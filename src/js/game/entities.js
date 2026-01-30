// This file defines the entities in the game, such as the player character, rocks, and animals, including their behaviors and interactions.

class Player {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.x = 100;
        this.y = canvas.height - this.height - 20; // Positioned above the ground
        this.speed = 5;
        this.jumpPower = 10;
        this.isJumping = false;
        this.gravity = 0.5;
        this.velocityY = 0;
    }

    update() {
        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;

            if (this.y >= canvas.height - this.height - 20) {
                this.y = canvas.height - this.height - 20;
                this.isJumping = false;
                this.velocityY = 0;
            }
        }
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.velocityY = -this.jumpPower;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'blue'; // Placeholder color for the player
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Rock {
    constructor(x, y) {
        this.width = 30;
        this.height = 30;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = 'gray'; // Placeholder color for rocks
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Animal {
    constructor(x, y) {
        this.width = 40;
        this.height = 40;
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.fillStyle = 'brown'; // Placeholder color for animals
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const entities = {
    player: new Player(),
    rocks: [],
    animals: []
};

function createObstacles() {
    // Create rocks and animals at random positions
    for (let i = 0; i < 5; i++) {
        entities.rocks.push(new Rock(Math.random() * canvas.width, canvas.height - 50));
        entities.animals.push(new Animal(Math.random() * canvas.width, canvas.height - 50));
    }
}

createObstacles();