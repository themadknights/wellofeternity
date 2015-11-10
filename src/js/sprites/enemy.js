export class Enemy extends Phaser.Sprite {
    constructor(game, x, y, damage = 1) {
        super(game, x, y, 'enemy');
        this.anchor.setTo(0, 1);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.damage = damage;
        // Disable gravity because it's flying
        this.body.allowGravity = false;

        // Start patrol behavior by default
        // TODO: using constants or as a difficulty params
        this.startPatrolBehavior(this.x + (this.x < 320?1:-1)*(100 + this.game.rnd.integerInRange(0, 100)), 1000);
    }

    // Patrols between current position covering a distance (px) in time (ms)
    startPatrolBehavior(distance, time) {
        // Create a patrol behavior using a simple yoyo tween
        this.movementTween = this.game.add.tween(this).to({ x: distance }, time, "Linear", true, 0, -1);
        this.movementTween.yoyo(true, 0);
    }
}
