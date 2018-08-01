/**
 * Main control for this library.
 */

import { firstLayerParser, IFirstLayerDataType } from './first-layer-parser';
import { collectionFetch, IFetchResult } from './nbinet-fetch';
import { ISecondLayerDataType, secondLayerParser } from './second-layer-parser';
import { IThirdLayerDataType, thirdLayerParser } from './third-layer-parser';

const getSecondLayerDataFromFirst: Function = async (firstLayerData: IFirstLayerDataType[]): Promise<ISecondLayerDataType[]> => {
  const htmlCode: IFetchResult[] = await Promise.all(
    firstLayerData.map((value: IFirstLayerDataType): IFetchResult => collectionFetch(value.url))
  );
  const result: ISecondLayerDataType[] = await Promise.all(
    htmlCode.map((value: IFetchResult): ISecondLayerDataType => secondLayerParser(value.data))
  );

  return [].concat.apply([], result);
};

const getThirdLayerDataFromSecond: Function = async (secondLayerData: ISecondLayerDataType[]): Promise<IThirdLayerDataType[]> => {
  const htmlCode: IFetchResult[] = await Promise.all(
    secondLayerData.map((value: ISecondLayerDataType): IFetchResult => collectionFetch(value.url))
  );
  // tslint:disable-next-line:no-unnecessary-local-variable
  const result: IThirdLayerDataType[] = await Promise.all(
    htmlCode.map((value: IFetchResult): IThirdLayerDataType => thirdLayerParser(value.data))
  );

  return result;
};

const bookCollection: Function = async (keyword: string, dataType: string = 'isbn'): Promise<object> => {
  const htmlCodeAfterFetch: IFetchResult = await collectionFetch(null, keyword, dataType);
  // To check where the HTML code is from and do next step
  console.log(`>>> You search data using ${htmlCodeAfterFetch.url}`);

  // tslint:disable-next-line:no-any
  let result: any = null;

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

// tslint:disable-next-line:no-default-export
export default bookCollection;
