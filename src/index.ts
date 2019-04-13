/**
 * Main control for this library.
 */

import { firstLayerParser, FirstLayerDataType } from './first-layer-parser';
import { collectionFetch, FetchResult } from './nbinet-fetch';
import { SecondLayerDataType, secondLayerParser } from './second-layer-parser';
import { ThirdLayerDataType, thirdLayerParser } from './third-layer-parser';

const getSecondLayerDataFromFirst: Function = async (firstLayerData: FirstLayerDataType[]): Promise<SecondLayerDataType[]> => {
  const htmlCode: FetchResult[] = await Promise.all(
    firstLayerData.map((value: FirstLayerDataType): FetchResult => collectionFetch(value.url))
  );
  const result: SecondLayerDataType[] = await Promise.all(
    htmlCode.map((value: FetchResult): SecondLayerDataType => secondLayerParser(value.data))
  );

  return ([] as SecondLayerDataType[]).concat.apply([], result);
};

const getThirdLayerDataFromSecond: Function = async (secondLayerData: SecondLayerDataType[]): Promise<ThirdLayerDataType[]> => {
  const htmlCode: FetchResult[] = await Promise.all(
    secondLayerData.map((value: SecondLayerDataType): FetchResult => collectionFetch(value.url))
  );
  const result: ThirdLayerDataType[] = await Promise.all(
    htmlCode.map((value: FetchResult): ThirdLayerDataType => thirdLayerParser(value.data))
  );

  return result;
};

const nbinetCollection: Function = async (keyword: string, dataType: string = 'isbn'): Promise<ThirdLayerDataType | ThirdLayerDataType[] | null> => {
  const htmlCodeAfterFetch: FetchResult = await collectionFetch(null, keyword, dataType);
  // To check where the HTML code is from and do next step
  console.log(`>>> You search data using ${htmlCodeAfterFetch.url}`);

  if (htmlCodeAfterFetch.data == null) {
    // To do here if no result is got from the HTML code
    console.log('>>> No result is got from the HTML code.');

    return null;
  }

  let result: ThirdLayerDataType | ThirdLayerDataType[] | null = null;

  if (htmlCodeAfterFetch.data.includes('沒有查獲符合查詢條件的館藏')) {
    // To do here if no result is got from the HTML code
    console.log('>>> No result is got from the HTML code.');

    return result;
  }

  if (htmlCodeAfterFetch.data.includes('class="browseEntry"')) {
    // To do here if The initial HTML code get from first layer page
    console.log('>>> The initial HTML code get from first layer page.');

    result = await firstLayerParser(htmlCodeAfterFetch.data);
    console.log(result);

    result = await getSecondLayerDataFromFirst(result);
    console.log(result);

    result = await getThirdLayerDataFromSecond(result);
    console.log(result);
  } else if (htmlCodeAfterFetch.data.includes('class="briefCitRow"')) {
    // To do here if The initial HTML code get from second layer page
    console.log('>>> The initial HTML code get from second layer page.');

    result = await secondLayerParser(htmlCodeAfterFetch.data);
    console.log(result);

    result = await getThirdLayerDataFromSecond(result);
    console.log(result);
  } else if (htmlCodeAfterFetch.data.includes('class="bibInfo"')) {
    // To do here if The initial HTML code get from third layer page
    console.log('>>> The initial HTML code get from third layer page.');

    result = await thirdLayerParser(htmlCodeAfterFetch.data);
    console.log(result);
  } else {
    // To do here if no result is got from the HTML code
    console.log('>>> No result is got from the HTML code.');
  }

  return result;
};

export default nbinetCollection;
