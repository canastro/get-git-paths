var queryPaths = require('../src/index');

const first = queryPaths('/Users/ricardocanastro/dev/canastror', 'notfound');
first.on('data', (path) => {
    console.log('first: ', path);
});
first.on('end', () => {
    console.log('first ended');
});

const second = queryPaths('/Users/ricardocanastro/dev/canastror', 'package.json');
second.on('data', (path) => {
    console.log('second: ', path);
});
second.on('end', () => {
    console.log('second ended');
});

const third = queryPaths('/Users/ricardocanastro/dev/canastror', ['.git', 'package.json']);
third.on('data', (path) => {
    console.log('third: ', path);
});
third.on('end', () => {
    console.log('third ended');
});
