export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        this.game.load.image('background', '/images/sky.png');
        this.game.load.image('player', '/images/player.png');
    }

    create () {
        this.game.state.start('start');
    }
}
