import { HistoricalAssetVolume } from '../../model';

export function getLastAssetVolumeFromCache(
  volume: Map<string, HistoricalAssetVolume>,
  assetId: number
) {
  return volume.get(
    Array.from(volume.keys())
      .filter((k) => {
        return k.startsWith(assetId + '-');
      })
      .sort((a, b) => {
        return parseInt(b.split('-')[1]) - parseInt(a.split('-')[1]);
      })[0]
  );
}
