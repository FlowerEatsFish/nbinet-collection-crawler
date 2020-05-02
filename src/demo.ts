/**
 * Demo
 */

import { DataType } from "../index";
import nbinetCollection from "./index";

interface RequestParams {
  keyword: string;
  dataType: DataType;
}

const dataList: RequestParams[] = [
  { keyword: "護理學博士教育課程規劃與評值研討會", dataType: "keyword" }, // It will get one result from third layer as expected.
  { keyword: "9789867494122", dataType: "isbn" }, // It will get more results from first layer as expected.
  { keyword: "blablablablablablablablablablablabla", dataType: "keyword" }, // It will be no result.
];

const demo: Function = async (): Promise<void> => {
  for (const data of dataList) {
    await console.log(
      `>>> You search data using keyword "${data.keyword}" and type "${data.dataType}".`,
    );
    const result = await nbinetCollection(data.keyword, data.dataType);
    await console.log(result);
  }
};

demo(dataList);
