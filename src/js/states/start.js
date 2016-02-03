import { TextButton } from 'ui/text_button';

export class StartState extends Phaser.State {
    constructor() {
        super();
    }

    create() {
        this.gameLogo = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 200, 'gameLogo');
        this.gameLogo.anchor.setTo(0.5);

        this.panels = {};
        this.createStartPanel();
        this.createModePanel();
    }

    togglePanel(panelId) {
        for (let panelId in this.panels) {
            this.panels[panelId].visible = false;
        }
        this.panels[panelId].visible = true;
    }

    createStartPanel() {
        let panel = this.game.add.group();

        panel.position = { x: this.game.world.centerX, y: this.game.world.centerY + 50 };

        this.startButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 0 },
            text: "Start Game",
            callback: () => { this.togglePanel('mode'); }
        });

        this.optionsButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 125 },
            text: "Options"
        });

        this.panels["start"] = panel;
    }

    createModePanel() {
        let panel = this.game.add.group();

        panel.position = { x: this.game.world.centerX, y: this.game.world.centerY + 50 };
        panel.visible = false;

        this.normalModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 0 },
            text: "Normal Mode"
        });

        this.infiniteModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 125 },
            text: "Infinte Mode"
        });

        this.infiniteModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: -225, y: 325 },
            scale: 0.5,
            text: "Back",
            callback: () => { this.togglePanel('start'); }
        });

        this.panels["mode"] = panel;
    }
}
