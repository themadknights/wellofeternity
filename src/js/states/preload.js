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
        this.game.load.bitmapFont('carrier_command', 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    }

    create () {
        this.game.state.start('load');
    }
}
