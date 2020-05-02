/**
 * To collect the results of second layer from the HTML page.
 */

export interface SecondLayerDataType {
  library: string | null;
  title: string | null;
  url: string | null;
}

const removeAllHtmlTag = (text: string): string => {
  let result = text.replace(/<\/?\w+[^>]*>/gi, "");
  // To remove beginning and end of spaces
  result = result.trim();

  return result;
};

const getUrl = (htmlCode: string): string | null => {
  let result = htmlCode.match(/<span class="briefcitTitle">[\w\W]*?<\/span>/gi);

  if (result) {
    result = result[0].match(/<a href="[\w\W]*?">/gi);
    if (result) {
      return result[0].replace(/<a href="([\w\W]*?)">/gi, "http://nbinet3.ncl.edu.tw$1");
    }
  }

  return null;
};

const getTitle = (htmlCode: string): string | null => {
  let result = htmlCode.match(/<span class="briefcitTitle">[\w\W]*?<\/span>/gi);

  if (result) {
    result = result[0].match(/<a [\w\W]*?>[\w\W]*?<\/a>/gi);
    if (result) {
      return removeAllHtmlTag(result[0]);
    }
  }

  return null;
};

const getLibrary = (htmlCode: string): string | null => {
  const result = htmlCode.match(/<span class="briefcitStatus">[\w\W]*?<\/span>/gi);

  return result && removeAllHtmlTag(result[0]);
};

const setCollectData = (htmlCodeList: string[]): SecondLayerDataType[] => {
  const result: SecondLayerDataType[] = htmlCodeList.map(
    (value): SecondLayerDataType => ({
      library: getLibrary(value),
      title: getTitle(value),
      url: getUrl(value),
    }),
  );

  return result;
};

const splitHtmlCode = (htmlCode: string): string[] | null =>
  htmlCode.match(
    /<tr class="briefCitRow">[\w\W]*?<!--this is customized <screens\/briefcit_cht\.html>-->/gi,
  );

const collectTargetHtmlCode = (htmlCode: string): string | null => {
  const result = htmlCode.match(
    /<table [\w\W]*? cellpadding="3"[\w\W]*?>[\w\W]*?<!-- END BROWSELIST\/BRIEFCIT AREA -->/gi,
  );

  return result ? result[0] : null;
};

export const secondLayerParser = (htmlCode: string): SecondLayerDataType[] | null => {
  // To aim target data
  const result = collectTargetHtmlCode(htmlCode);

  if (result) {
    // To split HTML code depend on the class name
    const parsedResult = splitHtmlCode(result);

    if (parsedResult) {
      // To parser each code and return the final result
      const collectedData = setCollectData(parsedResult);

      return collectedData;
    }
  }

  return null;
};
