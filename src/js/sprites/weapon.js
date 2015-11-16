export class Weapon extends Phaser.Sprite {
    constructor(game, owner, name) {
        super(game, owner.body.center.x + owner.width / 2, owner.body.center.y, name);
        this.anchor.setTo(0.5);
        this.game = game;
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.game.add.existing(this);
        this.owner = owner;
        this.visible = false;
        this.attackAnimation = this.animations.add('attack');
    }

    update() {
        this.scale.setTo(this.owner.scale.x, this.owner.scale.y);
        this.position.setTo(this.owner.body.center.x + this.owner.width / 2, this.owner.body.center.y);
    }

    attack() {
        this.visible = true;
        this.attackAnimation.play(10);
        this.attackAnimation.onComplete.add(() => this.visible = false);
    }
}
