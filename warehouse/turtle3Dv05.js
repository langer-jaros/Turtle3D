/*
VERZE 0.4.3 J.L.
*/

//https://allenpike.com/modeling-plants-with-l-systems/

// A-FRAME
var scene = document.getElementById('scene01');

/*
NAJDE STŘEDNÍ BOD.
*/
function getMiddlePoint(originPoint, endPoint) {
    x = originPoint[0] + ((endPoint[0] - originPoint[0]) / 2);
    y = originPoint[1] + ((endPoint[1] - originPoint[1]) / 2);
    z = originPoint[2] + ((endPoint[2] - originPoint[2]) / 2);
    return [x, y, z];
}

function getRotationXMatrix(angle) {
    return math.matrix([
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ]).valueOf();
}

function getRotationYMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ]).valueOf();
}

function getRotationZMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]).valueOf();
}

function getUnitMatrix() {
    return math.matrix([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]).valueOf();
}

/*
SPOČÍTÁ DÉLKU DANÉHO VEKTORU V0.2.3 J.L.
*/
function getVecLen(endPoint, startPoint = [0, 0, 0]) {
    [x0, y0, z0] = startPoint;
    [x1, y1, z1] = endPoint;
    return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2 + (z1 - z0) ** 2);
}

function getVectorFromTwoPoints(a, b) {
    return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
}

