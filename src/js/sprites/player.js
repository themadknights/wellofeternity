const PLAYER_MAX_HEALTH = 3;
const PLAYER_FALL_SPEED_LIMIT = 1000;
const PLAYER_VELOCITY = 200;
const PLAYER_JUMP_VELOCITY = 200;
const PLAYER_JUMP_SWIPE_THRESHOLD = 50;
const PLAYER_MOVE_TOUCH_THRESHOLD = 20;
const PLAYER_STATE_IDLE = 0;
const PLAYER_STATE_GROUND = 1;
const PLAYER_STATE_JUMPING = 2;
const PLAYER_STATE_FALLING = 3;
const PLAYER_STATE_GRABBING_THE_ROPE = 4;
const PLAYER_STATE_ATTACKING = 5;
export const PLAYER_STATE_GRABBING_THE_HOOK = 5;
export const PLAYER_SPIKE_VELOCITY = 50;

import { Weapon } from './sprites/weapon';

export class Player extends Phaser.Sprite {

    constructor(game, state, x, y) {
        super(game, x, y, 'player');
        this.gameState = state;
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.body.width -= 8;
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
        this.invulnerable = false;

        //Creating animations
        this.animations.add('movement', [4, 5, 6, 7], 10, true);

        // Create hook and hook rope
        this.createHook();

        this.weapon = new Weapon(this.game, this, 'machete');

        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        this.moving = false;
        if (this.state !== PLAYER_STATE_GRABBING_THE_HOOK && this.state !== PLAYER_STATE_ATTACKING) {
            //Checking Input
            this.body.velocity.x = 0;

            if(this.isMovingLeft()) {
                this.body.velocity.x -= PLAYER_VELOCITY;
                this.scale.setTo(-1, 1);
                this.body.allowGravity = true;
                this.moving = true;
            }
            if(this.isMovingRight()) {
                this.body.velocity.x += PLAYER_VELOCITY;
                this.scale.setTo(1, 1);
                this.body.allowGravity = true;
                this.moving = true;
            }

            if(this.moving) {
                this.play('movement');
            } else {
                this.animations.stop();
                this.frame = 0;
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

            // Shoot hook
            if(this.isShootingHook() && !this.hook.visible) {
                this.hook.reset(this.body.center.x, this.body.center.y);
                this.hook.visible = true;
                this.game.physics.arcade.moveToPointer(this.hook, 800);
            }

            // Attack with a weapon
            if(this.isAttacking() && !this.weapon.visible) {
                this.weapon.attack();
            }

            this.gameState.physics.arcade.overlap(this, this.gameState.rope, (player) => player.onOverlapRope());
            this.gameState.physics.arcade.overlap(this, this.gameState.chests, (player, chest) => player.onOverlapChest(chest));

            this.gameState.physics.arcade.collide(this.hook, this.gameState.walls, () => this.onHookSet());
        } else {
            this.gameState.physics.arcade.overlap(this, this.hook, () => this.grabHook());
        }

        if (this.hook.visible) {
            this.drawHookRope();
        }
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

    isShootingHook() {
        return this.game.input.activePointer.isDown;
    }

    isAttacking() {
        return this.spaceKey.isDown;
    }

    onOverlapRope(inputDownOnRope = false) {
        if (this.allowGrab && this.state !== PLAYER_STATE_GRABBING_THE_ROPE && (inputDownOnRope || this.isGrabbingTheRope())) {
            this.state = PLAYER_STATE_GRABBING_THE_ROPE;
            this.position.x = this.gameState.rope.x;
            this.disableGravity();
        }
    }

    onOverlapChest(chest, inputDownOnChest = false) {
        if(!chest.opened) {
            //Opening the chest and cancel player jump
            this.allowJump = false;
            if(inputDownOnChest || this.isGrabbingTheRope()) {
                chest.open();
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

    damage(amount) {
        if(!this.invulnerable) {
            this.health -= amount;
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
            this.gameState.updateHealthHud();
        }
    }

    loseAllHealth() {
        this.damage(this.health);
    }

    isDead() {
        return this.health <= 0;
    }

    disableGravity () {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
    }

    createHook () {
        this.hook = this.game.add.sprite(0, 0, 'hook');
        this.hook.visible = false;
        this.game.physics.arcade.enable(this.hook);
        this.hook.body.allowGravity = false;
        this.line = new Phaser.Line(this.position.x, this.position.y, this.hook.body.center.x, this.hook.body.center.y);
        this.rope = this.game.add.graphics(0, 0);
    }

    onHookSet () {
        this.disableGravity();
        this.hook.body.velocity.setTo(0);
        this.game.physics.arcade.moveToObject(this, this.hook, 800);
        this.state = PLAYER_STATE_GRABBING_THE_HOOK;
    }

    grabHook () {
        this.hook.visible = false;
        this.state = PLAYER_STATE_IDLE;
        this.body.velocity.y = 0;
        this.body.allowGravity = true;
        this.rope.clear();
    }

    drawHookRope () {
        this.line.setTo(this.position.x, this.position.y, this.hook.body.center.x, this.hook.body.center.y);
        this.rope.clear();
        this.rope.lineStyle(1, 0xffffff, 1);
        this.rope.moveTo(this.line.start.x, this.line.start.y);
        this.rope.lineTo(this.line.end.x, this.line.end.y);
        this.rope.endFill();
    }

    attack() {
        this.state = PLAYER_STATE_ATTACKING;
        this.weapon.attack();
    }
}
