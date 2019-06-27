# Unofficial National Bibliographic Information Network Collection API

[![NPM version](https://img.shields.io/npm/v/@flowereatfish/nbinet-collection-api.svg)](https://www.npmjs.com/package/@flowereatfish/nbinet-collection-api)
[![Travis-CI status](https://travis-ci.com/FlowerEatFish/nbinet-collection-api.svg?branch=master)](https://travis-ci.com/FlowerEatFish/nbinet-collection-api/builds)
[![AppVeyor status](https://ci.appveyor.com/api/projects/status/9h1kkwly756i4hf3/branch/master?svg=true)](https://ci.appveyor.com/project/FlowerEatFish/nbinet-collection-api/history)
[![Codecov status](https://codecov.io/gh/FlowerEatFish/nbinet-collection-api/branch/master/graph/badge.svg)](https://codecov.io/gh/FlowerEatFish/nbinet-collection-api/commits)
[![Dependencies status](https://david-dm.org/FlowerEatFish/nbinet-collection-api/status.svg)](https://david-dm.org/FlowerEatFish/nbinet-collection-api)
[![Code style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

非官方全國圖書書目資訊網 API

- [Unofficial National Bibliographic Information Network Collection API](#Unofficial-National-Bibliographic-Information-Network-Collection-API)
  - [Requirement](#Requirement)
  - [Installation](#Installation)
  - [Usage](#Usage)
    - [Node.js version 8 or higher (with full Async/Await support)](#Nodejs-version-8-or-higher-with-full-AsyncAwait-support)
    - [Others](#Others)
  - [Demo](#Demo)
    - [Commands](#Commands)
    - [Results](#Results)
  - [API documentation](#API-documentation)
    - [Input parameters](#Input-parameters)
    - [Output results](#Output-results)

## Requirement

This construct uses [Axios.js](https://github.com/axios/axios), so you need to care the Cross-Origin Requests (CORS).

## Installation

```shell
npm install @flowereatfish/nbinet-collection-api --save
```

## Usage

### Node.js version 8 or higher (with full Async/Await support)

```javascript
const nbinetCollectionApi = require('@flowereatfish/nbinet-collection-api');

const run = async () => {
  const results = await nbinetCollectionApi('護理學博士教育課程規劃與評值研討會', 'keyword');
  console.log(results);
};

run();
```

### Others

```javascript
const nbinetCollectionApi = require('@flowereatfish/nbinet-collection-api');

nbinetCollectionApi('護理學博士教育課程規劃與評值研討會', 'keyword')
  .then(results => console.log(results));
```

## Demo

### Commands

```shell
# To download the files and install packages.
$ git clone https://github.com/FlowerEatFish/nbinet-collection-api.git
$ cd nbinet-collection-api
$ npm install

# To run a demo.
$ npm start
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
  ]
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
import nbinetCollectionApi from '@flowereatfish/nbinet-collection-api';

const result = nbinetCollectionApi(
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
};

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
