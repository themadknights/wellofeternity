export class GameOverState extends Phaser.State {
    constructor() {
        super();
    }


    create () {
        console.log(this.game.width);
        console.log(this.game.height);
        this.world.setBounds(0, 0, this.game.width, this.game.height);
        this.canClose = false;
        let timer = this.time.create(this.game, true);
        timer.add(2.5*Phaser.Timer.SECOND, function() {
            this.canClose = true;
            this.closeText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 48, 'carrier_command', "Press 'Space' for play again", 12);
            this.closeText.anchor.setTo(0.5);
        }, this);
        timer.start();
        this.gameOverText = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY, 'carrier_command', "GAME OVER", 18);
        this.gameOverText.anchor.setTo(0.5);
    }

    update() {
        if(this.canClose) {
            if(this.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
                this.state.start('start');
            }
        }
    }

}
