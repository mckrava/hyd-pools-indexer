import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Stablepool} from "./stablepool.model"
import {PoolOperationType} from "./_poolOperationType"

@Entity_()
export class StablepoolOperation {
    constructor(props?: Partial<StablepoolOperation>) {
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

    @IntColumn_({nullable: false})
    assetInId!: number

    @BigIntColumn_({nullable: false})
    assetInAmount!: bigint

    @IntColumn_({nullable: false})
    assetOutId!: number

    @BigIntColumn_({nullable: false})
    assetOutAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetFee!: bigint

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @Column_("varchar", {length: 4, nullable: false})
    type!: PoolOperationType

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    indexInBlock!: number

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
