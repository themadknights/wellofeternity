export class PublisherState extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        this.publisherLogo = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'tmkLogo');
        this.publisherLogo.fixedToCamera = true;
        this.publisherLogo.anchor.setTo(0.5);
        this.publisherLogo.alpha = 0;

        let tween = this.game.add.tween(this.publisherLogo).to( { alpha: 1 }, 1000, "Linear", true, 0, 0);
        tween.yoyo(true, 1000);

        tween.onComplete.add(() => {
            this.game.state.start('level');
        });
    }
}
