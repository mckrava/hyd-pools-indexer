import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v115 from '../v115'
import * as v185 from '../v185'

export const initializePool =  {
    name: 'Omnipool.initialize_pool',
    /**
     * Initialize Omnipool with stable asset and native asset.
     * 
     * First added assets must be:
     * - preferred stable coin asset set as `StableCoinAssetId` pallet parameter
     * - native asset
     * 
     * Omnipool account must already have correct balances of stable and native asset.
     * 
     * Parameters:
     * - `stable_asset_price`: Initial price of stable asset
     * - `native_asset_price`: Initial price of stable asset
     * 
     * Emits two `TokenAdded` events when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.initialize_pool',
        sts.struct({
            stableAssetPrice: v115.FixedU128,
            nativeAssetPrice: v115.FixedU128,
            stableWeightCap: v115.Permill,
            nativeWeightCap: v115.Permill,
        })
    ),
}

export const addToken =  {
    name: 'Omnipool.add_token',
    /**
     * Add new token to omnipool in quantity `amount` at price `initial_price`
     * 
     * Can be called only after pool is initialized, otherwise it returns `NoStableAssetInPool`
     * 
     * Initial liquidity must be transferred to pool's account for this new token manually prior to calling `add_token`.
     * 
     * Initial liquidity is pool's account balance of the token.
     * 
     * Position NFT token is minted for `position_owner`.
     * 
     * Parameters:
     * - `asset`: The identifier of the new asset added to the pool. Must be registered in Asset registry
     * - `initial_price`: Initial price
     * - `position_owner`: account id for which share are distributed in form on NFT
     * 
     * Emits `TokenAdded` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.add_token',
        sts.struct({
            asset: sts.number(),
            initialPrice: v115.FixedU128,
            weightCap: v115.Permill,
            positionOwner: v115.AccountId32,
        })
    ),
}

export const addLiquidity =  {
    name: 'Omnipool.add_liquidity',
    /**
     * Add liquidity of asset `asset` in quantity `amount` to Omnipool
     * 
     * `add_liquidity` adds specified asset amount to pool and in exchange gives the origin
     * corresponding shares amount in form of NFT at current price.
     * 
     * Asset's tradable state must contain ADD_LIQUIDITY flag, otherwise `NotAllowed` error is returned.
     * 
     * NFT is minted using NTFHandler which implements non-fungibles traits from frame_support.
     * 
     * Asset weight cap must be respected, otherwise `AssetWeightExceeded` error is returned.
     * Asset weight is ratio between new HubAsset reserve and total reserve of Hub asset in Omnipool.
     * 
     * Parameters:
     * - `asset`: The identifier of the new asset added to the pool. Must be already in the pool
     * - `amount`: Amount of asset added to omnipool
     * 
     * Emits `LiquidityAdded` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.add_liquidity',
        sts.struct({
            asset: sts.number(),
            amount: sts.bigint(),
        })
    ),
}

export const removeLiquidity =  {
    name: 'Omnipool.remove_liquidity',
    /**
     * Remove liquidity of asset `asset` in quantity `amount` from Omnipool
     * 
     * `remove_liquidity` removes specified shares amount from given PositionId (NFT instance).
     * 
     * Asset's tradable state must contain REMOVE_LIQUIDITY flag, otherwise `NotAllowed` error is returned.
     * 
     * if all shares from given position are removed, NFT is burned.
     * 
     * Parameters:
     * - `position_id`: The identifier of position which liquidity is removed from.
     * - `amount`: Amount of shares removed from omnipool
     * 
     * Emits `LiquidityRemoved` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.remove_liquidity',
        sts.struct({
            positionId: sts.bigint(),
            amount: sts.bigint(),
        })
    ),
}

export const sacrificePosition =  {
    name: 'Omnipool.sacrifice_position',
    /**
     * Sacrifice LP position in favor of pool.
     * 
     * A position is destroyed and liquidity owned by LP becomes pool owned liquidity.
     * 
     * Only owner of position can perform this action.
     * 
     * Emits `PositionDestroyed`.
     */
    v115: new CallType(
        'Omnipool.sacrifice_position',
        sts.struct({
            positionId: sts.bigint(),
        })
    ),
}

