export class Enemy extends Phaser.Sprite {
    constructor(game, x, y, damage = 1) {
        super(game, x, y, 'enemy');
        // Using anchor in the middle to handle sprite flip correctly
        this.anchor.setTo(0.5);
        // Tiled anchor is on (0, 1) so it must be fixed
        this.position.subtract(this.width / 2, this.height / 2);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.damage = damage;
        this.body.allowGravity = false;
    }

    update () {
        if (this.body.velocity.x >= 0) {
            this.scale.setTo(1, 1);
        } else {
            this.scale.setTo(-1, 1);
        }
    }
}
