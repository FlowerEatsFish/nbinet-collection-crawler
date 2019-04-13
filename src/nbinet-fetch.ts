/**
 * To fetch data via books.com.tw.
 */

import axios, { AxiosError, AxiosResponse } from 'axios';

export interface FetchResult {
  data: string | null;
  url: string;
}

const removeLeftoverCode: Function = (htmlCode: string): string => {
  let result: string = htmlCode.replace('\\t', '');
  result = result.replace('\\n', '');
  result = result.replace(/\s+/gi, ' ');

  return result;
};

const setKeywordToInsertUrl: Function = (keyword: string): string => {
  // To remove special characters
  let temp: string = keyword.replace(/[~!@#$%^&*()_+\-=}{[\]|"':;?/.,<>}\\]/gi, ' ');
  // To remove two or more consequent spaces and replace a space with plus character
  temp = temp.replace(/\s+/, '+');
  // To remove last space
  temp = temp.replace(/\s+$/, '');

  return encodeURI(temp);
};

const setTypeToInsertUrl: Function = (dataType: string): string => {
  switch (dataType) {
    case 'isbn':
      return 'i';
    default:
      return 'X';
  }
};

const setUrl: Function = (keyword: string, dataType: string): string => `http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=${setTypeToInsertUrl(dataType)}&searcharg=${setKeywordToInsertUrl(keyword)}&searchscope=1`;

const fetchFullHtmlCode: Function = async (url: string): Promise<string> => {
  return new Promise((resolve: (data: string) => void, reject: (error: AxiosError) => void): void => {
    axios.get(url)
      .then((response: AxiosResponse): void => resolve(removeLeftoverCode(response.data)))
      .catch((error: AxiosError): void => reject(error));
  });
};

const setUrlFollowParameter: Function = async (url: string, keyword: string, dataType: string): Promise<string> => {
  if (url) {
    return url;
  }

  const combineUrl: string = await setUrl(keyword, dataType);

  return combineUrl;
};

export const collectionFetch: Function = async (url: string, keyword: string, dataType: string = 'keyword'): Promise<FetchResult> => {
  const fullUrl: string = await setUrlFollowParameter(url, keyword, dataType);

  let data: string | null;
  try {
    data = await fetchFullHtmlCode(fullUrl);
  } catch (error) {
    data = null;
  }

  return { data: data, url: fullUrl };
};
