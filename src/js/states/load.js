export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.load.image('background', 'images/sky.png');
        this.load.image('player', 'images/player.png');
        this.load.image('world', 'images/world.png');
        this.load.image('enemy', 'images/bat.png');
    }

    create () {
        this.game.state.start('start');
    }
}
