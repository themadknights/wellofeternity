import { Player } from './sprites/player';

export class StartState extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        var i;
        this.background = this.game.add.image(0, 0, 'background');
        this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY);

        //Creating the map and its main layer, resizering the world to fix that layer
        this.map = this.add.tilemap();
        this.map.addTilesetImage('world');
        this.platforms = this.map.create('platforms', 25, 100, 32, 32);
        this.platforms.resizeWorld();

        //TODO: Example of platform, to be deleted when the map generation is done
        for(i = 0; i < 15; i++) {
            this.map.putTile(0, 10+i, 15);
        }
    }
}
