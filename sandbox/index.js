var queryPaths = require('../src/index');

queryPaths('/Users/ricardocanastro/dev/canastror/gin', '.git').then(function (response) {
    console.log('git:: ', response);
});

queryPaths('/Users/ricardocanastro/dev/canastror/gin', 'package.json').then(function (response) {
    console.log('package.json:: ', response);
});

queryPaths('/Users/ricardocanastro/dev/canastror/gin', ['package.json', '.git']).then(function (response) {
    console.log('package.json or .git:: ', response);
});
