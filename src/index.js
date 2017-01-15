'use strict';

const path = require('path');
const events = require('events');
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
const getProjectsPaths = (currentPath, query, cb) =>
    fs.readdirAsync(currentPath).then((files) => {
        const promises = [];

        if (isMatch(files, query)) {
            return cb(currentPath);
        }

        files.forEach((file) => {
            const currentFilePath = path.join(currentPath, file);
            const promise = fs.lstatAsync(currentFilePath)
                .then((stats) => {
                    if (stats.isSymbolicLink() || !stats.isDirectory()) {
                        return null;
                    }

                    return getProjectsPaths(currentFilePath, query, cb);
                });

            promises.push(promise);
        });

        return Promise.all(promises);
    });

module.exports = function queryPaths(rootPath, query) {
    if (!rootPath || !query) {
        throw new Error('QUERY-PATHS: invalid parameters');
    }

    var eventEmitter = new events.EventEmitter();

    getProjectsPaths(rootPath, query, (path) => {
        eventEmitter.emit('data', path);
    }).then(() => {
        eventEmitter.emit('end');
    });

    return eventEmitter;
};