function degToRad(deg) {
    return deg / 180 * Math.PI
}
/*
INCREMENT / DECREMENT COLOR VALUE
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

// TURTLE
/*
NETESTOVÁNO V0.2.3 J.L.
*/
const Turtle = function (positions = [0, 0, 0], rotations = [0, 0, 0], color = '#398D4D', penDown = true, radius = 0.5) {
    //set base parameters
    this.coordinates = positions;
    [rotX, rotY, rotZ] = rotations;
    this.color = color;
    this.penIsDown = penDown;
    this.radius = radius;
    this.tiny = 1;

    //setting origin transformation
    this.transofrmationM = getUnitMatrix();
    this.transofrmationM = math.multiply(getRotationXMatrix(degToRad(rotX)), this.transofrmationM);
    this.transofrmationM = math.multiply(getRotationYMatrix(degToRad(rotY)), this.transofrmationM);
    this.transofrmationM = math.multiply(getRotationZMatrix(degToRad(rotZ)), this.transofrmationM);

    this.rollRight = function (angle) {
        this.transofrmationM = math.multiply(getRotationYMatrix(degToRad(-angle)), this.transofrmationM);
    };

    this.rollLeft = function (angle) {
        this.transofrmationM = math.multiply(getRotationYMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.turnRight = function (angle) {
        this.transofrmationM = math.multiply(getRotationZMatrix(degToRad(-angle)), this.transofrmationM);
    };

    this.turnLeft = function (angle) {
        this.transofrmationM = math.multiply(getRotationZMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.pitchUp = function (angle) {
        this.transofrmationM = math.multiply(getRotationXMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.pitchDown = function (angle) {
        this.transofrmationM = math.multiply(getRotationXMatrix(degToRad(-angle)), this.transofrmationM);
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

    /*
    Z BODŮ NAJDE STŘEDY, ÚHLY A DÉLKU, ZAVOLÁ DRAWCYLINDER J.L.
    */
    this.drawLine = function (endPos, startPos = this.coordinates) {
        [x0, y0, z0] = startPos;
        [x1, y1, z1] = endPos;

        centerPos = getMiddlePoint(startPos, endPos);
        vector = getVectorFromTwoPoints(startPos, endPos);

        [dX, dY, dZ] = vector;

        vectorLen = getVecLen(vector);

        rotX = Math.acos(dY / vectorLen) / Math.PI * 180;
        rotY180 = ((dX ** 2 + dZ ** 2) != 0) ? Math.acos(dZ / Math.sqrt(dX ** 2 + dZ ** 2)) / Math.PI * 180 : 0;
        rotY = (dX > 0) ? rotY180 : 360 - rotY180;

        this.drawCylineder(centerPos, [rotX, rotY, 0], vectorLen);
    };

    /*
    JENOM NAKRESLÍ VÁLEC, SE STŘEDOVÝMI SOUŘADNICEMI, ROTACEMI A DÉLKOU V03 JL
    */
    this.drawCylineder = function (centerPos, rotations, len) {
        let el = document.createElement('a-cylinder');

        var position = '' + centerPos[0] + ' ' + centerPos[1] + ' ' + centerPos[2];
        el.setAttribute('position', position);
        el.setAttribute('height', len);

        this.radius = (len / 10) * this.tiny; // radius is 1/20 of length 
        el.setAttribute('radius', this.radius);
        //console.log('radius:',this.radius);
        el.setAttribute('color', this.color);
        //el.setAttribute('src', './bark.exr');


        var rotation = '' + rotations[0] + ' ' + rotations[1] + ' ' + ((rotations[2] + 360) % 360);
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

    /*
    DRAW LIST 
    */
    this.leaf = function () {
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

// PLANT
/**
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
* 
*/


/**
 * NETESTOVANO D.D
 */
const r1 = 0.9;

var plant1 = function(ch) {
    switch (ch) {
        case 'F':
            return 'Y[++++++MF][-----NF][^^^^^OF][&&&&&PF]';
            break;
        case 'M':
            return 'Z-M';
            break;
        case 'N':
            return 'Z+N';
            break;
        case 'O':
            return 'Z&O';
            break;
        case 'P':
            return 'Z^P';
            break;
        case 'Y':
            return 'Z-ZY+';
            break;
        case 'Z':
            return 'ZZ';
            break;
        default:
            return ch;
            break;
    }

}

var plant2 = function (ch) {
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

function drawPlant(str, step, angle) {
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
                stack.push([t.coordinates, t.transofrmationM, t.tiny, t.color])
                break;
            case ']':
                [coordinates, transofrmationM, tiny, color] = stack.pop();
                t.penUp();
                t.setPosition(coordinates);
                t.setHeading(transofrmationM);
                t.tiny = tiny;
                t.color = color;
                t.penDown();
                break;
            case '’':
                t.color = ColorLuminance(t.color, +0.15);
                break;
            case '!':
                t.tiny *= 0.7;
                break;
            case 'f':
                t.leaf();
                break;
            default:
                break;
        }
    }
}

var curve = function (ch) {
    switch (ch) {
        case 'X':
            return "^\\XF^\\XFX-F^//XFX&F+//XFX-F/X-/"
        default:
            return ch;
    }
}

var hilbertCurve = function (ch) {
    switch (ch) {
        case 'A':
            return "B-F+CFC+F-D&F∧D-F+&&CFC+F+B//"
        case 'B':
            return "A&F∧CFB∧F∧D∧∧-F-D∧|F∧B|FC∧F∧A//"
        case 'C':
            return "|D∧|F∧B-F+C∧F∧A&&FA&F∧C+F+B∧F∧D//"
        case 'D':
            return "|CFB-F+B|FA&F∧A&&FB-F+B|FC//"
        default:
            return ch;
    }
}

var getNextGen = function (prevString, prodRules) {
    var newString = '';
    var len = prevString.length;
    for (j = 0; j < len; j++) {
        newString += prodRules(prevString.charAt(j));
    }
    return newString;
}

var createObject = function (symbol, gens, rules, viewer, step, angle) {
    var i;
    string = symbol;
    for (i = 0; i < gens; i++) {
        string = getNextGen(string, rules);
        console.log("generated string", string)
        if (i == gens - 1) {
            //console.log("before viewer");
            viewer(string, step, angle);
        }
    }
};

// MAIN
const STEP = 3;
const TURN_ANGLE = 22.5;
const START_POSITION = [0, -5, -30];
const START_HEADING = [0, 180, 0];
const COLOR = '#2C3A21';
const START_SYMBOL = 'X';
const GENERATIONS = 4;

var t = new Turtle(START_POSITION, START_HEADING, COLOR);

//createObject(START_SYMBOL, GENERATIONS, curve, drawPlant, STEP, TURN_ANGLE);
createObject('A', GENERATIONS, plant2, drawPlant, STEP, TURN_ANGLE);
//createObject(START_SYMBOL, GENERATIONS, hilbertCurve, drawPlant, STEP, TURN_ANGLE);

/*
var plantStr = '';
plantStr = getPlant1Prescription('F', 3);
//console.log('plant1 string:', plantStr);
drawPlant(plantStr,45);
*/

// DEBUG


/*/
t.forward(STEP);
t.turnRight(45);
t.forward(STEP);
t.turnRight(15);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnLeft(45);
t.forward(STEP);
t.turnLeft(15);
t.forward(STEP);
t.turnLeft(30);
t.forward(STEP);


t.forward(STEP);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);
t.turnRight(30);
t.forward(STEP);

t.pitchUp(60);
t.forward(STEP);
t.pitchUp(60);
t.forward(STEP);
t.pitchUp(60);
t.forward(STEP);
t.forward(STEP);
t.forward(STEP);
t.pitchDown(60);
t.forward(STEP);
t.pitchDown(60);
t.forward(STEP);
t.pitchDown(60);
t.forward(STEP);

t.forward(STEP);
t.turnLeft(90);
t.forward(STEP);
t.rollLeft(90);
t.turnLeft(90);
t.forward(STEP);
t.turnLeft(90);
t.forward(STEP);

t.pitchUp(30);
t.rollRight(30);
t.turnRight(30);
t.forward(STEP);

t.pitchDown(90);
t.forward(STEP);
t.turnRight(90);
t.forward(STEP);
/*/

//// POMOCNÉ DEBUGGOVACÍ OBRAZCE, NA KTERÝCH JE DOBŘE VIDĚT JAK SETO CHOVÁ ////
// t.setPosition(10, 0, 100);
// //console.log('t.pos', t.pos);    

// t.drawCylineder([0,0,-30], [0,0,0], 10)
// t.drawLine([0, 5,-30], [0,-5,-30]);

//t.drawCylineder([0,0,-10], [30,0,0], 5)
//t.drawLine([0,0,-10], [10,-5,-20]);
//t.drawLine([0,0,-10], [-10,20,-25]);

//t.drawLine([-10,-10,-5]);

/*
t.turnRight(90);
t.forward(STEP);
t.turnRight(90);
t.forward(STEP);
*/

/*
t.drawLine([1,0,0]);
t.rollRight(45);
t.drawLine([1,5,2]);
*/
