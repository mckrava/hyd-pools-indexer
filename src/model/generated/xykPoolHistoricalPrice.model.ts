import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {XykPool} from "./xykPool.model"

@Entity_()
export class XykPoolHistoricalPrice {
    constructor(props?: Partial<XykPoolHistoricalPrice>) {
        Object.assign(this, props)
    }

    /**
     * PoolId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => XykPool, {nullable: true})
    pool!: XykPool

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

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
