const sinon = require('sinon');
const expect = require('chai').expect;
const requireUncached = require('require-uncached');
const mock = require('mock-require');

describe('index', function() {
    var sandbox;

    beforeEach(function() {
        // Create a sandbox for the test
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        // Restore all the things made through the sandbox
        sandbox.restore();
    });

    context('when no path is provided', () => {
        it('should throw error', () => {
            const queryPaths = requireUncached('../src/index');

            expect(() => queryPaths()).to.throw(/QUERY-PATHS: invalid parameters/);
        });
    });

    context('when no query is provided', () => {
        it('should throw error', () => {
            const queryPaths = requireUncached('../src/index');

            expect(() => queryPaths('test.json')).to.throw(/QUERY-PATHS: invalid parameters/);
        });
    });

    context('when a path is provided', function () {
        context('when the first directory is a git repo', function () {
            it('should return git paths', function (done) {
                const files = ['test.json', '.git'];
                const stats = {
                    isDirectory: sandbox.stub().returns(false)
                };
                const fs = {
                    readdirAsync: sandbox.stub().returns(Promise.resolve(files)),
                    lstatAsync: sandbox.stub().returns(Promise.resolve(stats))
                };

                mock('bluebird', {
                    promisifyAll: () => fs
                });

                const queryPaths = requireUncached('../src/index');

                const event = queryPaths('/', '.git');
                event.on('data', (files) => {
                    expect(files).to.deep.equal('/');
                });

                event.on('end', () => {
                    done();
                });
            });
        });

        context('when a nested directory is a git repo', () => {
            it('should return git paths', function (done) {
                const filesA = ['folderB', 'folderC', 'other.json'];
                const filesB = ['.git', 'otherB.json'];
                const filesC = ['otherB.json'];

                const readdirAsync = (currentPath) => {
                    switch (currentPath) {
                    case '/folderB':
                        return Promise.resolve(filesB);
                    case '/folderC':
                        return Promise.resolve(filesC);
                    default:
                        return Promise.resolve(filesA);
                    }
                };

                const lstatAsync = (path) => {
                    const isDirectory = ['/folderB', '/folderC'].indexOf(path) !== -1;

                    return Promise.resolve({
                        isDirectory: () => isDirectory,
                        isSymbolicLink: () => false
                    });
                };

                const fs = {
                    readdirAsync,
                    lstatAsync
                };

                mock('bluebird', {
                    promisifyAll: () => fs
                });

                const queryPaths = requireUncached('../src/index');

                const event = queryPaths('/', '.git');
                event.on('data', (files) => {
                    expect(files).to.deep.equal('/folderB');
                });

                event.on('end', () => {
                    done();
                });
            });
        });

        context('when the query has two files', () => {
            it('should return git paths', function (done) {
                const filesA = ['folderB', 'folderC', 'other.json'];
                const filesB = ['.git', 'otherB.json'];
                const filesC = ['package.json'];

                const readdirAsync = (currentPath) => {
                    switch (currentPath) {
                    case '/folderB':
                        return Promise.resolve(filesB);
                    case '/folderC':
                        return Promise.resolve(filesC);
                    default:
                        return Promise.resolve(filesA);
                    }
                };

                const lstatAsync = (path) => {
                    const isDirectory = ['/folderB', '/folderC'].indexOf(path) !== -1;

                    return Promise.resolve({
                        isDirectory: () => isDirectory,
                        isSymbolicLink: () => false
                    });
                };

                const fs = {
                    readdirAsync,
                    lstatAsync
                };

                mock('bluebird', {
                    promisifyAll: () => fs
                });

                const queryPaths = requireUncached('../src/index');

                let calls = 0;
                const event = queryPaths('/', ['.git', 'package.json']);
                event.on('data', (files) => {
                    calls++;

                    if (calls === 1) {
                        expect(files).to.deep.equal('/folderB');
                    } else {
                        expect(files).to.deep.equal('/folderC');
                    }
                });

                event.on('end', () => {
                    done();
                });
            });
        });
    });
});
