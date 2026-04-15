/**
 * Vaultfire Protocol — Arbitrum One
 * Example: Check an agent's Street Cred reputation score
 *
 * Street Cred is Vaultfire's reputation scoring system for AI agents.
 * It rewards agents for establishing trust through identity registration,
 * partnership bonds, and peer ratings.
 *
 * Scoring breakdown:
 *   +30  Has ERC-8004 identity
 *   +25  Has at least one bond
 *   +15  Bond is currently active (not expired)
 *   +20  Platinum tier bonus (Gold: +15, Silver: +10, Bronze: +5)
 *   +5   Has multiple bonds (2+)
 *   ─────────────────────────────────
 *   95   Maximum possible score
 *
 * Tiers:
 *   Unranked  0      no identity
 *   Novice    1–29   identity only
 *   Trusted   30–54  identity + bonds
 *   Elite     55–79  identity + active bonds + tier bonus
 *   Legend    80–95  maximum trust signals
 */

import {
  VaultfireArbitrumClient,
  BondTier,
  DeployPendingError,
  STREET_CRED_SCORING,
} from '../src/index.js';
import type { Address } from '../src/index.js';

// ─── Setup ────────────────────────────────────────────────────────────────────

const AGENT_ADDRESS = (process.env['AGENT_ADDRESS'] ??
  '0xA054f831B562e729F8D268291EBde1B2EDcFb84F') as Address;

function renderScoreBar(score: number, max: number, width: number = 30): string {
  const filled = Math.round((score / max) * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  return `[${bar}] ${score}/${max}`;
}

async function main() {
  const client = new VaultfireArbitrumClient();

  console.log('\nVaultfire Protocol — Street Cred Checker on Arbitrum One');
  console.log('==========================================================\n');

  // ─── Local calculation demo (works without deployed contracts) ──────────────

  console.log('Local Street Cred simulation (no on-chain call required):');
  console.log('──────────────────────────────────────────────────────────\n');

  const scenarios = [
    {
      label: 'No identity, no bonds (fresh agent)',
      params: { hasIdentity: false, bondCount: 0, hasBondActive: false, highestBondTier: null },
    },
    {
      label: 'Identity only (Novice)',
      params: { hasIdentity: true, bondCount: 0, hasBondActive: false, highestBondTier: null },
    },
    {
      label: 'Identity + Bronze bond (Trusted)',
      params: {
        hasIdentity: true,
        bondCount: 1,
        hasBondActive: true,
        highestBondTier: BondTier.Bronze,
      },
    },
    {
      label: 'Identity + Gold bond (Elite)',
      params: {
        hasIdentity: true,
        bondCount: 1,
        hasBondActive: true,
        highestBondTier: BondTier.Gold,
      },
    },
    {
      label: 'Identity + Platinum + multiple bonds (Legend)',
      params: {
        hasIdentity: true,
        bondCount: 3,
        hasBondActive: true,
        highestBondTier: BondTier.Platinum,
      },
    },
  ];

  for (const { label, params } of scenarios) {
    const cred = client.calculateStreetCred(params);
    const bar = renderScoreBar(cred.total, STREET_CRED_SCORING.MAX_POSSIBLE);
    console.log(`  ${label}`);
    console.log(`  ${bar}  [${cred.tier.toUpperCase()}]`);
    console.log(`  Components: identity(${cred.components.identityScore}) + ` +
      `bond(${cred.components.bondExistsScore}) + ` +
      `active(${cred.components.bondActiveScore}) + ` +
      `tier(${cred.components.tierBonusScore}) + ` +
      `multiple(${cred.components.multipleBondsScore})`);
    console.log();
  }

  // ─── On-chain lookup (requires deployed contracts) ──────────────────────────

  console.log('On-chain Street Cred lookup:');
  console.log('─────────────────────────────\n');
  console.log(`Agent: ${AGENT_ADDRESS}\n`);

  try {
    const cred = await client.getStreetCred(AGENT_ADDRESS);

    console.log(`  Street Cred: ${renderScoreBar(cred.total, cred.maxPossible)}`);
    console.log(`  Tier: ${cred.tier.toUpperCase()}`);
    console.log(`  Has identity: ${cred.hasIdentity ? 'Yes' : 'No'}`);
    console.log(`  Bond count: ${cred.bondCount}`);
    console.log(`  Highest bond tier: ${cred.highestBondTier ?? 'None'}`);
    console.log();
    console.log('  Score breakdown:');
    console.log(`    Identity (ERC-8004):    ${cred.components.identityScore} / ${STREET_CRED_SCORING.IDENTITY}`);
    console.log(`    Bond exists:            ${cred.components.bondExistsScore} / ${STREET_CRED_SCORING.BOND_EXISTS}`);
    console.log(`    Bond active:            ${cred.components.bondActiveScore} / ${STREET_CRED_SCORING.BOND_ACTIVE}`);
    console.log(`    Tier bonus:             ${cred.components.tierBonusScore} / ${STREET_CRED_SCORING.TIER_BONUS_PLATINUM}`);
    console.log(`    Multiple bonds:         ${cred.components.multipleBondsScore} / ${STREET_CRED_SCORING.MULTIPLE_BONDS}`);
    console.log(`    ─────────────────────────────────`);
    console.log(`    Total:                  ${cred.total} / ${cred.maxPossible}`);

    // VNS lookup
    console.log('\n  Checking VNS name...');
    try {
      const vnsName = await client.reverseLookupVNS(AGENT_ADDRESS);
      console.log(`  VNS name: ${vnsName ?? '(no name registered)'}`);
    } catch (vnsErr) {
      if (vnsErr instanceof DeployPendingError) {
        console.log(`  VNS: ⏳ Not deployed yet`);
      }
    }

  } catch (error) {
    if (error instanceof DeployPendingError) {
      console.log('  ⏳ ' + error.message);
      console.log('\n  This is expected — contracts are not yet deployed on Arbitrum One.');
      console.log('  Watch https://github.com/Ghostkey316/vaultfire-arbitrum for updates.');
    } else {
      throw error;
    }
  }

  console.log('\n  Arbiscan: ' + client.getAddressUrl(AGENT_ADDRESS));
}

main().catch(console.error);
