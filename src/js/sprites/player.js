const PLAYER_MAX_HEALTH = 3;
const PLAYER_FALL_SPEED_LIMIT = 600;
const PLAYER_VELOCITY = 200;
const PLAYER_JUMP_VELOCITY = 200;
const PLAYER_STATE_IDLE = 0;
const PLAYER_STATE_GROUND = 1;
const PLAYER_STATE_JUMPING = 2;
const PLAYER_STATE_FALLING = 3;
const PLAYER_STATE_GRABBING_THE_ROPE = 4;
const PLAYER_STATE_ATTACKING = 5;
const PLAYER_SLIDE_VELOCITY = 100;
export const PLAYER_STATE_GRABBING_THE_HOOK = 5;
export const PLAYER_SPIKE_VELOCITY = 50;

import { Weapon } from './sprites/weapon';
import { Hook } from './sprites/hook';

export class Player extends Phaser.Sprite {

    constructor(game, state, x, y) {
        super(game, x, y, 'player');
        this.gameState = state;
        this.anchor.setTo(0.5);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.body.width -= 8;
        this.body.height -= 8;
        this.body.offset.y = 4;
        this.game.camera.follow(this);
        this.maxHealth = PLAYER_MAX_HEALTH;
        this.health = this.maxHealth;
        this.tooFast = false;
        this.invulnerable = false;
        this.movementFrozen = false;

        //Creating animations
        this.animations.add('movement', [4, 5, 6, 7], 10, true);
        this.animations.add('jump', [8, 9, 10, 11], 6, false);
        this.animations.add('fall', [12, 13], 5, true);
        this.animations.add('hardfall', [16, 17], 5, true);

        //Creating sounds
        this.jumpFx = this.game.add.audio('jumpFx');
        this.jumpFx.volume = 0.1;
        this.floorFx = this.game.add.audio('floorFx');
        this.floorFx.volume = 0.1;
        this.stepFx = this.game.add.audio('stepFx', true);
        this.stepFx.volume = 0.05;

        this.weapon = new Weapon(this.game, this, 'machete');
        this.hook = new Hook(this.game, this);

        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        // Check movementFrozen to prevent any action which modify player velocity
        if (!this.movementFrozen) {
            // Check if player is moving and set x velocity properly
            this.body.velocity.x = 0;

            if(this.aKey.isDown) {
                this.body.velocity.x -= PLAYER_VELOCITY;
                this.scale.setTo(-1, 1);
            }

            if(this.dKey.isDown) {
                this.body.velocity.x += PLAYER_VELOCITY;
                this.scale.setTo(1, 1);
            }

            // Play movement animation if player is moving
            if (this.body.velocity.x !== 0) {
                this.enableGravity();
                this.play('movement');
                if(!this.stepFx.isPlaying) {
                    this.stepFx.play();
                }
            } else {
                this.animations.stop();
                this.stepFx.stop();
                this.frame = 0;
            }

            // Check if player is falling and play correct animation
            if (this.body.velocity.y > PLAYER_FALL_SPEED_LIMIT) {
                this.tooFast = true;
                this.play('hardfall');
            } else if (!this.body.blocked.down) {
                this.play('fall');
            }

            // Check if player can jump and perform the jump
            if (this.canJump() && this.wKey.isDown) {
                this.play('jump');
                this.jumpFx.play();
                this.body.velocity.y = -PLAYER_JUMP_VELOCITY;
            }

            // Check if player is attacking and perform the attack
            if(this.spaceKey.isDown) {
                this.weapon.attack();
            }

            // Check if player is shooting the hook and perform the action
            if(this.game.input.activePointer.isDown) {
                this.hook.shoot();
            }
        }

        // Check player physics against other sprites
        this.gameState.physics.arcade.overlap(this, this.gameState.rope, (player) => player.onOverlapRope());
        this.gameState.physics.arcade.overlap(this, this.gameState.chests, (player, chest) => player.onOverlapChest(chest));
        if(this.touchedChest && !this.gameState.physics.arcade.intersects(this.touchedChest.body, this.body)) {
            this.touchedChest = null;
        }
    }

    canJump() {
        return this.body.blocked.down && !this.touchedChest;
    }

    onOverlapRope() {
        if (!this.body.blocked.down && this.wKey.isDown) {
            // TODO: a grab animation maybe?
            this.animations.stop();
            this.position.x = this.gameState.rope.x;
            this.disableGravity();
        }
    }

    onOverlapChest(chest) {
        if(!chest.opened) {
            //Opening the chest and cancel player jump
            this.touchedChest = chest;
            if (this.wKey.isDown) {
                chest.open();
                let timer = this.game.time.create(this.game, true);
                timer.add(0.5*Phaser.Timer.SECOND, function() {
                    this.touchedChest = null;
                }, this);
                timer.start();
            }
        }
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
        this.tooFast = false;
    }

    enableGravity () {
        this.body.allowGravity = true;
    }

    slide() {
        if(this.body.velocity.y >= 0) {
            this.allowGravity = false;
            this.body.velocity.y = PLAYER_SLIDE_VELOCITY;
        }
    }

    landing() {
        if(this.state === PLAYER_STATE_FALLING && this.body.onFloor()) {
            this.floorFx.play();
        }
    }

    freezeMovement() {
        this.body.velocity.setTo(0);
        this.animations.stop();
        this.frame = 0;
        this.disableGravity();
        this.movementFrozen = true;
    }

    allowMovement() {
        this.enableGravity();
        this.movementFrozen = false;
    }
}
