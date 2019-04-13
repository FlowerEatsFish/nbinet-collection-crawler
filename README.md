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
  >>> You search data using http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=X&searcharg=%E8%AD%B7%E7%90%86%E5%AD%B8%E5%8D%9A%E5%A3%AB%E6%95%99%E8%82%B2%E8%AA%B2%E7%A8%8B%E8%A6%8F%E5%8A%83%E8%88%87%E8%A9%95%E5%80%BC%E7%A0%94%E8%A8%8E%E6%9C%83&searchscope=1
  >>> The initial HTML code get from third layer page.

  # The results collected from third layer are as follows and return it:
  { bookDetail:
    [ { bookKey: '題名', bookValue: '護理學博士教育課程規劃與評值研討會 = The Curriculum Design and Evaluation of Doctoral Program in Nursing / 臺北醫學大學護理學院主辦; 臺灣護理教育學會等協辦' },
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
      { bookKey: '其他題名', bookValue: '護理學博士教育課程規劃與評值研討會會議手冊' } ],
    collection:
    [ { library: '國家圖書館',
        callNumber: '419.63 8646 97 ',
        status: '依各館館藏為準' } ] }
  ```

  ```shell
  >>> You search data using keyword "等一個人咖啡" and type "keyword".
  >>> You search data using http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=X&searcharg=%E7%AD%89%E4%B8%80%E5%80%8B%E4%BA%BA%E5%92%96%E5%95%A1&searchscope=1
  >>> The initial HTML code get from second layer page.

  # Here will show results collected from second layer but don't return it.
  [ {
      library: '1 copy available at (CIP新書書訊)',
      title: '等一個人咖啡 / 九把刀著',
      url: 'http://nbinet3.ncl.edu.tw/search~S1*cht?/X{u7B49}{u4E00}{u500B}{u4EBA}{u5496}{u5561}&searchscope=1&SORT=D/X{u7B49}{u4E00}{u500B}{u4EBA}{u5496}{u5561}&searchscope=1&SORT=D&SUBKEY=%E7%AD%89%E4%B8%80%E5%80%8B%E4%BA%BA%E5%92%96%E5%95%A1/1%2C68%2C68%2CB/frameset&FF=X{u7B49}{u4E00}{u500B}{u4EBA}{u5496}{u5561}&searchscope=1&SORT=D&1%2C1%2C'
    },
    { library: '1 copy available at (ISBN新書書訊)',
      title: '等一個人咖啡(簡體字版) / 九把刀作',
      url: 'http://nbinet3.ncl.edu.tw/search~S1*cht?/X{u7B49}{u4E00}{u500B}{u4EBA}{u5496}{u5561}&searchscope=1&SORT=D/X{u7B49}{u4E00}{u500B}{u4EBA}{u5496}{u5561}&searchscope=1&SORT=D&SUBKEY=%E7%AD%89%E4%B8%80%E5%80%8B%E4%BA%BA%E5%92%96%E5%95%A1/1%2C68%2C68%2CB/frameset&FF=X{u7B49}{u4E00}{u500B}{u4EBA}{u5496}{u5561}&searchscope=1&SORT=D&2%2C2%2C'
    },
    { ... }, { ... }, ...
  ]

  [ {...}, {...}, ... ] # Here will show results collected from third layer and return it.
                        # Array.length <= 50
  ```

  ```shell
  >>> You search data using keyword "9789867494122" and type "isbn".
  >>> You search data using http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=i&searcharg=9789867494122&searchscope=1
  >>> The initial HTML code get from first layer page.

  # Here will show results collected from first layer but don't return it.
  [ {
      url: 'http://nbinet3.ncl.edu.tw/search~S1*cht?/i9789867494122/i9789867494122/1%2C2%2C7%2CE/2exact&FF=i9789867494122&1%2C3%2C',
      library: [ '中原大學圖書館', '中國文化大學圖書館', '中國醫藥大學圖書館', '元智大學圖書館', '文藻外語大學圖書館', '世新大學圖書館', '佛光人文社會學院圖書館', '育達科技大學家聲紀念圖書館', ... ]
    },
    { url: 'http://nbinet3.ncl.edu.tw/search~S1*cht?/i9789867494122/i9789867494122/1%2C2%2C7%2CE/2exact&FF=i978986749412205{213c63}13{215765}&1%2C4%2C',
      library: [ '世新大學圖書館', '國立屏東大學圖書館', '國立成功大學圖書館', '臺北市立圖書館', '國立臺北護理健康大學圖書館', '國立高雄科技大學圖書館(建工/燕巢校區)', '國立臺灣師範大學圖書館', '淡江大學圖書館', ... ]
    }
  ]

  [ {...}, {...}, ... ] # Here will show results collected from second layer but don't return it.

  [ {...}, {...}, ... ] # Here will show results collected from third layer and return it.
                        # Array.length <= 50
  ```

  ```shell
  >>> You search data using keyword "blablablablablablablablablablablabla" and type "keyowrd".
  >>> You search data using http://nbinet3.ncl.edu.tw/search~S1*cht/?searchtype=X&searcharg=blablablablablablablablablablablabla&searchscope=1
  >>> No result is got from the HTML code.

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
