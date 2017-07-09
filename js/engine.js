/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 1010;
    canvas.height = 1010;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }
    // Rectangle

    var Rectangle = function(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.right = this.left + width;
        this.bottom = this.top + height;
        this.width = width;
        this.height = height;
    };

    //Check Collisions
    function checkCollisions() {
        var playerRect = new Rectangle(
            player.x + 28,
            player.y + 124,
            44,
            47);

        allEnemies.forEach(function(bug) {
            var bugRect = new Rectangle(
                bug.x + 28,
                bug.y + 124,
                44,
                47);
            // Check to see if the rectangles overlap
            if (doRectanglesIntersect(bugRect, playerRect)) {
                player.x = 400;
                player.y = 800;
                console.log("Player collided with a bug!");
            }

            obstacles.forEach(function(obstacle) {
                var obstacleRect = new Rectangle(
                    obstacle.x + 28,
                    obstacle.y + 124,
                    44,
                    47);

                if (doRectanglesIntersect(bugRect, obstacleRect)) {
                    if (bug.sprite === 'images/LeftEnemyBug.png') {
                        bug.sprite = 'images/RightEnemyBug.png';
                    } else {
                        bug.sprite = 'images/LeftEnemyBug.png';
                    }
                    bug.direction *= -1;
                    bug.update(1);
                    console.log("Bug hit an obstacle!");
                }
            })
        });

        obstacles.forEach(function(obstacle) {
            var obstacleRect = new Rectangle(
                obstacle.x + 28,
                obstacle.y + 124,
                44,
                47);


            // Check to see if the rectangles overlap
            if (doRectanglesIntersect(obstacleRect, playerRect)) {
                console.log("Player collided with an obstacle!");
                if (obstacle.tileInfo.sprite === Door.sprite) {
                    console.log("Player reached the doors!");
                    player = new Player();
                } else {
                    player.x = player.previousLocation.x;
                    player.y = player.previousLocation.y;
                }
            }
        });

        for (index = 0; index < baseLayer[0].length; index++) {
            var waterTile = baseLayer[0][index];
            var waterRect = new Rectangle(
                waterTile.x + 28,
                waterTile.y + 80,
                44,
                47);
            if (doRectanglesIntersect(playerRect, waterRect)) {
                console.log("Player collided with water!");
                player.x = player.previousLocation.x;
                player.y = player.previousLocation.y;
                break;
            }
        }

        keepTheseItems = [];
        items.forEach(function(item) {
            var itemRect = new Rectangle(
                item.x, // + 28,
                item.y, // + 124,
                44,
                47);
            if (doRectanglesIntersect(itemRect, playerRect)) {
                console.log("Player picked up an item!");
            } else {
                keepTheseItems.push(item);
            }

        });
        items = keepTheseItems;
    }
    // Checks to see if rectangle variables intersect. Parameters: rectangle 1 and rectangle 2
    function doRectanglesIntersect(r1, r2) {
        return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */

    // Updates all the enemies (using enemy paramater) and player entities
    // on the canvas using the dt parameter.
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });

        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */

    // These variables determines the types of object (excluding enemies)
    // the player might interact with on the level map.
    var IMPASSABLE = 0,
        PASSABLE = 1,
        ITEM = 2,
        /*Game Objects*/
        // ITEMS to pick up
        Key = { sprite: 'images/Key.png', type: ITEM },
        Green_Gem = { sprite: 'images/Small Green Gem.png', type: ITEM },

        // PASSABLE tiles the character and bugs can walk on
        Wood = { sprite: 'images/Wood Block.png', type: PASSABLE },
        Wood2 = { sprite: 'images/Wood Block2.png', type: PASSABLE },
        Grass = { sprite: 'images/Grass Block.png', type: PASSABLE },
        Stone = { sprite: 'images/Stone Block.png', type: PASSABLE },
        Plain = { sprite: 'images/Plain Block.png', type: PASSABLE },

        // IMPASSABLE tiles the character and bugs cannot walk on
        Water = { sprite: 'images/Dark Water Block.png', type: IMPASSABLE },
        Door = { sprite: 'images/Door.png', type: IMPASSABLE },
        Tree = { sprite: 'images/tall-tree.png', type: IMPASSABLE },
        Wall = { sprite: 'images/Wall Block Tall.png', type: IMPASSABLE },
        Roof_SW = { sprite: 'images/Roof South West.png', type: IMPASSABLE },
        Roof_SE = { sprite: 'images/Roof South East.png', type: IMPASSABLE },
        Roof_S = { sprite: 'images/Roof South.png', type: IMPASSABLE },
        Rock = { sprite: 'images/Rock.png', type: IMPASSABLE },
        Bush = { sprite: 'images/Bush.png', type: IMPASSABLE },
        Statue = { sprite: 'images/Statue.png', type: IMPASSABLE },

        numRows,
        numCols,
        col,
        row,
        index,
        obstacle,
        item,
        buildingPiece;

    // Tile variable determines information about the tile, the x-position, and
    // the y-position of the tile on the level map. Used to aid in laying the
    // tiles for the level map.
    var Tile = function(tileInfo, x, y) {
        this.tileInfo = tileInfo;
        this.x = x;
        this.y = y;
    };

    /*LEVEL 1*/
    var baseLayer = [
        [new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water), new Tile(Water)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)],
        [new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass), new Tile(Grass)]
    ];

    var tileXSpan = 101,
        tileYSpan = 80;
    for (row = 0; row < 10; row++) {
        for (col = 0; col < 10; col++) {
            var tile = baseLayer[row][col];
            tile.y = tileYSpan * (row + 1.5);
            tile.x = tileXSpan * col;
        }
    }

    var obstacles = [
        new Tile(Tree, 115, 340),
        new Tile(Rock, 202, 340),
        new Tile(Tree, 303, 400),
        new Tile(Bush, 302, 660),
        new Tile(Rock, 402, 650),
        new Tile(Bush, 502, 670),
        new Tile(Rock, 502, 570),
        new Tile(Bush, 402, 570),
        new Tile(Bush, 602, 570),
        new Tile(Bush, 807, 320),
        new Tile(Bush, 707, 320),
        new Tile(Bush, 807, 410),
        new Tile(Bush, 607, 320),
        new Tile(Bush, 607, 405)
    ];

    for (row = 1.5; row < 9; row++) {
        obstacles.push(new Tile(Tree, 35, row * 101));
        obstacles.push(new Tile(Tree, -25, row * 101));
        obstacles.push(new Tile(Tree, 880, row * 101));
        obstacles.push(new Tile(Tree, 940, row * 101));
    }

    var items = [
        new Tile(Key, 135, 500),
        new Tile(Green_Gem, 730, 485)
    ];

    obstacles.push(new Tile(Door, 505, 80));
    obstacles.push(new Tile(Door, 405, 80));

    var building = [
        new Tile(Wall, 605, 82),
        new Tile(Wall, 305, 82),
        new Tile(Wood2, 260, 150),
        new Tile(Wood, 605, 150),
        new Tile(Roof_SW, 305, 0),
        new Tile(Roof_SE, 605, 0),
        new Tile(Roof_S, 405, 0),
        new Tile(Roof_S, 505, 0),
        new Tile(Tree, 270, 130),
        new Tile(Tree, 640, 130)
    ];

    // Renders the level map on the canvas using the baseLayer, obstacles, building,
    // items, and building variables.
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        numRows = baseLayer.length;
        for (row = 0; row < numRows; row++) {
            numCols = baseLayer[row].length;
            for (col = 0; col < numCols; col++) {
                var tile = baseLayer[row][col];
                ctx.drawImage(Resources.get(tile.tileInfo.sprite), tile.x, tile.y);
            }
        }

        /*Objects in Level 1*/
        for (index = 0; index < obstacles.length; index++) {
            obstacle = obstacles[index];
            ctx.drawImage(Resources.get(obstacle.tileInfo.sprite), obstacle.x, obstacle.y);
        }



        /*Items in Level 1*/
        for (index = 0; index < items.length; index++) {
            item = items[index];
            ctx.drawImage(Resources.get(item.tileInfo.sprite), item.x, item.y);
        }

        renderEntities();
    }

    function renderEntities(score) {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();

        {

            allGems.forEach(function(gem) {
                if (player.score > 200 && player.score < 400) {
                    gem.render();
                }
            });
        }



    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */

    Resources.load([
        'images/Dark Water Block.png',
        'images/Rock.png',
        'images/tall-tree.png',
        'images/Bush.png',
        'images/Grass Block.png',
        'images/Bush.png',
        'images/Key.png',
        'images/Small Green Gem.png',
        'images/Door.png',
        'images/Statue.png',
        'images/Wall Block Tall.png',
        'images/Roof South West.png',
        'images/Roof South East.png',
        'images/Roof South.png',
        'images/Wood Block.png',
        'images/Wood Block2.png',
        'images/Stone Block.png',
        'images/Plain Block.png',
        'images/char-boy.png',
        'images/RightEnemyBug.png',
        'images/LeftEnemyBug.png',
        'images/enemy-bug.png',
        'images/blue-gem.png',
        'images/Heart.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */

    global.ctx = ctx;
})(this);
