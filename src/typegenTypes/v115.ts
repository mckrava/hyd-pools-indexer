import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Tradability: sts.Type<Tradability> = sts.struct(() => {
    return  {
        bits: sts.number(),
    }
})

export interface Tradability {
    bits: number
}

export const Permill = sts.number()

export const AccountId32 = sts.bytes()

export const FixedU128 = sts.bigint()
