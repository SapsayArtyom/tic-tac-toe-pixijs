import { AnimatedSprite, Container, Graphics, Point, Sprite, Texture } from "pixi.js";
import MyLoader from "./MyLoader";

export interface ICellProps {
    width: number
    position: Point
    callback: () => void
}

export default class Cell extends Container {
    protected back: Graphics;
    // protected back: Sprite;
    protected fillCell: Sprite;
    protected wRect: number;
    protected fun: () => void;
    protected anim: AnimatedSprite;

    constructor(props: ICellProps) {
        super();

        this.wRect = props.width;
        this.width = props.width;
        this.position.set(props.position.x, props.position.y);
        this.fun = props.callback;

        this.createFillRect();
        this.addBack();
        this.addListeners();
    }

    protected createFillRect() {
        this.fillCell = new Sprite(MyLoader.getResource('win_highlight').texture);
        this.fillCell.alpha = 0;
        this.addChild(this.fillCell);
    }

    protected addBack() {
        this.back = new Graphics();
        this.back.beginFill(0x03b9a5);
        
        this.back.drawRect(0, 0, this.fillCell.width, this.fillCell.width);
        this.back.endFill();
        this.back.alpha = 0;
        this.addChild(this.back);
    }

    public async setValue(name: string) {
        const frames: Texture[] = [];
        const framesWin: Texture[] = [];
        
        for (let i = 0; i < 20; i++) {
            const index = i < 10 ? `0${i}` : i;
            const texture = Texture.from(`${name}-draw_${index}`) ;
            frames.push(texture);
        }
        for (let i = 0; i < 30; i++) {
            const index = i < 10 ? `0${i}` : i;
            const texture = Texture.from(`${name}-win_${index}`) ;
            framesWin.push(texture);
        }

        this.anim = new AnimatedSprite(frames);
        this.anim.play();
        this.anim.loop = false;
        this.addChild(this.anim);

        await new Promise((resolve) => {
            this.anim.onComplete = () => {
                this.anim.textures = framesWin;
                resolve({});
            };
        });
    }

    public win() {
        this.fillCell.alpha = 1;
        this.anim.loop = false;
        this.anim.play();
    }

    public restart() {
        this.interactive = true;
        this.fillCell.alpha = 0;
        this.removeChild(this.anim);
        this.anim = null;
    }

    protected addListeners() {
        this.interactive = true;
        this.on('click', () => {
            this.interactive = false;
            this.back.alpha = 0;
            this.fun();
        });
        
        this.on('pointerover', () => {
            this.back.alpha = 1;
        });
        this.on('pointerout', () => {
            this.back.alpha = 0;
        });
    }
}