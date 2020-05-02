/**
 * To collect the results of second layer from the HTML page.
 */

export interface SecondLayerDataType {
  library: string;
  title: string;
  url: string;
}

const removeAllHtmlTag: Function = (text: string): string => {
  let result: string = text.replace(/<\/?\w+[^>]*>/gi, "");
  // To remove beginning and end of spaces
  result = result.replace(/^\s+/, "");
  result = result.replace(/\s+$/, "");

  return result;
};

const getUrl: Function = (htmlCode: string): string | null => {
  let result: string[] | null = htmlCode.match(/<span class="briefcitTitle">[\w\W]*?<\/span>/gi);

  if (result != null) {
    result = result[0].match(/<a href="[\w\W]*?">/gi);
    if (result != null) {
      return result[0].replace(/<a href="([\w\W]*?)">/gi, "http://nbinet3.ncl.edu.tw$1");
    }
  }
  return null;
};

const getTitle: Function = (htmlCode: string): string | null => {
  let result: string[] | null = htmlCode.match(/<span class="briefcitTitle">[\w\W]*?<\/span>/gi);

  if (result != null) {
    result = result[0].match(/<a [\w\W]*?>[\w\W]*?<\/a>/gi);
    if (result != null) {
      return removeAllHtmlTag(result[0]);
    }
  }
  return null;
};

const getLibrary: Function = (htmlCode: string): string | null => {
  const result: string[] | null = htmlCode.match(/<span class="briefcitStatus">[\w\W]*?<\/span>/gi);

  if (result != null) {
    return removeAllHtmlTag(result[0]);
  }
  return null;
};

const setCollectData: Function = async (htmlCodeList: string[]): Promise<SecondLayerDataType[]> => {
  const result: SecondLayerDataType[] = await Promise.all(
    htmlCodeList.map(
      (value: string): SecondLayerDataType => ({
        library: getLibrary(value),
        title: getTitle(value),
        url: getUrl(value),
      }),
    ),
  );

  return result;
};

const splitHtmlCode: Function = (htmlCode: string): string[] | null =>
  htmlCode.match(
    /<tr class="briefCitRow">[\w\W]*?<!--this is customized <screens\/briefcit_cht\.html>-->/gi,
  );

const collectTargetHtmlCode: Function = (htmlCode: string): string | null => {
  const result: string[] | null = htmlCode.match(
    /<table [\w\W]*? cellpadding="3"[\w\W]*?>[\w\W]*?<!-- END BROWSELIST\/BRIEFCIT AREA -->/gi,
  );

  if (result != null) {
    return result[0];
  }
  return null;
};

export const secondLayerParser: Function = async (
  htmlCode: string,
): Promise<SecondLayerDataType[]> => {
  // To aim target data
  let rawResult: string = collectTargetHtmlCode(htmlCode);
  // To split HTML code depend on the class name
  rawResult = splitHtmlCode(rawResult);
  // To parser each code and return the final result
  const result: SecondLayerDataType[] = await setCollectData(rawResult);

  return result;
};
