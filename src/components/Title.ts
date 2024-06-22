import { BitmapText, Container } from "pixi.js";

export default class Title extends Container {
    protected text: BitmapText;

    constructor() {
        super();

        this.addText();
    }

    protected addText() {
        this.text = new BitmapText('Tic-Tac-Toe', {
            fontName: 'darkFont'
        });
        this.addChild(this.text);
    }

    public updText(val: string, isBot: boolean) {
        if (val) this.text.text = val;
        this.text.fontName = !isBot ? 'darkFont' : 'lightFont';
    }
}