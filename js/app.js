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
    this.lives = 3;
    this.score = 0;
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
    this.previousLocation = {x: this.x, y: this.y};
    this.score = 0;
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

Player.prototype.win = function() {
    console.log("score");
    this.score += 10;
    document.getElementById('player-score').innerHTML = this.score;
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

var Gem = function() {

    this.spriteRange = ["images/blue-gem.png", "images/Heart.png"];

    this.y = 200;
    this.yRange = [60, 80, 100];
    this.xRange = [60, 80, 350];
    this.x = startPos;
    var startPos = this.xRange[0];
}
var gem1 = new Gem();
var gem2 = new Gem();
var gem3 = new Gem();
var allGems = [gem1, gem2, gem3];

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

function gemCollisions() {
    for (var i = 0; i < allGems.length; i++) {
        if (Math.abs(player.x - allGems[i].x) < 60 && Math.abs(player.y - allGems[i].y) < 60) {
            player.win();
            allGems[i].reset();
        }
    }
};


Gem.prototype.getRandomY = function() {
    return this.yRange[Math.floor(Math.random() * this.yRange.length)];
}
Gem.prototype.getRandomX = function() {
    return this.xRange[Math.floor(Math.random() * this.xRange.length)];
}
Gem.prototype.getRandomSprite = function() {
    return this.spriteRange[Math.floor(Math.random() * this.spriteRange.length)];
}

Gem.prototype.reset = function() {
    this.y = this.getRandomY();
    this.x = this.getRandomX();
    this.sprite = this.getRandomSprite();
};


Gem.prototype.update = function() {
    this.reset();
}

allGems.forEach(function(gem) {
    gem.update();
});
