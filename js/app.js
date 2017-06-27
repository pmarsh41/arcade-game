// Player that must avoid Enemies
/*
var Player = function() {
    this.sprite = 'images/char-boy.png';
}
*/



// Enemies our player must avoid.
var Enemy = function(x, y, speed, direction) {
    this.x = x;
    this.y = y;
    this.speed = (Math.floor(Math.random()));
    this.direction = -1;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.move = function(dt) {
    if (this.direction === "left") {
        this.x = this.x - (dt * this.speed);
    } else if (this.direction === "right") {
        this.x = this.x + (dt * this.speed);
    }
};



// You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
Enemy.prototype.update = function(dt) {
    this.x = this.x + (this.speed * dt * this.direction);
    this.randomSpeed()

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Function for enemy's speed randomization
Enemy.prototype.randomSpeed = function() {
    this.speed = (Math.floor(Math.random() * -230));
};

//Player Movement
var Player = function(x, y) {
    this.x = 200;
    this.y = 400;
    this.sprite = 'images/char-boy.png';
    this.previousLocation = { x: this.x, y: this.y };
};

// Updates location of player
Player.prototype.update = function() {

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles key envents with direction parameters related
// to keystroke direction

Player.prototype.handleInput = function(direction) {
    this.previousLocation.x = this.x;
    this.previousLocation.y = this.x;

    if (direction === 'left' && this.x > 100) {
        this.x -= 100;
    }
    if (direction === 'up' && this.y > 100) {
        this.y -= 80;
    }
    if (direction === 'right' && this.x > -100 && this.x < 800) {
        this.x += 100;
    }
    if (direction === 'down' && this.y > 0 && this.y < 750) {
        this.y += 80;
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [
    new Enemy(600, 650),
    new Enemy(300, 560),
    new Enemy(500, 490),
    new Enemy(500, 250)
];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
