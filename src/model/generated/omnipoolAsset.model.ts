import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, ManyToOne as ManyToOne_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Omnipool} from "./omnipool.model"
import {OmnipoolAssetHistoricalVolume} from "./omnipoolAssetHistoricalVolume.model"
import {OmnipoolAssetOperation} from "./omnipoolAssetOperation.model"

@Entity_()
export class OmnipoolAsset {
    constructor(props?: Partial<OmnipoolAsset>) {
        Object.assign(this, props)
    }

    /**
     * OmnipoolId-AssetId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @Index_()
    @ManyToOne_(() => Omnipool, {nullable: true})
    pool!: Omnipool

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtParaBlock!: number

    @BooleanColumn_({nullable: true})
    isRemoved!: boolean | undefined | null

    @IntColumn_({nullable: true})
    removedAtParaBlock!: number | undefined | null

    @OneToMany_(() => OmnipoolAssetHistoricalVolume, e => e.omnipoolAsset)
    historicalVolume!: OmnipoolAssetHistoricalVolume[]

    @OneToMany_(() => OmnipoolAssetOperation, e => e.omnipoolAsset)
    operations!: OmnipoolAssetOperation[]
}
