/**
 * Turtle3D (Turtle graphics) implemented in JavaScript using framework A-frame.
 * 
 * Version 1.0.0
 * 
 * Inspiration: https://allenpike.com/modeling-plants-with-l-systems/
 */

// A-FRAME
var scene = document.getElementById('scene01');

/**
 * Retrieves a midpoint between given startpoint and endpoint.
 */
function getMiddlePoint(startPoint, endPoint) {
    x = startPoint[0] + ((endPoint[0] - startPoint[0]) / 2);
    y = startPoint[1] + ((endPoint[1] - startPoint[1]) / 2);
    z = startPoint[2] + ((endPoint[2] - startPoint[2]) / 2);
    return [x, y, z];
}

/**
 * Retrieves a rotation matrix rotated around X axis with angle given in radians.
 */
function getRotationXMatrix(angle) {
    return math.matrix([
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ]).valueOf();
}

/**
 * Retrieves a rotation matrix rotated around Y axis with angle given in radians.
 */
function getRotationYMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ]).valueOf();
}

/**
 * Retrieves a rotation matrix rotated around Z axis with angle given in radians.
 */
function getRotationZMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]).valueOf();
}

/**
 * Retrieves a three dimensional unitary matrix.
 */
function getUnitMatrix3D() {
    return math.matrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]).valueOf();
}

/**
 * Retrieves a length of a given vector.
 */
function getVecLen(endPoint, startPoint=[0, 0, 0]) {
    [x0, y0, z0] = startPoint;
    [x1, y1, z1] = endPoint;
    return Math.sqrt((x1 - x0)**2 + (y1 - y0)**2 + (z1 - z0)**2);
}

/**
 * Retrieves a vector from startPoint a to endPoint.
 */
function getVectorFromTwoPoints(startPoint, endPoint) {
    return [endPoint[0] - startPoint[0],
            endPoint[1] - startPoint[1], 
            endPoint[2] - startPoint[2]];
}

/**
 * Converts degrees to radians.
 */
function degToRad(deg) {
    return deg / 180 * Math.PI
}

/**
 * INCREMENT / DECREMENT COLOR VALUE
 */
function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}

/**
 * Turtle class.
 */
