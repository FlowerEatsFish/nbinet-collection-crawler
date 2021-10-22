/**
 * To fetch data via books.com.tw.
 */

import axios from "axios";

import { DataType } from "../index";

export interface FetchResult {
  data: string | null;
  url: string;
}

const removeLeftoverCode = (htmlCode: string): string => {
  let result = htmlCode.replace("\\t", "");
  result = result.replace("\\n", "");
  result = result.replace(/\s+/gi, " ");

  return result;
};

const setKeywordToInsertUrl = (keyword: string): string => {
  // To remove special characters
  let temp = keyword.replace(/[~!@#$%^&*()_+\-=}{[\]|"':;?/.,<>}\\]/gi, " ");
  // To remove two or more consequent spaces and replace a space with plus character
  temp = temp.replace(/\s+/, "+");
  // To remove last space
  temp = temp.replace(/\s+$/, "");

  return encodeURI(temp);
};

const setTypeToInsertUrl = (dataType: DataType): string => {
  switch (dataType) {
    case "isbn":
      return "i";
    default:
      return "X";
  }
};

const setUrl = (keyword: string, dataType: DataType): string => {
  const type = setTypeToInsertUrl(dataType);
  const arg = setKeywordToInsertUrl(keyword);

  return `http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=${type}&searcharg=${arg}&searchscope=1`;
};

const fetchFullHtmlCode = async (url: string): Promise<string | null> => {
  try {
    const response = await axios.get<string>(url);

    return removeLeftoverCode(response.data);
  } catch (error) {
    return null;
  }
};

const setUrlFollowParameter = (url: string | null, keyword: string, dataType: DataType): string => {
  return url ? url : setUrl(keyword, dataType);
};

export const collectionFetch = async (
  url: string | null,
  keyword: string = "",
  dataType: DataType = "keyword",
): Promise<FetchResult> => {
  const fullUrl = setUrlFollowParameter(url, keyword, dataType);

  return { data: await fetchFullHtmlCode(fullUrl), url: fullUrl };
};
