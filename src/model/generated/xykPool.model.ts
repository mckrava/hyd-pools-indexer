import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {XykPoolHistoricalPrice} from "./xykPoolHistoricalPrice.model"
import {XykPoolHistoricalVolume} from "./xykPoolHistoricalVolume.model"
import {XykPoolOperation} from "./xykPoolOperation.model"

@Entity_()
export class XykPool {
    constructor(props?: Partial<XykPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @IntColumn_({nullable: false})
    assetAId!: number

    @Index_()
    @IntColumn_({nullable: false})
    assetBId!: number

    @IntColumn_({nullable: false})
    shareTokenId!: number

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @BigIntColumn_({nullable: false})
    initialSharesAmount!: bigint

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtParaBlock!: number

    @BooleanColumn_({nullable: true})
    isDestroyed!: boolean | undefined | null

    @IntColumn_({nullable: true})
    destroyedAtParaBlock!: number | undefined | null

    @OneToMany_(() => XykPoolHistoricalPrice, e => e.pool)
    historicalBlockPrices!: XykPoolHistoricalPrice[]

    @OneToMany_(() => XykPoolHistoricalVolume, e => e.pool)
    historicalVolume!: XykPoolHistoricalVolume[]

    @OneToMany_(() => XykPoolOperation, e => e.pool)
    operations!: XykPoolOperation[]
}
