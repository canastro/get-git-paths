'use strict';

const path = require('path');
const promise = require('bluebird');
const fs = promise.promisifyAll(require('fs'));

/**
 * Validates if the current list of files matches the query
 * @method  isMatch
 * @param   {Array}         files
 * @param   {String|Array}  query
 * @returns {Boolean}
 */
const isMatch = (files, query) => {
    if (Array.isArray(query)) {
        return query.some(item => files.indexOf(item) !== -1);
    }

    return files.indexOf(query) !== -1;
};

/**
 * Recursive function that will travel down the root directory
 * gathering the ones that have a `${query}` file
 * @method  getProjectsPaths
 * @param   {String} currentPath
 * @param   {String} query
 * @returns {Promise}
 */
const getProjectsPaths = (currentPath, query) =>
    fs.readdirAsync(currentPath).then((files) => {
        const promises = [];

        if (isMatch(files, query)) {
            return Promise.resolve(currentPath);
        }

        files.forEach((file) => {
            const currentFilePath = path.join(currentPath, file);
            const promise = fs.statAsync(currentFilePath)
                .then((stats) => {
                    if (stats.isDirectory()) {
                        return getProjectsPaths(currentFilePath, query);
                    }
                });

            promises.push(promise);
        });

        return Promise.all(promises);
    });

module.exports = function getGitPaths(rootPath, query) {
    if (!rootPath || !query) {
        throw new Error('GET-GIT-PATHS: invalid parameters');
    }

    return getProjectsPaths(rootPath, query)
        .then((files) => {
            if (!Array.isArray(files)) {
                files = [files];
            }

            return files;
        })
        .then((files) => {
            return files.filter((file) => {
                // If a nested folder is a leaf folder it will return a array
                // with undefined in it, because we're returning a Promises.all
                // with a return undefined inside
                if (Array.isArray(file)) {
                    return false;
                }

                return !!file;
            });
        });
};
