# Unofficial National Bibliographic Information Network API

[![Travis-CI status](https://travis-ci.com/FlowerEatFish/nbinet-api.svg?branch=master)](https://travis-ci.com/FlowerEatFish/nbinet-api/builds)
[![AppVeyor status](https://ci.appveyor.com/api/projects/status/uwap6s2c4ga8x4jl/branch/master?svg=true)](https://ci.appveyor.com/project/FlowerEatFish/nbinet-api/history)
[![Dependencies status](https://david-dm.org/FlowerEatFish/nbinet-api/status.svg)](https://david-dm.org/FlowerEatFish/nbinet-api)
[![Code style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Requirements

- This construct uses Async/Await methods, so you need to run [polyfill.js](https://polyfill.io/v2/docs/) first.

- This construct uses [Axios.js](https://github.com/axios/axios), so you need to care the Cross-Origin Requests (CORS).

## Demo

- Commands:

  ```shell
  # To download the files and install packages.
  $ git clone https://github.com/FlowerEatFish/nbinet-api.git
  $ cd nbinet-api
  $ npm install

  # To run a demo.
  $ npm start
  ```

- Results:

  ```shell
  >>> You search data using keyword "護理學博士教育課程規劃與評值研討會" and type "keyword".

  {
    bookDetail: [
      { bookKey: '題名', bookValue: '護理學博士教育課程規劃與評值研討會 = The Curriculum Design and Evaluation of Doctoral Program in Nursing / 臺北醫學大學護理學院主辦; 臺灣護理教育學會等協辦' },
      { bookKey: '出版項', bookValue: '2008' },
      { bookKey: '出版項', bookValue: '[臺北市 : 臺北醫學大學護理學院, 民97.04]' },
      { bookKey: '面數高廣', bookValue: '123面 : 圖 ; 30公分' },
      { bookKey: '國際標準書號', bookValue: '平裝' },
      { bookKey: '附註', bookValue: '主要內容為英文' },
      { bookKey: '附註', bookValue: '含參考書目' },
      { bookKey: '標題', bookValue: '護理學' },
      { bookKey: '標題', bookValue: '高等教育' },
      { bookKey: '標題', bookValue: '課程規劃設計' },
      { bookKey: '標題', bookValue: '會議' },
      { bookKey: '其他著者', bookValue: '臺北醫學大學 護理學院' },
      { bookKey: '其他著者', bookValue: '臺灣護理教育學會' },
      { bookKey: '其他著者', bookValue: '護理學博士教育課程規劃與評值研討會 (民97 臺北醫學大學)' },
      { bookKey: '其他題名', bookValue: 'The Curriculum Design and Evaluation of Doctoral Program in Nursing' },
      { bookKey: '其他題名', bookValue: '護理學博士教育課程規劃與評值研討會會議手冊' }
    ],
    collection: [
      {
        library: '國家圖書館',
        callNumber: '419.63 8646 97 ',
        status: '依各館館藏為準'
      }
    ]
  }
  ```

  ```shell
  >>> You search data using keyword "等一個人咖啡" and type "keyword".

  [
    {
      bookDetail: [ {...}, {...}, ... ],
      collection: [ {...}, {...}, ... ]
    },
    { ... }, { ... }, ...
  ] # Array.prototype.length <= 50
  ```

  ```shell
  >>> You search data using keyword "9789867494122" and type "isbn".

  [
    {
      bookDetail: [ {...}, {...}, ... ],
      collection: [ {...}, {...}, ... ]
    },
    { ... }, { ... }, ...
  ] # Array.prototype.length <= 50
  ```

  ```shell
  >>> You search data using keyword "blablablablablablablablablablablabla" and type "keyowrd".

  null
  ```

## API documentation

### Input parameters you want to search for information

  ```js
  import NbinetCollectionApi from 'nbinet-collection-api.development'; // Here uses development mode as an example

  const result = NbinetCollectionApi(
    keyword, // string. Necessary.
             // If you configs it as null, it will get an error.
    dataType, // string. Default: "keyword". Optional: "keyword", "isbn".
              // Every page only shows maximum 50 results.
              // If you enter out of optional values, it will set "keyword".
  )
  ```

### Output results you get from input parameters

> The program only exports the results from third layer page as default, so the results from first and second layer pages do not show here.

  ```js
  // If you get one result, it will return an "object".
  result = {
    bookDetail: object[] or null
    [
      {
        bookKey: string,
        bookValue: string
      },
      { ... }, { ... }, ...
    ],
    collection: object[] or null
    [
      {
        library: string,
        callNumber: string,
        status: string
      },
      { ... }, { ... }, ...
    ]
  }

  // If you get two or more results, it will return an "array".
  result = [
    {
      ...  // This result is the same as above.
    },
    ...
  ];

  // If you have not got any result, it will return a "null".
  result = null;
  ```
