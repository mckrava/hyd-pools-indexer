import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {OmnipoolAsset} from "./omnipoolAsset.model"
import {PoolOperationType} from "./_poolOperationType"

@Entity_()
export class OmnipoolAssetOperation {
    constructor(props?: Partial<OmnipoolAssetOperation>) {
        Object.assign(this, props)
    }

    /**
     * TxId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    account!: Account

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @IntColumn_({nullable: false})
    assetInId!: number

    @BigIntColumn_({nullable: false})
    assetInAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetInFee!: bigint

    @IntColumn_({nullable: false})
    assetOutId!: number

    @BigIntColumn_({nullable: false})
    assetOutAmount!: bigint

    @BigIntColumn_({nullable: false})
    assetOutFee!: bigint

    @BigIntColumn_({nullable: false})
    protocolFee!: bigint

    @Index_()
    @ManyToOne_(() => OmnipoolAsset, {nullable: true})
    omnipoolAsset!: OmnipoolAsset

    @Column_("varchar", {length: 4, nullable: false})
    type!: PoolOperationType

    @IntColumn_({nullable: false})
    relayChainBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: false})
    paraChainBlockHeight!: number
}