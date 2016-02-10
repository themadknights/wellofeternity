const POWER_UP_VELOCITY = 100;

export class PowerUp extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'powerup');
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.bounce.set(1);
        this.body.velocity.x = (2*this.game.rnd.integerInRange(0, 1) - 1)*POWER_UP_VELOCITY;
        this.body.velocity.y = (2*this.game.rnd.integerInRange(0, 1) - 1)*POWER_UP_VELOCITY;
    }
}
