import { Circle } from './circle';
import utils from './assets/utils';

/**
 * Constants and Global Variables
 */
const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const c = canvas.getContext('2d')!;
canvas.width = innerWidth;
canvas.height = innerHeight;

const colors: string[] = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66',     '#FF5733', '#33FF57', '#5733FF', '#FF336E', '#33B5FF',
    '#C633FF', '#FF3333', '#33FFC5', '#FFD733', '#8333FF',
    '#FFA500', '#4CAF50', '#FF00FF', '#00FFFF', '#800080',
    '#FFFF00', '#FF4500', '#8A2BE2', '#00FF00', '#FF1493',
    '#6A5ACD', '#FF6347', '#7CFC00', '#8B008B', '#20B2AA',];

let circles: Circle[];
let gameInProgress = false;

/**
 * Initialization Function
 */
function init(): void {
    circles = [];
    gameInProgress = true;

    canvas.addEventListener('click', (event: MouseEvent) => {
        const x = event.clientX;
        const y = event.clientY;
        const radius = utils.randomIntFromRange(5, 50);
        const color = utils.randomColor(colors);

        const circle = new Circle(canvas, circles, x, y, c, radius, color);

        if (!circle.isTouchingBorders()) {
            circles.push(circle);
        }
    });}

/**
 * Animation Loop Function
 */
function animate(): void {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach((circle) => {
        circle.update();

        // Check if any ball reached the top of the canvas
        if (circle.y - circle.radius < 0) {
            gameInProgress = false;
            alert('Game Over! Balls reached the top.');
        }
    });

    // Check if no balls remain after a certain period of time (e.g., 10 seconds)
    if (gameInProgress && circles.length === 0) {
        gameInProgress = false;
        alert('Congratulations! You won!');
    }
}

/**
 * Delay Function
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function restartSimulation(): Promise<void> {
    // Restart circles
    init();

    // Introduce a delay (e.g., 1 second) before starting the animation
    await delay(1000);

    // Start the animation
    animate();
}

/**
 * Button Actions and Event Listeners
 */
const playButton = document.createElement('button');
playButton.textContent = 'Play';
document.body.appendChild(playButton);

const restartButton = document.createElement('button');
restartButton.textContent = 'Restart';
document.body.appendChild(restartButton);

function playSimulation(): void {
    animate();
}

// Event listeners for buttons
playButton.addEventListener('click', playSimulation);
restartButton.addEventListener('click', restartSimulation);

/**
 * Initial Invocation
 */
init();