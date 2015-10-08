export class LoadState extends Phaser.State {
    constructor() {
        super();
    }

    preload() {
        
    }

    create () {
        this.game.state.start('start');
    }
}
