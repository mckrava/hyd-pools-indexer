import {
  BatchBlocksParsedDataScope,
  LbpBuyExecutedData,
  LbpSellExecutedData,
  EventId,
  EventMetadata,
  LbpPoolCreatedData,
  LbpPoolUpdatedData,
  ParsedEventsCallsData,
  TokensTransferData,
  XykPoolCreatedData,
  XykPoolDestroyedData,
  XykBuyExecutedData,
  XykSellExecutedData,
  BalancesTransferData,
  OmnipoolTokenAddedData,
  OmnipoolTokenRemovedData,
  OmnipoolBuyExecutedData,
  OmnipoolSellExecutedData,
  StableswapPoolCreatedData,
  StableswapBuyExecutedData,
  StableswapSellExecutedData,
  StableswapLiquidityAddedData,
  StableswapLiquidityRemovedData,
  EventDataType,
} from './types';
import { EventName, RelayChainInfo } from '../types/events';
import { Block, Event, Extrinsic, ProcessorContext } from '../../processor';
import { Store } from '@subsquid/typeorm-store';
import parsers from '../';
import { calls, events } from '../../typegenTypes';

export class BatchBlocksParsedDataManager {
  private scope: BatchBlocksParsedDataScope;

  constructor() {
    this.scope = new Map();
  }

  set(section: EventName, value: ParsedEventsCallsData): void {
    this.scope.set(
      section,
      (this.scope.get(section) || new Map()).set(value.id, value)
    );
  }

  get<T>(section: EventName): Map<EventId, T> {
    return (
      (this.scope.get(section) as Map<EventId, T>) || new Map<EventId, T>()
    );
  }

  getSectionByEventName<T extends EventName>(
    section: T
  ): Map<EventId, EventDataType<T>> {
    return (
      (this.scope.get(section) as Map<EventId, EventDataType<T>>) ||
      new Map<EventId, EventDataType<T>>()
    );
  }

  getAllSectionsData() {
    const allValues: ParsedEventsCallsData[][] = [];

    this.scope.forEach((sectionDataMap) => {
      allValues.push([...sectionDataMap.values()]);
    });

    return allValues.flat();
  }

  entries(): IterableIterator<
    [EventName, Map<EventId, ParsedEventsCallsData>]
  > {
    return this.scope.entries();
  }
}

function getEventMetadata(
  event: Event,
  blockHeader: Block,
  extrinsic?: Extrinsic
): EventMetadata {
  return {
    id: event.id,
    indexInBlock: event.index,
    name: event.name,
    blockHeader,
    extrinsic,
  };
}

