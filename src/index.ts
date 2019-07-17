/**
 * Main control for this library.
 */

import { DataType, DetailType, NbinetCollectionFunction } from '../index';
import { firstLayerParser, FirstLayerDataType } from './first-layer-parser';
import { collectionFetch, FetchResult } from './nbinet-fetch';
import { SecondLayerDataType, secondLayerParser } from './second-layer-parser';
import { thirdLayerParser } from './third-layer-parser';

const getSecondLayerDataFromFirst: Function = async (firstLayerData: FirstLayerDataType[]): Promise<SecondLayerDataType[]> => {
  const resultAfterFetch: FetchResult[] = await Promise.all(
    firstLayerData.map((value: FirstLayerDataType): FetchResult => collectionFetch(value.url))
  );
  const result: SecondLayerDataType[] = await Promise.all(
    resultAfterFetch.map((value: FetchResult): SecondLayerDataType => secondLayerParser(value.data))
  );

  return ([] as SecondLayerDataType[]).concat.apply([], result);
};

const getThirdLayerDataFromSecond: Function = async (secondLayerData: SecondLayerDataType[]): Promise<DetailType[]> => {
  const resultAfterFetch: FetchResult[] = await Promise.all(
    secondLayerData.map((value: SecondLayerDataType): FetchResult => collectionFetch(value.url))
  );
  const result: DetailType[] = await Promise.all(
    resultAfterFetch.map((value: FetchResult): DetailType => thirdLayerParser(value.data, value.url))
  );

  return result;
};

const nbinetCollection: NbinetCollectionFunction = async (keyword: string, dataType: DataType = 'isbn'): Promise<DetailType | DetailType[] | null> => {
  const resultAfterFetch: FetchResult = await collectionFetch(null, keyword, dataType);
  // To check where the HTML code is from and do next step
  if (resultAfterFetch.data == null) {
    // To do here if no result is got from the HTML code
    return null;
  }

  let result: DetailType | DetailType[] | null = null;

  if (resultAfterFetch.data.includes('沒有查獲符合查詢條件的館藏')) {
    // To do here if no result is got from the HTML code
    return result;
  }

  if (resultAfterFetch.data.includes('class="browseEntry"')) {
    // To do here if The initial HTML code get from first layer page
    result = await firstLayerParser(resultAfterFetch.data);
    result = await getSecondLayerDataFromFirst(result);
    result = await getThirdLayerDataFromSecond(result);
  } else if (resultAfterFetch.data.includes('class="briefCitRow"')) {
    // To do here if The initial HTML code get from second layer page
    result = await secondLayerParser(resultAfterFetch.data);
    result = await getThirdLayerDataFromSecond(result);
  } else if (resultAfterFetch.data.includes('class="bibInfo"')) {
    // To do here if The initial HTML code get from third layer page
    result = await thirdLayerParser(resultAfterFetch.data, resultAfterFetch.url);
  }

  return result;
};

export default nbinetCollection;
