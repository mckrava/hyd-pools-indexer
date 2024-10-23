import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {OmnipoolAsset} from "./omnipoolAsset.model"

@Entity_()
export class OmnipoolAssetHistoricalData {
    constructor(props?: Partial<OmnipoolAssetHistoricalData>) {
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

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @BigIntColumn_({nullable: false})
    assetBalance!: bigint

    @BigIntColumn_({nullable: false})
    nativeAssetBalance!: bigint

    @BigIntColumn_({nullable: false})
    hubReserveBalance!: bigint

    @BigIntColumn_({nullable: false})
    sharesBalance!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
