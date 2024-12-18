import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId32 = Bytes

export interface PoolInfo {
    assets: number[]
    initialAmplification: NonZeroU16
    finalAmplification: NonZeroU16
    initialBlock: number
    finalBlock: number
    fee: Permill
}

export type Permill = number

export type NonZeroU16 = number

export const PoolInfo: sts.Type<PoolInfo> = sts.struct(() => {
    return  {
        assets: sts.array(() => sts.number()),
        initialAmplification: NonZeroU16,
        finalAmplification: NonZeroU16,
        initialBlock: sts.number(),
        finalBlock: sts.number(),
        fee: Permill,
    }
})

export const AssetAmount: sts.Type<AssetAmount> = sts.struct(() => {
    return  {
        assetId: sts.number(),
        amount: sts.bigint(),
    }
})

export interface AssetAmount {
    assetId: number
    amount: bigint
}

export const AccountId32 = sts.bytes()

export const Permill = sts.number()

export const NonZeroU16 = sts.number()
