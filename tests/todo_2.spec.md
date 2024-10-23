Query

```graphql
query MyQuery($poolIds: [String!]!, $startBlockNumber: Int!, $endBlockNumber: Int) {
    stablepoolHistoricalVolumesByPeriod(
        filter: {poolIds: $poolIds, startBlockNumber: $startBlockNumber, endBlockNumber: $endBlockNumber}
    ) {
        totalCount
        nodes {
            poolId
            assetVolumes {
                assetId
                swapVolume
                liqAddedVolume
                liqRemovedVolume
                routedLiqAddedVolume
                routedLiqRemovedVolume
                routedLiqFee
                liqFee
                swapFee
            }
        }
    }
    stablepoolHistoricalVolumes(
        filter: {paraChainBlockHeight: {greaterThanOrEqualTo: 3640100}, and: {paraChainBlockHeight: {lessThanOrEqualTo: 3640230}}}
        orderBy: PARA_CHAIN_BLOCK_HEIGHT_DESC
    ) {
        totalCount
        nodes {
            paraChainBlockHeight
            stablepoolAssetHistoricalVolumesByVolumesCollectionId {
                nodes {
                    id
                    liqAddedAmount
                    liqAddedTotalAmount
                    liqRemovedAmount
                    liqRemovedTotalAmount
                    routedLiqAddedAmount
                    routedLiqAddedTotalAmount
                    paraChainBlockHeight
                    routedLiqRemovedAmount
                    routedLiqRemovedTotalAmount
                    swapTotalVolumeIn
                    swapTotalVolumeOut
                    swapVolumeIn
                    swapVolumeOut
                }
            }
        }
    }
    stablepoolAssets {
        totalCount
    }
    stablepoolOperations(
        filter: {paraChainBlockHeight: {greaterThanOrEqualTo: 3640100}, and: {paraChainBlockHeight: {lessThanOrEqualTo: 3640230}}}
    ) {
        totalCount
        nodes {
            type
            assetInAmount
            assetInId
            assetOutAmount
            assetOutId
            paraChainBlockHeight
            poolId
        }
    }
}

```

Variables:

```json
{
  "poolIds":  ["100"],
  "startBlockNumber": 3640100,
  "endBlockNumber": 3640230
}
```

Response:
```json
{
  "data": {
    "stablepoolHistoricalVolumesByPeriod": {
      "totalCount": 1,
      "nodes": [
        {
          "poolId": "100",
          "assetVolumes": [
            {
              "assetId": 10,
              "swapVolume": "9908436",
              "liqAddedVolume": "300010000000",
              "liqRemovedVolume": "60078470",
              "routedLiqAddedVolume": "0",
              "routedLiqRemovedVolume": "0",
              "routedLiqFee": "0",
              "liqFee": "0",
              "swapFee": "3964"
            },
            {
              "assetId": 18,
              "swapVolume": "0",
              "liqAddedVolume": "300999999999999997902848",
              "liqRemovedVolume": "0",
              "routedLiqAddedVolume": "0",
              "routedLiqRemovedVolume": "0",
              "routedLiqFee": "0",
              "liqFee": "0",
              "swapFee": "0"
            },
            {
              "assetId": 23,
              "swapVolume": "9912401",
              "liqAddedVolume": "300000000000",
              "liqRemovedVolume": "0",
              "routedLiqAddedVolume": "0",
              "routedLiqRemovedVolume": "0",
              "routedLiqFee": "0",
              "liqFee": "0",
              "swapFee": "0"
            },
            {
              "assetId": 21,
              "swapVolume": "0",
              "liqAddedVolume": "300000000000",
              "liqRemovedVolume": "0",
              "routedLiqAddedVolume": "0",
              "routedLiqRemovedVolume": "0",
              "routedLiqFee": "0",
              "liqFee": "0",
              "swapFee": "0"
            }
          ]
        }
      ]
    },
    "stablepoolHistoricalVolumes": {
      "totalCount": 5,
      "nodes": [
        {
          "paraChainBlockHeight": 3640180,
          "stablepoolAssetHistoricalVolumesByVolumesCollectionId": {
            "nodes": [
              {
                "id": "100-10-3640180",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300010000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "60078470",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640180,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "9908436",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-18-3640180",
                "liqAddedAmount": "1000000000000000000000",
                "liqAddedTotalAmount": "301000000000000000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640180,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-21-3640180",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640180,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-23-3640180",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640180,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "9912401",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              }
            ]
          }
        },
        {
          "paraChainBlockHeight": 3640179,
          "stablepoolAssetHistoricalVolumesByVolumesCollectionId": {
            "nodes": [
              {
                "id": "100-10-3640179",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300010000000",
                "liqRemovedAmount": "60078470",
                "liqRemovedTotalAmount": "60078470",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640179,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "9908436",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-18-3640179",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000000000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640179,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-21-3640179",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640179,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-23-3640179",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640179,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "9912401",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              }
            ]
          }
        },
        {
          "paraChainBlockHeight": 3640154,
          "stablepoolAssetHistoricalVolumesByVolumesCollectionId": {
            "nodes": [
              {
                "id": "100-10-3640154",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300010000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640154,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "9908436",
                "swapVolumeIn": "0",
                "swapVolumeOut": "9908436"
              },
              {
                "id": "100-18-3640154",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000000000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640154,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-21-3640154",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640154,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-23-3640154",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640154,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "9912401",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "9912401",
                "swapVolumeOut": "0"
              }
            ]
          }
        },
        {
          "paraChainBlockHeight": 3640145,
          "stablepoolAssetHistoricalVolumesByVolumesCollectionId": {
            "nodes": [
              {
                "id": "100-10-3640145",
                "liqAddedAmount": "10000000",
                "liqAddedTotalAmount": "300010000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640145,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-18-3640145",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000000000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640145,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-21-3640145",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640145,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-23-3640145",
                "liqAddedAmount": "0",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640145,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              }
            ]
          }
        },
        {
          "paraChainBlockHeight": 3640110,
          "stablepoolAssetHistoricalVolumesByVolumesCollectionId": {
            "nodes": [
              {
                "id": "100-10-3640110",
                "liqAddedAmount": "300000000000",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640110,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-18-3640110",
                "liqAddedAmount": "300000000000000000000000",
                "liqAddedTotalAmount": "300000000000000000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640110,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-21-3640110",
                "liqAddedAmount": "300000000000",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640110,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              },
              {
                "id": "100-23-3640110",
                "liqAddedAmount": "300000000000",
                "liqAddedTotalAmount": "300000000000",
                "liqRemovedAmount": "0",
                "liqRemovedTotalAmount": "0",
                "routedLiqAddedAmount": "0",
                "routedLiqAddedTotalAmount": "0",
                "paraChainBlockHeight": 3640110,
                "routedLiqRemovedAmount": "0",
                "routedLiqRemovedTotalAmount": "0",
                "swapTotalVolumeIn": "0",
                "swapTotalVolumeOut": "0",
                "swapVolumeIn": "0",
                "swapVolumeOut": "0"
              }
            ]
          }
        }
      ]
    },
    "stablepoolAssets": {
      "totalCount": 4
    },
    "stablepoolOperations": {
      "totalCount": 1,
      "nodes": [
        {
          "type": "SELL",
          "assetInAmount": "9912401",
          "assetInId": "23",
          "assetOutAmount": "9908436",
          "assetOutId": "10",
          "paraChainBlockHeight": 3640154,
          "poolId": "100"
        }
      ]
    }
  }
}
```