export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.loadingText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', "Loading...", 18);
        this.loadingText.anchor.setTo(0.5);

        this.load.image('background', 'images/sky.png');
        this.load.image('player', 'images/player.png');
        this.load.image('world', 'images/world.png');
        this.load.image('enemy', 'images/bat.png');
    }

    create () {
        this.game.state.start('start');
    }
}
