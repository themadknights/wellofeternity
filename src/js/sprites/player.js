const PLAYER_MAX_HEALTH = 3;
const PLAYER_FALL_SPEED_LIMIT = 1000;
const PLAYER_VELOCITY = 200;
const PLAYER_JUMP_VELOCITY = 200;
const PLAYER_JUMP_SWIPE_THRESHOLD = 50;
const PLAYER_MOVE_TOUCH_THRESHOLD = 20;
const PLAYER_STATE_GROUND = 0;
const PLAYER_STATE_JUMPING = 1;
const PLAYER_STATE_FALLING = 2;
const PLAYER_STATE_GRABBING_THE_ROPE = 3;
export const PLAYER_SPIKE_VELOCITY = 50;

export class Player extends Phaser.Sprite {

    constructor(game, state, x, y) {
        super(game, x, y, 'player');
        this.gameState = state;
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.game.camera.follow(this);
        this.maxHealth = PLAYER_MAX_HEALTH;
        this.health = this.maxHealth;
        this.tooFast = false;
        //Adding gamepad controller
        if(this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.input.gamepad.pad1.connected) {
            this.pad = this.game.input.gamepad.pad1;
        }
        this.allowJump = true;
        this.allowGrab = true;
        this.immune = false;

        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    }

    update() {
        //Checking Input
        this.body.velocity.x = 0;

        if(this.isMovingLeft()) {
            this.body.velocity.x -= PLAYER_VELOCITY;
            this.scale.setTo(-1, 1);
            this.body.allowGravity = true;
        }
        if(this.isMovingRight()) {
            this.body.velocity.x += PLAYER_VELOCITY;
            this.scale.setTo(1, 1);
            this.body.allowGravity = true;
        }

        if (this.state !== PLAYER_STATE_GRABBING_THE_ROPE) {
            if (this.canJump() && this.isJumping()) {
                this.body.velocity.y = -PLAYER_JUMP_VELOCITY;
                this.allowGrab = false;
                this.wKey.onUp.addOnce(() => this.allowGrab = true);
            }
        }

        // Check player velocity in y to set his state
        if(this.body.velocity.y < 0) {
            this.state = PLAYER_STATE_JUMPING;
        } else if(this.body.velocity.y > 0) {
            if (this.body.velocity.y > PLAYER_FALL_SPEED_LIMIT) {
                this.tooFast = true;
            }
            this.state = PLAYER_STATE_FALLING;
        } else if (this.body.blocked.down) {
            this.state = PLAYER_STATE_GROUND;
        }

        this.gameState.physics.arcade.overlap(this, this.gameState.rope, (player) => player.onOverlapRope());
        this.gameState.physics.arcade.overlap(this, this.gameState.chests, (player, chest) => player.onOverlapChest(chest));
    }

    isMovingLeft() {
        return this.game.input.keyboard.isDown(Phaser.KeyCode.A) || this.pad && (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.x < this.position.x && Math.abs( this.game.input.activePointer.position.x - this.position.x) > PLAYER_MOVE_TOUCH_THRESHOLD;
    }

    isMovingRight() {
        return this.game.input.keyboard.isDown(Phaser.KeyCode.D) || this.pad && (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.x > this.position.x && Math.abs( this.game.input.activePointer.position.x - this.position.x) > PLAYER_MOVE_TOUCH_THRESHOLD;
    }

    canJump() {
        return this.body.blocked.down && this.allowJump;
    }

    isJumping() {
        return this.wKey.isDown || this.pad &&
        (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.y - this.game.input.activePointer.positionDown.y < -PLAYER_JUMP_SWIPE_THRESHOLD;
    }

    onOverlapRope(inputDownOnRope = false) {
        if (this.allowGrab && this.state !== PLAYER_STATE_GRABBING_THE_ROPE && (inputDownOnRope || this.isGrabbingTheRope())) {
            this.state = PLAYER_STATE_GRABBING_THE_ROPE;
            this.position.x = this.gameState.rope.x;
            this.disableGravity();
        }
    }

    onOverlapChest(chest, inputDownOnChest = false) {
        if(!chest.open) {
            //Opening the chest and cancel player jump
            this.allowJump = false;
            if(inputDownOnChest || this.isGrabbingTheRope()) {
                chest.open = true;
                chest.spawnCoins();
                let timer = this.game.time.create(this.game, true);
                timer.add(0.5*Phaser.Timer.SECOND, function() {
                    this.allowJump = true;
                }, this);
                timer.start();
            }
        }
    }

    isGrabbingTheRope() {
        return this.wKey.isDown || this.pad &&
        (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1);
    }

    loseHealth(health) {
        if(!this.immune) {
            this.health -= health;
            this.immune = true;
            let timer = this.game.time.create(this.game, true);
            this.immunityTween = this.game.add.tween(this).to({ visible: false }, 0.01 * Phaser.Timer.SECOND, "Linear", true, 0, -1);
            this.immunityTween.yoyo(true, 0);
            timer.add(2*Phaser.Timer.SECOND, function() {
                this.game.tweens.remove(this.immunityTween);
                this.immune = false;
                this.visible = true;
            }, this);
            timer.start();
            this.gameState.updateHealthHud();
        }
    }

    loseAllHealth() {
        this.loseHealth(this.health);
    }

    isDead() {
        return this.health <= 0;
    }

    disableGravity () {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
    }
}
