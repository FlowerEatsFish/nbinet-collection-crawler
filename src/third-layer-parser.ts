/**
 * To collect the results of third layer from the HTML page.
 */

export interface BookField {
  bookKey: string;
  bookValue: string;
}

export interface CollectionField {
  library: string | null;
  callNumber: string | null;
  status: string | null;
}

export interface ThirdLayerDataType {
  bookDetail: BookField[] | null;
  collection: CollectionField[] | null;
}

const removeAllHtmlTag: Function = (text: string): string => {
  let result: string = text.replace(/<\/?\w+[^>]*>/gi, '');
  // To remove beginning and end of spaces
  result = result.replace(/^\s+/, '');
  result = result.replace(/\s+$/, '');
  result = result.replace(/<!--.*?-->/gi, '');
  result = result.replace(/&#59/gi, '');
  result = result.replace(/&nbsp;/gi, '');

  return result;
};

const getkeyName: Function = (text: string): string | null => {
  const result: string[] | null = text.match(/<td [\w\W]*?class="bibInfoLabel">[\w\W]*?<\/td>/gi);

  if (result !== null) {
    return removeAllHtmlTag(result[0]);
  }
  return null;
};

const getValueName: Function = (text: string): string | null => {
  const result: string[] | null = text.match(/<td class="bibInfoData">[\w\W]*?<\/td>/gi);

  if (result !== null) {
    return removeAllHtmlTag(result[0]);
  }
  return null;
};

const getKeyAndValue: Function = async (htmlCode: string): Promise<BookField[] | null> => {
  let result: string[] | null = htmlCode.match(/<!-- BEGIN INNER BIB TABLE -->[\w\W]*?<!-- END INNER BIB TABLE -->/gi);

  if (result != null) {
    result = result[0].match(/<tr>[\w\W]*?<\/tr>/gi);

    if (result != null) {
      const keyAndValueList: BookField[] = await Promise.all(result.map((value: string): BookField => ({
        bookKey: getkeyName(value), bookValue: getValueName(value)
      })));

      for (let i: number = 0; i < keyAndValueList.length; i = i + 1) {
        if (keyAndValueList[i].bookKey === null) {
          keyAndValueList[i].bookKey = keyAndValueList[i - 1].bookKey;
        }
      }
      return keyAndValueList;
    }
  }
  return null;
};

const parserBookDetail: Function = async (htmlCode: string): Promise<BookField[] | null> => {
  const result: string[] | null = htmlCode.match(/<div class="bibContent">[\w\W]*?<\/div>/gi);

  if (result !== null) {
    const bookDetail: BookField[] = await Promise.all(result.map((value: string): BookField => getKeyAndValue(value)));

    return ([] as BookField[]).concat.apply([], bookDetail);
  }
  return null;
};

const getCollectionAllValueName: Function = (text: string): CollectionField => {
  const result: string[] | null = text.match(/<td [\w\W]*?>[\w\W]*?<\/td>/gi);

  if (result != null) {
    return {
      library: removeAllHtmlTag(result[0]),
      callNumber: removeAllHtmlTag(result[1]),
      status: removeAllHtmlTag(result[2])
    };
  }

  return {
    library: null,
    callNumber: null,
    status: null
  };
};

const parserCollectionList: Function = async (htmlCode: string): Promise<CollectionField[] | null> => {
  const result: string[] | null = htmlCode.match(/<tr class="bibItemsEntry">[\w\W]*?<\/tr>/gi);

  if (result !== null) {
    const collectionList: CollectionField[] = await Promise.all(result.map((value: string): CollectionField => getCollectionAllValueName(value)));

    return collectionList;
  }
  return null;
};

const combineData: Function = async (htmlCode: string): Promise<ThirdLayerDataType> => {
  const tempCollection: CollectionField[] | null = await parserCollectionList(htmlCode);
  const tempBookDetail: BookField[] | null = await parserBookDetail(htmlCode);

  return {
    bookDetail: tempBookDetail,
    collection: tempCollection
  };
};

const collectTargetHtmlCode: Function = (htmlCode: string): string | null => {
  const result: string[] | null = htmlCode.match(/<div class="bibInfo">[\w\W]*?<div style="clear:both">/gi);

  if (result != null) {
    return result[0];
  }
  return null;
};

export const thirdLayerParser: Function = async (htmlCode: string): Promise<ThirdLayerDataType[]> => {
  // To aim target data
  const rawResult: string = collectTargetHtmlCode(htmlCode);
  // To split HTML code depend on the class name
  const result: ThirdLayerDataType[] = await combineData(rawResult);

  return result;
};
