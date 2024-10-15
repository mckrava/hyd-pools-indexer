import {sts, Result, Option, Bytes, BitSequence} from './support'

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
