import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, FloatColumn as FloatColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {XykPool} from "./xykPool.model"

@Entity_()
export class XykPoolHistoricalVolume {
    constructor(props?: Partial<XykPoolHistoricalVolume>) {
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

    @FloatColumn_({nullable: false})
    averagePrice!: number

    @BigIntColumn_({nullable: false})
    assetAVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    assetAVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    assetATotalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    assetATotalVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    assetAFee!: bigint

    @BigIntColumn_({nullable: false})
    assetBFee!: bigint

    @BigIntColumn_({nullable: false})
    assetATotalFees!: bigint

    @BigIntColumn_({nullable: false})
    assetBTotalFees!: bigint

    @BigIntColumn_({nullable: false})
    assetBVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    assetBVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    assetBTotalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    assetBTotalVolumeOut!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
