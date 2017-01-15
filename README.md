![build status](https://travis-ci.org/canastro/query-paths.svg?branch=master)
[![npm version](https://badge.fury.io/js/query-paths.svg)](https://badge.fury.io/js/query-paths)
[![codecov](https://codecov.io/gh/canastro/query-paths/branch/master/graph/badge.svg)](https://codecov.io/gh/canastro/query-paths)

# query-paths
Small library to get all paths that contains one or multiple file names.

## How it works
This module is a composed by a recursive function that will travel down the root directory gathering the ones that match all the query.

## Usage
```js
var queryPaths = require('../src/index');

queryPaths('/Users/username/dev', '.git')
    .then(function (response) {
        console.log('All folders with a .git file: ', response);
    });

queryPaths('/Users/username/dev', 'package.json')
    .then(function (response) {
        console.log('All folders with a package.json file: ', response);
    });

queryPaths('/Users/username/dev', ['.git', 'package.json'])
    .then(function (response) {
        console.log('All folders with a .git or package.json file: ', response);
    });
```
