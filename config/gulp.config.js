var sourceFolder = './src',
    destFolder   = './public';

module.exports = {
    folders: {
        source: sourceFolder,
        dest: destFolder
    },
    files: {
        scripts: [
            `${sourceFolder}/js/states/*.js`,
            `${sourceFolder}/js/**/*.js`
        ],
        templates: `${sourceFolder}/templates/**/*.html`,
        libs: [
            './node_modules/phaser/dist/phaser.min.js'
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
