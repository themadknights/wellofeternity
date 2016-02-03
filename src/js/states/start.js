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
        this.createLevelsPanel();
    }

    togglePanel(panelId) {
        for (let panelId in this.panels) {
            this.panels[panelId].visible = false;
        }
        this.panels[panelId].visible = true;
    }

    startLevel(levelId) {
        this.game.state.start('level', true, false, levelId);
    }

    createStartPanel() {
        let panel = this.game.add.group();

        panel.position = { x: this.game.world.centerX, y: this.game.world.centerY + 25 };

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
            text: "Options",
            disabled: true
        });

        this.panels["start"] = panel;
    }

    createModePanel() {
        let panel = this.game.add.group();

        panel.position = { x: this.game.world.centerX, y: this.game.world.centerY + 25 };
        panel.visible = false;

        this.normalModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 0 },
            text: "Normal Mode",
            callback: () => { this.togglePanel('level'); }
        });

        this.infiniteModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 125 },
            text: "Infinte Mode",
            callback: () => { this.startLevel('infinite'); }
        });

        this.infiniteModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: -225, y: 350 },
            scale: 0.5,
            text: "Back",
            callback: () => { this.togglePanel('start'); }
        });

        this.panels["mode"] = panel;
    }

    createLevelsPanel() {
        let panel = this.game.add.group();

        panel.position = { x: this.game.world.centerX, y: this.game.world.centerY + 25 };
        panel.visible = false;

        this.easyLevelButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 0 },
            text: "Easy",
            callback: () => { this.startLevel('easy'); }
        });

        this.normalLevelButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 125 },
            text: "Normal",
            callback: () => { this.startLevel('normal'); }
        });

        this.insaneLevelButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: 0, y: 250 },
            text: "Insane",
            callback: () => { this.startLevel('insane'); }
        });

        this.infiniteModeButton = new TextButton({
            game: this.game,
            group: panel,
            position: { x: -225, y: 350 },
            scale: 0.5,
            text: "Back",
            callback: () => { this.togglePanel('mode'); }
        });


        this.panels["level"] = panel;
    }
}
