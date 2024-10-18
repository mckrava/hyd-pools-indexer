import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {StablepoolHistoricalVolume} from "./stablepoolHistoricalVolume.model"

@Entity_()
export class StablepoolAssetHistoricalVolume {
    constructor(props?: Partial<StablepoolAssetHistoricalVolume>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-paraChainBlockHeight-assetId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => StablepoolHistoricalVolume, {nullable: true})
    volumesCollection!: StablepoolHistoricalVolume

    @IntColumn_({nullable: false})
    assetId!: number

    @BigIntColumn_({nullable: false})
    assetFee!: bigint

    @BigIntColumn_({nullable: false})
    assetTotalFees!: bigint

    @BigIntColumn_({nullable: false})
    swapVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    swapVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    swapTotalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    swapTotalVolumeOut!: bigint

    @BigIntColumn_({nullable: false})
    liqAddedAmount!: bigint

    @BigIntColumn_({nullable: false})
    liqRemovedAmount!: bigint

    @BigIntColumn_({nullable: false})
    liqAddedTotalAmount!: bigint

    @BigIntColumn_({nullable: false})
    liqRemovedTotalAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqAddedAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqRemovedAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqAddedTotalAmount!: bigint

    @BigIntColumn_({nullable: false})
    routedLiqRemovedTotalAmount!: bigint
}
