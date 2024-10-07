// OMG Typescript...
import { ParsedEventsCallsData } from '../parsers/batchBlocksParser/types';

export function isNotNullOrUndefined<T extends Object>(
  input: null | undefined | T
): input is T {
  return input != null;
}

//TODO add additional sorting by eventIndexInBlock
export function getOrderedListByBlockNumber<T extends ParsedEventsCallsData>(
  eventsList: Array<T>
): Array<T> {
  return eventsList.sort((a, b) =>
    a.eventData.metadata.blockHeader.height < b.eventData.metadata.blockHeader.height
      ? -1
      : b.eventData.metadata.blockHeader.height < a.eventData.metadata.blockHeader.height
        ? 1
        : 0
  );
}
