import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class HistoricalAssetVolume {
    constructor(props?: Partial<HistoricalAssetVolume>) {
        Object.assign(this, props)
    }

    /**
     * AssetId-paraChainBlockHeight
     */
    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    assetId!: number

    @BigIntColumn_({nullable: false})
    volumeIn!: bigint

    @BigIntColumn_({nullable: false})
    volumeOut!: bigint

    @BigIntColumn_({nullable: false})
    totalVolumeIn!: bigint

    @BigIntColumn_({nullable: false})
    totalVolumeOut!: bigint

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}
