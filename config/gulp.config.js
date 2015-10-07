var sourceFolder = './src',
    destFolder   = './public';

module.exports = {
    folders: {
        source: sourceFolder,
        dest: destFolder
    },
    files: {
        scripts: `${sourceFolder}/js/**/*.js`,
        templates: `${sourceFolder}/templates/**/*.html`
    },
    scripts: {
        destFolder: `${destFolder}/js`,
        outFile: 'index.js'
    },
    server: {
        root: destFolder,
        livereload: true
    }
};
