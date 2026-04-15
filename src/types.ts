/**
 * Vaultfire Protocol — Arbitrum One
 * Type definitions for the Vaultfire SDK
 */

// ─── Address types ──────────────────────────────────────────────────────────

/** A checksummed Ethereum hex address */
export type Address = `0x${string}`;

/** A DEPLOY_PENDING placeholder or a real address */
export type ContractAddress = Address | 'DEPLOY_PENDING';

// ─── Bond tiers ──────────────────────────────────────────────────────────────

export enum BondTier {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
}

export const BOND_TIER_VALUES: Record<BondTier, bigint> = {
  [BondTier.Bronze]: BigInt('10000000000000000'),   // 0.01 ETH in wei
  [BondTier.Silver]: BigInt('50000000000000000'),   // 0.05 ETH in wei
  [BondTier.Gold]: BigInt('100000000000000000'),    // 0.1 ETH in wei
  [BondTier.Platinum]: BigInt('500000000000000000'), // 0.5 ETH in wei
};

export const BOND_TIER_ETH: Record<BondTier, string> = {
  [BondTier.Bronze]: '0.01',
  [BondTier.Silver]: '0.05',
  [BondTier.Gold]: '0.1',
  [BondTier.Platinum]: '0.5',
};

// ─── Partnership types ───────────────────────────────────────────────────────

export enum PartnershipType {
  Collaboration = 'collaboration',
  Delegation = 'delegation',
  ServiceProvider = 'service-provider',
  DataSharing = 'data-sharing',
  OracleConsumer = 'oracle-consumer',
}

// ─── Agent registration ───────────────────────────────────────────────────────

export interface AgentRegistrationParams {
  /** The agent's on-chain address */
  agentAddress: Address;
  /** Human-readable name for the agent */
  name: string;
  /** Optional metadata URI (IPFS or HTTPS) */
  metadataUri?: string;
  /** Agent capabilities bitmask */
  capabilities?: number;
}

export interface AgentRegistrationResult {
  transactionHash: `0x${string}`;
  agentAddress: Address;
  registeredAt: bigint;
}

// ─── Partnership bonds ───────────────────────────────────────────────────────

export interface CreateBondParams {
  /** The counterparty agent address */
  partnerAddress: Address;
  /** Type of partnership */
  partnershipType: PartnershipType;
  /** Bond tier determining collateral amount */
  tier: BondTier;
  /** Optional expiry timestamp (Unix seconds). 0 = no expiry */
  expiresAt?: bigint;
  /** Optional terms URI */
  termsUri?: string;
}

export interface CreateBondResult {
  transactionHash: `0x${string}`;
  bondId: bigint;
  bondAddress: Address;
  tier: BondTier;
  partnershipType: PartnershipType;
  createdAt: bigint;
}

// ─── Accountability bonds ────────────────────────────────────────────────────

export interface CreateAccountabilityBondParams {
  /** The subject agent whose accountability is being bonded */
  subjectAddress: Address;
  /** Bond tier */
  tier: BondTier;
  /** Mission statement or terms URI */
  missionUri?: string;
  /** Slash condition description */
  slashCondition?: string;
  /** Arbitrator address for disputes */
  arbitratorAddress?: Address;
}

export interface CreateAccountabilityBondResult {
  transactionHash: `0x${string}`;
  bondId: bigint;
  subjectAddress: Address;
  tier: BondTier;
  stakedAmount: bigint;
  createdAt: bigint;
}

// ─── Street Cred (reputation) ────────────────────────────────────────────────

export interface StreetCredComponents {
  /** +30 points for having an ERC-8004 identity */
  identityScore: number;
  /** +25 points for having at least one active bond */
  bondExistsScore: number;
  /** +15 points for bond being currently active (not expired) */
  bondActiveScore: number;
  /** Up to +20 points based on highest bond tier */
  tierBonusScore: number;
  /** +5 points for having multiple bonds */
  multipleBondsScore: number;
}

export interface StreetCredResult {
  agentAddress: Address;
  total: number;
  maxPossible: number;
  components: StreetCredComponents;
  tier: 'Unranked' | 'Novice' | 'Trusted' | 'Elite' | 'Legend';
  hasIdentity: boolean;
  bondCount: number;
  highestBondTier: BondTier | null;
}

// ─── VNS (Vaultfire Name Service) ────────────────────────────────────────────

export interface VNSLookupResult {
  name: string;
  resolvedAddress: Address | null;
  owner: Address | null;
  expiresAt: bigint | null;
  exists: boolean;
}

// ─── Peer rating ──────────────────────────────────────────────────────────────

export interface RatePeerParams {
  /** The peer agent being rated */
  peerAddress: Address;
  /** Rating from 1–5 */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Optional free-text comment */
  comment?: string;
  /** Category being rated */
  category?: 'reliability' | 'accuracy' | 'speed' | 'ethics' | 'overall';
}

export interface RatePeerResult {
  transactionHash: `0x${string}`;
  peerAddress: Address;
  ratingId: bigint;
  rating: number;
  submittedAt: bigint;
}

// ─── Client config ────────────────────────────────────────────────────────────

export interface VaultfireClientConfig {
  /** Private key for signing transactions (0x-prefixed) */
  privateKey?: `0x${string}`;
  /** Override the default RPC URL */
  rpcUrl?: string;
  /** Override contract addresses (useful for testing) */
  contractOverrides?: Partial<Record<string, Address>>;
}

// ─── Contract addresses registry ─────────────────────────────────────────────

export interface ContractAddresses {
  USDC: Address;
  ERC8004IdentityRegistry: ContractAddress;
  AIPartnershipBondsV2: ContractAddress;
  AIAccountabilityBondsV2: ContractAddress;
  ERC8004ReputationRegistry: ContractAddress;
  ERC8004ValidationRegistry: ContractAddress;
  VaultfireERC8004Adapter: ContractAddress;
  VaultfireNameService: ContractAddress;
  FlourishingMetricsOracle: ContractAddress;
  MultisigGovernance: ContractAddress;
  VaultfireTeleporterBridge: ContractAddress;
  DilithiumAttestor: ContractAddress;
  ProductionBeliefAttestationVerifier: ContractAddress;
  BeliefAttestationVerifier: ContractAddress;
  MissionEnforcement: ContractAddress;
  AntiSurveillance: ContractAddress;
  PrivacyGuarantees: ContractAddress;
}

// ─── ABI fragment types ───────────────────────────────────────────────────────

export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiInput[];
}

export interface AbiFragment {
  name?: string;
  type: 'function' | 'event' | 'constructor' | 'error' | 'fallback' | 'receive';
  stateMutability?: 'pure' | 'view' | 'nonpayable' | 'payable';
  inputs?: AbiInput[];
  outputs?: AbiInput[];
  anonymous?: boolean;
}

export type Abi = readonly AbiFragment[];

// ─── Chain config ─────────────────────────────────────────────────────────────

export interface ChainConfig {
  chain: string;
  chainId: number;
  rpc: string;
  explorer: string;
  explorerApi: string;
  usdc: Address;
  nativeToken: string;
  deployer: Address;
  contracts: ContractAddresses;
}
