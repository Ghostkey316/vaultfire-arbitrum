#!/usr/bin/env python3
"""
Vaultfire Protocol — Arbitrum One
Contract Bytecode Verification Script

Checks that deployed contracts have bytecode at their addresses on Arbitrum One.
DEPLOY_PENDING addresses are skipped with a clear message.

Usage:
    python3 scripts/verify_contracts.py
    python3 scripts/verify_contracts.py --json

Requirements: Python 3.8+ (standard library only)
"""

import json
import sys
import urllib.request
import urllib.error
import urllib.parse
import os
import time
import argparse
from pathlib import Path
from typing import Any

# ─── Configuration ─────────────────────────────────────────────────────────────

ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc"
CHAIN_ID = 42161

# Path to addresses.json (relative to project root)
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
ADDRESSES_FILE = PROJECT_ROOT / "contracts" / "addresses.json"

# Rate limiting: wait between RPC calls to avoid throttling
RPC_DELAY_SECONDS = 0.2

# ─── RPC client ────────────────────────────────────────────────────────────────

def rpc_call(method: str, params: list[Any], rpc_url: str = ARBITRUM_RPC) -> Any:
    """
    Makes a JSON-RPC call using urllib (standard library only).
    Returns the 'result' field or raises on error.
    """
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1,
    }).encode("utf-8")

    req = urllib.request.Request(
        rpc_url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            body = response.read().decode("utf-8")
            data = json.loads(body)

            if "error" in data:
                raise RuntimeError(f"RPC error: {data['error']}")

            return data.get("result")

    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error calling {rpc_url}: {e}") from e


def get_code(address: str, rpc_url: str = ARBITRUM_RPC) -> str:
    """
    Returns the bytecode at an address using eth_getCode.
    Returns '0x' for an EOA or undeployed address.
    """
    return rpc_call("eth_getCode", [address, "latest"], rpc_url)


def get_chain_id(rpc_url: str = ARBITRUM_RPC) -> int:
    """Returns the chain ID from the RPC endpoint."""
    result = rpc_call("eth_chainId", [], rpc_url)
    return int(result, 16)


# ─── Verification logic ────────────────────────────────────────────────────────

def is_deploy_pending(address: str) -> bool:
    return address == "DEPLOY_PENDING"


def has_bytecode(code: str) -> bool:
    """Returns True if bytecode is present (not empty '0x' or '0x0')."""
    return code not in ("0x", "0x0", "0x00", "")


def verify_contract(
    name: str,
    address: str,
    rpc_url: str = ARBITRUM_RPC,
) -> dict[str, Any]:
    """
    Verifies a single contract. Returns a result dict.
    """
    if is_deploy_pending(address):
        return {
            "contract": name,
            "address": address,
            "status": "pending",
            "message": "DEPLOY_PENDING — not yet deployed on Arbitrum One",
            "hasBytecode": False,
        }

    try:
        time.sleep(RPC_DELAY_SECONDS)
        code = get_code(address, rpc_url)
        deployed = has_bytecode(code)

        return {
            "contract": name,
            "address": address,
            "status": "deployed" if deployed else "empty",
            "message": (
                f"Deployed — {len(code) // 2 - 1} bytes of bytecode"
                if deployed
                else "No bytecode found — address appears empty"
            ),
            "hasBytecode": deployed,
            "bytecodeLength": len(code) // 2 - 1 if deployed else 0,
        }
    except RuntimeError as e:
        return {
            "contract": name,
            "address": address,
            "status": "error",
            "message": str(e),
            "hasBytecode": False,
        }


# ─── Main ──────────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify Vaultfire contract bytecode on Arbitrum One"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output results as JSON instead of human-readable text",
    )
    parser.add_argument(
        "--rpc",
        default=ARBITRUM_RPC,
        help=f"RPC URL to use (default: {ARBITRUM_RPC})",
    )
    args = parser.parse_args()

    use_json = args.json
    rpc_url = args.rpc

    # Load addresses
    if not ADDRESSES_FILE.exists():
        msg = f"Error: addresses file not found at {ADDRESSES_FILE}"
        if use_json:
            print(json.dumps({"error": msg}))
        else:
            print(msg, file=sys.stderr)
        return 1

    with open(ADDRESSES_FILE) as f:
        addresses_data = json.load(f)

    chain_name = addresses_data.get("chain", "Unknown")
    chain_id_expected = addresses_data.get("chainId", 0)
    contracts = addresses_data.get("contracts", {})
    deployer = addresses_data.get("deployer", "unknown")

    if not use_json:
        print("=" * 60)
        print("  Vaultfire Protocol — Contract Verification")
        print(f"  Chain: {chain_name} (Chain ID: {chain_id_expected})")
        print(f"  RPC: {rpc_url}")
        print(f"  Deployer: {deployer}")
        print("=" * 60)
        print()

    # Verify chain ID
    chain_id_ok = True
    try:
        actual_chain_id = get_chain_id(rpc_url)
        if actual_chain_id != chain_id_expected:
            msg = (
                f"Chain ID mismatch: expected {chain_id_expected}, "
                f"got {actual_chain_id}"
            )
            if not use_json:
                print(f"  ⚠  WARNING: {msg}")
                print()
            chain_id_ok = False
        else:
            if not use_json:
                print(f"  ✓  Chain ID verified: {actual_chain_id}")
                print()
    except RuntimeError as e:
        if not use_json:
            print(f"  ⚠  Could not verify chain ID: {e}")
            print()

    # Verify each contract
    results = []
    deployed_count = 0
    pending_count = 0
    error_count = 0

    for name, address in contracts.items():
        result = verify_contract(name, address, rpc_url)
        results.append(result)

        if result["status"] == "pending":
            pending_count += 1
        elif result["status"] == "deployed":
            deployed_count += 1
        elif result["status"] in ("empty", "error"):
            error_count += 1

        if not use_json:
            status = result["status"]
            symbol = {
                "deployed": "✓",
                "pending": "·",
                "empty": "✗",
                "error": "!",
            }.get(status, "?")

            addr_display = address[:10] + "..." + address[-8:] if len(address) > 20 else address
            print(f"  {symbol}  {name}")
            print(f"       Address: {addr_display}")
            print(f"       Status:  {result['message']}")
            print()

    # Summary
    summary = {
        "chain": chain_name,
        "chainId": chain_id_expected,
        "chainIdVerified": chain_id_ok,
        "deployer": deployer,
        "totalContracts": len(results),
        "deployed": deployed_count,
        "pending": pending_count,
        "errors": error_count,
        "results": results,
    }

    if use_json:
        print(json.dumps(summary, indent=2))
    else:
        print("=" * 60)
        print("  Summary")
        print("=" * 60)
        print(f"  Total contracts:  {len(results)}")
        print(f"  Deployed:         {deployed_count}")
        print(f"  Pending:          {pending_count}")
        print(f"  Errors:           {error_count}")
        print()

        if pending_count > 0:
            print(
                f"  ℹ  {pending_count} contract(s) are DEPLOY_PENDING on Arbitrum One."
            )
            print(
                "     Watch https://github.com/Ghostkey316/vaultfire-arbitrum"
                " for deployment announcements."
            )
            print()

        if error_count > 0:
            print(f"  ⚠  {error_count} contract(s) failed verification.")
            return 1

    return 0 if error_count == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
