import { Player, PLAYER_SPIKE_VELOCITY } from './sprites/player';
import { Enemy } from './sprites/enemy';

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

        this.background = this.game.add.image(0, 0, 'background');

        //Creating gravity
        this.physics.arcade.gravity.y = 300;

        //Player
        this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);

        //Enemies group
        this.enemies = this.game.add.group();
        this.enemies.add(new Enemy(this.game, 300, 400));

        //Creating the map and its main layer, resizering the world to fix that layer
        this.map = this.add.tilemap();
        this.map.addTilesetImage('world');
        this.platforms = this.map.create('platforms', 25, 100, 32, 32);
        this.platforms.resizeWorld();
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
                console.log(player.body.velocity.y);
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
    }

    update() {
        this.physics.arcade.collide(this.player, this.platforms, function(player) {
            if(player.tooFast) {
                player.loseAllHealth();
            }
        });

        this.physics.arcade.collide(this.player, this.enemies, function(player, enemy) {
            player.loseHealth(enemy.damage);
        });

        //TODO: check game over condition
    }
}
