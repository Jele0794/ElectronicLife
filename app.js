var plan = ['################################',
            '#             ####             #',
            '#   ###                        #',
            '#                      o       #',
            '#                         # #  #',
            '#          ###            ###  #',
            '#                          ##  #',
            '#               #####          #',
            '#   o         #######          #',
            '#                #       o     #',
            '#                              #',
            '#             ## #             #',
            '#       #       ##      ##     #',
            '#              #  #            #',
            '################################'];

var directions = {
    'n': new Vector(0, -1),
    'ne': new Vector(1, -1),
    'e': new Vector(1, 0),
    'se': new Vector(1, 1),
    's': new Vector(0, 1),
    'sw': new Vector(-1, 1),
    'w': new Vector(-1, 0),
    'nw':new Vector(-1, -1)
};

var directionNames = 'n ne e se s sw w nw'.split(' ')

/**
 * Simple abstraction of a vector wich contains 
 * two coordinates.
 *
 * @param {number} x Position in x.
 * @param {number} y Position in y.
 */
function Vector (x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Add a vector to the current vector.
 *
 * @param {Vector} other Vector to add.
 */
Vector.prototype.add = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

/**
 * Grid abstraction that has an space, represented
 * as a fixed array, a width and a height.
 *
 * @param {number} width Grid width.
 * @param {number} height Grid height.
 */
function Grid(width, height) {
    // create a new fixed array.
    this.space = new Array(width + height);
    this.width = width;
    this.height = height;
}

/**
 * Validate that a pair of coordinates are inside of
 * the grid.
 *
 * @param {Vector} vector Coordinates to search into the grid.
 */
Grid.prototype.isInside = function (vector) {
    return vector.x >= 0 && vector.x < this.width &&
           vector.y >=0 && vector.y < this.height;
};

/**
 * Search on the grid using a vector coordinates.
 *
 * @param {Vector} vector Vector used to search.
 */
Grid.prototype.get = function(vector) {
    return this.space[vector.x + this.width * vector.y];
};

/**
 * Assign the received value to the grid on the specific
 * coordinates.
 *
 * @param {Vector} vector Vector used to assign a value.
 * @param {string} value Value to be assigned.
 */
Grid.prototype.set = function(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
};

/**
 * Return a random element from the array.
 *
 * @param {Array} array Array that contains elements.
 */
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Abstraction of a simple Bouncing Critter.
 */
function BouncingCritter() {
    // assigns a random direction to the new bouncing critter.
    this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function(view) {
    if (view.look(this.direction) !== ' ') {
        this.direction = view.find(' ') || 's';
    }
    return {type: 'move', direction: this.direction};
};

/**
 * Return a created element depending on the legend object.
 *
 * @param {legend} legend Object that contains the meaning of each character in the map.
 * @param {string} ch Character that represents something in the map.
 */
function elementFromChar(legend, ch) {
    // if the character is an empty space.
    if (ch === ' ') {
        return null;
    }
    // create a new element from the legend passed as an argument.
    var element = new legend[ch]();
    element.originChar = ch;
    // return the created element.
    return element;
}

/**
 * Abstraction of a world that contains a grid with
 * existing elements and a legend used to define
 * each element of the world.
 *
 * @param {string[][]} map Array of string arrays that represent the map.
 * @param {legend} legend Object that contains the meaning of each character in the map.
 */
function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;

    // for each row on the map.
    map.forEach(function(line, y) {
        // for each element of the row.
        for (var x = 0; x < line.length; x++) {
            // set the element to the grid on the vector location.
            grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
        }
    });
}

/**
 * Return the original character assigned to a
 * created element.
 *
 * @param {*} element Created element using a legend object.
 */
function charFromElement(element) {
    if (element === null) {
        return ' ';
    } else {
        return element.originChar;
    }
}

/**
 * Get every element inside a world grid and
 * concat it to a string. Finally, return the string.
 */
World.prototype.toString = function() {
    var output = '';
    for (var y = 0; y < this.grid.height; y++) {
        for (var x = 0; x < this.grid.width; x++) {
            var element = this.grid.get(new Vector(x, y));
            output += charFromElement(element);
        }
        output += '\n';
    }
    return output;
}

/**
 * Simple abstraction of a wall.
 */
function Wall() {}

var world = new World(plan, {'#': Wall, 'o': BouncingCritter});

console.log(world.toString())