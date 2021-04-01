# Unofficial National Bibliographic Information Network Collection Crawler

[![NPM version](https://img.shields.io/npm/v/nbinet-collection-crawler.svg)](https://www.npmjs.com/package/nbinet-collection-crawler)
[![Actions status](https://github.com/FlowerEatsFish/nbinet-collection-crawler/workflows/build/badge.svg?branch=master)](https://github.com/FlowerEatsFish/nbinet-collection-crawler/actions)
[![Codecov status](https://codecov.io/gh/FlowerEatsFish/nbinet-collection-crawler/branch/master/graph/badge.svg)](https://codecov.io/gh/FlowerEatsFish/nbinet-collection-crawler/commits)
[![Scheduled status](https://travis-ci.com/FlowerEatsFish/nbinet-collection-crawler.svg?branch=master)](https://travis-ci.com/FlowerEatsFish/nbinet-collection-crawler/builds)
[![Dependencies status](https://github.com/FlowerEatsFish/nbinet-collection-crawler/workflows/dependencies-status/badge.svg?branch=master)](https://github.com/FlowerEatsFish/nbinet-collection-crawler/actions)
[![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

全國圖書書目資訊網館藏資料爬蟲

- [Unofficial National Bibliographic Information Network Collection Crawler](#Unofficial-National-Bibliographic-Information-Network-Collection-Crawler)
  - [Requirements](#Requirements)
  - [Installations](#Installations)
  - [Usage](#Usage)
    - [Node.js version 8 or higher (with full Async/Await support)](#Nodejs-version-8-or-higher-with-full-AsyncAwait-support)
    - [Others](#Others)
  - [Demo](#Demo)
    - [Commands](#Commands)
    - [Results](#Results)
  - [API documentation](#API-documentation)
    - [Input parameters](#Input-parameters)
    - [Output results](#Output-results)

## Requirements

- This construct uses XHR such as [Axios.js](https://github.com/axios/axios), so you need to care about the Cross-Origin Requests (CORS) if you use this construct in web browsers rather than Node.js.

## Installations

- NPM

```shell
npm install nbinet-collection-crawler --save
```

- Yarn

```shell
yarn add nbinet-collection-crawler
```

## Usage

### Node.js version 8 or higher (with full Async/Await support)

```javascript
const nbinetCollectionCrawler = require('nbinet-collection-crawler');

const run = async () => {
  const results = await nbinetCollectionCrawler('護理學博士教育課程規劃與評值研討會', 'keyword');
  console.log(results);
};

run();
```

### Others

```javascript
const nbinetCollectionCrawler = require('nbinet-collection-crawler');

nbinetCollectionCrawler('護理學博士教育課程規劃與評值研討會', 'keyword')
  .then(results => console.log(results));
```

## Demo

### Commands

```shell
# To download the files and install packages.
$ git clone https://github.com/FlowerEatsFish/nbinet-collection-crawler.git
$ cd nbinet-collection-crawler
$ yarn install # npm install

# To run a demo.
$ yarn start # npm start
```

### Results

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
  ],
  url: 'http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=X&searcharg=%E8%AD%B7%E7%90%86%E5%AD%B8%E5%8D%9A%E5%A3%AB%E6%95%99%E8%82%B2%E8%AA%B2%E7%A8%8B%E8%A6%8F%E5%8A%83%E8%88%87%E8%A9%95%E5%80%BC%E7%A0%94%E8%A8%8E%E6%9C%83&searchscope=1'
}
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

### Input parameters

```javascript
import nbinetCollectionCrawler from 'nbinet-collection-crawler';

const result = nbinetCollectionCrawler(
  keyword,  // string. Necessary.
            // If you set it as null, it will get an error.
  dataType, // string. Default: "keyword". Optional: "keyword", "isbn".
            // Every page only shows maximum 50 results.
            // If you enter out of optional values, it will set "keyword".
);
```

### Output results

```javascript
// If you get one result, it will return an "object".
result = {
  bookDetail: object[] | null
  [
    {
      bookKey: string | null,
      bookValue: string | null
    },
    { ... }, { ... }, ...
  ],
  collection: object[] | null
  [
    {
      library: string,
      callNumber: string,
      status: string
    },
    { ... }, { ... }, ...
  ],
  url: string,
};

// If you get two or more results, it will return an "array".
result = [
  {
    ...  // This result is the same as above.
  },
  { ... }, { ... }, ...
];

// If you have not got any result, it will return a "null".
result = null;
```
