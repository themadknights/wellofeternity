export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.loadingText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', "Loading...", 18);
        this.loadingText.anchor.setTo(0.5);

        this.load.image('tmkLogo', 'images/TMKSquareG.png');
        this.load.image('background', 'images/background.png');
        this.load.spritesheet('player', 'images/player.png', 32, 48, 20);
        this.load.image('world', 'images/platform.png');
        this.load.image('enemy', 'images/bat.png');
        this.load.image('rope', 'images/rope.png');
        this.load.spritesheet('chest', 'images/chest.png', 64, 38, 2);
        this.load.spritesheet('machete', 'images/machete.png', 32, 48, 4);
        this.load.image('wall', 'images/wall.png');
        this.load.spritesheet('coin', 'images/coin.png', 32, 32, 5);
        this.load.image('hook', 'images/hook.png');
        this.load.image('walltrap', 'images/walltrap.png');
        this.load.image('projectile', 'images/arrow.png');

        this.load.json('presetTest01', 'json/preset_test_01.json');
        this.load.json('preset01', 'json/preset01.json');
        this.load.json('preset02', 'json/preset02.json');
        this.load.json('preset03', 'json/preset03.json');

        this.load.audio('jumpFx', 'sounds/jump.wav');
        this.load.audio('floorFx', 'sounds/floor.wav');
        this.load.audio('stepFx', 'sounds/step.wav');
        this.load.audio('coinFx', 'sounds/coin.wav');

        this.load.spritesheet('health_icons', 'images/health_icons.png', 16, 16, 2);
    }

    create () {
        let defaultState = 'level';

        // @if NODE_ENV='production'
        defaultState = 'publisher';
        // @endif
        
        this.game.state.start(defaultState, true, false);
    }
}
