/**
 * Vaultfire Protocol — Arbitrum One
 * VaultfireArbitrumClient — main SDK entry point
 *
 * Connects to Arbitrum One via viem and exposes methods for:
 *   - Agent registration (ERC-8004)
 *   - Partnership bonds
 *   - Accountability bonds
 *   - Street Cred reputation scoring
 *   - Vaultfire Name Service lookups
 *   - Peer ratings
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
  type PublicClient,
  type WalletClient,
  type Chain,
  type Transport,
  type Account,
  type WriteContractParameters,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
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

import {
  BondTier,
  BOND_TIER_VALUES,
  PartnershipType,
  type Address,
  type AgentRegistrationParams,
  type AgentRegistrationResult,
  type CreateBondParams,
  type CreateBondResult,
  type CreateAccountabilityBondParams,
  type CreateAccountabilityBondResult,
  type StreetCredResult,
  type StreetCredComponents,
  type VNSLookupResult,
  type RatePeerParams,
  type RatePeerResult,
  type VaultfireClientConfig,
} from './types.js';

// ─── Error classes ────────────────────────────────────────────────────────────

export class DeployPendingError extends Error {
  constructor(contractName: string) {
    super(
      `Contract "${contractName}" is DEPLOY_PENDING on Arbitrum One. ` +
      `This contract has not yet been deployed. ` +
      `Watch https://github.com/Ghostkey316/vaultfire-arbitrum for deployment announcements.`
    );
    this.name = 'DeployPendingError';
  }
}

export class InvalidRatingError extends Error {
  constructor(rating: number) {
    super(`Rating must be between 1 and 5, received: ${rating}`);
    this.name = 'InvalidRatingError';
  }
}

export class NoWalletError extends Error {
  constructor() {
    super(
      'This operation requires a wallet. ' +
      'Provide a privateKey in VaultfireClientConfig to sign transactions.'
    );
    this.name = 'NoWalletError';
  }
}

// ─── Client implementation ────────────────────────────────────────────────────

/**
 * VaultfireArbitrumClient
 *
 * The main SDK client for interacting with Vaultfire Protocol on Arbitrum One.
 *
 * @example
 * ```typescript
 * import { VaultfireArbitrumClient } from '@vaultfire/arbitrum';
 *
 * const client = new VaultfireArbitrumClient({
 *   privateKey: '0xYOUR_PRIVATE_KEY',
 * });
 *
 * const streetCred = await client.getStreetCred('0xAGENT_ADDRESS');
 * console.log(`Street Cred: ${streetCred.total}/${streetCred.maxPossible}`);
 * ```
 */
export class VaultfireArbitrumClient {
  private readonly config = ARBITRUM_CONFIG;
  private readonly contracts = ARBITRUM_CONTRACTS;
  private readonly rpcUrl: string;
  private readonly publicClient: PublicClient;
  private walletClient: WalletClient<Transport, Chain, Account> | null = null;

  constructor(clientConfig?: VaultfireClientConfig) {
    this.rpcUrl = clientConfig?.rpcUrl ?? this.config.rpc;

    const chain = arbitrumChainDef as unknown as Chain;

    this.publicClient = createPublicClient({
      chain,
      transport: http(this.rpcUrl),
    });

    if (clientConfig?.privateKey) {
      const account = privateKeyToAccount(clientConfig.privateKey);
      this.walletClient = createWalletClient({
        account,
        chain,
        transport: http(this.rpcUrl),
      }).extend(publicActions) as unknown as WalletClient<Transport, Chain, Account>;
    }
  }

  // ─── Internal helpers ───────────────────────────────────────────────────────

  /**
   * Asserts a contract address is not DEPLOY_PENDING before use.
   * Throws DeployPendingError if the contract hasn't been deployed.
   */
  private requireDeployed(contractName: keyof typeof ARBITRUM_CONTRACTS): Address {
    const addr = this.contracts[contractName];
    if (addr === 'DEPLOY_PENDING') {
      throw new DeployPendingError(contractName);
    }
    return addr as Address;
  }

