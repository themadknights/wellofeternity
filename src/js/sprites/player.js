export const PLAYER_FALL_SPEED_LIMIT = 50;

export class Player extends Phaser.Sprite {

    constructor(game, x, y) {
        super(game, x, y, 'player');
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.health = 3;
        this.tooFast = false;
    }

    loseHealth(health) {
        this.health -= health;
    }
}
