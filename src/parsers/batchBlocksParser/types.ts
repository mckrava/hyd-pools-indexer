import { Runtime } from '@subsquid/substrate-runtime';
import {
  BalancesTransferEventParams,
  EventName,
  LbpBuyExecutedEventParams,
  LbpPoolCreatedEventParams,
  LbpPoolUpdatedEventParams,
  LbpSellExecutedEventParams,
  RelayChainInfo,
  TokensTransferEventParams,
} from '../types/events';
import { LbpCreatePoolCallArgs } from '../types/calls';
import { BlockHeader } from '@subsquid/substrate-processor';
import { Block } from '../../processor';

export type EventId = string;

export type BatchBlocksParsedDataScope = Map<
  EventName,
  Map<EventId, ParsedEventsCallsData>
>;

export type ParsedEventsCallsData =
  | LbpPoolCreatedData
  | LbpPoolUpdatedData
  | TokensTransferData
  | BalancesTransferData
  | LbpBuyExecutedData
  | LbpSellExecutedData;

export type CallParsedData<T = undefined> = {
  name: string;
  // signer: string;
  args?: T;
};

export type EventParsedData<T> = {
  name: string;
  metadata: EventMetadata;
  params: T;
};

export type ParsedEventCallData<
  E extends { metadata: EventMetadata },
  C extends { name: string },
> = {
  id: string;
  relayChainInfo: RelayChainInfo;
  eventData: E;
  callData?: C;
};

export interface EventMetadata {
  id: EventId;
  name: string;
  indexInBlock: number;
  block: Block;
}

/**
 *  ==== LBP Pool Created ====
 */
export type LbpPoolCreatedData = ParsedEventCallData<
  LbpPoolCreatedEventParsedData,
  LbpCreatePoolCallParsedData
>;

export type LbpPoolCreatedEventParsedData =
  EventParsedData<LbpPoolCreatedEventParams>;

export type LbpCreatePoolCallParsedData = CallParsedData<LbpCreatePoolCallArgs>;

/**
 *  ==== LBP Pool Updated ====
 */

export type LbpPoolUpdatedData = ParsedEventCallData<
  LbpPoolUpdatedEventParsedData,
  CallParsedData
>;

export type LbpPoolUpdatedEventParsedData =
  EventParsedData<LbpPoolUpdatedEventParams>;

/**
 *  ==== Tokens Transfer ====
 */

export type TokensTransferData = ParsedEventCallData<
  TokensTransferEventParsedData,
  CallParsedData
>;

export type TokensTransferEventParsedData =
  EventParsedData<TokensTransferEventParams>;

/**
 *  ==== Balances Transfer ====
 */

export type BalancesTransferData = ParsedEventCallData<
  BalancesTransferEventParsedData,
  CallParsedData
>;

export type BalancesTransferEventParsedData =
  EventParsedData<BalancesTransferEventParams>;

/**
 *  ==== LBP Buy Executed ====
 */

export type LbpBuyExecutedData = ParsedEventCallData<
  LbpBuyExecutedEventParsedData,
  CallParsedData
>;

export type LbpBuyExecutedEventParsedData =
  EventParsedData<LbpBuyExecutedEventParams>;

/**
 *  ==== LBP Sell Executed ====
 */

export type LbpSellExecutedData = ParsedEventCallData<
  LbpSellExecutedEventParsedData,
  CallParsedData
>;

export type LbpSellExecutedEventParsedData =
  EventParsedData<LbpSellExecutedEventParams>;
