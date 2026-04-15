/**
 * Vaultfire Protocol — Arbitrum One
 * Chain configuration and contract address registry
 */

import type { Address, ContractAddresses, ChainConfig } from './types.js';

// ─── Contract addresses ───────────────────────────────────────────────────────

/**
 * Contract addresses for Vaultfire Protocol on Arbitrum One.
 * All 16 Vaultfire-specific contracts are deployed and verified on Arbitrum One.
 * USDC is the real Circle-native USDC on Arbitrum.
 */
export const ARBITRUM_CONTRACTS: ContractAddresses = {
  // ✅ Real address — Circle-native USDC on Arbitrum One
  USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address,

  // ✅ Deployed — Vaultfire contracts live on Arbitrum One (deployed 2026-04-15)
  ERC8004IdentityRegistry: '0x6298c62FDA57276DC60de9E716fbBAc23d06D5F1' as Address,
  AIPartnershipBondsV2: '0x0E777878C5b5248E1b52b09Ab5cdEb2eD6e7Da58' as Address,
  AIAccountabilityBondsV2: '0xfDdd2B1597c87577543176AB7f49D587876563D2' as Address,
  ERC8004ReputationRegistry: '0x8aceF0Bc7e07B2dE35E9069663953f41B5422218' as Address,
  ERC8004ValidationRegistry: '0x1A80F77e12f1bd04538027aed6d056f5DCcDCD3C' as Address,
  VaultfireERC8004Adapter: '0x613585B786af2d5ecb1c3e712CE5ffFB8f53f155' as Address,
  VaultfireNameService: '0x247F31bB2b5a0d28E68bf24865AA242965FF99cd' as Address,
  FlourishingMetricsOracle: '0x630C43F763a332793C421C788B8b1CCC5A3122E7' as Address,
  MultisigGovernance: '0x889f5cfb142Bb6E72CB0C633800324C335eED9A4' as Address,
  VaultfireTeleporterBridge: '0xe2aDfe84703dd6B5e421c306861Af18F962fDA91' as Address,
  DilithiumAttestor: '0xc2F789d82ef55bAbb9Df38f61E606cD34628dB38' as Address,
  ProductionBeliefAttestationVerifier: '0xe0B709511438D0aCfD5D2d69F40b90C4c27eC760' as Address,
  BeliefAttestationVerifier: '0xaEBD3d62DF9bF5A5b99c289756c4cd203AC879e5' as Address,
  MissionEnforcement: '0x690411685278548157409FA7AC8279A5B1Fb6F78' as Address,
  AntiSurveillance: '0xcf64D815F5424B7937aB226bC733Ed35ab6CaDcB' as Address,
  PrivacyGuarantees: '0x281814eF92062DA8049Fe5c4743c4Aef19a17380' as Address,
};

// ─── Chain configuration ──────────────────────────────────────────────────────

export const ARBITRUM_CONFIG: ChainConfig = {
  chain: 'arbitrum-one',
  chainId: 42161,
  rpc: 'https://arb1.arbitrum.io/rpc',
  explorer: 'https://arbiscan.io',
  explorerApi: 'https://api.arbiscan.io/api',
  usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address,
  nativeToken: 'ETH',
  deployer: '0xA054f831B562e729F8D268291EBde1B2EDcFb84F' as Address,
  contracts: ARBITRUM_CONTRACTS,
};

// ─── Viem chain definition ────────────────────────────────────────────────────

export const arbitrumChainDef = {
  id: 42161,
  name: 'Arbitrum One',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
    public: {
      http: ['https://arb1.arbitrum.io/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
  },
} as const;

// ─── ABI definitions ──────────────────────────────────────────────────────────

/** ERC-8004 Identity Registry — core agent registration */
export const ERC8004_IDENTITY_REGISTRY_ABI = [
  {
    name: 'registerAgent',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'agentAddress', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'metadataUri', type: 'string' },
      { name: 'capabilities', type: 'uint256' },
    ],
    outputs: [{ name: 'agentId', type: 'uint256' }],
  },
  {
    name: 'getAgent',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentAddress', type: 'address' }],
    outputs: [
      { name: 'agentId', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'metadataUri', type: 'string' },
      { name: 'capabilities', type: 'uint256' },
      { name: 'registeredAt', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  {
    name: 'isRegistered',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentAddress', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'AgentRegistered',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'agentId', type: 'uint256', indexed: true },
      { name: 'agentAddress', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'registeredAt', type: 'uint256', indexed: false },
    ],
  },
] as const;

/** AI Partnership Bonds V2 — peer-to-peer trust bonds */
export const AI_PARTNERSHIP_BONDS_V2_ABI = [
  {
    name: 'createBond',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'partnerAddress', type: 'address' },
      { name: 'partnershipType', type: 'uint8' },
      { name: 'tier', type: 'uint8' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'termsUri', type: 'string' },
    ],
    outputs: [
      { name: 'bondId', type: 'uint256' },
      { name: 'bondAddress', type: 'address' },
    ],
  },
  {
    name: 'getBond',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [
      { name: 'initiator', type: 'address' },
      { name: 'partner', type: 'address' },
      { name: 'partnershipType', type: 'uint8' },
      { name: 'tier', type: 'uint8' },
      { name: 'stakedAmount', type: 'uint256' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'termsUri', type: 'string' },
    ],
  },
  {
    name: 'getActiveBonds',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentAddress', type: 'address' }],
    outputs: [{ name: 'bondIds', type: 'uint256[]' }],
  },
  {
    name: 'dissolve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'BondCreated',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'bondId', type: 'uint256', indexed: true },
      { name: 'initiator', type: 'address', indexed: true },
      { name: 'partner', type: 'address', indexed: true },
      { name: 'tier', type: 'uint8', indexed: false },
      { name: 'stakedAmount', type: 'uint256', indexed: false },
    ],
  },
] as const;

