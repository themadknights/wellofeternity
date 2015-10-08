import { Player } from './sprites/player';

export class StartState extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        this.background = this.game.add.image(0, 0, 'background');
        this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);
    }
}
