export type LbpCreatePoolCallArgs = {
  poolOwner: string;
  assetA: number;
  assetAAmount: bigint;
  assetB: number;
  assetBAmount: bigint;
  initialWeight: number;
  finalWeight: number;
  // weightCurve: v176.WeightCurveType,
  fee: [number, number];
  feeCollector: string;
  repayTarget: bigint;
};
