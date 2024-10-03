import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Pool} from "./pool.model"

@Entity_()
export class HistoricalBlockPrice {
    constructor(props?: Partial<HistoricalBlockPrice>) {
        Object.assign(this, props)
    }

    /**
     * PoolId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Pool, {nullable: true})
    pool!: Pool

    @IntColumn_({nullable: false})
    assetAId!: number

    @IntColumn_({nullable: false})
    assetBId!: number

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
