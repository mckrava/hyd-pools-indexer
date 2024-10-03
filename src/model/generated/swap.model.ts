import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, FloatColumn as FloatColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Pool} from "./pool.model"
import {SwapType} from "./_swapType"

@Entity_()
export class Swap {
    constructor(props?: Partial<Swap>) {
        Object.assign(this, props)
    }

    /**
     * TxId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @IntColumn_({nullable: false})
    assetInId!: number

    @BigIntColumn_({nullable: false})
    assetInAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetInFee!: bigint

    @IntColumn_({nullable: false})
    assetOutId!: number

    @BigIntColumn_({nullable: false})
    assetOutAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetOutFee!: bigint

    @FloatColumn_({nullable: false})
    swapPrice!: number

    @Index_()
    @ManyToOne_(() => Pool, {nullable: true})
    pool!: Pool

    @Column_("varchar", {length: 4, nullable: false})
    type!: SwapType

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
