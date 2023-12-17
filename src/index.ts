import utils from './utils';

interface Velocity {
    x: number;
    y: number;
}

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const c = canvas.getContext('2d')!;

canvas.width = innerWidth;
canvas.height = innerHeight;

const colors: string[] = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

// Objects
class Circle {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: Velocity;
    gravity: number;
    friction: number;

    constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: 0,
            y: 3
        }
        this.gravity = 1;
        this.friction = 0.8;
    }

    draw(): void {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    // Check if two circles are colliding
    isColliding(otherCircle: Circle): boolean {
        const distance = utils.distance(this.x, this.y, otherCircle.x, otherCircle.y);
        return distance < this.radius + otherCircle.radius;
    }

    // Check if circle is inside canvas
    isTouchingBorders(): boolean {
        // Check if any part of the circle is touching the canvas borders
        return (
            this.x - this.radius < 0 ||
            this.x + this.radius > canvas.width ||
            this.y - this.radius < 0 ||
            this.y + this.radius > canvas.height
        );
    }

    update(): void {
        this.draw();

        /** When ball hits th bottom of screen **/
        if (this.y + this.radius + this.velocity.y > canvas.height) {
            this.velocity.y = -this.velocity.y * this.friction
        } else {
            this.velocity.y += this.gravity
        }
        this.y += this.velocity.y;


        circles.forEach((otherCircle) => {
            if (otherCircle !== this && this.isColliding(otherCircle) && !this.isTouchingBorders()) {
                // Perform collision response
                const angle = Math.atan2(otherCircle.y - this.y, otherCircle.x - this.x);
                const overlap = this.radius + otherCircle.radius - utils.distance(this.x, this.y, otherCircle.x, otherCircle.y);

                const pushPosX = overlap / 2 * Math.cos(angle);
                const pushPosY = overlap / 2 * Math.sin(angle);

                // Move circles away from each other
                if (pushPosX + this.radius < canvas.width && pushPosY + this.radius < canvas.height) {
                    this.x -= pushPosX
                    this.y -= pushPosY
                }
                // Adjust velocities for a more realistic bounce
                const relativeVelocity = {
                    x: this.velocity.x - otherCircle.velocity.x,
                    y: this.velocity.y - otherCircle.velocity.y
                };

                const normal = {
                    x: Math.cos(angle),
                    y: Math.sin(angle)
                };

                const relativeSpeed = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

                if (relativeSpeed < 0) {
                    // Perform elastic collision
                    const impulse = (2 * relativeSpeed) / (1 / this.radius + 1 / otherCircle.radius);
                    this.velocity.x -= impulse * normal.x / this.radius;
                    this.velocity.y -= impulse * normal.y / this.radius;
                    otherCircle.velocity.x += impulse * normal.x / otherCircle.radius;
                    otherCircle.velocity.y += impulse * normal.y / otherCircle.radius;
                }
            }
        });
    }
}

// Implementation
let circles: Circle[];

function init(): void {
    circles = [];

    canvas.addEventListener('click', (event: MouseEvent) => {
        const x = event.clientX;
        const y = event.clientY;
        const radius = utils.randomIntFromRange(5, 50);
        const color = utils.randomColor(colors);

        circles.push(new Circle(x, y, radius, color));
    });
}

// Animation Loop
function animate(): void {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach((circle) => {
        circle.update();
    });
}

init();
animate();
