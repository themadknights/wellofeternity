export class StartState extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        this.gameLogo = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 200, 'gameLogo');
        this.gameLogo.anchor.setTo(0.5);
    }
}
