export class WallTrap extends Phaser.Sprite {
    constructor(game, state, y) {
        let l = game.rnd.integerInRange(0, 1);
        super(game, l*640, y, 'walltrap');
        this.gameState = state;
        this.anchor.setTo(l, 1);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.width = 600;
    }
}
