class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext("2d");

        this.context.moveTo(0, 0);
        this.context.lineTo(200, 100);
        this.context.stroke();
    }
}

new Game();