const Turtle = function (positions=[0, 0, 0], rotations=[0, 0, 0], color='#398D4D', penDown=true, radius=0.5) {
    // Setting the base parameters.
    this.coordinates = positions;
    [rotX, rotY, rotZ] = rotations;
    this.color = color;
    this.penIsDown = penDown;
    this.radius = radius;
    this.scaleTiny = 1;

    // Setting of the initial rotatins.
    this.transofrmationM = getUnitMatrix3D();
    this.transofrmationM = math.multiply(getRotationXMatrix(degToRad(rotX)), this.transofrmationM);
    this.transofrmationM = math.multiply(getRotationYMatrix(degToRad(rotY)), this.transofrmationM);
    this.transofrmationM = math.multiply(getRotationZMatrix(degToRad(rotZ)), this.transofrmationM);

    this.turnLeft = function (angle) {
        this.transofrmationM = math.multiply(getRotationZMatrix(degToRad(angle)), this.transofrmationM);
    };
    
    this.turnRight = function (angle) {
        this.transofrmationM = math.multiply(getRotationZMatrix(degToRad(-angle)), this.transofrmationM);
    };

    this.pitchDown = function (angle) {
        this.transofrmationM = math.multiply(getRotationXMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.pitchUp = function (angle) {
        this.transofrmationM = math.multiply(getRotationXMatrix(degToRad(-angle)), this.transofrmationM);
    };

    this.rollLeft = function (angle) {
        this.transofrmationM = math.multiply(getRotationYMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.rollRight = function (angle) {
        this.transofrmationM = math.multiply(getRotationYMatrix(degToRad(-angle)), this.transofrmationM);
    };

    this.penUp = function () {
        this.penIsDown = false;
    };
    
    this.penDown = function () {
        this.penIsDown = true;
    };
    
    this.setPosition = function (position) {
        this.coordinates = position;
    };

    this.setHeading = function (transofrmationM) {
        this.transofrmationM = transofrmationM;
    };

   /**
    * Calculates vector midpoints, angles, length and calls function drawCylinder.
    */
   this.drawLine = function (endPos, startPos=this.coordinates) {
        [x0, y0, z0] = startPos;
        [x1, y1, z1] = endPos;

        centerPos = getMiddlePoint(startPos, endPos);
        vector = getVectorFromTwoPoints(startPos, endPos);

        [dX, dY, dZ] = vector;

        vectorLen = getVecLen(vector);

        rotX = Math.acos(dY / vectorLen) / Math.PI * 180;
        rotY180 = ((dX**2 + dZ**2) != 0)? Math.acos(dZ / Math.sqrt(dX**2 + dZ**2)) / Math.PI * 180: 0;
        rotY = (dX > 0)? rotY180: 360 - rotY180;

        this.drawCylineder(centerPos, [rotX, rotY, 0], vectorLen);
    };

    /**
     * Draws cylinder with given center positions, rotations, and cylinder length.
     */
    this.drawCylineder = function (centerPos, rotations, len) {
        let el = document.createElement('a-cylinder');
        
        var position = ''+centerPos[0]+' '+centerPos[1]+' '+centerPos[2];
        el.setAttribute('position', position);
        el.setAttribute('height', len);
        
        this.radius = (len / 10) * this.scaleTiny;
        el.setAttribute('radius', this.radius);
        el.setAttribute('color', this.color);
        //el.setAttribute('src', './bark.exr');
        
        var rotation = ''+rotations[0]+' '+rotations[1]+' '+((rotations[2] + 360) % 360);
        el.setAttribute('rotation', rotation);
        el.setAttribute('shadow');

        scene.appendChild(el);
    };

    this.forward = function (length) {
        vector = [0, length, 0];
        inverseM = math.inv(this.transofrmationM);

        rotatedV = math.multiply(inverseM, vector);
        newPos = math.add(this.coordinates, rotatedV);

        if (this.penIsDown) {
            this.drawLine(newPos, this.coordinates);
            this.setPosition(newPos);
        }
    };

    /**
     * Draws leaf as a sphere.
     */
    this.drawLeaf = function () {
        rotY = degToRad(Math.random() * Math.floor(18000));
        rotX = degToRad(Math.random() * Math.floor(18000));
        rotations = [rotX, rotY, 0];
        var pos = this.coordinates[0] + ' ' + this.coordinates[1] + ' ' + this.coordinates[2];
        let el = document.createElement('a-sphere');
        el.setAttribute('position', pos);
        el.setAttribute('radius', Math.abs(1 - this.radius));
        //el.setAttribute('src', './leaf.exr');        
        var rotation = '' + rotations[0] + ' ' + rotations[1] + ' ' + ((rotations[2] + 360) % 360);
        el.setAttribute('rotation', rotation);
        el.setAttribute('color', '#CB72CF');

        scene.appendChild(el);
    };
}

/**
 * Plant's symbol meaning
 * 
 * + Turn left by angle α, using rotation matrix RU(α).
 * − Turn right by angle α, using rotation matrix RU(−α).
 * & Pitch down by angle α, using rotation matrix RL(α).
 * ^ Pitch up by angle α, using rotation matrix RL(−α).
 * \ Roll left by angle α, using rotation matrix RH(α).
 * / Roll right by angle α, using rotation matrix RH(−α).
 * | Turn around, using rotation matrix RU(180◦).
 * 
 * R = right, L = left
 * U = Y axis
 * L = X axis
 * H = Z axis
 */

var plant = function (ch) {
    switch (ch) {
        case 'A':
            return '[&FL!Af]/////’[&FL!Af]///////’[&FL!Af]';
            break;
        case 'F':
            return 'S ///// F';
            break;
        case 'S':
            return 'F L';
            break;
        case 'L':
            return '[’’’∧∧]';
            break;
        default:
            return ch;
    }
}

/**
 * 
 * @param {*} str 
 * @param {*} step 
 * @param {*} angle 
 */
function drawPlant(str, step, angle, t) {
    var stack = [];
    for (let i = 0; i < str.length; i++) {
        switch (str[i]) {
            case 'F':
                t.forward(step);
                break;
            case '+':
                t.turnLeft(angle);
                break;
            case '−':
                t.turnRight(angle);
                break;
            case '&':
                t.pitchDown(angle);
                break;
            case '^':
                t.pitchUp(angle);
                break;
            case '\\':
                t.rollLeft(angle);
                break;
            case '/':
                t.rollRight(angle);
                break;
            case '|':
                t.rollLeft(180);
                break;
            case '[':
                stack.push([t.coordinates, t.transofrmationM, t.scaleTiny, t.color])
                break;
            case ']':
                [coordinates, transofrmationM, scaleTiny, color] = stack.pop();
                t.penUp();
                t.setPosition(coordinates);
                t.setHeading(transofrmationM);
                t.scaleTiny = scaleTiny;
                t.color = color;
                t.penDown();
                break;
            case '’':
                t.color = ColorLuminance(t.color, +0.15);
                break;
            case '!':
                t.scaleTiny *= 0.7;
                break;
            case 'f':
                t.drawLeaf();
                break;
            default:
                break;
        }
    }
}

/**
 * Generates next generation of given string with given production rules.
 */
var getNextGen = function (prevString, prodRules) {
    var newString = '';
    var len = prevString.length;
    for (j = 0; j < len; j++) {
        newString += prodRules(prevString.charAt(j));
    }
    return newString;
}

/**
 * Generates desired number of generations of the ruling string.
 * Visualize the string with a viewer function.
 */
var generateAndShow = function (symbol, gens, rules, viewer, step, angle, turtle) {
    var i;
    string = symbol;
    for (i = 0; i < gens; i++) {
        string = getNextGen(string, rules);
        //console.log("generated string", string)
        if (i == gens - 1) {
            //console.log("before viewer");
            viewer(string, step, angle, turtle);
        }
    }
};

// MAIN
const STEP = 4;
const TURN_ANGLE = 22.5;
const START_POSITION = [0, -10, -30];
const START_HEADING = [0, 180, 0];
const COLOR = '#2C3A21';
const START_SYMBOL = 'A';
const GENERATIONS = 4;
const TURTLE = new Turtle(START_POSITION, START_HEADING, COLOR);

generateAndShow(START_SYMBOL, GENERATIONS, plant, drawPlant, STEP, TURN_ANGLE, TURTLE);
