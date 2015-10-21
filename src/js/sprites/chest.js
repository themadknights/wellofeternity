export class Chest extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'chest');
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);

        this.body.allowGravity = false;
    }

}
