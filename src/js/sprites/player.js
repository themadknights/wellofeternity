export class Player extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'player');
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
    }
}
