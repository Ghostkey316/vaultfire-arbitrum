/**
 * @vaultfire/arbitrum
 * Vaultfire Protocol on Arbitrum One — AI agent trust, accountability bonds,
 * and belief-weighted governance.
 *
 * @see https://github.com/Ghostkey316/vaultfire-arbitrum
 */

// ─── Client ───────────────────────────────────────────────────────────────────

export {
  VaultfireArbitrumClient,
  DeployPendingError,
  InvalidRatingError,
  NoWalletError,
} from './client.js';

// ─── Config ───────────────────────────────────────────────────────────────────

export {
  ARBITRUM_CONFIG,
  ARBITRUM_CONTRACTS,
  arbitrumChainDef,
  ERC8004_IDENTITY_REGISTRY_ABI,
  AI_PARTNERSHIP_BONDS_V2_ABI,
  AI_ACCOUNTABILITY_BONDS_V2_ABI,
  ERC8004_REPUTATION_REGISTRY_ABI,
  VAULTFIRE_NAME_SERVICE_ABI,
  STREET_CRED_SCORING,
  STREET_CRED_TIERS,
  PARTNERSHIP_TYPE_VALUES,
  BOND_TIER_ENUM_VALUES,
  RATING_CATEGORY_VALUES,
} from './config.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  Address,
  ContractAddress,
  ContractAddresses,
  ChainConfig,
  AgentRegistrationParams,
  AgentRegistrationResult,
  CreateBondParams,
  CreateBondResult,
  CreateAccountabilityBondParams,
  CreateAccountabilityBondResult,
  StreetCredComponents,
  StreetCredResult,
  VNSLookupResult,
  RatePeerParams,
  RatePeerResult,
  VaultfireClientConfig,
  AbiFragment,
  AbiInput,
  Abi,
} from './types.js';

export {
  BondTier,
  BOND_TIER_VALUES,
  BOND_TIER_ETH,
  PartnershipType,
} from './types.js';

// ─── Version ──────────────────────────────────────────────────────────────────

export const VERSION = '1.0.0';
export const CHAIN_ID = 42161;
export const CHAIN_NAME = 'Arbitrum One';
