var sourceFolder = './src',
    destFolder   = './public';

module.exports = {
    folders: {
        source: sourceFolder,
        dest: destFolder
    },
    files: {
        scripts: `${sourceFolder}/js/**/*.js`,
        templates: `${sourceFolder}/templates/**/*.html`,
        libs: [
            './node_modules/systemjs/dist/system.js'
        ]
    },
    scripts: {
        destFolder: `${destFolder}/js`,
        outFile: 'index.js'
    },
    libs: {
        destFolder: `${destFolder}/js`,
        outFile: 'libs.js'
    },
    server: {
        root: destFolder,
        livereload: true
    }
};
