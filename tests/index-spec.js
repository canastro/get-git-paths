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
            const getGitPaths = requireUncached('../src/index');

            function fn() {
                getGitPaths();
            };

            expect(fn).to.throw(/GET-GIT-PATHS: no rootPath provided/);
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
                    statAsync: sandbox.stub().returns(Promise.resolve(stats))
                };

                mock('bluebird', {
                    promisifyAll: () => fs
                });

                const getGitPaths = requireUncached('../src/index');

                getGitPaths('/').then((files) => {
                    expect(files).to.deep.equal(['/']);
                    done();
                });
            });
        });

        context('when a nested directory is a git repo', () => {
            it('should return git paths', function (done) {
                const filesA = ['folderB', 'folderC', 'other.json'];
                const filesB = ['.git', 'otherB.json'];
                const filesC = ['otherB.json'];

                const readdirAsync = sandbox.stub();
                readdirAsync.onCall(0).returns(Promise.resolve(filesA));
                readdirAsync.onCall(1).returns(Promise.resolve(filesB));
                readdirAsync.onCall(2).returns(Promise.resolve(filesC));

                const statAsync = sandbox.stub();
                statAsync.onCall(0).returns(Promise.resolve({ isDirectory: () => true }));
                statAsync.onCall(1).returns(Promise.resolve({ isDirectory: () => true }));
                statAsync.returns(Promise.resolve({ isDirectory: () => false }));

                const fs = {
                    readdirAsync,
                    statAsync
                };

                mock('bluebird', {
                    promisifyAll: () => fs
                });

                const getGitPaths = requireUncached('../src/index');

                getGitPaths('/').then((files) => {
                    expect(files).to.deep.equal(['/folderB']);
                    done();
                });
            });
        });
    });
});
