import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class OmnipoolAssetHistoricalVolume {
    constructor(props?: Partial<OmnipoolAssetHistoricalVolume>) {
        Object.assign(this, props)
    }

    /**
     * OmnipoolAssetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @IntColumn_({nullable: false})
    assetAId!: number

    @IntColumn_({nullable: false})
    assetBId!: number

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
