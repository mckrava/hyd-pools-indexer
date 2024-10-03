import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v115 from '../v115'
import * as v170 from '../v170'
import * as v201 from '../v201'

export const sellExecuted =  {
    name: 'Omnipool.SellExecuted',
    /**
     * Sell trade executed.
     */
    v115: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v115.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
    /**
     * Sell trade executed.
     */
    v170: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v170.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
    /**
     * Sell trade executed.
     */
    v201: new EventType(
        'Omnipool.SellExecuted',
        sts.struct({
            who: v201.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            hubAmountIn: sts.bigint(),
            hubAmountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
}

export const buyExecuted =  {
    name: 'Omnipool.BuyExecuted',
    /**
     * Buy trade executed.
     */
    v115: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v115.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
        })
    ),
    /**
     * Buy trade executed.
     */
    v170: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v170.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
    /**
     * Buy trade executed.
     */
    v201: new EventType(
        'Omnipool.BuyExecuted',
        sts.struct({
            who: v201.AccountId32,
            assetIn: sts.number(),
            assetOut: sts.number(),
            amountIn: sts.bigint(),
            amountOut: sts.bigint(),
            hubAmountIn: sts.bigint(),
            hubAmountOut: sts.bigint(),
            assetFeeAmount: sts.bigint(),
            protocolFeeAmount: sts.bigint(),
        })
    ),
}