export const sell =  {
    name: 'Omnipool.sell',
    /**
     * Execute a swap of `asset_in` for `asset_out`.
     * 
     * Price is determined by the Omnipool.
     * 
     * Hub asset is traded separately.
     * 
     * Asset's tradable states must contain SELL flag for asset_in and BUY flag for asset_out, otherwise `NotAllowed` error is returned.
     * 
     * Parameters:
     * - `asset_in`: ID of asset sold to the pool
     * - `asset_out`: ID of asset bought from the pool
     * - `amount`: Amount of asset sold
     * - `min_buy_amount`: Minimum amount required to receive
     * 
     * Emits `SellExecuted` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.sell',
        sts.struct({
            assetIn: sts.number(),
            assetOut: sts.number(),
            amount: sts.bigint(),
            minBuyAmount: sts.bigint(),
        })
    ),
}

export const buy =  {
    name: 'Omnipool.buy',
    /**
     * Execute a swap of `asset_out` for `asset_in`.
     * 
     * Price is determined by the Omnipool.
     * 
     * Hub asset is traded separately.
     * 
     * Asset's tradable states must contain SELL flag for asset_in and BUY flag for asset_out, otherwise `NotAllowed` error is returned.
     * 
     * Parameters:
     * - `asset_in`: ID of asset sold to the pool
     * - `asset_out`: ID of asset bought from the pool
     * - `amount`: Amount of asset sold
     * - `max_sell_amount`: Maximum amount to be sold.
     * 
     * Emits `BuyExecuted` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.buy',
        sts.struct({
            assetOut: sts.number(),
            assetIn: sts.number(),
            amount: sts.bigint(),
            maxSellAmount: sts.bigint(),
        })
    ),
}

export const setAssetTradableState =  {
    name: 'Omnipool.set_asset_tradable_state',
    /**
     * Update asset's tradable state.
     * 
     * Parameters:
     * - `asset_id`: asset id
     * - `state`: new state
     * 
     * Emits `TradableStateUpdated` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.set_asset_tradable_state',
        sts.struct({
            assetId: sts.number(),
            state: v115.Tradability,
        })
    ),
}

export const refundRefusedAsset =  {
    name: 'Omnipool.refund_refused_asset',
    /**
     * Refund given amount of asset to a recipient.
     * 
     * A refund is needed when a token is refused to be added to Omnipool, and initial liquidity of the asset has been already transferred to pool's account.
     * 
     * Transfer is performed only when asset is not in Omnipool and pool's balance has sufficient amount.
     * 
     * Only `AddTokenOrigin` can perform this operition -same as `add_token`o
     * 
     * Emits `AssetRefunded`
     */
    v115: new CallType(
        'Omnipool.refund_refused_asset',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            recipient: v115.AccountId32,
        })
    ),
}

export const setAssetWeightCap =  {
    name: 'Omnipool.set_asset_weight_cap',
    /**
     * Update asset's weight cap
     * 
     * Parameters:
     * - `asset_id`: asset id
     * - `cap`: new weight cap
     * 
     * Emits `AssetWeightCapUpdated` event when successful.
     * 
     */
    v115: new CallType(
        'Omnipool.set_asset_weight_cap',
        sts.struct({
            assetId: sts.number(),
            cap: v115.Permill,
        })
    ),
}

export const setTvlCap =  {
    name: 'Omnipool.set_tvl_cap',
    /**
     * Update TVL cap
     * 
     * Parameters:
     * - `cap`: new tvl cap
     * 
     * Emits `TVLCapUpdated` event when successful.
     * 
     */
    v125: new CallType(
        'Omnipool.set_tvl_cap',
        sts.struct({
            cap: sts.bigint(),
        })
    ),
}

export const withdrawProtocolLiquidity =  {
    name: 'Omnipool.withdraw_protocol_liquidity',
    v185: new CallType(
        'Omnipool.withdraw_protocol_liquidity',
        sts.struct({
            assetId: sts.number(),
            amount: sts.bigint(),
            price: sts.tuple(() => [sts.bigint(), sts.bigint()]),
            dest: v185.AccountId32,
        })
    ),
}

export const removeToken =  {
    name: 'Omnipool.remove_token',
    v185: new CallType(
        'Omnipool.remove_token',
        sts.struct({
            assetId: sts.number(),
            beneficiary: v185.AccountId32,
        })
    ),
}

export const addLiquidityWithLimit =  {
    name: 'Omnipool.add_liquidity_with_limit',
    /**
     * See [`Pallet::add_liquidity_with_limit`].
     */
    v244: new CallType(
        'Omnipool.add_liquidity_with_limit',
        sts.struct({
            asset: sts.number(),
            amount: sts.bigint(),
            minSharesLimit: sts.bigint(),
        })
    ),
}

export const removeLiquidityWithLimit =  {
    name: 'Omnipool.remove_liquidity_with_limit',
    /**
     * See [`Pallet::remove_liquidity_with_limit`].
     */
    v244: new CallType(
        'Omnipool.remove_liquidity_with_limit',
        sts.struct({
            positionId: sts.bigint(),
            amount: sts.bigint(),
            minLimit: sts.bigint(),
        })
    ),
}
