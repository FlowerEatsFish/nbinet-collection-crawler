/**
 * To collect the results of third layer from the HTML page.
 */

export interface IBookField {
  dataKey: string;
  dataValue: string;
}

export interface ILibraryField {
  library: string;
  callNumber: string;
  status: string;
}

export interface IThirdLayerDataType {
  bookDetail: IBookField[];
  library: ILibraryField[];
}

const removeAllHtmlTag: Function = (text: string): string => {
  let result: string = text.replace(/<\/?\w+[^>]*>/gi, '');
  // To remove beginning and end of spaces
  result = result.replace(/^\s+/, '');
  result = result.replace(/\s+$/, '');
  result = result.replace(/<!\-\-.*?\-\->/gi, '');
  result = result.replace(/&#59/gi, '');
  result = result.replace(/&nbsp;/gi, '');

  return result;
};

const getkeyName: Function = (text: string): string => {
  const result: string[] = text.match(/<td [\w\W]*?class="bibInfoLabel">[\w\W]*?<\/td>/gi);
  if (result !== null) {
    return removeAllHtmlTag(result[0]);
  }

  return null;
};

const getValueName: Function = (text: string): string => {
  const result: string[] = text.match(/<td class="bibInfoData">[\w\W]*?<\/td>/gi);
  if (result !== null) {
    return removeAllHtmlTag(result[0]);
  }

  return null;
};

const getKeyAndValue: Function = async (htmlCode: string): Promise<IBookField[]> => {
  let result: string|string[] = htmlCode.match(/<!\-\- BEGIN INNER BIB TABLE \-\->[\w\W]*?<!\-\- END INNER BIB TABLE \-\->/gi)[0];
  result = result.match(/<tr>[\w\W]*?<\/tr>/gi);

  // tslint:disable-next-line:no-unnecessary-local-variable
  const keyAndValueList: IBookField[] = await Promise.all(result.map((value: string): IBookField => ({
        dataKey: getkeyName(value), dataValue: getValueName(value)
      })
    )
  );

  for (let i: number = 0; i < keyAndValueList.length; i = i + 1) {
    if (keyAndValueList[i].dataKey === null) {
      keyAndValueList[i].dataKey = keyAndValueList[i - 1].dataKey;
    }
  }

  return keyAndValueList;
};

const parserBookDetail: Function = async (htmlCode: string): Promise<IBookField[]> => {
  try {
    const result: string[] = htmlCode.match(/<div class="bibContent">[\w\W]*?<\/div>/gi);
    if (result !== null) {
      const bookDetail: IBookField[] = await Promise.all(result.map((value: string): IBookField => getKeyAndValue(value)));

      return [].concat.apply([], bookDetail);
    }

    return null;
  } catch {
    return null;
  }
};

const getLibraryAllValueName: Function = (text: string): ILibraryField => {
  const result: string[] = text.match(/<td [\w\W]*?>[\w\W]*?<\/td>/gi);

  return {
    library: removeAllHtmlTag(result[0]),
    callNumber: removeAllHtmlTag(result[1]),
    status: removeAllHtmlTag(result[2])
  };
};

const parserLibraryList: Function = async (htmlCode: string): Promise<ILibraryField[]> => {
  try {
    const result: string[] = htmlCode.match(/<tr class="bibItemsEntry">[\w\W]*?<\/tr>/gi);
    if (result !== null) {
      // tslint:disable-next-line:no-unnecessary-local-variable
      const libraryList: ILibraryField[] = await Promise.all(result.map((value: string): ILibraryField => getLibraryAllValueName(value)));

      return libraryList;
    }

    return null;
  } catch {
    return null;
  }
};

const combineData: Function = async (htmlCode: string): Promise<IThirdLayerDataType> => {
  const tempLibrary: ILibraryField[] = await parserLibraryList(htmlCode);
  const tempBookDetail: IBookField[] = await parserBookDetail(htmlCode);

  return {
    bookDetail: tempBookDetail,
    library: tempLibrary
  };
};

const collectTargetHtmlCode: Function = (htmlCode: string): string => htmlCode.match(/<div class="bibInfo">[\w\W]*?<div style="clear\:both">/gi)[0];

export const thirdLayerParser: Function = async (htmlCode: string): Promise<IThirdLayerDataType[]> => {
  // To aim target data
  const rawResult: string = collectTargetHtmlCode(htmlCode);
  // To split HTML code depend on the class name
  // tslint:disable-next-line:no-unnecessary-local-variable
  const result: IThirdLayerDataType[] = await combineData(rawResult);

  return result;
};
