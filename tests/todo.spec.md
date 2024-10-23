Query

```graphql
query MyQuery($poolIds: [String!]!, $startBlockNumber: Int!, $endBlockNumber: Int!) {
  xykPoolHistoricalVolumes(
    last: 1000
    filter: {paraChainBlockHeight: {greaterThanOrEqualTo: 4839800}, and: {paraChainBlockHeight: {lessThanOrEqualTo: 4839900}}}
    orderBy: PARA_CHAIN_BLOCK_HEIGHT_DESC
  ) {
    nodes {
      poolId
      paraChainBlockHeight
      assetATotalVolumeIn
      assetATotalVolumeOut
      assetBTotalVolumeIn
      assetBTotalVolumeOut
      assetAVolumeIn
      assetAVolumeOut
      assetBVolumeIn
      assetBVolumeOut
    }
  }
  xykPoolHistoricalVolumesByPeriod(
    filter: {poolIds: $poolIds, startBlockNumber: $startBlockNumber, endBlockNumber: $endBlockNumber}
  ) {
    totalCount
    nodes {
      poolId
      totalVolume
      assetAVolume
      assetBVolume
    }
  }
}
```

Variables:

```json
{
  "poolIds": ["0x2c07d00c7a50979d6329b8900b9d86dc74a4a6045e8a32953a530863d535162b", "0x7c8f9187077349d56baee904e41dc917a061ddf236bd920dfa7b9cfeba7feb7d", "0xf4262f94584a25196d90287ca673b753fa68b168fe4f22030db0162fd4acba21"],
  "startBlockNumber": 4839800,
  "endBlockNumber": 4839900
}
```

Response:
```json
{
  "data": {
    "xykPoolHistoricalVolumes": {
      "nodes": [
        {
          "poolId": "0x2c07d00c7a50979d6329b8900b9d86dc74a4a6045e8a32953a530863d535162b",
          "paraChainBlockHeight": 4839900,
          "assetATotalVolumeIn": "299296894265171655",
          "assetATotalVolumeOut": "646527770023025752",
          "assetBTotalVolumeIn": "2420217025264437635",
          "assetBTotalVolumeOut": "2340161111082393531",
          "assetAVolumeIn": "0",
          "assetAVolumeOut": "10053860433",
          "assetBVolumeIn": "76503986035037",
          "assetBVolumeOut": "0"
        },
        {
          "poolId": "0x351d4cc0ee15008026d2d8f8a203fb684970938314ba673b4fb53b62c68adc4c",
          "paraChainBlockHeight": 4839900,
          "assetATotalVolumeIn": "40725019852263250",
          "assetATotalVolumeOut": "35430009651947150",
          "assetBTotalVolumeIn": "16489277739298015",
          "assetBTotalVolumeOut": "17046434113263052",
          "assetAVolumeIn": "0",
          "assetAVolumeOut": "76503986035047",
          "assetBVolumeIn": "22180672075620",
          "assetBVolumeOut": "0"
        },
        {
          "poolId": "0x7c8f9187077349d56baee904e41dc917a061ddf236bd920dfa7b9cfeba7feb7d",
          "paraChainBlockHeight": 4839900,
          "assetATotalVolumeIn": "5580970628229425",
          "assetATotalVolumeOut": "3527415694452202",
          "assetBTotalVolumeIn": "66076635283233824",
          "assetBTotalVolumeOut": "68337185596981592",
          "assetAVolumeIn": "10000000000",
          "assetAVolumeOut": "0",
          "assetBVolumeIn": "0",
          "assetBVolumeOut": "22180672075620"
        },
        {
          "poolId": "0x7c8f9187077349d56baee904e41dc917a061ddf236bd920dfa7b9cfeba7feb7d",
          "paraChainBlockHeight": 4839898,
          "assetATotalVolumeIn": "5580960628229425",
          "assetATotalVolumeOut": "3527490231213659",
          "assetBTotalVolumeIn": "66240995283233824",
          "assetBTotalVolumeOut": "68315004924905972",
          "assetAVolumeIn": "0",
          "assetAVolumeOut": "74536761457",
          "assetBVolumeIn": "164360000000000",
          "assetBVolumeOut": "0"
        },
        {
          "poolId": "0x2c07d00c7a50979d6329b8900b9d86dc74a4a6045e8a32953a530863d535162b",
          "paraChainBlockHeight": 4839894,
          "assetATotalVolumeIn": "299297125764817033",
          "assetATotalVolumeOut": "646527759969165319",
          "assetBTotalVolumeIn": "2420140521278402598",
          "assetBTotalVolumeOut": "2341913923921982704",
          "assetAVolumeIn": "231499645378",
          "assetAVolumeOut": "0",
          "assetBVolumeIn": "0",
          "assetBVolumeOut": "1752812839589173"
        },
        {
          "poolId": "0x2c07d00c7a50979d6329b8900b9d86dc74a4a6045e8a32953a530863d535162b",
          "paraChainBlockHeight": 4839868,
          "assetATotalVolumeIn": "296578628927171655",
          "assetATotalVolumeOut": "646527759969165319",
          "assetBTotalVolumeIn": "2420140521278402598",
          "assetBTotalVolumeOut": "2340160753500256384",
          "assetAVolumeIn": "2194680000000000",
          "assetAVolumeOut": "0",
          "assetBVolumeIn": "0",
          "assetBVolumeOut": "288292841200"
        },
        {
          "poolId": "0xf4262f94584a25196d90287ca673b753fa68b168fe4f22030db0162fd4acba21",
          "paraChainBlockHeight": 4839813,
          "assetATotalVolumeIn": "901203153199536169605771",
          "assetATotalVolumeOut": "443315311366896356635498",
          "assetBTotalVolumeIn": "1814905418644884451853898",
          "assetBTotalVolumeOut": "1658267808501787973467151",
          "assetAVolumeIn": "16673008",
          "assetAVolumeOut": "0",
          "assetBVolumeIn": "0",
          "assetBVolumeOut": "2442505475396181364657"
        }
      ]
    },
    "xykPoolHistoricalVolumesByPeriod": {
      "totalCount": 3,
      "nodes": [
        {
          "poolId": "0x2c07d00c7a50979d6329b8900b9d86dc74a4a6045e8a32953a530863d535162b",
          "totalVolume": "2795136960033500",
          "assetAVolume": "2718275391860500",
          "assetBVolume": "76861568173000"
        },
        {
          "poolId": "0x7c8f9187077349d56baee904e41dc917a061ddf236bd920dfa7b9cfeba7feb7d",
          "totalVolume": "-142243864685837",
          "assetAVolume": "-64536761457",
          "assetBVolume": "-142179327924380"
        },
        {
          "poolId": "0xf4262f94584a25196d90287ca673b753fa68b168fe4f22030db0162fd4acba21",
          "totalVolume": "0",
          "assetAVolume": "0",
          "assetBVolume": "0"
        }
      ]
    }
  }
}
```