export class Enemy extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'enemy');
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);

        // Disable gravity because it's flying
        this.body.allowGravity = false;
    }
}
