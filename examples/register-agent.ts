/**
 * Vaultfire Protocol — Arbitrum One
 * Example: Register an AI agent via ERC-8004 Identity Registry
 *
 * This example will throw a DeployPendingError until contracts are deployed.
 * Watch https://github.com/Ghostkey316/vaultfire-arbitrum for deployment.
 */

import { VaultfireArbitrumClient, BondTier, DeployPendingError } from '../src/index.js';
import type { Address } from '../src/index.js';

// ─── Setup ────────────────────────────────────────────────────────────────────

// Replace with your actual private key (never commit real keys to source control)
const PRIVATE_KEY = process.env['PRIVATE_KEY'] as `0x${string}` | undefined;

// The agent address you want to register (can be different from the signer)
const AGENT_ADDRESS = (process.env['AGENT_ADDRESS'] ??
  '0xfA15Ee28939B222B0448261A22156070f0A7813C') as Address;

async function main() {
  if (!PRIVATE_KEY) {
    console.error('Error: PRIVATE_KEY environment variable is required');
    console.error('Usage: PRIVATE_KEY=0x... AGENT_ADDRESS=0x... npx tsx examples/register-agent.ts');
    process.exit(1);
  }

  const client = new VaultfireArbitrumClient({ privateKey: PRIVATE_KEY });

  // Show chain info
  const config = client.getChainConfig();
  console.log(`\nVaultfire Protocol — ${config.chain}`);
  console.log(`Chain ID: ${config.chainId}`);
  console.log(`Explorer: ${config.explorer}`);
  console.log(`USDC: ${config.usdc}\n`);

  // Show pending contracts
  const pending = client.getPendingContracts();
  console.log(`Contracts pending deployment: ${pending.length}`);

  if (!client.isFullyDeployed()) {
    console.log('Note: Vaultfire contracts are not yet deployed on Arbitrum One.');
    console.log('The following will throw DeployPendingError (expected at pre-deployment stage):\n');
  }

  try {
    console.log(`Registering agent: ${AGENT_ADDRESS}`);
    console.log(`Name: "MyVaultfireAgent"`);
    console.log(`Capabilities: 7 (identity + bonding + rating)\n`);

    const result = await client.registerAgent({
      agentAddress: AGENT_ADDRESS,
      name: 'MyVaultfireAgent',
      metadataUri: 'ipfs://QmYourMetadataHashHere',
      capabilities: 7,
    });

    console.log('✓ Agent registered successfully!');
    console.log(`  Transaction: ${client.getTransactionUrl(result.transactionHash)}`);
    console.log(`  Agent address: ${result.agentAddress}`);
    console.log(`  Registered at: ${new Date(Number(result.registeredAt) * 1000).toISOString()}`);

  } catch (error) {
    if (error instanceof DeployPendingError) {
      console.log('⏳ ' + error.message);
      console.log('\nThis is expected — contracts are not yet deployed on Arbitrum One.');
      console.log('Watch https://github.com/Ghostkey316/vaultfire-arbitrum for updates.');
    } else {
      throw error;
    }
  }
}

main().catch(console.error);
