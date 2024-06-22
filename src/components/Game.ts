import { Application, BitmapText, Container, Point, Sprite } from "pixi.js";
import MyLoader from "./MyLoader";
import Cell from "./Cell";
import Title from "./Title";

interface iWinner {
    winner: string
    winningLine: number[][]
}

export default class Game extends Container {

    protected app: Application;
    protected gridContainer: Container;
    protected btnContainer: Container;
    protected title: Title;
    protected text: BitmapText;
    protected arrCell: [] = [];
    protected gap = 5;
    protected isBot = false;
    protected matrixCell: Cell[][];
    protected board: string[][];

    constructor(app: Application) {
        super();

        this.app = app;

        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.matrixCell = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        this.startGame();
        this.createBoard();
        this.createGrid();
        this.addText();
        this.addButton();

        this.setPos();
    }

    protected addButton() {
        this.btnContainer = new Container();
        this.addChild(this.btnContainer);
        this.text = new BitmapText('restart', {
            fontName: 'lightFont',
            fontSize: 40
        });
        this.btnContainer.addChild(this.text);
        this.btnContainer.position.x = (this.app.view.width - this.btnContainer.width) / 2;
        this.btnContainer.position.y = this.app.view.height - this.btnContainer.height - 100;
        this.btnContainer.buttonMode = true;
        this.btnContainer.alpha = 0;

        this.btnContainer.on('click', () => {
            this.btnContainer.alpha = 0;
            this.btnContainer.interactive = false;
            this.restartGame();
        });
    }

    protected addText() {
        this.title = new Title();
        this.posTitle();
        this.addChild(this.title);
    }

    protected updText(val: string | null) {
        this.title.updText(val, this.isBot);
        this.posTitle();
    }

    protected posTitle() {
        this.title.position.x = (this.app.view.width - this.title.width) / 2;
        this.title.position.y = 50;
    }

    protected startGame() {
        const sprite = new Sprite(MyLoader.getResource('bg').texture);
        this.addChild(sprite);
    }

    protected createBoard() {
        this.gridContainer = new Container();
        this.addChild(this.gridContainer);
        const grid = new Sprite(MyLoader.getResource('playfield').texture);
        this.gridContainer.addChild(grid);
    }

    protected createGrid() {
        const width = (this.gridContainer.width) / 3;

        for (let i = 0; i < this.board.length; i++) {
            const el = this.board[i];
            for (let j = 0; j < el.length; j++) {
                const cell = new Cell({
                    width, 
                    position: new Point((width + this.gap) * i, (width + this.gap) * j),
                    callback: () => this.setCell(i, j)
                });
                this.matrixCell[i][j] = cell;
                this.gridContainer.addChild(cell);
            }
        }
    }

    protected async setCell(i: number, j: number) {
        this.board[i][j] = this.isBot ? '0' : '1';
        this.gridContainer.interactiveChildren = false;
        await this.matrixCell[i][j].setValue(this.isBot ? 'circle' : 'cross');
        const check = this.checkFinishGame();
        
        if (!check) this.stepGame();
    }

    protected async stepGame() {
        this.isBot = !this.isBot;
        this.title.updText(null, this.isBot);
        if(this.isBot) {
            const winMove = this.findWinningMove('1');
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            winMove ? this.setCell(winMove[0], winMove[1]) : this.botStep();
        } 
        else this.gridContainer.interactiveChildren = true;
    }

    protected botStep() {
        const winMove = this.findWinningMove('0');
        if( winMove) this.setCell(winMove[0], winMove[1]);
        else {
            const cell = this.getRandomEmptyCell();
            this.setCell(cell[0], cell[1]);
        }
    }

    protected getRandomEmptyCell(): number[] {
        const emptyCells = this.findEmptyCells();

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }

    protected findEmptyCells() {
        const emptyCells = [];
    
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === null) {
                    emptyCells.push([i, j]);
                }
            }
        }

        return emptyCells;
    }

    protected checkFinishGame() {
        let endGame = true;
        const win = this.checkWin();
        const emptyCells = this.findEmptyCells();
        
        if (win) this.showWin(win);
        else if (emptyCells.length === 0) this.endGame();
        else endGame = false;

        return endGame;
    }

    protected endGame() {
        this.updText('no winner');
        this.btnContainer.alpha = 1;
        this.btnContainer.interactive = true;
    }

    protected restartGame() {
        this.isBot = false;
        for (let i = 0; i < this.board.length; i++) {
            const el = this.board[i];
            for (let j = 0; j < el.length; j++) {
                this.board[i][j] = null;
                this.matrixCell[i][j].restart();
            }
        }
        this.gridContainer.interactiveChildren = true;
        this.updText('Tic-Tac-Toe');
    }

    protected checkWin(): iWinner | null {
        const lines = [
            // Горизонтали
            {line: [this.board[0][0], this.board[0][1], this.board[0][2]], positions: [[0, 0], [0, 1], [0, 2]]},
            {line: [this.board[1][0], this.board[1][1], this.board[1][2]], positions: [[1, 0], [1, 1], [1, 2]]},
            {line: [this.board[2][0], this.board[2][1], this.board[2][2]], positions: [[2, 0], [2, 1], [2, 2]]},
            // Вертикали
            {line: [this.board[0][0], this.board[1][0], this.board[2][0]], positions: [[0, 0], [1, 0], [2, 0]]},
            {line: [this.board[0][1], this.board[1][1], this.board[2][1]], positions: [[0, 1], [1, 1], [2, 1]]},
            {line: [this.board[0][2], this.board[1][2], this.board[2][2]], positions: [[0, 2], [1, 2], [2, 2]]},
            // Диагонали
            {line: [this.board[0][0], this.board[1][1], this.board[2][2]], positions: [[0, 0], [1, 1], [2, 2]]},
            {line: [this.board[0][2], this.board[1][1], this.board[2][0]], positions: [[0, 2], [1, 1], [2, 0]]}
        ];
    
        for (const {line, positions} of lines) {
            if (line[0] && line[0] === line[1] && line[0] === line[2]) {
                return { winner: line[0], winningLine: positions };
            }
        }
    
        return null;
    }

    protected findWinningMove(player: string): number[] {
        const emptyCells = this.findEmptyCells();
        for (const [col, row] of emptyCells) {
            this.board[col][row] = player;
            if (this.checkWin()) {
                this.board[col][row] = null;
                return [col, row];
            }
            this.board[col][row] = null;
        }
    
        return null;
    }

    protected showWin(obj: iWinner) {
        const {winner, winningLine} = obj;

        this.updText(`${winner === '1' ? 'Cross' : 'Circle'} Wins`);
        this.posTitle();
        for (let i = 0; i < winningLine.length; i++) {
            const el = winningLine[i];
            const winCell = this.matrixCell[el[0]][el[1]];
            winCell.win();
        }

        this.btnContainer.alpha = 1;
        this.btnContainer.interactive = true;
    }

    protected setPos() {
        this.gridContainer.position.x = (this.app.view.width - this.gridContainer.width) / 2;
        this.gridContainer.position.y = (this.app.view.height - this.gridContainer.height) / 2;
    }
}