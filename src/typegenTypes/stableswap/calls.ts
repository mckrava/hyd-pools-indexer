import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v183 from '../v183'

export const createPool =  {
    name: 'Stableswap.create_pool',
    /**
     * Create a stableswap pool with given list of asset
     * 
     * All assets must be correctly registered in `T::AssetRegistry`.
     * Note that this does not seed the pool with liquidity. Use `add_liquidity` to provide
     * initial liquidity.
     * 
     * Parameters:
     * - `origin`: Must be T::AuthorityOrigin
     * - `share_asset`: Preregistered share asset identifier
     * - `assets`: List of Asset ids
     * - `amplification`: Pool amplification
     * - `fee`: fee to be applied on trade and liquidity operations
     * 
     * Emits `PoolCreated` event if successful.
     */
    v183: new CallType(
        'Stableswap.create_pool',
        sts.struct({
            shareAsset: sts.number(),
            assets: sts.array(() => sts.number()),
            amplification: sts.number(),
            fee: v183.Permill,
        })
    ),
}
