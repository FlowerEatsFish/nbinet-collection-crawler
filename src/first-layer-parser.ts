/**
 * To collect the results of first layer from the HTML page.
 */

export interface CollectDataType {
  dataType: string;
  value: string | null;
}

export interface FirstLayerDataType {
  url: string | null;
  library: string[];
}

const removeAllHtmlTag: Function = (text: string): string => {
  let result: string = text.replace(/<\/?\w+[^>]*>/gi, "");
  // To remove beginning and end of spaces
  result = result.replace(/^\s+/, "");
  result = result.replace(/\s+$/, "");

  return result;
};

const getUrl: Function = (htmlCode: string): string | null => {
  const result: string[] | null = htmlCode.match(/<a href="[\w\W]*?">/gi);

  if (result != null) {
    return result[0].replace(/<a href="([\w\W]*?)">/gi, "http://nbinet3.ncl.edu.tw$1");
  }
  return null;
};

const getLibrary: Function = (htmlCode: string): string[] | null => {
  const parserResult: string[] | null = htmlCode.match(/<strong>[\w\W]*?<\/strong>/gi);

  if (parserResult != null) {
    const libraryListOnString: string = removeAllHtmlTag(parserResult[0]);

    return libraryListOnString.split(", ");
  }
  return null;
};

const setCollectData: Function = async (htmlCodeList: string[]): Promise<CollectDataType[]> => {
  const result: CollectDataType[] = await Promise.all(
    htmlCodeList.map(
      (value: string): CollectDataType => {
        if (value.includes('class="browseEntry"')) {
          return { dataType: "url", value: getUrl(value) };
        }
        if (value.includes('class="browseSubEntry"')) {
          return { dataType: "library", value: getLibrary(value) };
        }

        return { dataType: "none", value: null };
      },
    ),
  );

  return result;
};

const combineData: Function = (dataList: CollectDataType[]): FirstLayerDataType[] => {
  const newData: FirstLayerDataType[] = [];
  for (const data of dataList) {
    switch (data.dataType) {
      case "url":
        newData.push({ url: data.value, library: [] });
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

const splitHtmlCode: Function = (htmlCode: string): string[] | null =>
  htmlCode.match(/<tr[\w\W]*?>[\w\W]*?<\/tr>/gi);

const collectTargetHtmlCode: Function = (htmlCode: string): string[] | null =>
  htmlCode.match(/<table[\w\W]*? class="browseList">[\w\W]*?<\/table>/gi);

export const firstLayerParser: Function = async (
  htmlCode: string,
): Promise<FirstLayerDataType[] | null> => {
  // To aim target data
  let result: string[] | null = collectTargetHtmlCode(htmlCode);

  if (result != null) {
    // To split HTML code depend on the class name
    result = splitHtmlCode(result[0]);

    if (result != null) {
      // To parser each code and return the reports
      result = await setCollectData(result);
      // To combine each report into a final result
      return combineData(result);
    }
  }
  return null;
};
