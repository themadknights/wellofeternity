var sourceFolder = 'src',
    destFolder   = 'public';

module.exports = {
    folders: {
        source: sourceFolder,
        dest: destFolder
    },
    files: {
        scripts: [
            `${sourceFolder}/js/utils.js`,
            `${sourceFolder}/js/sprites/enemy.js`,
            `${sourceFolder}/js/sprites/**/*.js`,
            `${sourceFolder}/js/states/*.js`,
            `${sourceFolder}/js/**/*.js`
        ],
        templates: `${sourceFolder}/templates/**/*.html`,
        libs: [
            'node_modules/phaser/dist/phaser.min.js'
        ],
        styles: `${sourceFolder}/styles/**/*.css`,
        images: `${sourceFolder}/images/**/*.*`,
        json: `${sourceFolder}/json/**/*.*`,
        fonts: `${sourceFolder}/fonts/**/*.*`
    },
    scripts: {
        destFolder: `${destFolder}/js`,
        outFile: 'index.js'
    },
    libs: {
        destFolder: `${destFolder}/js`,
        outFile: 'libs.js'
    },
    styles: {
        destFolder: `${destFolder}/css`,
        outFile: 'index.css'
    },
    images: {
        destFolder: `${destFolder}/images`
    },
    json: {
        destFolder: `${destFolder}/json`
    },
    fonts: {
        destFolder: `${destFolder}/fonts`
    },
    server: {
        root: destFolder,
        livereload: true
    }
};
