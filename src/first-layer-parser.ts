/**
 * To collect the results of first layer from the HTML page.
 */

export interface CollectDataType {
  dataType: string;
  value: string[] | string | null;
}

export interface FirstLayerDataType {
  url: string | null;
  library: string[];
}

const removeAllHtmlTag = (text: string): string => {
  let result = text.replace(/<\/?\w+[^>]*>/gi, "");
  // To remove beginning and end of white spaces
  result = result.trim();

  return result;
};

const getUrl = (htmlCode: string): string | null => {
  const result = htmlCode.match(/<a href="[\w\W]*?">/gi);

  if (result) {
    return result[0].replace(/<a href="([\w\W]*?)">/gi, "http://nbinet3.ncl.edu.tw$1");
  }

  return null;
};

const getLibrary = (htmlCode: string): string[] | null => {
  const parserResult = htmlCode.match(/<strong>[\w\W]*?<\/strong>/gi);

  if (parserResult) {
    const libraryListOnString = removeAllHtmlTag(parserResult[0]);

    return libraryListOnString.split(", ");
  }

  return null;
};

const setCollectData = (htmlCodeList: string[]): CollectDataType[] => {
  const result = htmlCodeList.map(
    (value): CollectDataType => {
      if (value.includes('class="browseEntry"')) {
        return { dataType: "url", value: getUrl(value) };
      }
      if (value.includes('class="browseSubEntry"')) {
        return { dataType: "library", value: getLibrary(value) };
      }

      return { dataType: "none", value: null };
    },
  );

  return result;
};

const combineData = (dataList: CollectDataType[]): FirstLayerDataType[] => {
  const newData: FirstLayerDataType[] = [];
  for (const data of dataList) {
    switch (data.dataType) {
      case "url":
        newData.push({
          url: !data.value ? null : Array.isArray(data.value) ? data.value[0] : data.value,
          library: [],
        });
        break;
      case "library":
        newData[newData.length - 1].library = newData[newData.length - 1].library.concat(
          data.value ? data.value : [],
        );
        break;
      default:
        break;
    }
  }

  return newData;
};

const splitHtmlCode = (htmlCode: string): string[] | null =>
  htmlCode.match(/<tr[\w\W]*?>[\w\W]*?<\/tr>/gi);

const collectTargetHtmlCode = (htmlCode: string): string[] | null =>
  htmlCode.match(/<table[\w\W]*? class="browseList">[\w\W]*?<\/table>/gi);

export const firstLayerParser = (htmlCode: string): FirstLayerDataType[] | null => {
  // To aim target data
  const result = collectTargetHtmlCode(htmlCode);

  if (result) {
    // To split HTML code depend on the class name
    const parsedResult = splitHtmlCode(result[0]);

    if (parsedResult) {
      // To parser each code and return the reports
      const collectedData = setCollectData(parsedResult);
      // To combine each report into a final result
      return combineData(collectedData);
    }
  }

  return null;
};
