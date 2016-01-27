const HOOK_MAX_LENGTH = 300

export class Hook extends Phaser.Sprite {
    constructor(game, owner) {
        super(game, 0, 0, 'hook');
        this.anchor.setTo(0.5);
        this.game = game;
        this.owner = owner;
        this.gameState = owner.gameState;
        this.game.physics.arcade.enable(this);
        this.body.allowGravity = false;
        this.game.add.existing(this);
        this.visible = false;
        this.anchored = false;
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

            // Draw hook rope as a simple white line
            this.rope.lineStyle(1, 0xffffff, 1);
            this.rope.beginFill();
            this.rope.moveTo(this.owner.body.center.x, this.owner.body.center.y);
            this.rope.lineTo(this.position.x, this.position.y);
            this.rope.endFill();

            // Check hook collision
            this.gameState.physics.arcade.collide(this, this.gameState.walls, () => this.onAnchored());
            this.gameState.physics.arcade.collide(this, this.gameState.map.platforms, () => this.onAnchored());
            this.gameState.physics.arcade.overlap(this, this.owner, () => this.onGrabbed());
        }
    }

    shoot() {
        if(!this.visible) {
            this.reset(this.owner.body.center.x, this.owner.body.center.y);
            this.visible = true;
            this.game.physics.arcade.moveToPointer(this, 800);
        }
    }

    onAnchored () {
        if (!this.anchored) {
            this.anchored = true;
            this.body.velocity.setTo(0);
            this.owner.freezeMovement();
            this.game.physics.arcade.moveToObject(this.owner, this, 800);
        }
    }

    onGrabbed () {
        if (this.anchored) {
            this.anchored = false;
            this.visible = false;
            this.owner.body.velocity.setTo(0);
            this.owner.allowMovement();
            this.rope.clear();
        }
    }
}
