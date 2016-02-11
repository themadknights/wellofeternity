import { Map } from './map';
import { Player } from './sprites/player';
import { WallTrap } from './sprites/walltrap';
import { pad } from './utils';

export class LevelState extends Phaser.State {
    constructor() {
        super();
    }

    init(difficulty) {
        this.difficulty = difficulty;

        //Starting Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);

        // @if NODE_ENV = 'development'
        //  Press F1 to toggle the debug display
        this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.F1);
        this.debugKey.onDown.add(this.toggleDebug, this);
        // @endif
    }

    create() {
        //Creating gravity
        this.physics.arcade.gravity.y = 300;

        //Enemies group
        this.enemies = this.game.add.group();

        //Chest group
        this.chests = this.game.add.group();

        //Coins group
        this.coins = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.coins.enableBody = true;

        //Wall trap and projectile group
        this.traps = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.projectiles = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.traps.add(new WallTrap(this.game, this, 200));
        this.traps.add(new WallTrap(this.game, this, 300));
        this.traps.add(new WallTrap(this.game, this, 400));
        this.traps.add(new WallTrap(this.game, this, 500));

        //Player
        this.player = new Player(this.game, this, this.game.world.centerX, 100);

        //Map
        this.map = new Map(this.game, this, this.difficulty);

        //Add sounds
        this.coinFx = this.game.add.audio('coinFx');
        this.coinFx.volume = 0.1;

        // Add walls
        this.createWalls();
        // Add rope to the back of the scene but in front background
        this.createRope();
        // Add simple background as tile sprite
        this.createBackground();
        // Add hud in front of all the objects
        this.createHUD();
    }

    update() {
        if (!this.map.isFinished()) {
            if(this.player.position.y >= (this.map.lastChunkGenerated - 20) * this.map.tileHeight) {
                this.map.generateWorldChunk(this.map.lastChunkGenerated + 20);
            }
        }

        this.physics.arcade.collide(this.player, this.walls);

        this.physics.arcade.collide(this.player, this.map.platforms, function(player) {
            player.landing();

            if (player.tooFast) {
                player.loseAllHealth();
            }

            if (player.hook.anchored) {
                player.hook.onGrabbed();
            }
        });

        this.physics.arcade.overlap(this.player, this.traps, function(player, trap) {
            trap.fire();
        });

        this.physics.arcade.overlap(this.player, this.enemies, function(player, enemy) {
            player.damage(enemy.attackDamage);
        });

        this.physics.arcade.overlap(this.player.weapon, this.enemies, (weapon, enemy) => {
            if (weapon.visible) {
                enemy.damage(weapon.attackDamage);
            }
        });

        this.physics.arcade.overlap(this.player, this.coins, function(player, coin) {
            if(coin.allowedPickup) {
                this.coinFx.play();
                coin.kill();
                this.addScore(coin.score);
            }
        }, null, this);

        this.physics.arcade.overlap(this.player, this.projectiles, function(player, projectile) {
            player.damage(projectile.attackDamage);
            projectile.kill();
        });

        this.physics.arcade.collide(this.coins, this.map.platforms);
        this.physics.arcade.collide(this.coins, this.walls);

        if (this.player.isDead()) {
            this.gameOver();
        }

        this.background.autoScroll(0, (this.cameraLastPositionY - this.camera.position.y) * 20);
        this.cameraLastPositionY = this.camera.position.y;
    }

    render() {
        if (this.showDebug) {
            this.game.debug.body(this.player);
            this.game.debug.body(this.player.hook);
            this.enemies.forEach((enemy) => this.game.debug.body(enemy));
            this.coins.forEach((coin) => this.game.debug.body(coin));
            this.traps.forEach((trap) => this.game.debug.body(trap));
            this.game.debug.text(`Player gravity: ${this.player.body.velocity.y}`, 50, 50);
        }
    }

    gameOver() {
        this.game.state.start('gameover', true, false, this.score);
    }

    addScore (amount) {
        this.score += amount;
        this.scoreLabel.text = `Score: ${pad(this.score)}`;
    }

    updateHealthHud () {
        for (let i = 0; i < this.player.maxHealth; i += 1) {
            this.healthIcons.children[i].frame = i < this.player.health ? 0 : 1;
        }
    }

    updateChunksHud () {
        if (this.chunksLabel) {
          this.chunksLabel.text = `Chunks: ${this.map.chunks} / ${this.map.maxChunks}`;
        }
    }

    createBackground () {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        this.background.sendToBack();
        this.background.fixedToCamera = true;
        this.cameraLastPositionY = this.camera.position.y;
    }

    createRope () {
        this.rope = this.game.add.tileSprite(this.game.world.centerX, 0, 16, this.game.world.height, 'rope');
        this.game.physics.arcade.enable(this.rope);
        this.rope.anchor.setTo(0.5, 0);
        this.rope.body.immovable = true;
        this.rope.body.allowGravity = false;
        this.rope.sendToBack();
    }

    createWalls () {
        let leftWall = this.game.add.tileSprite(0, 0, 16, this.game.world.height, 'wall');
        let rightWall = this.game.add.tileSprite(this.game.width, 0, 16, this.game.world.height, 'wall');

        this.walls = this.game.add.group();
        this.walls.enableBody = true; // Enable physics for the whole group
        this.walls.add(leftWall);
        this.walls.add(rightWall);

        leftWall.body.immovable = true;
        leftWall.body.allowGravity = false;

        rightWall.anchor.setTo(1, 0);
        rightWall.body.immovable = true;
        rightWall.body.allowGravity = false;
    }

    createHUD () {
        this.score = 0;
        this.scoreLabel = this.game.add.bitmapText(this.game.width - 10, 10, 'carrier_command', `Score: ${pad(this.score)}`, 12);
        this.scoreLabel.anchor.setTo(1, 0);
        this.scoreLabel.fixedToCamera = true;

        this.healthLabel = this.game.add.bitmapText(10, 10, 'carrier_command', "Health: ", 12);
        this.healthLabel.fixedToCamera = true;

        this.healthIcons = this.game.add.group();
        this.healthIcons.fixedToCamera = true;

        for (let i = 0; i < this.player.maxHealth; i += 1) {
            let icon = this.game.add.sprite(this.healthLabel.width + 16 + i * 18, 16, 'health_icons');
            icon.anchor.setTo(0.5);
            this.healthIcons.add(icon);
        }
        this.updateHealthHud();

        this.hookReadyLabel = this.game.add.bitmapText(10, 32, 'carrier_command', "Hook Ready", 12);
        this.hookReadyLabel.fixedToCamera = true;

        this.chunksLabel = this.game.add.bitmapText(this.game.width - 10, 32, 'carrier_command', "Chunks: ? / ?", 12);
        this.chunksLabel.anchor.setTo(1, 0);
        this.chunksLabel.fixedToCamera = true;
        this.updateChunksHud();

        if (this.player.godMode) {
          this.godModeLabel = this.game.add.bitmapText(10, 54, 'carrier_command', "GOD MODE", 12);
          this.godModeLabel.fixedToCamera = true;
        }
    }

    toggleDebug () {
        this.showDebug = (this.showDebug) ? false : true;
    }
}
