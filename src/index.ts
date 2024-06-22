import * as PIXI from 'pixi.js';
import MyLoader from './components/MyLoader';
import './index.css';
import Game from './components/Game';
new class Main {

    protected app: PIXI.Application;
    protected mainContainer: PIXI.Container;
    protected game: Game;

    constructor() {
        this.initGame();
    }

    async initGame() { 
        this.app = new PIXI.Application({
            width: 1920,
            height: 1080,
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__PIXI_APP__ = this.app;

        document.body.appendChild(this.app.view);
        this.mainContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);
        this.loadAssets();
    }

    async loadAssets() {
        const loader = MyLoader.loader;
        loader.add('bg', './assets/images/bg.png');
        loader.add('playfield', './assets/images/playfield.png');
        loader.add('win_highlight', './assets/images/win_highlight.png');
        loader.add('sequence', './assets/spritesheets/sequence.json');
        loader.add('main', './assets/spritesheets/main.json');
        loader.add('darkFont', './assets/fonts/darkFont.fnt');
        loader.add('lightFont', './assets/fonts/lightFont.fnt');

        await MyLoader.loadAssets(loader);

        this.game = new Game(this.app);
        this.mainContainer.addChild(this.game);
    }
};
