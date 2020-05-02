/**
 * To collect the results of third layer from the HTML page.
 */

import { BookDetailField, CollectionField, DetailType } from "../index";

const removeAllHtmlTag = (text: string): string => {
  let result = text.replace(/<\/?\w+[^>]*>/gi, "");

  // To remove beginning and end of spaces
  result = result.trim();

  result = result.replace(/<!--.*?-->/gi, "");
  result = result.replace(/&#59/gi, "");
  result = result.replace(/&nbsp;/gi, "");

  return result;
};

const getKeyName = (text: string): string | null => {
  const result = text.match(/<td [\w\W]*?class="bibInfoLabel">[\w\W]*?<\/td>/gi);

  return result ? removeAllHtmlTag(result[0]) : null;
};

const getValueName = (text: string): string | null => {
  const result = text.match(/<td class="bibInfoData">[\w\W]*?<\/td>/gi);

  return result ? removeAllHtmlTag(result[0]) : null;
};

const getKeyAndValue = (htmlCode: string): BookDetailField[] => {
  let result = htmlCode.match(
    /<!-- BEGIN INNER BIB TABLE -->[\w\W]*?<!-- END INNER BIB TABLE -->/gi,
  );

  if (result) {
    result = result[0].match(/<tr>[\w\W]*?<\/tr>/gi);

    if (result) {
      const keyAndValueList = result.map(
        (value): BookDetailField => ({
          bookKey: getKeyName(value),
          bookValue: getValueName(value),
        }),
      );

      for (let i = 0; i < keyAndValueList.length; i = i + 1) {
        if (keyAndValueList[i].bookKey === null) {
          keyAndValueList[i].bookKey = keyAndValueList[i - 1].bookKey;
        }
      }

      return keyAndValueList;
    }
  }

  return [];
};

const parseBookDetail = (htmlCode: string): BookDetailField[] | null => {
  const result = htmlCode.match(/<div class="bibContent">[\w\W]*?<\/div>/gi);

  if (result) {
    const bookDetail = result.map((value): BookDetailField[] => getKeyAndValue(value));

    return ([] as BookDetailField[]).concat.apply([], bookDetail);
  }

  return null;
};

const getCollectionAllValueName = (text: string): CollectionField => {
  const result = text.match(/<td [\w\W]*?>[\w\W]*?<\/td>/gi);

  if (result) {
    return {
      library: removeAllHtmlTag(result[0]),
      callNumber: removeAllHtmlTag(result[1]),
      status: removeAllHtmlTag(result[2]),
    };
  }

  return {
    library: null,
    callNumber: null,
    status: null,
  };
};

const parseCollectionList = (htmlCode: string): CollectionField[] | null => {
  const result = htmlCode.match(/<tr class="bibItemsEntry">[\w\W]*?<\/tr>/gi);

  if (result) {
    const collectionList = result.map((value): CollectionField => getCollectionAllValueName(value));

    return collectionList;
  }

  return null;
};

const collectTargetHtmlCode = (htmlCode: string): string | null => {
  const result = htmlCode.match(/<div class="bibInfo">[\w\W]*?<div style="clear:both">/gi);

  return result ? result[0] : null;
};

export const thirdLayerParser = (htmlCode: string, url: string): DetailType => {
  // To aim target data
  const result = collectTargetHtmlCode(htmlCode);

  if (result) {
    // To split HTML code depend on the class name
    return {
      bookDetail: parseBookDetail(result),
      collection: parseCollectionList(result),
      url,
    };
  }

  return {
    bookDetail: null,
    collection: null,
    url,
  };
};
