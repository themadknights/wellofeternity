const PLAYER_MAX_HEALTH = 3;
const PLAYER_FALL_SPEED_LIMIT = 1000;
const PLAYER_VELOCITY = 300;
const PLAYER_JUMP_VELOCITY = 300;
const PLAYER_JUMP_SWIPE_THRESHOLD = 50;
export const PLAYER_SPIKE_VELOCITY = 50;

export class Player extends Phaser.Sprite {

    constructor(game, state, x, y) {
        super(game, x, y, 'player');
        this.state = state;
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.game.camera.follow(this);
        this.maxHealth = PLAYER_MAX_HEALTH;
        this.health = 1; // TODO: start with less health for testing
        this.tooFast = false;
        //Adding gamepad controller
        if(this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.input.gamepad.pad1.connected) {
            this.pad = this.game.input.gamepad.pad1;
        }
    }

    update() {
        //Checking Input
        this.body.velocity.x = 0;

        if(this.isMovingLeft()) {
            this.body.velocity.x -= PLAYER_VELOCITY;
            this.scale.setTo(-1, 1);
        }
        if(this.isMovingRight()) {
            this.body.velocity.x += PLAYER_VELOCITY;
            this.scale.setTo(1, 1);
        }

        if(this.body.velocity.y > PLAYER_FALL_SPEED_LIMIT) {
            this.tooFast = true;
        }

        if (this.canJump() && this.isJumping()) {
            this.body.velocity.y = -PLAYER_JUMP_VELOCITY;
        }

        this.body.allowGravity = true;
        // player.body.velocity.y = 0;
        this.state.physics.arcade.overlap(this, this.state.rope, function(player) {
            if (player.isGrabbingTheRope()) {
                player.disableGravity();
            }
        });
    }

    isMovingLeft() {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.A) || this.pad && (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.x < this.position.x;
    }

    isMovingRight() {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.pad && (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.x > this.position.x;
    }

    canJump() {
        return this.body.blocked.down;
    }

    isJumping() {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.pad &&
        (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.y - this.game.input.activePointer.positionDown.y < -PLAYER_JUMP_SWIPE_THRESHOLD;
    }

    isGrabbingTheRope() {
        return this.game.input.keyboard.isDown(Phaser.Keyboard.W) || this.pad &&
        (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ||
        this.game.input.activePointer.isDown;
    }

    loseHealth(health) {
        this.health -= health;
    }

    loseAllHealth() {
        this.health = 0;
    }

    isDead() {
        return this.health <= 0;
    }

    disableGravity () {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
    }
}
