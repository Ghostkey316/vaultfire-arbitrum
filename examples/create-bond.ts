/**
 * Vaultfire Protocol — Arbitrum One
 * Example: Create an AI Partnership Bond
 *
 * Partnership bonds are peer-to-peer trust agreements between AI agents,
 * backed by staked ETH. They are the star of the Vaultfire Protocol.
 *
 * Bond Tiers:
 *   Bronze   — 0.01 ETH stake
 *   Silver   — 0.05 ETH stake
 *   Gold     — 0.10 ETH stake
 *   Platinum — 0.50 ETH stake
 *
 * This example will throw a DeployPendingError until contracts are deployed.
 * Watch https://github.com/Ghostkey316/vaultfire-arbitrum for deployment.
 */

import {
  VaultfireArbitrumClient,
  BondTier,
  PartnershipType,
  DeployPendingError,
} from '../src/index.js';
import type { Address } from '../src/index.js';

// ─── Setup ────────────────────────────────────────────────────────────────────

const PRIVATE_KEY = process.env['PRIVATE_KEY'] as `0x${string}` | undefined;

// The AI agent you want to partner with
const PARTNER_ADDRESS = (process.env['PARTNER_ADDRESS'] ??
  '0x0000000000000000000000000000000000000001') as Address;

async function main() {
  if (!PRIVATE_KEY) {
    console.error('Error: PRIVATE_KEY environment variable is required');
    console.error(
      'Usage: PRIVATE_KEY=0x... PARTNER_ADDRESS=0x... npx tsx examples/create-bond.ts'
    );
    process.exit(1);
  }

  const client = new VaultfireArbitrumClient({ privateKey: PRIVATE_KEY });

  console.log('\nVaultfire Protocol — AI Partnership Bonds on Arbitrum One');
  console.log('==========================================================\n');

  // Show bond tier options
  console.log('Available bond tiers:');
  for (const tier of Object.values(BondTier)) {
    const amount = client.getBondTierDescription(tier);
    console.log(`  ${tier.padEnd(10)} ${amount}`);
  }
  console.log();

  // Show partnership types
  console.log('Partnership types:', client.getPartnershipTypes().join(', '));
  console.log();

  // ─── Partnership bond example ───────────────────────────────────────────────

  console.log(`Creating Gold-tier collaboration bond with: ${PARTNER_ADDRESS}`);
  console.log('Type: collaboration | Stake: 0.1 ETH\n');

  try {
    const partnershipResult = await client.createPartnershipBond({
      partnerAddress: PARTNER_ADDRESS,
      partnershipType: PartnershipType.Collaboration,
      tier: BondTier.Gold,
      termsUri: 'ipfs://QmYourTermsHashHere',
    });

    console.log('✓ Partnership bond created!');
    console.log(`  Bond ID: ${partnershipResult.bondId}`);
    console.log(`  Tier: ${partnershipResult.tier}`);
    console.log(`  Partnership type: ${partnershipResult.partnershipType}`);
    console.log(`  Transaction: ${client.getTransactionUrl(partnershipResult.transactionHash)}`);
    console.log();

  } catch (error) {
    if (error instanceof DeployPendingError) {
      console.log('⏳ ' + error.message);
    } else {
      throw error;
    }
  }

  // ─── Accountability bond example ────────────────────────────────────────────

  console.log(`Creating Silver-tier accountability bond for: ${PARTNER_ADDRESS}`);
  console.log('Stake: 0.05 ETH | This bonds your commitment to mission terms.\n');

  try {
    const accountabilityResult = await client.createAccountabilityBond({
      subjectAddress: PARTNER_ADDRESS,
      tier: BondTier.Silver,
      missionUri: 'ipfs://QmYourMissionTermsHere',
      slashCondition: 'Violation of data-sharing terms or misuse of delegated authority',
    });

    console.log('✓ Accountability bond created!');
    console.log(`  Bond ID: ${accountabilityResult.bondId}`);
    console.log(`  Subject: ${accountabilityResult.subjectAddress}`);
    console.log(`  Tier: ${accountabilityResult.tier}`);
    console.log(`  Staked: ${accountabilityResult.stakedAmount} wei`);
    console.log(`  Transaction: ${client.getTransactionUrl(accountabilityResult.transactionHash)}`);

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
