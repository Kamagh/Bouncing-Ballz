import utils from './assets/utils';

/**
 * Represents the velocity of an object in 2D space.
 * @interface
 */
interface Velocity {
    x: number;
    y: number;
}

/**
 * Represents a circle in the canvas.
 * @class
 */
export class Circle {
    x: number;
    y: number;
    c:  CanvasRenderingContext2D;
    radius: number;
    color: string;
    velocity: Velocity;
    gravity: number;
    friction: number;
    mass: number;
    canvas: HTMLCanvasElement;
    circles: Circle[];
    private angle: number;

    /**
     * Creates a new Circle.
     * @constructor
     * @param canvas
     * @param circles
     * @param {number} x - The x-coordinate of the center.
     * @param {number} y - The y-coordinate of the center.
     * @param c
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The color of the circle.
     */
    constructor(
        canvas: HTMLCanvasElement,
        circles: Circle[],
        x: number,
        y: number,
        c: CanvasRenderingContext2D,
        radius: number,
        color: string
    ) {
        this.canvas = canvas;
        this.circles = circles;
        this.x = x;
        this.y = y;
        this.c = c;
        this.radius = radius;
        this.color = color;
        this.velocity = { x: 0, y: 3 };
        this.gravity = 0.5;
        this.friction = 0.8;
        this.mass = 1;
    }

    /**
     * Draws the circle on the canvas.
     * @method
     */
    draw(): void {
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.c.fillStyle = this.color;
        this.c.fill();
        this.c.closePath();
    }

    /**
     * Checks if two circles are colliding.
     * @method
     * @param {Circle} otherCircle - The other circle to check for collision.
     * @returns {boolean} True if the circles are colliding, false otherwise.
     */
    isColliding(otherCircle: Circle): boolean {
        const distance = utils.distance(this.x, this.y, otherCircle.x, otherCircle.y);
        return distance <= this.radius + otherCircle.radius;
    }

    /**
     * Checks if the circle is touching the canvas borders.
     * @method
     * @returns {boolean} True if the circle is touching the borders, false otherwise.
     */
    isTouchingBorders(): boolean {
        return (
            this.x - this.radius < 0 ||
            this.x + this.radius > innerWidth ||
            this.y - this.radius < 0 ||
            this.y + this.radius > innerHeight
        );    }

    /**
     * Updates the position and behavior of the circle.
     * @method
     */
    update(): void {
        this.draw();
        this.applyGravity();
        this.handleCollisions();
    }

    private applyGravity(): void {
        if (this.y + this.radius + this.velocity.y > this.canvas.height) {
            this.bounceOffGround();
        } else {
            this.velocity.y += this.gravity;
        }

        this.y += this.velocity.y;
    }

    private bounceOffGround(): void {
        this.velocity.y = -this.velocity.y * this.friction;
    }

    private handleCollisions(): void {
        this.circles.forEach((otherCircle, otherIndex) => {
            if (this.shouldHandleCollision(otherCircle)) {
                this.performCollisionResponse(otherCircle, otherIndex);
            }
        });
    }

    private shouldHandleCollision(otherCircle: Circle): boolean {
        return otherCircle !== this && this.isColliding(otherCircle) && !this.isTouchingBorders();
    }

    private performCollisionResponse(otherCircle: Circle, otherIndex: number): void {
        this.angle = Math.atan2(otherCircle.y - this.y, otherCircle.x - this.x);
        const overlap = this.radius + otherCircle.radius - utils.distance(this.x, this.y, otherCircle.x, otherCircle.y);

        const pushPosX = overlap / 2 * Math.cos(this.angle);
        const pushPosY = overlap / 2 * Math.sin(this.angle);

        if (this.shouldBounceOffFlatGround()) {
            this.bounceOffFlatGround();
        } else {
            this.slightlyBounceOffOtherCircle(pushPosX, pushPosY, otherCircle, otherIndex);
        }
    }

    private shouldBounceOffFlatGround(): boolean {
        return this.y + this.radius + this.velocity.y > this.canvas.height - 5;
    }

    private bounceOffFlatGround(): void {
        this.velocity.y = -this.velocity.y * this.friction;
    }

    private slightlyBounceOffOtherCircle(pushPosX: number, pushPosY: number, otherCircle: Circle, otherIndex: number): void {
        if (this.isSafeToMoveCircles(pushPosX, pushPosY)) {
            this.moveCirclesAway(pushPosX, pushPosY, otherCircle);
            this.adjustVelocitiesForRealisticBounce(pushPosX, pushPosY, otherCircle);
            this.removeCirclesIfSameColor(otherCircle, otherIndex);
        }
    }

    private isSafeToMoveCircles(pushPosX: number, pushPosY: number): boolean {
        return pushPosX + this.radius < this.canvas.width && pushPosY + this.radius < this.canvas.height;
    }

    private moveCirclesAway(pushPosX: number, pushPosY: number, otherCircle: Circle): void {
        const mtvX = this.calculateMTV(pushPosX, this.radius + otherCircle.radius);
        const mtvY = this.calculateMTV(pushPosY, this.radius + otherCircle.radius);

        this.moveCircle(this, -mtvX, -mtvY);
        this.moveCircle(otherCircle, mtvX, mtvY);

        this.ensureCirclesWithinBounds();
    }

    private calculateMTV(push: number, sumOfRadii: number): number {
        return push > 0 ? Math.min(push, sumOfRadii) : Math.max(push, -sumOfRadii);
    }

    private moveCircle(circle: Circle, offsetX: number, offsetY: number): void {
        circle.x += offsetX;
        circle.y += offsetY;
    }

    private ensureCirclesWithinBounds(): void {
        this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));
    }

    private adjustVelocitiesForRealisticBounce(pushPosX: number, pushPosY: number, otherCircle: Circle): void {
        const relativeVelocity = {
            x: this.velocity.x - otherCircle.velocity.x,
            y: this.velocity.y - otherCircle.velocity.y
        };

        const normal = {
            x: Math.cos(this.angle),
            y: Math.sin(this.angle)
        };

        const relativeSpeed = relativeVelocity.x * normal.x + relativeVelocity.y * normal.y;

        if (relativeSpeed < 0) {
            this.elasticCollision(otherCircle, normal, relativeSpeed);
        }
    }

    private elasticCollision(otherCircle: Circle, normal: { x: number, y: number }, relativeSpeed: number): void {
        const impulse = (2 * relativeSpeed) / (1 / this.radius + 1 / otherCircle.radius);
        this.velocity.x -= impulse * normal.x / this.radius;
        this.velocity.y -= impulse * normal.y / this.radius;
        otherCircle.velocity.x += impulse * normal.x / otherCircle.radius;
        otherCircle.velocity.y += impulse * normal.y / otherCircle.radius;
    }

    private removeCirclesIfSameColor(otherCircle: Circle, otherIndex: number): void {
        if (this.color === otherCircle.color) {
            this.circles.splice(otherIndex, 1);
            this.circles.splice(this.circles.indexOf(this), 1);
        }
    }
}
