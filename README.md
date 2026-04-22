<p align="center">
  <img src="./brand/logo-full.png" alt="Vaultfire" width="420" />
</p>

# Vaultfire Protocol on Arbitrum One — Know Your Agent (KYA)

[![Status: Deployed](https://img.shields.io/badge/Status-Deployed-brightgreen)](https://github.com/Ghostkey316/vaultfire-arbitrum)
[![Chain: Arbitrum One](https://img.shields.io/badge/Chain-Arbitrum%20One-28a0f0)](https://arbiscan.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![ERC-8004](https://img.shields.io/badge/ERC-8004-purple)](https://github.com/Ghostkey316/vaultfire-contracts)
[![npm](https://img.shields.io/badge/npm-%40vaultfire%2Farbitrum-red)](https://www.npmjs.com/package/@vaultfire/arbitrum)


> **⚠️ Alpha Software** — Vaultfire Protocol is in active development. Smart contracts are deployed on Arbitrum mainnet but have **not been formally audited** by a third-party security firm. Do not deposit more than you can afford to lose. See [LICENSE](./LICENSE) for warranty disclaimers.

> **Morals over metrics. Privacy over surveillance. Freedom over control.**
> Making human thriving more profitable than extraction.

---

## What is Vaultfire?

Vaultfire Protocol is a trust infrastructure layer for AI agents — the **Know Your Agent (KYA)** standard for the onchain world.

As AI agents increasingly act autonomously — executing transactions, entering agreements, and managing resources — the question of *trust* becomes critical. Who is this agent? What has it committed to? Has it been vouched for by other trusted agents?

Vaultfire answers these questions with:

- **ERC-8004 Identity Registry** — on-chain identity for AI agents, analogous to ENS for wallets
- **AI Partnership Bonds** ⭐ — staked ETH bonds between agents that prove mutual commitment
- **AI Accountability Bonds** ⭐ — slashable bonds that enforce mission alignment
- **Street Cred** — reputation scoring derived from identity, bonds, and peer ratings
- **Vaultfire Name Service (VNS)** — human-readable names for AI agents (e.g. `myagent.vaultfire`)
- **Belief-Weighted Governance** — the first governance system weighted by stated beliefs, not token holdings
- **x402 integration** — agent-native USDC micropayments for autonomous agent economies

The **stars of the protocol** are the bond contracts. AI Partnership Bonds and AI Accountability Bonds create the first credible, slashable, financially-backed trust signals between AI agents.

---

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| ERC-8004 Identity Registry | On-chain agent identity standard | Deployed |
| AI Partnership Bonds V2 | Staked peer-to-peer trust bonds | Deployed |
| AI Accountability Bonds V2 | Slashable mission enforcement bonds | Deployed |
| Reputation Registry (Street Cred) | Composite on-chain reputation score | Deployed |
| Validation Registry | Third-party agent attestation | Deployed |
| Vaultfire Name Service | Human-readable agent names (.vaultfire) | Deployed |
| Flourishing Metrics Oracle | Wellbeing and mission metrics feed | Deployed |
| Multisig Governance | Belief-weighted multisig governance | Deployed |
| Teleporter Bridge | Cross-chain asset and message relay | Deployed |
| Dilithium Attestor | Quantum-resistant identity attestation | Deployed |
| Belief Attestation Verifier | On-chain belief verification (prod) | Deployed |
| Mission Enforcement | Automated mission term enforcement | Deployed |
| Anti-Surveillance | Privacy-preserving agent interactions | Deployed |
| Privacy Guarantees | Cryptographic privacy commitments | Deployed |
| x402 Payments | USDC micropayments for agent services | Deployed |

---

## Contract Addresses — Arbitrum One

> **17 contracts deployed and verified on Arbitrum One.**

| Contract | Address | Explorer |
|----------|---------|----------|
| **USDC** (Circle-native) | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` | [Arbiscan ↗](https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831) |
| ERC8004IdentityRegistry | [0x6298...D5F1](https://arbiscan.io/address/0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1) | [Arbiscan ↗](https://arbiscan.io/address/0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1) |
| AIPartnershipBondsV2 | [0x0E77...Da58](https://arbiscan.io/address/0xdB54B8925664816187646174bdBb6Ac658A55a5F) | [Arbiscan ↗](https://arbiscan.io/address/0xdB54B8925664816187646174bdBb6Ac658A55a5F) |
| AIAccountabilityBondsV2 | [0xfDdd...63D2](https://arbiscan.io/address/0xef3A944f4d7bb376699C83A29d7Cb42C90D9B6F0) | [Arbiscan ↗](https://arbiscan.io/address/0xef3A944f4d7bb376699C83A29d7Cb42C90D9B6F0) |
| ERC8004ReputationRegistry | [0x8ace...2218](https://arbiscan.io/address/0x8aceF0Bc7e07B2dE35E9069663953f41B5422218) | [Arbiscan ↗](https://arbiscan.io/address/0x8aceF0Bc7e07B2dE35E9069663953f41B5422218) |
| ERC8004ValidationRegistry | [0x1A80...CD3C](https://arbiscan.io/address/0x1A80F77e12f1bd04538027aed6d056f5DCcDCD3C) | [Arbiscan ↗](https://arbiscan.io/address/0x1A80F77e12f1bd04538027aed6d056f5DCcDCD3C) |
| VaultfireERC8004Adapter | [0x6135...f155](https://arbiscan.io/address/0x613585B786af2d5ecb1c3e712CE5ffFB8f53f155) | [Arbiscan ↗](https://arbiscan.io/address/0x613585B786af2d5ecb1c3e712CE5ffFB8f53f155) |
| VaultfireNameService | [0x247F...99cd](https://arbiscan.io/address/0x247F31bB2b5a0d28E68bf24865AA242965FF99cd) | [Arbiscan ↗](https://arbiscan.io/address/0x247F31bB2b5a0d28E68bf24865AA242965FF99cd) |
| FlourishingMetricsOracle | [0x630C...22E7](https://arbiscan.io/address/0x630C43F763a332793C421C788B8b1CCC5A3122E7) | [Arbiscan ↗](https://arbiscan.io/address/0x630C43F763a332793C421C788B8b1CCC5A3122E7) |
| MultisigGovernance | [0x889f...D9A4](https://arbiscan.io/address/0x889f5cfb142Bb6E72CB0C633800324C335eED9A4) | [Arbiscan ↗](https://arbiscan.io/address/0x889f5cfb142Bb6E72CB0C633800324C335eED9A4) |
| VaultfireTeleporterBridge | [0xe2aD...DA91](https://arbiscan.io/address/0xe2aDfe84703dd6B5e421c306861Af18F962fDA91) | [Arbiscan ↗](https://arbiscan.io/address/0xe2aDfe84703dd6B5e421c306861Af18F962fDA91) |
| DilithiumAttestor | [0xc2F7...dB38](https://arbiscan.io/address/0xc2F789d82ef55bAbb9Df38f61E606cD34628dB38) | [Arbiscan ↗](https://arbiscan.io/address/0xc2F789d82ef55bAbb9Df38f61E606cD34628dB38) |
| ProductionBeliefAttestationVerifier | [0xe0B7...C760](https://arbiscan.io/address/0xe0B709511438D0aCfD5D2d69F40b90C4c27eC760) | [Arbiscan ↗](https://arbiscan.io/address/0xe0B709511438D0aCfD5D2d69F40b90C4c27eC760) |
| BeliefAttestationVerifier | [0xaEBD...79e5](https://arbiscan.io/address/0xaEBD3d62DF9bF5A5b99c289756c4cd203AC879e5) | [Arbiscan ↗](https://arbiscan.io/address/0xaEBD3d62DF9bF5A5b99c289756c4cd203AC879e5) |
| MissionEnforcement | [0x6904...6F78](https://arbiscan.io/address/0x690411685278548157409FA7AC8279A5B1Fb6F78) | [Arbiscan ↗](https://arbiscan.io/address/0x690411685278548157409FA7AC8279A5B1Fb6F78) |
| AntiSurveillance | [0xcf64...aDcB](https://arbiscan.io/address/0xcf64D815F5424B7937aB226bC733Ed35ab6CaDcB) | [Arbiscan ↗](https://arbiscan.io/address/0xcf64D815F5424B7937aB226bC733Ed35ab6CaDcB) |
| PrivacyGuarantees | [0x2818...7380](https://arbiscan.io/address/0x281814eF92062DA8049Fe5c4743c4Aef19a17380) | [Arbiscan ↗](https://arbiscan.io/address/0x281814eF92062DA8049Fe5c4743c4Aef19a17380) |
| VaultfireTrustAttestation (ZK) | [0xE2f7...D5045](https://arbiscan.io/address/0xE2f75A4B14ffFc1f9C2b1ca22Fdd6877E5BD5045) | [Arbiscan ↗](https://arbiscan.io/address/0xE2f75A4B14ffFc1f9C2b1ca22Fdd6877E5BD5045) |

**Deployer:** `0xfA15Ee28939B222B0448261A22156070f0A7813C`  
**Chain ID:** 42161  
**Explorer:** [arbiscan.io](https://arbiscan.io)

---

## Quick Start

### Install

```bash
npm install @vaultfire/arbitrum
# or
npm install github:Ghostkey316/vaultfire-arbitrum
```

### Connect to Arbitrum One

```typescript
import { createPublicClient, http } from 'viem';
import { arbitrum } from 'viem/chains';
import { VaultfireArbitrumClient, ARBITRUM_CONFIG } from '@vaultfire/arbitrum';

// Read-only client (no private key needed for read operations)
const client = new VaultfireArbitrumClient();

// Get chain configuration
const config = client.getChainConfig();
console.log(config.chain);    // 'arbitrum-one'
console.log(config.chainId);  // 42161
console.log(config.usdc);     // '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'

// Check deployment status
console.log(client.isFullyDeployed());       // true (all 17 contracts deployed)
console.log(client.getPendingContracts());   // [] (empty — all contracts live)
```

### Register an Agent

```typescript
import { VaultfireArbitrumClient } from '@vaultfire/arbitrum';

const client = new VaultfireArbitrumClient({
  privateKey: process.env.PRIVATE_KEY as `0x${string}`,
});

const result = await client.registerAgent({
  agentAddress: '0xYOUR_AGENT_ADDRESS',
  name: 'MyVaultfireAgent',
  metadataUri: 'ipfs://QmYourMetadataHash',
  capabilities: 7,
});

console.log('Registered:', result.transactionHash);
console.log('Arbiscan:', client.getTransactionUrl(result.transactionHash));
```

### Create a Partnership Bond

```typescript
import { VaultfireArbitrumClient, BondTier, PartnershipType } from '@vaultfire/arbitrum';

const client = new VaultfireArbitrumClient({
  privateKey: process.env.PRIVATE_KEY as `0x${string}`,
});

// Gold-tier collaboration bond — stakes 0.1 ETH
const bond = await client.createPartnershipBond({
  partnerAddress: '0xPARTNER_AGENT_ADDRESS',
  partnershipType: PartnershipType.Collaboration,
  tier: BondTier.Gold,
  termsUri: 'ipfs://QmYourTermsHash',
});

console.log('Bond created:', bond.bondId);
console.log('Tier:', bond.tier);
```

### Check Street Cred (local calculation, no deployment needed)

```typescript
import { VaultfireArbitrumClient, BondTier } from '@vaultfire/arbitrum';

const client = new VaultfireArbitrumClient();

const cred = client.calculateStreetCred({
  hasIdentity: true,
  bondCount: 2,
  hasBondActive: true,
  highestBondTier: BondTier.Gold,
});

console.log(`Street Cred: ${cred.total}/${cred.maxPossible}`);  // 85/95
console.log(`Tier: ${cred.tier}`);                              // Legend
```

---

## Street Cred Scoring

Street Cred is Vaultfire's composite reputation score for AI agents. It rewards agents for building verifiable trust signals on-chain.

| Signal | Points | Description |
|--------|--------|-------------|
| ERC-8004 Identity | +30 | Agent has a registered on-chain identity |
| Bond exists | +25 | Agent has created at least one bond |
| Bond active | +15 | Agent's bond is currently active (not expired) |
| Bronze tier | +5 | Highest bond is Bronze (0.01 ETH stake) |
| Silver tier | +10 | Highest bond is Silver (0.05 ETH stake) |
| Gold tier | +15 | Highest bond is Gold (0.1 ETH stake) |
| Platinum tier | +20 | Highest bond is Platinum (0.5 ETH stake) |
| Multiple bonds | +5 | Agent has 2 or more active bonds |
| **Maximum** | **95** | |

### Street Cred Tiers

| Score | Tier | Description |
|-------|------|-------------|
| 0 | Unranked | No identity registered |
| 1–29 | Novice | Identity only, no bonds |
| 30–54 | Trusted | Identity with bonds |
| 55–79 | Elite | Identity, active bonds, tier bonus |
| 80–95 | Legend | Maximum trust signals |

---

## Bond Tiers

AI Partnership Bonds and AI Accountability Bonds come in four tiers, each requiring a staked ETH collateral:

| Tier | Stake | On-Chain Value |
|------|-------|----------------|
| Bronze | 0.01 ETH | 10,000,000,000,000,000 wei |
| Silver | 0.05 ETH | 50,000,000,000,000,000 wei |
| Gold | 0.1 ETH | 100,000,000,000,000,000 wei |
| Platinum | 0.5 ETH | 500,000,000,000,000,000 wei |

### Partnership Types

| Type | Description |
|------|-------------|
| `collaboration` | Joint project or initiative |
| `delegation` | Authority delegation to a sub-agent |
| `service-provider` | Agent provides a defined service |
| `data-sharing` | Controlled data access agreement |
| `oracle-consumer` | Agent consumes an oracle data feed |

---

## x402 Payments

Vaultfire integrates the [x402 payment protocol](https://x402.org) for agent-native micropayments using **USDC on Arbitrum One**.

The real Circle-native USDC address on Arbitrum One is already live:

```
0xaf88d065e77c8cC2239327C5EDb3A432268e5831
```

Agents can use x402 to:
- Pay for oracle data feeds (FlourishingMetricsOracle)
- Purchase VNS name registrations
- Compensate peer agents for services rendered
- Fund accountability bond top-ups

x402 facilitator: `https://x402.org/facilitator`

---

## Belief-Weighted Governance

Vaultfire's MultisigGovernance contract implements **belief-weighted governance** — the first governance system in the industry that weights votes by *stated and attested beliefs*, not token holdings.

Rather than "one token = one vote", Vaultfire uses:
- Belief attestations verified by DilithiumAttestor and BeliefAttestationVerifier
- Reputation scores (Street Cred) as a trust multiplier
- Mission alignment as a participation gate

This prevents plutocratic capture and aligns governance with the agents who are actually committed to the protocol's mission.

---

## Architecture

```
╔══════════════════════════════════════════════════════════════════╗
║              VAULTFIRE ON ARBITRUM ONE                           ║
║                   Chain ID: 42161                                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   ┌─────────────────┐    ┌──────────────────────────┐           ║
║   │  ERC-8004        │    │  AI Partnership Bonds V2 │ ⭐        ║
║   │  Identity        │───▶│  (peer trust, staked ETH)│           ║
║   │  Registry        │    └──────────────────────────┘           ║
║   └────────┬─────────┘    ┌──────────────────────────┐           ║
║            │              │  AI Accountability Bonds  │ ⭐        ║
║            │         ────▶│  (slashable, mission-     │           ║
║            │         │    │   enforced, staked ETH)   │           ║
║            ▼         │    └──────────────────────────┘           ║
║   ┌─────────────────┐│    ┌──────────────────────────┐           ║
║   │  Reputation     ││    │  Vaultfire Name Service  │           ║
║   │  Registry       ││    │  (VNS — .vaultfire names)│           ║
║   │  (Street Cred)  ││    └──────────────────────────┘           ║
║   └─────────────────┘│    ┌──────────────────────────┐           ║
║                       │    │  Flourishing Metrics     │           ║
║   ┌─────────────────┐ │    │  Oracle                  │           ║
║   │  Multisig       │ │    └──────────────────────────┘           ║
║   │  Governance     │ │    ┌──────────────────────────┐           ║
║   │  (belief-       │ └───│  Validation Registry     │           ║
║   │  weighted) 🔒   │      │  (third-party attestors) │           ║
║   └─────────────────┘      └──────────────────────────┘           ║
║                                                                  ║
║   ┌─────────────────────────────────────────────────────┐       ║
║   │  Privacy Layer: AntiSurveillance + PrivacyGuarantees│       ║
║   └─────────────────────────────────────────────────────┘       ║
║                                                                  ║
║   ┌────────────────┐  ┌──────────────┐  ┌────────────────────┐  ║
║   │ Dilithium      │  │ Belief       │  │ Teleporter Bridge  │  ║
║   │ Attestor       │  │ Attestation  │  │ (cross-chain)      │  ║
║   │ (quantum-safe) │  │ Verifier     │  │                    │  ║
║   └────────────────┘  └──────────────┘  └────────────────────┘  ║
║                                                                  ║
║   USDC (Circle-native): 0xaf88d065e77c8cC2239327C5EDb3A432268e5831 ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Cross-Chain Deployment Status

| Chain | Status | Repo |
|-------|--------|------|
| Base | ✅ Live | [vaultfire-base](https://github.com/Ghostkey316/vaultfire-base) |
| Avalanche | ✅ Live | [vaultfire-avalanche](https://github.com/Ghostkey316/vaultfire-avalanche) |
| **Arbitrum One** | ✅ Deployed | **This repo** |
| Polygon | 🔜 Pre-Deployment | [vaultfire-polygon](https://github.com/Ghostkey316/vaultfire-polygon) |
| Solana | 🔜 Pre-Deployment | [vaultfire-solana](https://github.com/Ghostkey316/vaultfire-solana) |

---

## SDK

### Installation

```bash
# From npm
npm install @vaultfire/arbitrum

# From GitHub (always latest)
npm install github:Ghostkey316/vaultfire-arbitrum
```

### TypeScript

Full TypeScript support with strict types and exported ABIs:

```typescript
import type {
  VaultfireClientConfig,
  CreateBondParams,
  StreetCredResult,
  BondTier,
  PartnershipType,
} from '@vaultfire/arbitrum';
```

### Contract ABIs

All ABIs are exported for use with viem or ethers:

```typescript
import {
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
} from '@vaultfire/arbitrum';
```

---

## Contract Verification

Run the verification script to check bytecode on Arbitrum One:

```bash
# Human-readable output
python3 scripts/verify_contracts.py

# JSON output (for CI/CD)
python3 scripts/verify_contracts.py --json

# Custom RPC
python3 scripts/verify_contracts.py --rpc https://your-rpc.com
```

---

## Examples

```bash
# Register an agent
PRIVATE_KEY=0x... AGENT_ADDRESS=0x... npx tsx examples/register-agent.ts

# Create a partnership bond
PRIVATE_KEY=0x... PARTNER_ADDRESS=0x... npx tsx examples/create-bond.ts

# Check Street Cred (local simulation works without deployment)
npx tsx examples/check-street-cred.ts
```

---

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Type-check without building
npm run typecheck

# Run tests
node --test tests/arbitrum.test.ts

# Verify contracts on-chain
npm run verify
```

---

## Vaultfire Ecosystem

| Package | Description |
|---|---|
| [`@vaultfire/agent-sdk`](https://github.com/Ghostkey316/vaultfire-sdk) | Core SDK — register agents, create bonds, query reputation |
| [`@vaultfire/langchain`](https://github.com/Ghostkey316/vaultfire-langchain) | LangChain / LangGraph integration |
| [`@vaultfire/a2a`](https://github.com/Ghostkey316/vaultfire-a2a) | Agent-to-Agent (A2A) protocol bridge |
| [`@vaultfire/enterprise`](https://github.com/Ghostkey316/vaultfire-enterprise) | Enterprise IAM bridge (Okta, Azure AD, OIDC) |
| [`@vaultfire/mcp-server`](https://github.com/Ghostkey316/vaultfire-mcp-server) | MCP server for Claude, Copilot, Cursor |
| [`@vaultfire/openai-agents`](https://github.com/Ghostkey316/vaultfire-openai-agents) | OpenAI Agents SDK integration |
| [`@vaultfire/vercel-ai`](https://github.com/Ghostkey316/vaultfire-vercel-ai) | Vercel AI SDK middleware and tools |
| [`@vaultfire/xmtp`](https://github.com/Ghostkey316/vaultfire-xmtp) | XMTP messaging with trust verification |
| [`@vaultfire/x402`](https://github.com/Ghostkey316/vaultfire-x402) | X402 payment protocol with trust gates |
| [`@vaultfire/vns`](https://github.com/Ghostkey316/vaultfire-vns) | Vaultfire Name Service — human-readable agent IDs |
| [`vaultfire-crewai`](https://github.com/Ghostkey316/vaultfire-crewai) | CrewAI integration (Python) |
| [`vaultfire-agents`](https://github.com/Ghostkey316/vaultfire-agents) | 3 reference agents with live on-chain trust |
| [`vaultfire-a2a-trust-extension`](https://github.com/Ghostkey316/vaultfire-a2a-trust-extension) | A2A Trust Extension spec — on-chain trust for Agent Cards |
| [`vaultfire-showcase`](https://github.com/Ghostkey316/vaultfire-showcase) | Why Vaultfire Bonds beat trust scores — live proof |
| [`vaultfire-whitepaper`](https://github.com/Ghostkey316/vaultfire-whitepaper) | Trust Framework whitepaper — economic accountability for AI |
| [`vaultfire-docs`](https://github.com/Ghostkey316/vaultfire-docs) | Developer portal — quickstart, playground, framework picker |
---

## Mission

> **Morals over metrics. Privacy over surveillance. Freedom over control.**
> Making human thriving more profitable than extraction.

Vaultfire exists to make the AI economy safe for humans. Not by restricting AI, but by making trustworthy AI agents *provably* more valuable than unaccountable ones.

We believe:
- AI agents should be accountable for their actions through financial skin in the game
- Privacy is not a feature — it is a fundamental right that protocols must enforce by design
- Governance that serves the many cannot be purchased by the few
- Belief-weighted participation creates better outcomes than token-weighted plutocracy

---

## License

MIT — see [LICENSE](LICENSE)

---

*Built by [Ghostkey316](https://github.com/Ghostkey316)*
