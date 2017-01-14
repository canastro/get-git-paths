var getGitPaths = require('../src/index');

getGitPaths('/Users/ricardocanastro/dev/canastror/gin').then(function (response) {
    console.log(response);
});
