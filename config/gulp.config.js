var sourceFolder = 'src',
    destFolder   = 'public',
    configFolder = 'config';

module.exports = {
    folders: {
        source: sourceFolder,
        dest: destFolder
    },
    files: {
        scripts: [
            `${sourceFolder}/js/utils.js`,
            `${sourceFolder}/js/sprites/weapon.js`,
            `${sourceFolder}/js/sprites/hook.js`,
            `${sourceFolder}/js/sprites/enemy.js`,
            `${sourceFolder}/js/sprites/**/*.js`,
            `${sourceFolder}/js/map.js`,
            `${sourceFolder}/js/ui/**/*.js`,
            `${sourceFolder}/js/states/**/*.js`,
            `${sourceFolder}/js/**/*.js`
        ],
        templates: `${sourceFolder}/templates/**/*.html`,
        libs: [
            'node_modules/phaser/dist/phaser.js',
            'node_modules/stats.js/build/stats.min.js'
        ],
        styles: `${sourceFolder}/styles/**/*.css`,
        images: `${sourceFolder}/images/**/*.*`,
        sounds: `${sourceFolder}/sounds/**/*.*`,
        json: `${sourceFolder}/json/**/*.*`,
        fonts: `${sourceFolder}/fonts/**/*.*`,
        cname: `${configFolder}/CNAME`
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
    sounds: {
        destFolder: `${destFolder}/sounds`
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
