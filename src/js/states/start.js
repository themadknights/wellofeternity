import { Map } from './map';
import { Player, PLAYER_STATE_GRABBING_THE_HOOK } from './sprites/player';
import { WallTrap } from './sprites/walltrap';
import { pad } from './utils';

export class StartState extends Phaser.State {
    constructor() {
        super();
    }

    init() {
        //Starting Physics
        this.physics.startSystem(Phaser.Physics.ARCADE);
        //Starting Gamepad Support
        this.input.gamepad.start();

        //  Press F1 to toggle the debug display
        this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.F1);
        this.debugKey.onDown.add(this.toggleDebug, this);
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
        this.map = new Map(this.game, this);

        // TODO: generate a few chunks for testing purposes
        for(let i = 1; i < 5; i++) {
            this.map.generateWorldChunk(20*i);
        }

        //Replace 12 index for 12..15 randomly
        this.map.replaceRandomSpikes();

        // Resize world after adding chunks
        this.map.platforms.resizeWorld();

        //TODO: Example of goal, to be deleted when the map generation si done
        for(let i = 0; i < 20; i++) {
            this.map.putTile(98, i, 99);
        }

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
        this.physics.arcade.collide(this.player, this.walls);

        this.physics.arcade.collide(this.player, this.map.platforms, function(player) {
            //TODO: check deprecation when hook collide with tiles
            if (player.state === PLAYER_STATE_GRABBING_THE_HOOK) {
                player.grabHook();
            }

            if(player.tooFast) {
                player.loseAllHealth();
            }
        });

        this.physics.arcade.overlap(this.player, this.traps, function(player, trap) {
            trap.fire();
        });

        this.physics.arcade.collide(this.player.hook, this.map.platforms, () => {
            this.player.onHookSet();
        });

        this.physics.arcade.overlap(this.player, this.enemies, function(player, enemy) {
            player.loseHealth(enemy.damage);
        });

        this.physics.arcade.overlap(this.player, this.coins, function(player, coin) {
            if(coin.allowedPickup) {
                coin.kill();
                this.addScore(100);
            }
        }, null, this);

        this.physics.arcade.overlap(this.player, this.projectiles, function(player, projectile) {
            player.loseHealth(1);
            projectile.kill();
        });

        this.physics.arcade.collide(this.coins, this.map.platforms);

        if (this.player.isDead()) {
            this.gameOver();
        }
    }

    render() {
        if (this.showDebug) {
            this.game.debug.body(this.player);
            this.enemies.forEach((enemy) => this.game.debug.body(enemy));
            this.traps.forEach((trap) => this.game.debug.body(trap));
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

    createBackground () {
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');
        this.background.sendToBack();
    }

    createRope () {
        this.rope = this.game.add.tileSprite(this.game.world.centerX, 0, 16, this.game.world.height, 'rope');
        this.game.physics.arcade.enable(this.rope);
        this.rope.anchor.setTo(0.5, 0);
        this.rope.body.immovable = true;
        this.rope.body.allowGravity = false;
        this.rope.sendToBack();
        this.rope.inputEnabled = true;
        this.rope.events.onInputDown.add(() => {
            this.player.allowGrab = true;
            this.physics.arcade.overlap(this.player, this.rope, (player) => player.onOverlapRope(true));
        });
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
    }

    toggleDebug () {
        this.showDebug = (this.showDebug) ? false : true;
    }
}
