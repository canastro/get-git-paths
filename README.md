![build status](https://travis-ci.org/canastro/get-git-paths.svg?branch=master)
[![npm version](https://badge.fury.io/js/get-git-paths.svg)](https://badge.fury.io/js/get-git-paths)
[![codecov](https://codecov.io/gh/canastro/get-git-paths/branch/master/graph/badge.svg)](https://codecov.io/gh/canastro/get-git-paths)

# get-git-paths
Small library to get all git paths in a given root path.

## How it works
This module is a composed by a recursive function that will travel down the root directory gathering the ones that have a .git file.

## Usage
```js
var getGitPaths = require('../src/index');

getGitPaths('/Users/username/dev')
    .then(function (response) {
        console.log(response);
    });
```
