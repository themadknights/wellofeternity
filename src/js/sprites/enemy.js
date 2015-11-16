export class Enemy extends Phaser.Sprite {
    constructor(game, x, y, data) {
        super(game, x, y, 'enemy');
        // Using anchor in the middle to handle sprite flip correctly
        this.anchor.setTo(0.5);
        // Tiled anchor is on (0, 1) so it must be fixed
        this.position.subtract(this.width / 2, this.height / 2);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.attackDamage = data.attackDamage;
        this.health = data.health;
        this.body.allowGravity = false;
        this.invulnerable = false;
    }

    update () {
        if (this.body.velocity.x >= 0) {
            this.scale.setTo(1, 1);
        } else {
            this.scale.setTo(-1, 1);
        }
    }

    damage (amount) {
        if(!this.invulnerable) {
            this.health -= amount;
            if (this.health > 0) {
                this.invulnerable = true;
                let timer = this.game.time.create(this.game, true);
                this.immunityTween = this.game.add.tween(this).to({ alpha: 0 }, 0.1 * Phaser.Timer.SECOND, "Linear", true, 0, -1);
                this.immunityTween.yoyo(true, 0);
                timer.add(2*Phaser.Timer.SECOND, function() {
                    this.game.tweens.remove(this.immunityTween);
                    this.invulnerable = false;
                    this.alpha = 1;
                }, this);
                timer.start();
            } else {
                this.kill();
            }
        }
    }
}
