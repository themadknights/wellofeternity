import { Player } from './sprites/player';
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
        }
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
