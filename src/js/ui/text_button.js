export class TextButton {
    constructor({ game, group, position, text, callback, scale }) {
        this.button = game.add.button(position.x, position.y, 'buttonBg', callback);
        this.button.anchor.setTo(0.5);
        group.add(this.button);

        if (scale) {
            this.button.scale.setTo(scale);
        }

        this.label = game.add.bitmapText(position.x, position.y, 'carrier_command', text, 20);
        this.label.anchor.setTo(0.5);
        this.label.tint = "#000";
        group.add(this.label);
    }
}
