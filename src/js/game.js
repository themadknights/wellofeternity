import { PreloadState } from './states/preload';
import { LoadState } from './states/load';
import { LevelState } from './sates/level';
import { PublisherState } from './sates/publisher';
import { GameOverState } from './sates/game_over';

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 850;

export class Game extends Phaser.Game {
    constructor () {
        super(CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.CANVAS);
        this.state.add('preload', new PreloadState());
        this.state.add('load', new LoadState());
        this.state.add('publisher', new PublisherState());
        this.state.add('level', new LevelState());
        this.state.add('gameover', new GameOverState());

        this.state.start('preload');
    }
}
