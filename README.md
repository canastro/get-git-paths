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

const first = queryPaths('/Users/username/dev', 'notfound');
first.on('data', (path) => {
    console.log('first: ', path);
});
first.on('end', () => {
    console.log('first ended');
});

const second = queryPaths('/Users/username/dev', 'package.json');
second.on('data', (path) => {
    console.log('second: ', path);
});
second.on('end', () => {
    console.log('second ended');
});

const third = queryPaths('/Users/username/dev', ['.git', 'package.json']);
third.on('data', (path) => {
    console.log('third: ', path);
});
third.on('end', () => {
    console.log('third ended');
});
```