/** AI Accountability Bonds V2 — staked mission accountability */
export const AI_ACCOUNTABILITY_BONDS_V2_ABI = [
  {
    name: 'createBond',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'subjectAddress', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'missionUri', type: 'string' },
      { name: 'slashCondition', type: 'string' },
      { name: 'arbitratorAddress', type: 'address' },
    ],
    outputs: [{ name: 'bondId', type: 'uint256' }],
  },
  {
    name: 'getBond',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'bondId', type: 'uint256' }],
    outputs: [
      { name: 'subject', type: 'address' },
      { name: 'bonder', type: 'address' },
      { name: 'tier', type: 'uint8' },
      { name: 'stakedAmount', type: 'uint256' },
      { name: 'missionUri', type: 'string' },
      { name: 'slashCondition', type: 'string' },
      { name: 'arbitratorAddress', type: 'address' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  {
    name: 'slash',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'bondId', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'AccountabilityBondCreated',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'bondId', type: 'uint256', indexed: true },
      { name: 'subject', type: 'address', indexed: true },
      { name: 'bonder', type: 'address', indexed: true },
      { name: 'tier', type: 'uint8', indexed: false },
      { name: 'stakedAmount', type: 'uint256', indexed: false },
    ],
  },
] as const;

/** ERC-8004 Reputation Registry — Street Cred scoring */
export const ERC8004_REPUTATION_REGISTRY_ABI = [
  {
    name: 'getReputation',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentAddress', type: 'address' }],
    outputs: [
      { name: 'identityScore', type: 'uint256' },
      { name: 'bondExistsScore', type: 'uint256' },
      { name: 'bondActiveScore', type: 'uint256' },
      { name: 'tierBonusScore', type: 'uint256' },
      { name: 'multipleBondsScore', type: 'uint256' },
      { name: 'total', type: 'uint256' },
      { name: 'bondCount', type: 'uint256' },
      { name: 'highestTier', type: 'uint8' },
    ],
  },
  {
    name: 'ratePeer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'peerAddress', type: 'address' },
      { name: 'rating', type: 'uint8' },
      { name: 'comment', type: 'string' },
      { name: 'category', type: 'uint8' },
    ],
    outputs: [{ name: 'ratingId', type: 'uint256' }],
  },
  {
    name: 'getPeerRatings',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'peerAddress', type: 'address' }],
    outputs: [
      { name: 'totalRatings', type: 'uint256' },
      { name: 'averageRating', type: 'uint256' },
      { name: 'ratingIds', type: 'uint256[]' },
    ],
  },
  {
    name: 'PeerRated',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'ratingId', type: 'uint256', indexed: true },
      { name: 'rater', type: 'address', indexed: true },
      { name: 'peer', type: 'address', indexed: true },
      { name: 'rating', type: 'uint8', indexed: false },
      { name: 'category', type: 'uint8', indexed: false },
    ],
  },
] as const;

/** Vaultfire Name Service — human-readable agent names */
export const VAULTFIRE_NAME_SERVICE_ABI = [
  {
    name: 'lookup',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'name', type: 'string' }],
    outputs: [
      { name: 'resolvedAddress', type: 'address' },
      { name: 'owner', type: 'address' },
      { name: 'expiresAt', type: 'uint256' },
      { name: 'exists', type: 'bool' },
    ],
  },
  {
    name: 'reverseLookup',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'agentAddress', type: 'address' }],
    outputs: [{ name: 'name', type: 'string' }],
  },
  {
    name: 'register',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'agentAddress', type: 'address' },
      { name: 'durationYears', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'NameRegistered',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'name', type: 'string', indexed: false },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'resolvedAddress', type: 'address', indexed: true },
      { name: 'expiresAt', type: 'uint256', indexed: false },
    ],
  },
] as const;

// ─── Street Cred scoring constants ───────────────────────────────────────────

export const STREET_CRED_SCORING = {
  IDENTITY: 30,
  BOND_EXISTS: 25,
  BOND_ACTIVE: 15,
  TIER_BONUS_BRONZE: 5,
  TIER_BONUS_SILVER: 10,
  TIER_BONUS_GOLD: 15,
  TIER_BONUS_PLATINUM: 20,
  MULTIPLE_BONDS: 5,
  MAX_POSSIBLE: 95,
} as const;

export const STREET_CRED_TIERS = {
  UNRANKED: { min: 0, max: 0, label: 'Unranked' },
  NOVICE: { min: 1, max: 29, label: 'Novice' },
  TRUSTED: { min: 30, max: 54, label: 'Trusted' },
  ELITE: { min: 55, max: 79, label: 'Elite' },
  LEGEND: { min: 80, max: 95, label: 'Legend' },
} as const;

// ─── Partnership type enum values (matching on-chain uint8) ──────────────────

export const PARTNERSHIP_TYPE_VALUES = {
  collaboration: 0,
  delegation: 1,
  'service-provider': 2,
  'data-sharing': 3,
  'oracle-consumer': 4,
} as const;

// ─── Bond tier enum values (matching on-chain uint8) ─────────────────────────

export const BOND_TIER_ENUM_VALUES = {
  Bronze: 0,
  Silver: 1,
  Gold: 2,
  Platinum: 3,
} as const;

// ─── Rating category enum values (matching on-chain uint8) ───────────────────

export const RATING_CATEGORY_VALUES = {
  reliability: 0,
  accuracy: 1,
  speed: 2,
  ethics: 3,
  overall: 4,
} as const;
