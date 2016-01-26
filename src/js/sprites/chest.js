export class Chest extends Phaser.Sprite {
    constructor(game, state, x, y) {
        super(game, x, y, 'chest');
        this.gameState = state;
        this.anchor.setTo(0, 1);
        this.game.add.existing(this);
        this.game.physics.arcade.enable(this);
        this.opened = false;
        this.body.allowGravity = false;
        this.inputEnabled = true;
    }

    open () {
        this.opened = true;
        this.frame = 1;
        this.spawnCoins();
    }

    spawnCoins() {
        //Spawning coins
        let n = this.game.rnd.integerInRange(1, 5);

        for(let i = 0; i < n; i++) {
            let coin = this.gameState.coins.getFirstExists(false);
            if(coin) {
                coin.reset(this.x + this.width/2, this.y);
            } else {
                coin = this.gameState.coins.create(this.x + this.width/2, this.y, 'coin');
                coin.anchor.setTo(0.5);
            }
            coin.allowedPickup = false;
            let coinTimer = this.game.time.create(this.game, true);
            coinTimer.add(1*Phaser.Timer.SECOND, function() {
                coin.allowedPickup = true;
            }, this);
            coinTimer.start();
            coin.body.bounce.set(0.9);
            coin.body.velocity.x = this.game.rnd.between(-100, 100);
            coin.body.velocity.y = this.game.rnd.between(-200, -50);
        }
    }
}
