import { PreloadState } from './states/preload';
import { LoadState } from './states/load';
import { StartState } from './states/start';
import { GameOverState } from './states/gameover';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export class Game extends Phaser.Game {
    constructor () {
        super(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.state.add('preload', new PreloadState());
        this.state.add('load', new LoadState());
        this.state.add('start', new StartState());
        this.state.add('gameover', new GameOverState());
        this.state.start('preload');
    }
}
