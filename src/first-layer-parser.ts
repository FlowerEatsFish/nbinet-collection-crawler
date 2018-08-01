/**
 * To collect the results of first layer from the HTML page.
 */

export interface ICollectDataType {
  dataType: string;
  value: string;
}

export interface IFirstLayerDataType {
  url: string;
  library: string[];
}

const removeAllHtmlTag: Function = (text: string): string => {
  let result: string = text.replace(/<\/?\w+[^>]*>/gi, '');
  // To remove beginning and end of spaces
  result = result.replace(/^\s+/, '');
  result = result.replace(/\s+$/, '');

  return result;
};

const getUrl: Function = (htmlCode: string): string => {
  const result: string = htmlCode.match(/<a href="[\w\W]*?">/gi)[0];

  return result.replace(/<a href="([\w\W]*?)">/gi, 'http://nbinet3.ncl.edu.tw$1');
};

const getLibrary: Function = (htmlCode: string): string[] => {
  let result: string = htmlCode.match(/<strong>[\w\W]*?<\/strong>/gi)[0];
  result = removeAllHtmlTag(result);

  return result.split(', ');
};

const setCollectData: Function = async (htmlCodeList: string[]): Promise<ICollectDataType[]> => {
  // tslint:disable-next-line:no-unnecessary-local-variable
  const result: ICollectDataType[] = await Promise.all(
    htmlCodeList.map((value: string): ICollectDataType => {
      if (value.includes('class="browseEntry"')) {
        return { dataType: 'url', value: getUrl(value) };
      }
      if (value.includes('class="browseSubEntry"')) {
        return { dataType: 'library', value: getLibrary(value) };
      }

      return { dataType: 'none', value: null };
    })
  );

  return result;
};

const combineData: Function = (dataList: ICollectDataType[]): IFirstLayerDataType[] => {
  const newData: IFirstLayerDataType[] = [];
  for (const data of dataList) {
    switch (data.dataType) {
      case 'url':
        newData.push({ url: data.value, library: [] });
        break;
      case 'library':
        newData[newData.length - 1].library = newData[newData.length - 1].library.concat(data.value);
      default:
    }
  }

  return newData;
};

const splitHtmlCode: Function = (htmlCode: string): string[] => htmlCode.match(/<tr[\w\W]*?>[\w\W]*?<\/tr>/gi);

const collectTargetHtmlCode: Function = (htmlCode: string): string => htmlCode.match(/<table[\w\W]*? class="browseList">[\w\W]*?<\/table>/gi)[0];

export const firstLayerParser: Function = async (htmlCode: string): Promise<IFirstLayerDataType[]> => {
  // To aim target data
  let result: string = collectTargetHtmlCode(htmlCode);
  // To split HTML code depend on the class name
  result = splitHtmlCode(result);
  // To parser each code and return the reports
  result = await setCollectData(result);

  // To combine each report into a final result
  return combineData(result);
};
