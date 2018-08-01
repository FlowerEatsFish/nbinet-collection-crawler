/**
 * Demo
 */

// tslint:disable-next-line:import-name
import bookCollection from './index';

interface IDataType {
  keyword: string;
  dataType: string;
}

const dataList: IDataType[] = [
  { keyword: '9789867364739', dataType: 'isbn' }, // It will get one result from third layer as expected.
  { keyword: '等一個人咖啡', dataType: 'keyword' }, // It will get more results from second layer as expected.
  { keyword: '9789867494122', dataType: 'isbn' }, // It will get more results from first layer as expected.
  { keyword: 'blablablablablablablablablablablabla', dataType: 'keyowrd' } // It will be no result.
];

const demo: Function = async (): Promise<void> => {
  for (const data of dataList) {
    await console.log(`>>> You search data using keyword "${data.keyword}" and type "${data.dataType}".`);
    await bookCollection(data.keyword, data.dataType);
  }
};

demo(dataList);
