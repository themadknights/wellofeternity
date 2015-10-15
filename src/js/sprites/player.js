const PLAYER_MAX_HEALTH = 3;
const PLAYER_FALL_SPEED_LIMIT = 1000;
const PLAYER_VELOCITY = 300;

export class Player extends Phaser.Sprite {

    constructor(game, x, y) {
        super(game, x, y, 'player');
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.game.camera.follow(this);
        this.health = PLAYER_MAX_HEALTH;
        this.tooFast = false;
    }

    update() {
        this.body.velocity.x = 0;
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.body.velocity.x -= PLAYER_VELOCITY;
        }
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.body.velocity.x += PLAYER_VELOCITY;
        }

        if(this.body.velocity.y > PLAYER_FALL_SPEED_LIMIT) {
            this.tooFast = true;
        }
    }

    loseHealth(health) {
        this.health -= health;
    }

    loseAllHealth() {
        this.health = 0;
    }
}
