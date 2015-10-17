export class PreloadState extends Phaser.State {
    constructor() {
        super();
    }

    init () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    }

    preload() {

    }

    create () {
        this.game.state.start('load');
    }
}
