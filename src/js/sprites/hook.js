const HOOK_MAX_LENGTH = 300

export class Hook extends Phaser.Sprite {
    constructor(game, owner) {
        super(game, 0, 0, 'hook');
        this.anchor.setTo(0.5);
        this.game = game;
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.game.add.existing(this);
        this.owner = owner;
        this.visible = false;

        this.rope = this.game.add.graphics(0, 0);
    }

    update() {
        if (this.visible) {
            let distance = Phaser.Point.distance(this.owner, this.position);

            this.rope.clear();

            if (distance > HOOK_MAX_LENGTH) {
                this.visible = false;
                return;
            }

            this.rope.lineStyle(1, 0xffffff, 1);
            this.rope.beginFill();
            this.rope.moveTo(this.owner.body.center.x, this.owner.body.center.y);
            this.rope.lineTo(this.position.x, this.position.y);
            this.rope.endFill();
        }
    }

    shoot() {
        if(!this.visible) {
            this.reset(this.owner.body.center.x, this.owner.body.center.y);
            this.visible = true;
            this.game.physics.arcade.moveToPointer(this, 800);
        }
    }
}



// isShootingHook() {
//     return ;
// }
//
//     // Shoot hook
//     if(this.isShootingHook() &&
//
//

//
//     this.gameState.physics.arcade.collide(this.hook, this.gameState.walls, () => this.onHookSet());
// } else {
//     this.gameState.physics.arcade.overlap(this, this.hook, () => this.grabHook());
// }
//
// if (this.hook.visible) {
//     this.drawHookRope();
// }
// onHookSet () {
//     this.animations.stop();
//     this.frame = 0;
//     this.tooFast = false;
//     this.disableGravity();
//     this.hook.body.velocity.setTo(0);
//     this.game.physics.arcade.moveToObject(this, this.hook, 800);
//     this.state = PLAYER_STATE_GRABBING_THE_HOOK;
// }
//
// grabHook () {
//     this.hook.visible = false;
//     this.state = PLAYER_STATE_IDLE;
//     this.body.velocity.y = 0;
//     this.body.allowGravity = true;
//     this.rope.clear();
// }
//
