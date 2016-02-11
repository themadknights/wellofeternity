const TILES_PER_CHUNK = 20;

const MAX_TILES = {
  easy:      100 * TILES_PER_CHUNK,
  normal:    400 * TILES_PER_CHUNK,
  insane:   1500 * TILES_PER_CHUNK,
  infinite: 5000 * TILES_PER_CHUNK
}

import { Chest } from './sprite/chest';
import { PatrolEnemy } from './sprites/enemies/patrol_enemy';
import { PLAYER_SPIKE_VELOCITY } from './sprites/player';

export class Map extends Phaser.Tilemap {
    constructor(game, state, difficulty = 'easy') {
        super(game);

        this.gameState = state;
        this.chunks = 0;
        this.maxChunks = MAX_TILES[difficulty] / TILES_PER_CHUNK;
        this.difficulty = difficulty;

        this.addTilesetImage('world');
        this.platforms = this.create('platforms', 20, MAX_TILES[difficulty] + TILES_PER_CHUNK, 32, 32);

        //Creating the map and its main layer, resizering the world to fix that layer
        this.mapPresets = [];
        this.lastChunkGenerated = 0;
        // this.mapPresets.push(this.game.cache.getJSON('presetTest01'));
        for(let i = 0; i < 3; i++) {
            this.mapPresets[i] = this.game.cache.getJSON('preset0' + (i+1));
        }

        //Spikes logic (Tiles: 99)
        this.setTileIndexCallback([12,13,14,15], function(player) {
            //PLAYER_SPIKE_VELOCITY is an epsilon for kill the player (velocity > 0 when the player hit moving in the floor)
            if(player === this.gameState.player && player.body.velocity.y > PLAYER_SPIKE_VELOCITY) {
                player.loseAllHealth();
                // console.log(player.body.velocity.y);
            }
        }, this);

        //Goal logic (Tiles: 98)
        this.setTileIndexCallback(98, function(player) {
            // TODO: restart the level for now, same as player's death
            if(player === this.gameState.player) {
                this.gameState.gameOver();
            }
        }, this);

        // Generate initial chunks
        for(let i = 1; i < 5; i++) {
            this.generateWorldChunk(20*i);
        }

        //Replace 12 index for 12..15 randomly
        this.replaceRandomSpikes();

        // Resize world after adding chunks
        this.platforms.resizeWorld();
    }

    replaceRandomSpikes () {
        this.forEach(function (tile) {
            if (tile.index === 12) {
                tile.index = this.game.rnd.integerInRange(12, 15);
            }
        }, this);
    }

    generateWorldChunk(y) {
        var preset   = this.game.rnd.integerInRange(0,this.mapPresets.length - 1),
            mapChunk = this.mapPresets[preset].layers[0].data,
            i        = -1;

        this.forEach(function(tile) {
            tile.index = mapChunk[i++] - 1;
        }, this, 0, y, 20, 20);

        this.mapPresets[preset].layers[1].objects.forEach(function(object) {
            switch(object.type) {
                case 'bat':
                    this.gameState.enemies.add(new PatrolEnemy(this.game, object.x, object.y + y*32, object.properties));
                    break;
                case 'chest':
                    this.gameState.chests.add(new Chest(this.game, this.gameState, object.x, object.y + y*32, object.properties));
                    break;
            }
        }, this);

        this.lastChunkGenerated = y;

        this.setCollisionBetween(0, 5);

        this.chunks += 1;
        this.gameState.updateChunksHud();

        if (this.chunks === this.maxChunks) {
            // Add goal at the bottom
            for(let i = 0; i < 20; i++) {
                this.putTile(98, i, MAX_TILES[this.difficulty] + TILES_PER_CHUNK - 1);
            }
        }
    }

    isFinished() {
        return this.chunks === this.maxChunks;
    }
}
