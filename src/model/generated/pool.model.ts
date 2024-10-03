import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {HistoricalBlockPrice} from "./historicalBlockPrice.model"
import {HistoricalVolume} from "./historicalVolume.model"
import {Swap} from "./swap.model"

@Entity_()
export class Pool {
    constructor(props?: Partial<Pool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @IntColumn_({nullable: false})
    assetAId!: number

    @IntColumn_({nullable: false})
    assetBId!: number

    @BigIntColumn_({nullable: false})
    assetABalance!: bigint

    @BigIntColumn_({nullable: false})
    assetBBalance!: bigint

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @IntColumn_({nullable: false})
    createdAtParaBlock!: number

    @IntColumn_({nullable: true})
    startBlockNumber!: number | undefined | null

    @IntColumn_({nullable: true})
    endBlockNumber!: number | undefined | null

    @IntColumn_({array: true, nullable: true})
    fee!: (number | undefined | null)[] | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    feeCollector!: Account | undefined | null

    @BigIntColumn_({nullable: true})
    repayTarget!: bigint | undefined | null

    @IntColumn_({nullable: true})
    initialWeight!: number | undefined | null

    @IntColumn_({nullable: true})
    finalWeight!: number | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account | undefined | null

    @OneToMany_(() => HistoricalBlockPrice, e => e.pool)
    historicalBlockPrices!: HistoricalBlockPrice[]

    @OneToMany_(() => HistoricalVolume, e => e.pool)
    historicalVolume!: HistoricalVolume[]

    @OneToMany_(() => Swap, e => e.pool)
    swaps!: Swap[]
}
