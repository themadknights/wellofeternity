export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.loadingText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', "Loading...", 18);
        this.loadingText.anchor.setTo(0.5);

        this.load.image('background', 'images/background.png');
        this.load.spritesheet('player', 'images/player.png', 32, 48, 16);
        this.load.image('world', 'images/platform.png');
        this.load.image('enemy', 'images/bat.png');
        this.load.image('rope', 'images/rope.png');
        this.load.spritesheet('chest', 'images/chest.png', 64, 38, 2);
        this.load.spritesheet('machete', 'images/machete.png', 32, 48, 4);
        this.load.image('wall', 'images/wall.png');
        this.load.image('coin', 'images/coin.png');
        this.load.image('hook', 'images/hook.png');
        this.load.image('walltrap', 'images/walltrap.png');
        this.load.image('projectile', 'images/arrow.png');

        this.load.json('presetTest01', 'json/preset_test_01.json');
        this.load.json('preset01', 'json/preset01.json');
        this.load.json('preset02', 'json/preset02.json');
        this.load.json('preset03', 'json/preset03.json');

        this.load.spritesheet('health_icons', 'images/health_icons.png', 16, 16, 2);
    }

    create () {
        this.game.state.start('start');
    }
}
