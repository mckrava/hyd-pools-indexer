import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Stablepool} from "./stablepool.model"

@Entity_()
export class StablepoolAsset {
    constructor(props?: Partial<StablepoolAsset>) {
        Object.assign(this, props)
    }

    /**
     * stablepoolId-assetId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Stablepool, {nullable: true})
    pool!: Stablepool

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
