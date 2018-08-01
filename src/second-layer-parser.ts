/**
 * To collect the results of second layer from the HTML page.
 */

export interface ISecondLayerDataType {
  library: string;
  title: string;
  url: string;
}

const removeAllHtmlTag: Function = (text: string): string => {
  let result: string = text.replace(/<\/?\w+[^>]*>/gi, '');
  // To remove beginning and end of spaces
  result = result.replace(/^\s+/, '');
  result = result.replace(/\s+$/, '');

  return result;
};

const getUrl: Function = (htmlCode: string): string => {
  let result: string = htmlCode.match(/<span class="briefcitTitle">[\w\W]*?<\/span>/gi)[0];
  result = result.match(/<a href="[\w\W]*?">/gi)[0];

  return result.replace(/<a href="([\w\W]*?)">/gi, 'http://nbinet3.ncl.edu.tw$1');
};

const getTitle: Function = (htmlCode: string): string => {
  let result: string = htmlCode.match(/<span class="briefcitTitle">[\w\W]*?<\/span>/gi)[0];
  result = result.match(/<a [\w\W]*?>[\w\W]*?<\/a>/gi)[0];

  return removeAllHtmlTag(result);
};

const getLibrary: Function = (htmlCode: string): string => {
  const result: string = htmlCode.match(/<span class="briefcitStatus">[\w\W]*?<\/span>/gi)[0];

  return removeAllHtmlTag(result);
};

const setCollectData: Function = async (htmlCodeList: string[]): Promise<ISecondLayerDataType[]> => {
  // tslint:disable-next-line:no-unnecessary-local-variable
  const result: ISecondLayerDataType[] = await Promise.all(
    htmlCodeList.map((value: string): ISecondLayerDataType => ({
        library: getLibrary(value), title: getTitle(value), url: getUrl(value)
      })
    )
  );

  return result;
};

const splitHtmlCode: Function = (htmlCode: string): string[] => htmlCode.match(/<tr class="briefCitRow">[\w\W]*?<!\-\-this is customized <screens\/briefcit_cht\.html>\-\->/gi);

const collectTargetHtmlCode: Function = (htmlCode: string): string => htmlCode.match(/<table [\w\W]*? cellpadding="3"[\w\W]*?>[\w\W]*?<!\-\- END BROWSELIST\/BRIEFCIT AREA \-\->/gi)[0];

export const secondLayerParser: Function = async (htmlCode: string): Promise<ISecondLayerDataType[]> => {
  // To aim target data
  let rawResult: string = collectTargetHtmlCode(htmlCode);
  // To split HTML code depend on the class name
  rawResult = splitHtmlCode(rawResult);
  // To parser each code and return the final result
  // tslint:disable-next-line:no-unnecessary-local-variable
  const result: ISecondLayerDataType[] = await setCollectData(rawResult);

  return result;
};
