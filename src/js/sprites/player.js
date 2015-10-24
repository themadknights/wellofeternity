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
        this.health = this.maxHealth;
        this.tooFast = false;
        //Adding gamepad controller
        if(this.game.input.gamepad.supported && this.game.input.gamepad.active && this.game.input.gamepad.pad1.connected) {
            this.pad = this.game.input.gamepad.pad1;
        }
        this.allowJump = true;
        this.immune = false;
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

        this.state.physics.arcade.overlap(this, this.state.chests, function(player, chest) {
            if(!chest.open) {
                //Opening the chest and cancel player jump
                player.allowJump = false;
                if(player.isGrabbingTheRope()) {
                    chest.open = true;
                    //Spawning coins
                    let n = this.game.rnd.integerInRange(1, 5);
                    for(let i = 0; i < n; i++) {
                        let coin = this.state.coins.getFirstExists(false);
                        if(coin) {
                            coin.reset(chest.x, chest.y);
                        } else {
                            coin = this.state.coins.create(chest.x, chest.y, 'coin');
                            coin.anchor.setTo(0.5);
                        }
                        coin.allowedPickup = false;
                        let coinTimer = this.game.time.create(this.game, true);
                        coinTimer.add(1*Phaser.Timer.SECOND, function() {
                            coin.allowedPickup = true;
                        }, this);
                        coinTimer.start();
                        coin.body.bounce.set(0.9);
                        coin.body.velocity.x = this.game.rnd.between(-100, 100);
                        coin.body.velocity.y = this.game.rnd.between(-200, -50);
                    }
                    let timer = this.game.time.create(this.game, true);
                    timer.add(0.5*Phaser.Timer.SECOND, function() {
                        player.allowJump = true;
                    }, this);
                    timer.start();
                }
            }
        }, null, this);
    }

    isMovingLeft() {
        return this.game.input.keyboard.isDown(Phaser.KeyCode.A) || this.pad && (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.x < this.position.x;
    }

    isMovingRight() {
        return this.game.input.keyboard.isDown(Phaser.KeyCode.D) || this.pad && (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.x > this.position.x;
    }

    canJump() {
        return this.body.blocked.down && this.allowJump;
    }

    isJumping() {
        return this.game.input.keyboard.isDown(Phaser.KeyCode.W) || this.pad &&
        (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ||
        this.game.input.activePointer.isDown && this.game.input.activePointer.position.y - this.game.input.activePointer.positionDown.y < -PLAYER_JUMP_SWIPE_THRESHOLD;
    }

    isGrabbingTheRope() {
        return this.game.input.keyboard.isDown(Phaser.KeyCode.W) || this.pad &&
        (this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ||
        this.game.input.activePointer.isDown;
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
            this.state.updateHealthHud();
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