  /**
   * Asserts a wallet client is available (privateKey was provided).
   */
  private requireWallet(): WalletClient<Transport, Chain, Account> {
    if (!this.walletClient) {
      throw new NoWalletError();
    }
    return this.walletClient;
  }

  /**
   * Returns the tier bonus points for a given bond tier.
   */
  private getTierBonusPoints(tier: BondTier | null): number {
    if (tier === null) return 0;
    switch (tier) {
      case BondTier.Bronze: return STREET_CRED_SCORING.TIER_BONUS_BRONZE;
      case BondTier.Silver: return STREET_CRED_SCORING.TIER_BONUS_SILVER;
      case BondTier.Gold: return STREET_CRED_SCORING.TIER_BONUS_GOLD;
      case BondTier.Platinum: return STREET_CRED_SCORING.TIER_BONUS_PLATINUM;
    }
  }

  /**
   * Maps a numeric Street Cred total to a human-readable tier label.
   */
  private getStreetCredTierLabel(
    total: number
  ): 'Unranked' | 'Novice' | 'Trusted' | 'Elite' | 'Legend' {
    if (total === 0) return STREET_CRED_TIERS.UNRANKED.label;
    if (total <= STREET_CRED_TIERS.NOVICE.max) return STREET_CRED_TIERS.NOVICE.label;
    if (total <= STREET_CRED_TIERS.TRUSTED.max) return STREET_CRED_TIERS.TRUSTED.label;
    if (total <= STREET_CRED_TIERS.ELITE.max) return STREET_CRED_TIERS.ELITE.label;
    return STREET_CRED_TIERS.LEGEND.label;
  }

