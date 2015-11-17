export class WallTrap extends Phaser.Sprite {
    constructor(game, state, y) {
        let l = game.rnd.integerInRange(0, 1);
        super(game, l*640, y, 'walltrap');
        this.ammo = true;
        this.gameState = state;
        this.anchor.setTo(l, 1);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.body.width = 600;
    }

    fire() {
        if(this.ammo) {
            this.ammo = false;
            let projectile = this.gameState.projectiles.getFirstExists(false);
            if(projectile) {
                projectile.reset(this.x, this.y + this.height/2);
            } else {
                projectile = this.gameState.projectiles.create(this.x, this.y + this.height/2, 'projectile');
                projectile.anchor.setTo(0.5);
            }
            projectile.body.allowGravity = false;
            projectile.body.velocity.x = (320 - this.x);
        }
    }
}
