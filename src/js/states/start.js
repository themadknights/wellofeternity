import { Player, PLAYER_SPIKE_VELOCITY } from './sprites/player';
import { Enemy } from './sprites/enemy';
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
    }

    create() {
        var i;

        // Add simple background as tile sprite
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'background');

        // Add rope to the back of the scene but in front background
        this.rope = this.game.add.tileSprite(this.game.world.centerX, 0, 16, this.game.world.height, 'rope');
        this.game.physics.arcade.enable(this.rope);
        this.rope.anchor.setTo(0.5, 0);
        this.rope.body.immovable = true;
        this.rope.body.allowGravity = false;

        //Creating gravity
        this.physics.arcade.gravity.y = 300;

        //Player
        this.player = new Player(this.game, this, this.game.world.centerX, 100);

        //Enemies group
        this.enemies = this.game.add.group();
        this.enemies.add(new Enemy(this.game, 200, 600));

        //Creating the map and its main layer, resizering the world to fix that layer
        this.map = this.add.tilemap();
        this.map.addTilesetImage('world');
        this.platforms = this.map.create('platforms', 25, 100, 32, 32);
        this.map.setCollision(0);

        //TODO: Example of platform, to be deleted when the map generation is done
        for(i = 0; i < 15; i++) {
            this.map.putTile(0, 10+i, 15);
            this.map.putTile(0, 10+i, 16);
        }

        //Spikes logic (Tiles: 1)
        this.map.setTileIndexCallback(1, function(player) {
            //PLAYER_SPIKE_VELOCITY is an epsilon for kill the player (velocity > 0 when the player hit moving in the floor)
            if(player === this.player && player.body.velocity.y > PLAYER_SPIKE_VELOCITY) {
                player.loseAllHealth();
                // console.log(player.body.velocity.y);
            }
        }, this);

        //TODO: Example of spikes, to be deleted when the map generation is done
        //The player can walk over spikes if they are 2 and he walks quickly
        this.map.putTile(1, 15, 15);
        this.map.putTile(1, 16, 15);
        //The player can't fall <--- Maybe, the hitbox of the player should be smaller.
        this.map.putTile(1, 18, 15);
        //The player die
        this.map.putTile(1, 20, 15);
        this.map.putTile(1, 21, 15);
        this.map.putTile(1, 22, 15);
        //The player can walk through spikes
        this.map.putTile(1, 10, 14);

        //Goal logic (Tiles: 2)
        this.map.setTileIndexCallback(2, function() {
            // TODO: restart the level for now, same as player's death
            this.restartLevel();
        }, this);

        //TODO: Example of goal, to be deleted when the map generation si done
        for(i = 0; i < 25; i++) {
            this.map.putTile(2, i, 99);
        }

        this.score = 0;
        this.scoreLabel = this.game.add.bitmapText(this.game.world.width - 10, 10, 'carrier_command', "Score: ", 12);
        this.scoreLabel.anchor.setTo(1, 0);
        this.scoreLabel.fixedToCamera = true;


        this.healthLabel = this.game.add.bitmapText(10, 10, 'carrier_command', "Health: ", 12);
        this.healthLabel.fixedToCamera = true;

        this.healthIcons = this.game.add.group();
        this.healthIcons.fixedToCamera = true;
        for (i = 0; i < this.player.maxHealth; i += 1) {
            let icon = this.game.add.sprite(this.healthLabel.width + 16 + i * 18, 16, 'health_icons');
            icon.anchor.setTo(0.5);
            this.healthIcons.add(icon);
        }
        this.updateHealthHud();
        this.platforms.resizeWorld();
    }

    update() {
        this.physics.arcade.collide(this.player, this.platforms, function(player) {
            if(player.tooFast) {
                player.loseAllHealth();
            }
        });

        this.physics.arcade.overlap(this.player, this.enemies, function(player, enemy) {
            player.loseHealth(enemy.damage);
        });

        if (this.player.isDead()) {
            this.restartLevel();
        }

        // TODO: Not a real usage, just for testing
        this.addScore(1);
    }

    render() {
        // this.game.debug.spriteInfo(this.player, 32, 32);
    }

    restartLevel() {
        this.state.restart();
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
}
