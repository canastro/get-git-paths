'use strict';

const path = require('path');
const promise = require('bluebird');
const fs = promise.promisifyAll(require('fs'));

/**
 * Recursive function that will travel down the root directory
 * gathering the ones that have a .git file
 * @method  getProjectsPaths
 * @param   {String} currentPath
 * @returns {Promise}
 */
const getProjectsPaths = (currentPath) =>
    fs.readdirAsync(currentPath).then((files) => {
        const promises = [];

        if (files.indexOf('.git') !== -1) {
            return Promise.resolve(currentPath);
        }

        files.forEach((file) => {
            const currentFilePath = path.join(currentPath, file);
            const promise = fs.statAsync(currentFilePath)
                .then((stats) => {
                    if (stats.isDirectory()) {
                        return getProjectsPaths(currentFilePath);
                    }
                });

            promises.push(promise);
        });

        return Promise.all(promises);
    });

module.exports = function getGitPaths(rootPath) {
    if (!rootPath) {
        throw new Error('GET-GIT-PATHS: no rootPath provided');
    }

    return getProjectsPaths(rootPath)
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