export function getParsedEventsData(
  ctx: ProcessorContext<Store>
): BatchBlocksParsedDataManager {
  const parsedDataManager = new BatchBlocksParsedDataManager();
  let totalEventsNumber = 0;

  for (let block of ctx.blocks) {
    const relayChainInfo: RelayChainInfo = {
      parachainBlockNumber: 0,
      relaychainBlockNumber: 0,
    };

    for (let call of block.calls) {
      switch (call.name) {
        case calls.parachainSystem.setValidationData.name: {
          let validationData =
            parsers.calls.parachainSystem.parseSetValidationDataArgs(call);
          relayChainInfo.relaychainBlockNumber =
            validationData.relayParentNumber;
          relayChainInfo.parachainBlockNumber = block.header.height;
          break;
        }
        default:
      }
    }

    ctx.batchState.state = {
      relayChainInfo: ctx.batchState.state.relayChainInfo.set(
        relayChainInfo.parachainBlockNumber,
        relayChainInfo
      ),
    };

    for (let event of block.events) {
      let call = null;

      try {
        call = event.getCall();
      } catch (e) {}

      const callMetadata = {
        name: call?.name ?? '_system',
      };

      const eventMetadata = getEventMetadata(
        event,
        block.header,
        event.extrinsic
      );

      switch (event.name) {
        /**
         * ==== LBP pools ====
         */
        case events.lbp.poolCreated.name: {
          const callArgs = call
            ? parsers.calls.lbp.parseCreatePoolArgs(call)
            : undefined;
          const eventParams = parsers.events.lbp.parsePoolCreatedParams(event);

          parsedDataManager.set(EventName.LBP_PoolCreated, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
              args: callArgs,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.lbp.poolUpdated.name: {
          const eventParams = parsers.events.lbp.parsePoolUpdatedParams(event);

          parsedDataManager.set(EventName.LBP_PoolUpdated, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.lbp.buyExecuted.name: {
          const eventParams = parsers.events.lbp.parseBuyExecutedParams(event);

          parsedDataManager.set(EventName.LBP_BuyExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.lbp.sellExecuted.name: {
          const eventParams = parsers.events.lbp.parseSellExecutedParams(event);

          parsedDataManager.set(EventName.LBP_SellExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        /**
         * ==== XYK pools ====
         */

        case events.xyk.poolCreated.name: {
          const callArgs =
            call && call.name === calls.xyk.createPool.name
              ? parsers.calls.xyk.parseCreatePoolArgs(call)
              : undefined;
          const eventParams = parsers.events.xyk.parsePoolCreatedParams(event);

          parsedDataManager.set(EventName.XYK_PoolCreated, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
              args: callArgs,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.xyk.poolDestroyed.name: {
          const eventParams =
            parsers.events.xyk.parsePoolDestroyedParams(event);

          parsedDataManager.set(EventName.XYK_PoolDestroyed, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.xyk.buyExecuted.name: {
          const eventParams = parsers.events.xyk.parseBuyExecutedParams(event);

          parsedDataManager.set(EventName.XYK_BuyExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.xyk.sellExecuted.name: {
          const eventParams = parsers.events.xyk.parseSellExecutedParams(event);

          parsedDataManager.set(EventName.XYK_SellExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        /**
         * ==== Omnipools ====
         */

        case events.omnipool.tokenAdded.name: {
          const eventParams =
            parsers.events.omnipool.parseTokenAddedParams(event);

          parsedDataManager.set(EventName.Omnipool_TokenAdded, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.omnipool.tokenRemoved.name: {
          const eventParams =
            parsers.events.omnipool.parseTokenRemovedParams(event);

          parsedDataManager.set(EventName.Omnipool_TokenRemoved, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.omnipool.buyExecuted.name: {
          const eventParams =
            parsers.events.omnipool.parseBuyExecutedParams(event);

          parsedDataManager.set(EventName.Omnipool_BuyExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.omnipool.sellExecuted.name: {
          const eventParams =
            parsers.events.omnipool.parseSellExecutedParams(event);

          parsedDataManager.set(EventName.Omnipool_SellExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        /**
         * ==== Stableswap ====
         */

        case events.stableswap.poolCreated.name: {
          const eventParams =
            parsers.events.stableswap.parsePoolCreatedParams(event);

          parsedDataManager.set(EventName.Stableswap_PoolCreated, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        case events.stableswap.buyExecuted.name: {
          const eventParams =
            parsers.events.stableswap.parseBuyExecutedParams(event);

          parsedDataManager.set(EventName.Stableswap_BuyExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        case events.stableswap.sellExecuted.name: {
          const eventParams =
            parsers.events.stableswap.parseSellExecutedParams(event);

          parsedDataManager.set(EventName.Stableswap_SellExecuted, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        case events.stableswap.liquidityAdded.name: {
          const eventParams =
            parsers.events.stableswap.parseLiquidityAddedParams(event);

          parsedDataManager.set(EventName.Stableswap_LiquidityAdded, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        case events.stableswap.liquidityRemoved.name: {
          const eventParams =
            parsers.events.stableswap.parseLiquidityRemovedParams(event);

          parsedDataManager.set(EventName.Stableswap_LiquidityRemoved, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }

        /**
         * ==== Common ====
         */
        case events.tokens.transfer.name: {
          const eventParams = parsers.events.tokens.parseTransferParams(event);

          parsedDataManager.set(EventName.Tokens_Transfer, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        case events.balances.transfer.name: {
          const eventParams =
            parsers.events.balances.parseTransferParams(event);

          parsedDataManager.set(EventName.Balances_Transfer, {
            relayChainInfo,
            id: eventMetadata.id,
            eventData: {
              name: eventMetadata.name,
              metadata: eventMetadata,
              params: eventParams,
            },
            callData: {
              ...callMetadata,
            },
          });
          totalEventsNumber++;
          break;
        }
        default:
      }
    }
  }

  ctx.log.info(
    `Parsed ${totalEventsNumber} events from ${ctx.blocks.length} blocks [${ctx.blocks[0].header.height} / ${ctx.blocks[ctx.blocks.length - 1].header.height}].`
  );
  return parsedDataManager;
}
