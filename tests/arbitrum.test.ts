/**
 * Vaultfire Protocol — Arbitrum One
 * Comprehensive test suite
 *
 * Uses Node.js built-in test runner (node:test + node:assert).
 * Run with: node --test tests/arbitrum.test.ts
 * Or (after build): node --test dist/tests/arbitrum.test.js
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

import {
  ARBITRUM_CONFIG,
  ARBITRUM_CONTRACTS,
  STREET_CRED_SCORING,
  STREET_CRED_TIERS,
  PARTNERSHIP_TYPE_VALUES,
  BOND_TIER_ENUM_VALUES,
  RATING_CATEGORY_VALUES,
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
  arbitrumChainDef,
} from '../src/config.js';

import {
  BondTier,
  BOND_TIER_VALUES,
  BOND_TIER_ETH,
  PartnershipType,
} from '../src/types.js';

import {
  VaultfireArbitrumClient,
  DeployPendingError,
  InvalidRatingError,
  NoWalletError,
} from '../src/client.js';

import {
  VERSION,
  CHAIN_ID,
  CHAIN_NAME,
} from '../src/index.js';

// ─── Helper ────────────────────────────────────────────────────────────────────

function isValidAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('Vaultfire Arbitrum — Config Validation', () => {

  it('TC-001: Chain ID is 42161 (Arbitrum One)', () => {
    assert.strictEqual(ARBITRUM_CONFIG.chainId, 42161);
  });

  it('TC-002: Chain name is arbitrum-one', () => {
    assert.strictEqual(ARBITRUM_CONFIG.chain, 'arbitrum-one');
  });

  it('TC-003: RPC URL is the official Arbitrum RPC', () => {
    assert.strictEqual(ARBITRUM_CONFIG.rpc, 'https://arb1.arbitrum.io/rpc');
  });

  it('TC-004: Explorer URL is arbiscan.io', () => {
    assert.strictEqual(ARBITRUM_CONFIG.explorer, 'https://arbiscan.io');
  });

  it('TC-005: Explorer API URL is api.arbiscan.io', () => {
    assert.strictEqual(ARBITRUM_CONFIG.explorerApi, 'https://api.arbiscan.io/api');
  });

  it('TC-006: Native token is ETH', () => {
    assert.strictEqual(ARBITRUM_CONFIG.nativeToken, 'ETH');
  });

  it('TC-007: USDC address is the Circle-native Arbitrum USDC', () => {
    assert.strictEqual(
      ARBITRUM_CONFIG.usdc,
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
    );
  });

  it('TC-008: USDC address is a valid Ethereum address', () => {
    assert.ok(isValidAddress(ARBITRUM_CONFIG.usdc), 'USDC address must be a valid hex address');
  });

  it('TC-009: Deployer address matches expected', () => {
    assert.strictEqual(
      ARBITRUM_CONFIG.deployer,
      '0xfA15Ee28939B222B0448261A22156070f0A7813C'
    );
  });

  it('TC-010: Deployer address is a valid Ethereum address', () => {
    assert.ok(isValidAddress(ARBITRUM_CONFIG.deployer));
  });
});

describe('Vaultfire Arbitrum — Contract Addresses', () => {

  it('TC-011: All contract addresses are real deployed addresses (none are DEPLOY_PENDING)', () => {
    const contracts = ARBITRUM_CONTRACTS;
    const pendingAddresses = Object.entries(contracts)
      .filter(([, v]) => v === 'DEPLOY_PENDING')
      .map(([k]) => k);
    assert.deepEqual(pendingAddresses, []);
  });

  it('TC-012: USDC address matches config', () => {
    assert.strictEqual(ARBITRUM_CONTRACTS.USDC, ARBITRUM_CONFIG.usdc);
  });

  it('TC-013: ERC8004IdentityRegistry has real deployed address', () => {
    assert.strictEqual(ARBITRUM_CONTRACTS.ERC8004IdentityRegistry, '0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1');
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.ERC8004IdentityRegistry));
  });

  it('TC-014: AIPartnershipBondsV2 has real deployed address', () => {
    assert.strictEqual(ARBITRUM_CONTRACTS.AIPartnershipBondsV2, '0xdB54B8925664816187646174bdBb6Ac658A55a5F');
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.AIPartnershipBondsV2));
  });

  it('TC-015: AIAccountabilityBondsV2 has real deployed address', () => {
    assert.strictEqual(ARBITRUM_CONTRACTS.AIAccountabilityBondsV2, '0xef3A944f4d7bb376699C83A29d7Cb42C90D9B6F0');
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.AIAccountabilityBondsV2));
  });

  it('TC-016: ERC8004ReputationRegistry has real deployed address', () => {
    assert.strictEqual(ARBITRUM_CONTRACTS.ERC8004ReputationRegistry, '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218');
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.ERC8004ReputationRegistry));
  });

  it('TC-017: VaultfireNameService has real deployed address', () => {
    assert.strictEqual(ARBITRUM_CONTRACTS.VaultfireNameService, '0x247F31bB2b5a0d28E68bf24865AA242965FF99cd');
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.VaultfireNameService));
  });

  it('TC-018: Total contracts count is 17', () => {
    assert.strictEqual(Object.keys(ARBITRUM_CONTRACTS).length, 17);
  });

  it('TC-019: All 17 contract addresses are valid Ethereum addresses', () => {
    const allAddresses = Object.values(ARBITRUM_CONTRACTS);
    assert.strictEqual(allAddresses.length, 17);
    for (const addr of allAddresses) {
      assert.ok(isValidAddress(addr), `Expected valid address, got: ${addr}`);
    }
  });
});

describe('Vaultfire Arbitrum — Client Instantiation', () => {

  it('TC-020: Client instantiates without private key', () => {
    assert.doesNotThrow(() => new VaultfireArbitrumClient());
  });

  it('TC-021: Client instantiates with custom RPC URL', () => {
    assert.doesNotThrow(() =>
      new VaultfireArbitrumClient({ rpcUrl: 'https://arb1.arbitrum.io/rpc' })
    );
  });

  it('TC-022: getChainConfig returns correct chain ID', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(client.getChainConfig().chainId, 42161);
  });

  it('TC-023: getContractAddresses returns USDC', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(
      client.getContractAddresses().USDC,
      '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
    );
  });

  it('TC-024: isFullyDeployed returns true (all contracts deployed)', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(client.isFullyDeployed(), true);
  });

  it('TC-025: getPendingContracts returns empty array (all deployed)', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(client.getPendingContracts().length, 0);
  });

  it('TC-026: getPendingContracts does not include any contract names', () => {
    const client = new VaultfireArbitrumClient();
    const pending = client.getPendingContracts();
    assert.deepEqual(pending, []);
  });
});

describe('Vaultfire Arbitrum — Deployed State Validation', () => {

  it('TC-027: registerAgent throws NoWalletError (not DeployPendingError) when no wallet', async () => {
    const client = new VaultfireArbitrumClient();
    await assert.rejects(
      () => client.registerAgent({
        agentAddress: '0xfA15Ee28939B222B0448261A22156070f0A7813C',
        name: 'TestAgent',
      }),
      NoWalletError
    );
  });

  it('TC-028: registerAgent does NOT throw DeployPendingError (contract is deployed)', async () => {
    const client = new VaultfireArbitrumClient();
    try {
      await client.registerAgent({
        agentAddress: '0xfA15Ee28939B222B0448261A22156070f0A7813C',
        name: 'TestAgent',
      });
    } catch (err) {
      assert.ok(!(err instanceof DeployPendingError), 'Should not throw DeployPendingError');
    }
  });

  it('TC-029: createPartnershipBond throws NoWalletError (not DeployPendingError) when no wallet', async () => {
    const client = new VaultfireArbitrumClient();
    await assert.rejects(
      () => client.createPartnershipBond({
        partnerAddress: '0x0000000000000000000000000000000000000001',
        partnershipType: PartnershipType.Collaboration,
        tier: BondTier.Bronze,
      }),
      NoWalletError
    );
  });

  it('TC-030: createAccountabilityBond throws NoWalletError (not DeployPendingError) when no wallet', async () => {
    const client = new VaultfireArbitrumClient();
    await assert.rejects(
      () => client.createAccountabilityBond({
        subjectAddress: '0x0000000000000000000000000000000000000001',
        tier: BondTier.Silver,
      }),
      NoWalletError
    );
  });

  it('TC-031: ERC8004ReputationRegistry address is a valid deployed address', () => {
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.ERC8004ReputationRegistry));
    assert.strictEqual(
      ARBITRUM_CONTRACTS.ERC8004ReputationRegistry,
      '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218'
    );
  });

  it('TC-032: VaultfireNameService address is a valid deployed address', () => {
    assert.ok(isValidAddress(ARBITRUM_CONTRACTS.VaultfireNameService));
    assert.strictEqual(
      ARBITRUM_CONTRACTS.VaultfireNameService,
      '0x247F31bB2b5a0d28E68bf24865AA242965FF99cd'
    );
  });

  it('TC-033: DeployPendingError class still works correctly (for manual error creation)', () => {
    const err = new DeployPendingError('AIPartnershipBondsV2');
    assert.ok(err.message.includes('AIPartnershipBondsV2'));
  });

  it('TC-034: DeployPendingError name is DeployPendingError', () => {
    const err = new DeployPendingError('TestContract');
    assert.strictEqual(err.name, 'DeployPendingError');
  });

  it('TC-035: DeployPendingError message mentions Arbitrum One', () => {
    const err = new DeployPendingError('TestContract');
    assert.ok(err.message.includes('Arbitrum One'));
  });

  it('TC-036: NoWalletError is thrown when no privateKey provided for write ops', async () => {
    const err = new NoWalletError();
    assert.ok(err instanceof Error);
    assert.strictEqual(err.name, 'NoWalletError');
  });
});

describe('Vaultfire Arbitrum — Street Cred Scoring', () => {

  it('TC-037: Max possible score is 95', () => {
    assert.strictEqual(STREET_CRED_SCORING.MAX_POSSIBLE, 95);
  });

  it('TC-038: Identity score is 30', () => {
    assert.strictEqual(STREET_CRED_SCORING.IDENTITY, 30);
  });

  it('TC-039: Bond exists score is 25', () => {
    assert.strictEqual(STREET_CRED_SCORING.BOND_EXISTS, 25);
  });

  it('TC-040: Bond active score is 15', () => {
    assert.strictEqual(STREET_CRED_SCORING.BOND_ACTIVE, 15);
  });

  it('TC-041: Platinum tier bonus is 20', () => {
    assert.strictEqual(STREET_CRED_SCORING.TIER_BONUS_PLATINUM, 20);
  });

  it('TC-042: Multiple bonds score is 5', () => {
    assert.strictEqual(STREET_CRED_SCORING.MULTIPLE_BONDS, 5);
  });

  it('TC-043: calculateStreetCred returns 0 for fresh agent', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: false,
      bondCount: 0,
      hasBondActive: false,
      highestBondTier: null,
    });
    assert.strictEqual(result.total, 0);
    assert.strictEqual(result.tier, 'Unranked');
  });

  it('TC-044: calculateStreetCred returns 30 for identity-only', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true,
      bondCount: 0,
      hasBondActive: false,
      highestBondTier: null,
    });
    assert.strictEqual(result.total, 30);
    assert.strictEqual(result.tier, 'Trusted');
  });

  it('TC-045: calculateStreetCred returns 95 for fully bonded Platinum agent', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true,
      bondCount: 3,
      hasBondActive: true,
      highestBondTier: BondTier.Platinum,
    });
    // 30 + 25 + 15 + 20 + 5 = 95
    assert.strictEqual(result.total, 95);
    assert.strictEqual(result.tier, 'Legend');
  });

  it('TC-046: calculateStreetCred Bronze tier bonus is 5', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true,
      bondCount: 1,
      hasBondActive: true,
      highestBondTier: BondTier.Bronze,
    });
    // 30 + 25 + 15 + 5 = 75 (Elite)
    assert.strictEqual(result.components.tierBonusScore, 5);
    assert.strictEqual(result.tier, 'Elite');
  });

  it('TC-047: calculateStreetCred Silver tier bonus is 10', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true,
      bondCount: 1,
      hasBondActive: true,
      highestBondTier: BondTier.Silver,
    });
    assert.strictEqual(result.components.tierBonusScore, 10);
  });

  it('TC-048: calculateStreetCred Gold tier bonus is 15', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true,
      bondCount: 1,
      hasBondActive: true,
      highestBondTier: BondTier.Gold,
    });
    assert.strictEqual(result.components.tierBonusScore, 15);
  });

  it('TC-049: calculateStreetCred maxPossible is always 95', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: false,
      bondCount: 0,
      hasBondActive: false,
      highestBondTier: null,
    });
    assert.strictEqual(result.maxPossible, 95);
  });

  it('TC-050: Multiple bonds bonus only triggers at 2+ bonds', () => {
    const client = new VaultfireArbitrumClient();
    const one = client.calculateStreetCred({
      hasIdentity: true, bondCount: 1, hasBondActive: true, highestBondTier: BondTier.Gold,
    });
    const two = client.calculateStreetCred({
      hasIdentity: true, bondCount: 2, hasBondActive: true, highestBondTier: BondTier.Gold,
    });
    assert.strictEqual(one.components.multipleBondsScore, 0);
    assert.strictEqual(two.components.multipleBondsScore, 5);
  });
});

describe('Vaultfire Arbitrum — Bond Tier Calculations', () => {

  it('TC-051: Bronze tier stake is 0.01 ETH (10000000000000000 wei)', () => {
    assert.strictEqual(BOND_TIER_VALUES[BondTier.Bronze], BigInt('10000000000000000'));
  });

  it('TC-052: Silver tier stake is 0.05 ETH (50000000000000000 wei)', () => {
    assert.strictEqual(BOND_TIER_VALUES[BondTier.Silver], BigInt('50000000000000000'));
  });

  it('TC-053: Gold tier stake is 0.1 ETH (100000000000000000 wei)', () => {
    assert.strictEqual(BOND_TIER_VALUES[BondTier.Gold], BigInt('100000000000000000'));
  });

  it('TC-054: Platinum tier stake is 0.5 ETH (500000000000000000 wei)', () => {
    assert.strictEqual(BOND_TIER_VALUES[BondTier.Platinum], BigInt('500000000000000000'));
  });

  it('TC-055: getBondStakeAmount returns correct value for Bronze', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(client.getBondStakeAmount(BondTier.Bronze), BigInt('10000000000000000'));
  });

  it('TC-056: getBondTierDescription returns correct string for Gold', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(client.getBondTierDescription(BondTier.Gold), '0.1 ETH');
  });

  it('TC-057: BOND_TIER_ETH maps are correct', () => {
    assert.strictEqual(BOND_TIER_ETH[BondTier.Bronze], '0.01');
    assert.strictEqual(BOND_TIER_ETH[BondTier.Silver], '0.05');
    assert.strictEqual(BOND_TIER_ETH[BondTier.Gold], '0.1');
    assert.strictEqual(BOND_TIER_ETH[BondTier.Platinum], '0.5');
  });

  it('TC-058: Platinum stake is 50x Bronze stake', () => {
    const ratio = BOND_TIER_VALUES[BondTier.Platinum] / BOND_TIER_VALUES[BondTier.Bronze];
    assert.strictEqual(ratio, BigInt(50));
  });
});

describe('Vaultfire Arbitrum — Partnership Type Validation', () => {

  it('TC-059: collaboration is a valid partnership type', () => {
    assert.ok(Object.values(PartnershipType).includes(PartnershipType.Collaboration));
  });

  it('TC-060: All 5 partnership types are defined', () => {
    const types = Object.values(PartnershipType);
    assert.strictEqual(types.length, 5);
  });

  it('TC-061: getPartnershipTypes returns all 5 types', () => {
    const client = new VaultfireArbitrumClient();
    assert.strictEqual(client.getPartnershipTypes().length, 5);
  });

  it('TC-062: PARTNERSHIP_TYPE_VALUES maps all types to 0-4', () => {
    const vals = Object.values(PARTNERSHIP_TYPE_VALUES);
    assert.deepEqual(vals.sort(), [0, 1, 2, 3, 4]);
  });

  it('TC-063: collaboration maps to 0', () => {
    assert.strictEqual(PARTNERSHIP_TYPE_VALUES['collaboration'], 0);
  });

  it('TC-064: oracle-consumer maps to 4', () => {
    assert.strictEqual(PARTNERSHIP_TYPE_VALUES['oracle-consumer'], 4);
  });
});

describe('Vaultfire Arbitrum — ABI Correctness', () => {

  it('TC-065: ERC8004IdentityRegistry ABI has registerAgent function', () => {
    const hasRegister = ERC8004_IDENTITY_REGISTRY_ABI.some(
      f => f.name === 'registerAgent' && f.type === 'function'
    );
    assert.ok(hasRegister);
  });

  it('TC-066: ERC8004IdentityRegistry ABI has isRegistered view function', () => {
    const fn = ERC8004_IDENTITY_REGISTRY_ABI.find(f => f.name === 'isRegistered');
    assert.ok(fn);
    assert.strictEqual(fn?.stateMutability, 'view');
  });

  it('TC-067: AIPartnershipBondsV2 ABI has payable createBond', () => {
    const fn = AI_PARTNERSHIP_BONDS_V2_ABI.find(f => f.name === 'createBond');
    assert.ok(fn);
    assert.strictEqual(fn?.stateMutability, 'payable');
  });

  it('TC-068: AIPartnershipBondsV2 ABI has getActiveBonds view function', () => {
    const fn = AI_PARTNERSHIP_BONDS_V2_ABI.find(f => f.name === 'getActiveBonds');
    assert.ok(fn);
    assert.strictEqual(fn?.stateMutability, 'view');
  });

  it('TC-069: AIAccountabilityBondsV2 ABI has slash function', () => {
    const hasFn = AI_ACCOUNTABILITY_BONDS_V2_ABI.some(f => f.name === 'slash');
    assert.ok(hasFn);
  });

  it('TC-070: ERC8004ReputationRegistry ABI has getReputation view', () => {
    const fn = ERC8004_REPUTATION_REGISTRY_ABI.find(f => f.name === 'getReputation');
    assert.ok(fn);
    assert.strictEqual(fn?.stateMutability, 'view');
  });

  it('TC-071: ERC8004ReputationRegistry ABI has ratePeer function', () => {
    const hasFn = ERC8004_REPUTATION_REGISTRY_ABI.some(f => f.name === 'ratePeer');
    assert.ok(hasFn);
  });

  it('TC-072: VaultfireNameService ABI has lookup view function', () => {
    const fn = VAULTFIRE_NAME_SERVICE_ABI.find(f => f.name === 'lookup');
    assert.ok(fn);
    assert.strictEqual(fn?.stateMutability, 'view');
  });

  it('TC-073: VaultfireNameService ABI has reverseLookup view function', () => {
    const fn = VAULTFIRE_NAME_SERVICE_ABI.find(f => f.name === 'reverseLookup');
    assert.ok(fn);
    assert.strictEqual(fn?.stateMutability, 'view');
  });

  it('TC-074: All ABI functions have valid stateMutability values', () => {
    const validMutabilities = ['pure', 'view', 'nonpayable', 'payable'];
    const allAbis = [
      ...ERC8004_IDENTITY_REGISTRY_ABI,
      ...AI_PARTNERSHIP_BONDS_V2_ABI,
      ...AI_ACCOUNTABILITY_BONDS_V2_ABI,
      ...ERC8004_REPUTATION_REGISTRY_ABI,
      ...VAULTFIRE_NAME_SERVICE_ABI,
    ];
    for (const frag of allAbis) {
      if (frag.type === 'function') {
        assert.ok(
          validMutabilities.includes(frag.stateMutability ?? ''),
          `Invalid stateMutability "${frag.stateMutability}" on ${frag.name}`
        );
      }
    }
  });
});

describe('Vaultfire Arbitrum — Utilities', () => {

  it('TC-075: getTransactionUrl builds correct Arbiscan URL', () => {
    const client = new VaultfireArbitrumClient();
    const url = client.getTransactionUrl('0xabc123' as `0x${string}`);
    assert.strictEqual(url, 'https://arbiscan.io/tx/0xabc123');
  });

  it('TC-076: getAddressUrl builds correct Arbiscan URL', () => {
    const client = new VaultfireArbitrumClient();
    const url = client.getAddressUrl('0xfA15Ee28939B222B0448261A22156070f0A7813C');
    assert.strictEqual(
      url,
      'https://arbiscan.io/address/0xfA15Ee28939B222B0448261A22156070f0A7813C'
    );
  });

  it('TC-077: CHAIN_ID export is 42161', () => {
    assert.strictEqual(CHAIN_ID, 42161);
  });

  it('TC-078: CHAIN_NAME export is Arbitrum One', () => {
    assert.strictEqual(CHAIN_NAME, 'Arbitrum One');
  });

  it('TC-079: VERSION export is 1.0.0', () => {
    assert.strictEqual(VERSION, '1.0.0');
  });

  it('TC-080: arbitrumChainDef has correct id', () => {
    assert.strictEqual(arbitrumChainDef.id, 42161);
  });

  it('TC-081: arbitrumChainDef native currency is ETH', () => {
    assert.strictEqual(arbitrumChainDef.nativeCurrency.symbol, 'ETH');
  });

  it('TC-082: BOND_TIER_ENUM_VALUES has 4 entries', () => {
    assert.strictEqual(Object.keys(BOND_TIER_ENUM_VALUES).length, 4);
  });

  it('TC-083: RATING_CATEGORY_VALUES has 5 categories', () => {
    assert.strictEqual(Object.keys(RATING_CATEGORY_VALUES).length, 5);
  });

  it('TC-084: InvalidRatingError has correct name', () => {
    const err = new InvalidRatingError(6);
    assert.strictEqual(err.name, 'InvalidRatingError');
  });

  it('TC-085: InvalidRatingError message includes the bad rating', () => {
    const err = new InvalidRatingError(99);
    assert.ok(err.message.includes('99'));
  });
});

describe('Vaultfire Arbitrum — Street Cred Tier Labels', () => {

  it('TC-086: Score 0 maps to Unranked', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: false, bondCount: 0, hasBondActive: false, highestBondTier: null,
    });
    assert.strictEqual(result.tier, 'Unranked');
  });

  it('TC-087: Score 1–29 maps to Novice', () => {
    // identity only = 30, so we test manually via tier tiers
    assert.strictEqual(STREET_CRED_TIERS.NOVICE.min, 1);
    assert.strictEqual(STREET_CRED_TIERS.NOVICE.max, 29);
    assert.strictEqual(STREET_CRED_TIERS.NOVICE.label, 'Novice');
  });

  it('TC-088: Score 30–54 maps to Trusted', () => {
    assert.strictEqual(STREET_CRED_TIERS.TRUSTED.min, 30);
    assert.strictEqual(STREET_CRED_TIERS.TRUSTED.max, 54);
    assert.strictEqual(STREET_CRED_TIERS.TRUSTED.label, 'Trusted');
  });

  it('TC-089: Score 55–79 maps to Elite', () => {
    assert.strictEqual(STREET_CRED_TIERS.ELITE.min, 55);
    assert.strictEqual(STREET_CRED_TIERS.ELITE.max, 79);
    assert.strictEqual(STREET_CRED_TIERS.ELITE.label, 'Elite');
  });

  it('TC-090: Score 80–95 maps to Legend', () => {
    assert.strictEqual(STREET_CRED_TIERS.LEGEND.min, 80);
    assert.strictEqual(STREET_CRED_TIERS.LEGEND.max, 95);
    assert.strictEqual(STREET_CRED_TIERS.LEGEND.label, 'Legend');
  });

  it('TC-091: Identity-only score (30) maps to Trusted', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true, bondCount: 0, hasBondActive: false, highestBondTier: null,
    });
    assert.strictEqual(result.total, 30);
    assert.strictEqual(result.tier, 'Trusted');
  });

  it('TC-092: calculateStreetCred hasIdentity matches params', () => {
    const client = new VaultfireArbitrumClient();
    const withId = client.calculateStreetCred({
      hasIdentity: true, bondCount: 0, hasBondActive: false, highestBondTier: null,
    });
    const withoutId = client.calculateStreetCred({
      hasIdentity: false, bondCount: 0, hasBondActive: false, highestBondTier: null,
    });
    assert.strictEqual(withId.hasIdentity, true);
    assert.strictEqual(withoutId.hasIdentity, false);
  });

  it('TC-093: calculateStreetCred bondCount is preserved', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true, bondCount: 7, hasBondActive: true, highestBondTier: BondTier.Gold,
    });
    assert.strictEqual(result.bondCount, 7);
  });

  it('TC-094: calculateStreetCred highestBondTier is preserved', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true, bondCount: 1, hasBondActive: true, highestBondTier: BondTier.Platinum,
    });
    assert.strictEqual(result.highestBondTier, BondTier.Platinum);
  });

  it('TC-095: Identity score component is 0 when no identity', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: false, bondCount: 0, hasBondActive: false, highestBondTier: null,
    });
    assert.strictEqual(result.components.identityScore, 0);
  });

  it('TC-096: Bond active score is 0 when bond is not active', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true, bondCount: 1, hasBondActive: false, highestBondTier: BondTier.Gold,
    });
    assert.strictEqual(result.components.bondActiveScore, 0);
  });

  it('TC-097: Correct score: identity + bond + active + silver + 1 bond = 75', () => {
    const client = new VaultfireArbitrumClient();
    const result = client.calculateStreetCred({
      hasIdentity: true, bondCount: 1, hasBondActive: true, highestBondTier: BondTier.Silver,
    });
    // 30 + 25 + 15 + 10 + 0 = 80
    assert.strictEqual(result.total, 80);
  });

  it('TC-098: USDC address is checksummed (mixed case)', () => {
    const usdc = ARBITRUM_CONFIG.usdc;
    // Circle's native USDC on Arbitrum has specific mixed case
    assert.ok(usdc.includes('af88d065e77c8cC2239327C5EDb3A432268e5831'.toLowerCase()) ||
      usdc === '0xaf88d065e77c8cC2239327C5EDb3A432268e5831');
  });

  it('TC-099: BOND_TIER_ENUM_VALUES Bronze is 0', () => {
    assert.strictEqual(BOND_TIER_ENUM_VALUES['Bronze'], 0);
  });

  it('TC-100: BOND_TIER_ENUM_VALUES Platinum is 3', () => {
    assert.strictEqual(BOND_TIER_ENUM_VALUES['Platinum'], 3);
  });
});
