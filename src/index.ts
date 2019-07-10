/**
 * Main control for this library.
 */

import { DataType, DetailType, NbinetCollectionFunction } from '../index';
import { firstLayerParser, FirstLayerDataType } from './first-layer-parser';
import { collectionFetch, FetchResult } from './nbinet-fetch';
import { SecondLayerDataType, secondLayerParser } from './second-layer-parser';
import { thirdLayerParser } from './third-layer-parser';

const getSecondLayerDataFromFirst: Function = async (firstLayerData: FirstLayerDataType[]): Promise<SecondLayerDataType[]> => {
  const htmlCode: FetchResult[] = await Promise.all(
    firstLayerData.map((value: FirstLayerDataType): FetchResult => collectionFetch(value.url))
  );
  const result: SecondLayerDataType[] = await Promise.all(
    htmlCode.map((value: FetchResult): SecondLayerDataType => secondLayerParser(value.data))
  );

  return ([] as SecondLayerDataType[]).concat.apply([], result);
};

const getThirdLayerDataFromSecond: Function = async (secondLayerData: SecondLayerDataType[]): Promise<DetailType[]> => {
  const htmlCode: FetchResult[] = await Promise.all(
    secondLayerData.map((value: SecondLayerDataType): FetchResult => collectionFetch(value.url))
  );
  const result: DetailType[] = await Promise.all(
    htmlCode.map((value: FetchResult): DetailType => thirdLayerParser(value.data))
  );

  return result;
};

const nbinetCollection: NbinetCollectionFunction = async (keyword: string, dataType: DataType = 'isbn'): Promise<DetailType | DetailType[] | null> => {
  const htmlCodeAfterFetch: FetchResult = await collectionFetch(null, keyword, dataType);
  // To check where the HTML code is from and do next step

  if (htmlCodeAfterFetch.data == null) {
    // To do here if no result is got from the HTML code

    return null;
  }

  let result: DetailType | DetailType[] | null = null;

  if (htmlCodeAfterFetch.data.includes('沒有查獲符合查詢條件的館藏')) {
    // To do here if no result is got from the HTML code
    return result;
  }

  if (htmlCodeAfterFetch.data.includes('class="browseEntry"')) {
    // To do here if The initial HTML code get from first layer page
    result = await firstLayerParser(htmlCodeAfterFetch.data);
    result = await getSecondLayerDataFromFirst(result);
    result = await getThirdLayerDataFromSecond(result);
  } else if (htmlCodeAfterFetch.data.includes('class="briefCitRow"')) {
    // To do here if The initial HTML code get from second layer page
    result = await secondLayerParser(htmlCodeAfterFetch.data);
    result = await getThirdLayerDataFromSecond(result);
  } else if (htmlCodeAfterFetch.data.includes('class="bibInfo"')) {
    // To do here if The initial HTML code get from third layer page
    result = await thirdLayerParser(htmlCodeAfterFetch.data);
  }

  return result;
};

export default nbinetCollection;
