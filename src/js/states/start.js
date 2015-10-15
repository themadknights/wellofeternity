import { Player, PLAYER_FALL_SPEED_LIMIT } from './sprites/player';

export class StartState extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        var i;

        this.background = this.game.add.image(0, 0, 'background');

        //Creating gravity
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 300;

        //Player
        this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);
        this.physics.arcade.enable(this.player);
        this.camera.follow(this.player);

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
        if(this.player.body.velocity.y > PLAYER_FALL_SPEED_LIMIT) {
            this.player.tooFast = true;
        }

        this.physics.arcade.collide(this.player, this.platforms, function(player) {
            if(player.tooFast) {
                player.loseHealth(3);
            }
        });
    }
}
