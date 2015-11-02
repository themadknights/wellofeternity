export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.loadingText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', "Loading...", 18);
        this.loadingText.anchor.setTo(0.5);

        this.load.image('background', 'images/background.png');
        this.load.image('player', 'images/player.png');
        this.load.image('world', 'images/platform.png');
        this.load.image('enemy', 'images/bat.png');
        this.load.image('rope', 'images/rope.png');
        this.load.spritesheet('chest', 'images/chest.png', 64, 32, 2);
        this.load.image('wall', 'images/wall.png');
        this.load.image('coin', 'images/coin.png');
        this.load.image('hook', 'images/hook.png');

        this.load.json('presets', 'json/presets.json');

        this.load.spritesheet('health_icons', 'images/health_icons.png', 16, 16, 2);
    }

    create () {
        this.game.state.start('start');
    }
}