  /**
   * Maps an on-chain uint8 tier value to a BondTier enum.
   */
  private tierFromUint8(value: bigint): BondTier | null {
    switch (Number(value)) {
      case BOND_TIER_ENUM_VALUES.Bronze: return BondTier.Bronze;
      case BOND_TIER_ENUM_VALUES.Silver: return BondTier.Silver;
      case BOND_TIER_ENUM_VALUES.Gold: return BondTier.Gold;
      case BOND_TIER_ENUM_VALUES.Platinum: return BondTier.Platinum;
      default: return null;
    }
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Returns the Arbitrum One chain configuration.
   */
  getChainConfig() {
    return { ...this.config };
  }

  /**
   * Returns all contract addresses (including DEPLOY_PENDING markers).
   */
  getContractAddresses() {
    return { ...this.contracts };
  }

  /**
   * Checks whether all Vaultfire contracts have been deployed
   * (none are DEPLOY_PENDING).
   */
  isFullyDeployed(): boolean {
    return Object.values(this.contracts).every((addr) => addr !== 'DEPLOY_PENDING');
  }

  /**
   * Returns a list of contracts that are still DEPLOY_PENDING.
   */
  getPendingContracts(): string[] {
    return Object.entries(this.contracts)
      .filter(([, addr]) => addr === 'DEPLOY_PENDING')
      .map(([name]) => name);
  }

  // ─── Agent registration ─────────────────────────────────────────────────────

  /**
   * Registers an AI agent on-chain via ERC-8004 Identity Registry.
   *
   * @throws {DeployPendingError} if ERC8004IdentityRegistry is not deployed
   * @throws {NoWalletError} if no private key was provided
   */
  async registerAgent(params: AgentRegistrationParams): Promise<AgentRegistrationResult> {
    const registryAddress = this.requireDeployed('ERC8004IdentityRegistry');
    const wallet = this.requireWallet();

    const hash = await wallet.writeContract({
      address: registryAddress,
      abi: ERC8004_IDENTITY_REGISTRY_ABI,
      functionName: 'registerAgent',
      args: [
        params.agentAddress,
        params.name,
        params.metadataUri ?? '',
        BigInt(params.capabilities ?? 0),
      ],
    } as Parameters<typeof wallet.writeContract>[0]);

    return {
      transactionHash: hash,
      agentAddress: params.agentAddress,
      registeredAt: BigInt(Math.floor(Date.now() / 1000)),
    };
  }

  /**
   * Checks whether an agent address is registered in the ERC-8004 registry.
   *
   * @throws {DeployPendingError} if ERC8004IdentityRegistry is not deployed
   */
  async isAgentRegistered(agentAddress: Address): Promise<boolean> {
    const registryAddress = this.requireDeployed('ERC8004IdentityRegistry');

    return this.publicClient.readContract({
      address: registryAddress,
      abi: ERC8004_IDENTITY_REGISTRY_ABI,
      functionName: 'isRegistered',
      args: [agentAddress],
    }) as Promise<boolean>;
  }

  // ─── Partnership bonds ──────────────────────────────────────────────────────

  /**
   * Creates a peer-to-peer AI Partnership Bond.
   *
   * Requires ETH stake equal to the bond tier value:
   *   - Bronze: 0.01 ETH
   *   - Silver: 0.05 ETH
   *   - Gold:   0.1  ETH
   *   - Platinum: 0.5 ETH
   *
   * @throws {DeployPendingError} if AIPartnershipBondsV2 is not deployed
   * @throws {NoWalletError} if no private key was provided
   */
  async createPartnershipBond(params: CreateBondParams): Promise<CreateBondResult> {
    const bondsAddress = this.requireDeployed('AIPartnershipBondsV2');
    const wallet = this.requireWallet();

    const stakeAmount = BOND_TIER_VALUES[params.tier];
    const partnershipTypeValue = PARTNERSHIP_TYPE_VALUES[params.partnershipType];
    const tierValue = BOND_TIER_ENUM_VALUES[params.tier];

    const hash = await wallet.writeContract({
      address: bondsAddress,
      abi: AI_PARTNERSHIP_BONDS_V2_ABI,
      functionName: 'createBond',
      args: [
        params.partnerAddress,
        partnershipTypeValue,
        tierValue,
        params.expiresAt ?? BigInt(0),
        params.termsUri ?? '',
      ],
      value: stakeAmount,
    } as unknown as WriteContractParameters);

    return {
      transactionHash: hash,
      bondId: BigInt(0), // will be set from receipt event in production
      bondAddress: bondsAddress,
      tier: params.tier,
      partnershipType: params.partnershipType,
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
    };
  }

  /**
   * Returns all active partnership bond IDs for an agent.
   *
   * @throws {DeployPendingError} if AIPartnershipBondsV2 is not deployed
   */
  async getActiveBonds(agentAddress: Address): Promise<bigint[]> {
    const bondsAddress = this.requireDeployed('AIPartnershipBondsV2');

    return this.publicClient.readContract({
      address: bondsAddress,
      abi: AI_PARTNERSHIP_BONDS_V2_ABI,
      functionName: 'getActiveBonds',
      args: [agentAddress],
    }) as Promise<bigint[]>;
  }

  // ─── Accountability bonds ───────────────────────────────────────────────────

  /**
   * Creates an AI Accountability Bond — staked proof of mission commitment.
   *
   * @throws {DeployPendingError} if AIAccountabilityBondsV2 is not deployed
   * @throws {NoWalletError} if no private key was provided
   */
  async createAccountabilityBond(
    params: CreateAccountabilityBondParams
  ): Promise<CreateAccountabilityBondResult> {
    const bondsAddress = this.requireDeployed('AIAccountabilityBondsV2');
    const wallet = this.requireWallet();

    const stakeAmount = BOND_TIER_VALUES[params.tier];
    const tierValue = BOND_TIER_ENUM_VALUES[params.tier];

    const hash = await wallet.writeContract({
      address: bondsAddress,
      abi: AI_ACCOUNTABILITY_BONDS_V2_ABI,
      functionName: 'createBond',
      args: [
        params.subjectAddress,
        tierValue,
        params.missionUri ?? '',
        params.slashCondition ?? '',
        params.arbitratorAddress ?? ('0x0000000000000000000000000000000000000000' as Address),
      ],
      value: stakeAmount,
    } as unknown as WriteContractParameters);

    return {
      transactionHash: hash,
      bondId: BigInt(0),
      subjectAddress: params.subjectAddress,
      tier: params.tier,
      stakedAmount: stakeAmount,
      createdAt: BigInt(Math.floor(Date.now() / 1000)),
    };
  }

  // ─── Street Cred (reputation) ───────────────────────────────────────────────

  /**
   * Retrieves the Street Cred reputation score for an agent.
   *
   * Scoring breakdown:
   *   +30  Has ERC-8004 identity
   *   +25  Has at least one bond
   *   +15  Bond is currently active
   *   +20  Platinum tier bonus (or 15/10/5 for Gold/Silver/Bronze)
   *   +5   Has multiple bonds (2+)
   *   ──────────────────────────────
   *   95   Maximum possible score
   *
   * @throws {DeployPendingError} if ERC8004ReputationRegistry is not deployed
   */
  async getStreetCred(agentAddress: Address): Promise<StreetCredResult> {
    const reputationAddress = this.requireDeployed('ERC8004ReputationRegistry');

    const result = await this.publicClient.readContract({
      address: reputationAddress,
      abi: ERC8004_REPUTATION_REGISTRY_ABI,
      functionName: 'getReputation',
      args: [agentAddress],
    }) as unknown as readonly [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint];

    const [
      identityScoreRaw,
      bondExistsScoreRaw,
      bondActiveScoreRaw,
      tierBonusScoreRaw,
      multipleBondsScoreRaw,
      totalRaw,
      bondCountRaw,
      highestTierRaw,
    ] = result;

    const components: StreetCredComponents = {
      identityScore: Number(identityScoreRaw),
      bondExistsScore: Number(bondExistsScoreRaw),
      bondActiveScore: Number(bondActiveScoreRaw),
      tierBonusScore: Number(tierBonusScoreRaw),
      multipleBondsScore: Number(multipleBondsScoreRaw),
    };

    const total = Number(totalRaw);
    const bondCount = Number(bondCountRaw);
    const highestBondTier = this.tierFromUint8(highestTierRaw);

    return {
      agentAddress,
      total,
      maxPossible: STREET_CRED_SCORING.MAX_POSSIBLE,
      components,
      tier: this.getStreetCredTierLabel(total),
      hasIdentity: components.identityScore > 0,
      bondCount,
      highestBondTier,
    };
  }

  /**
   * Calculates a Street Cred score locally (without on-chain call).
   * Useful for testing or UI previews.
   */
  calculateStreetCred(params: {
    hasIdentity: boolean;
    bondCount: number;
    hasBondActive: boolean;
    highestBondTier: BondTier | null;
  }): StreetCredResult {
    const components: StreetCredComponents = {
      identityScore: params.hasIdentity ? STREET_CRED_SCORING.IDENTITY : 0,
      bondExistsScore: params.bondCount > 0 ? STREET_CRED_SCORING.BOND_EXISTS : 0,
      bondActiveScore: params.hasBondActive ? STREET_CRED_SCORING.BOND_ACTIVE : 0,
      tierBonusScore: this.getTierBonusPoints(params.highestBondTier),
      multipleBondsScore: params.bondCount >= 2 ? STREET_CRED_SCORING.MULTIPLE_BONDS : 0,
    };

    const total = Object.values(components).reduce((sum, v) => sum + v, 0);

    return {
      agentAddress: '0x0000000000000000000000000000000000000000' as Address,
      total,
      maxPossible: STREET_CRED_SCORING.MAX_POSSIBLE,
      components,
      tier: this.getStreetCredTierLabel(total),
      hasIdentity: params.hasIdentity,
      bondCount: params.bondCount,
      highestBondTier: params.highestBondTier,
    };
  }

  // ─── VNS (Vaultfire Name Service) ───────────────────────────────────────────

  /**
   * Looks up a Vaultfire Name Service (VNS) entry.
   *
   * @throws {DeployPendingError} if VaultfireNameService is not deployed
   */
  async lookupVNS(name: string): Promise<VNSLookupResult> {
    const vnsAddress = this.requireDeployed('VaultfireNameService');

    const result = await this.publicClient.readContract({
      address: vnsAddress,
      abi: VAULTFIRE_NAME_SERVICE_ABI,
      functionName: 'lookup',
      args: [name],
    }) as readonly [Address, Address, bigint, boolean];

    const [resolvedAddress, owner, expiresAt, exists] = result;

    return {
      name,
      resolvedAddress: exists ? resolvedAddress : null,
      owner: exists ? owner : null,
      expiresAt: exists ? expiresAt : null,
      exists,
    };
  }

  /**
   * Reverse-looks up the VNS name for an agent address.
   *
   * @throws {DeployPendingError} if VaultfireNameService is not deployed
   */
  async reverseLookupVNS(agentAddress: Address): Promise<string | null> {
    const vnsAddress = this.requireDeployed('VaultfireNameService');

    const name = await this.publicClient.readContract({
      address: vnsAddress,
      abi: VAULTFIRE_NAME_SERVICE_ABI,
      functionName: 'reverseLookup',
      args: [agentAddress],
    }) as string;

    return name.length > 0 ? name : null;
  }

  // ─── Peer rating ────────────────────────────────────────────────────────────

  /**
   * Rates a peer agent on-chain.
   *
   * @throws {DeployPendingError} if ERC8004ReputationRegistry is not deployed
   * @throws {NoWalletError} if no private key was provided
   * @throws {InvalidRatingError} if rating is not between 1–5
   */
  async ratePeer(params: RatePeerParams): Promise<RatePeerResult> {
    if (params.rating < 1 || params.rating > 5) {
      throw new InvalidRatingError(params.rating);
    }

    const reputationAddress = this.requireDeployed('ERC8004ReputationRegistry');
    const wallet = this.requireWallet();

    const categoryValue = RATING_CATEGORY_VALUES[params.category ?? 'overall'];

    const hash = await wallet.writeContract({
      address: reputationAddress,
      abi: ERC8004_REPUTATION_REGISTRY_ABI,
      functionName: 'ratePeer',
      args: [
        params.peerAddress,
        params.rating,
        params.comment ?? '',
        categoryValue,
      ],
    } as Parameters<typeof wallet.writeContract>[0]);

    return {
      transactionHash: hash,
      peerAddress: params.peerAddress,
      ratingId: BigInt(0),
      rating: params.rating,
      submittedAt: BigInt(Math.floor(Date.now() / 1000)),
    };
  }

  // ─── Utilities ──────────────────────────────────────────────────────────────

  /**
   * Returns the ETH stake amount for a given bond tier.
   */
  getBondStakeAmount(tier: BondTier): bigint {
    return BOND_TIER_VALUES[tier];
  }

  /**
   * Returns a human-readable ETH amount string for a bond tier.
   * e.g. "0.01 ETH" for Bronze
   */
  getBondTierDescription(tier: BondTier): string {
    const amounts: Record<BondTier, string> = {
      [BondTier.Bronze]: '0.01 ETH',
      [BondTier.Silver]: '0.05 ETH',
      [BondTier.Gold]: '0.1 ETH',
      [BondTier.Platinum]: '0.5 ETH',
    };
    return amounts[tier];
  }

  /**
   * Returns all valid partnership types.
   */
  getPartnershipTypes(): PartnershipType[] {
    return Object.values(PartnershipType);
  }

  /**
   * Returns the Arbiscan transaction URL for a given tx hash.
   */
  getTransactionUrl(txHash: `0x${string}`): string {
    return `${this.config.explorer}/tx/${txHash}`;
  }

  /**
   * Returns the Arbiscan address URL for a given address.
   */
  getAddressUrl(address: Address): string {
    return `${this.config.explorer}/address/${address}`;
  }
}

// ─── Named exports ────────────────────────────────────────────────────────────

export {
  BondTier,
  PartnershipType,
  BOND_TIER_VALUES,
  ARBITRUM_CONFIG,
  ARBITRUM_CONTRACTS,
  STREET_CRED_SCORING,
  STREET_CRED_TIERS,
};
