import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {StablepoolLiquidityAction} from "./stablepoolLiquidityAction.model"

@Entity_()
export class StablepoolAssetLiquidityAmount {
    constructor(props?: Partial<StablepoolAssetLiquidityAmount>) {
        Object.assign(this, props)
    }

    /**
     * TxId
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => StablepoolLiquidityAction, {nullable: true})
    liquidityAction!: StablepoolLiquidityAction

    @Index_()
    @IntColumn_({nullable: false})
    assetId!: number

    @BigIntColumn_({nullable: false})
    amount!: bigint
}
