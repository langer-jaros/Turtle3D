/*
VERZE 0.4.3 J.L.
*/

//https://allenpike.com/modeling-plants-with-l-systems/

// A-FRAME
var scene = document.getElementById('scene01');

// SUBFUNCTIONS
function addMatrices(mA, mB) {
    return math.add(mA, mB);
}

/*
FUNGUJE D.D
*/
function multiplyMatrices(mA, mB) {
    return math.multiply(mA, mB);
}

/*
FUNGUJE D.D.
*/
function matrixInvert(M) {
    return math.inv(M);
}

/*
NAJDE STŘEDNÍ BOD.
FUNGUJE DOBŘE, ZMĚNA V0.3 J.L.
*/
function getMiddlePoint(originPoint, endPoint) {
    x = originPoint[0] + ((endPoint[0] - originPoint[0]) / 2);
    y = originPoint[1] + ((endPoint[1] - originPoint[1]) / 2);
    z = originPoint[2] + ((endPoint[2] - originPoint[2]) / 2);
    return [x, y, z];
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationXMatrix(angle) {
    return math.matrix([
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]
    ]).valueOf();
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationYMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ]).valueOf();
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationZMatrix(angle) {
    return math.matrix([
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ]).valueOf();
}

/*
FUNGUJE
*/
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
function getVecLen(endPoint, startPoint=[0, 0, 0]) {
    [x0, y0, z0] = startPoint;
    [x1, y1, z1] = endPoint;
    console.log('x0, y0, z0', x0, y0, z0);
    console.log('x1, y1, z1', x1, y1, z1);
    return Math.sqrt((x1 - x0)**2 + (y1 - y0)**2 + (z1 - z0)**2);
}

/*
FUNGUJE D.D.
*/
function getVectorFromTwoPoints(a, b) {
    //bod A,B, vector V = AB->:
    // B-A = V
    return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
}

/*
FUNGUJE D.D.
*/
function getVectorInBase(vector, base) {
    // base 3*3, vector 1*3
    //nasobeni vectoru
    return multiplyMatrices(vector, base);
    /*xn = base[0][0]*vector[0]+base[0][1]*vector[1]+base[0][2]*vector[2];
    yn = base[1][0]*vector[0]+base[1][1]*vector[1]+base[1][2]*vector[2];
    zn = base[2][0]*vector[0]+base[2][1]*vector[1]+base[2][2]*vector[2];
    return [xn,yn,zn];*/
}

/*
FUNGUJE D.D.
*/
function getEndPoint(originPoint, vector) {
    //endPoint-OriginPoint = vector
    return [vector[0] + originPoint[0], vector[1] + originPoint[1], vector[2] + originPoint[2]];
}

/*
NETESTOVÁNO V0.3 J.L.
*/
function modifyLenghtOfVector(vector, length) {
    //u = (lenght/|vector|)*vector
    len = length / getLenght(vector);
    return [len * vector[0], len * vector[1], len * vector[2]];
};

function degToRad(deg) {
    return  deg / 180 * Math.PI
}

function arrFromVec(vec) {
    return [vec.x, vec.y, vec.z];
}

const Vector = function (arr) {
    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[2];
    
    this.getArray = function () {
        return [this.x, this.y, this.z];
    }
};

// TURTLE
/*
NETESTOVÁNO V0.2.3 J.L.
*/
const Turtle = function (positions=[0, 0, 0], rotations=[0, 0, 0], color='green', penDown=true) {
    this.coordinates = positions;
    [rotX, rotY, rotZ] = rotations;
    this.color = color;
    this.penIsDown = penDown;
    console.log('this.coordinates', this.coordinates);

    this.transofrmationM = getUnitMatrix();
    this.transofrmationM = multiplyMatrices(getRotationXMatrix(degToRad(rotX)), this.transofrmationM);
    this.transofrmationM = multiplyMatrices(getRotationYMatrix(degToRad(rotY)), this.transofrmationM);
    this.transofrmationM = multiplyMatrices(getRotationZMatrix(degToRad(rotZ)), this.transofrmationM);
    console.log('this.transofrmationM', this.transofrmationM);
    this.inverseM = matrixInvert(this.transofrmationM);

    this.rollRight = function (angle) {
        this.transofrmationM = multiplyMatrices(getRotationYMatrix(degToRad(-angle)), this.transofrmationM);
    };

    this.rollLeft = function (angle) {
        this.transofrmationM = multiplyMatrices(getRotationYMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.turnRight = function (angle) {
        this.transofrmationM = multiplyMatrices(getRotationZMatrix(degToRad(-angle)), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
    };

    this.turnLeft = function (angle) {
        this.transofrmationM = multiplyMatrices(getRotationZMatrix(degToRad(angle)), this.transofrmationM);
        console.log('this.transofrmationM', this.transofrmationM);
    };

    this.pitchUp = function (angle) {
        this.transofrmationM = multiplyMatrices(getRotationXMatrix(degToRad(angle)), this.transofrmationM);
    };

    this.pitchDown = function (angle) {
        this.transofrmationM = multiplyMatrices(getRotationXMatrix(degToRad(-angle)), this.transofrmationM);
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
   this.drawLine = function (endPos, startPos=this.coordinates) {
        [x0, y0, z0] = startPos;
        console.log('x0, y0, z0', x0, y0, z0);

        [x1, y1, z1] = endPos;
        console.log('x1, y1, z1', x1, y1, z1);

        centerPos = getMiddlePoint(startPos, endPos);

        vector = getVectorFromTwoPoints(startPos, endPos);
        [dX, dY, dZ] = vector;
        console.log('dX, dY, dZ:', dX, dY, dZ);

        vectorLen = getVecLen(vector);
        console.log('vectorLen', vectorLen);

        rotX = Math.acos(dY / vectorLen) / Math.PI * 180;
        console.log('rotX', rotX);

        rotY180 = ((dX**2 + dZ**2) != 0)? Math.acos(dZ / Math.sqrt(dX**2 + dZ**2)) / Math.PI * 180: 0;
        console.log('rotY180', rotY180);
        rotY = (dX > 0)? rotY180: 360 - rotY180;
        console.log('rotY', rotY);

        this.drawCylineder(centerPos, [rotX, rotY, 0], vectorLen);
    };

    /*
    JENOM NAKRESLÍ VÁLEC, SE STŘEDOVÝMI SOUŘADNICEMI, ROTACEMI A DÉLKOU V03 JL
    */
    this.drawCylineder = function (centerPos, rotations, len) {
        let el = document.createElement('a-cylinder');
        
        var position = ''+centerPos[0]+' '+centerPos[1]+' '+centerPos[2];
        el.setAttribute('position', position);
        el.setAttribute('height', len);
        
        rad = len / 10; // radius is 1/20 of length 
        el.setAttribute('radius', rad);
        el.setAttribute('color', this.color);
        
        var rotation = ''+rotations[0]+' '+rotations[1]+' '+((rotations[2] + 360) % 360);
        el.setAttribute('rotation', rotation);
        el.setAttribute('shadow');

        scene.appendChild(el);
    };

    this.forward = function (length) {
        vector = [0, length, 0];
        console.log('vector', vector);

        console.log('this.transofrmationM', this.transofrmationM);
        this.inverseM = matrixInvert(this.transofrmationM);
        console.log('this.inverseM', this.inverseM);

        rotatedV = multiplyMatrices(this.inverseM, vector);
        console.log('rotatedV', rotatedV);

        newPos = addMatrices(this.coordinates, rotatedV);

        console.log('newPos', newPos);

        if (this.penIsDown) {
            this.drawLine(newPos, this.coordinates);
            this.setPosition(newPos);
        }
    };
}

// PLANT
/*
var viewPlant = function(s, step, angle){
    var len = s.length;
    this.stack = [];

    for (k = 0; k < len; k++) {
        switch (s.charAt(k)) {
        case 'F':
            t.forward(step);
            break;
        case '-':
            t.left(angle);
            break;
        case '+':
            t.right(angle);
            break;
        case '[':
            this.stack.push([[t.X, t.Y],t.heading])
            break;
        case ']':
            [p, h] = this.stack.pop();
            t.penup();
            t.setposition(p[0], p[1]);
            t.setheading(h);
            t.pendown();
            break;
        default:
            if(s.charAt(k) != 'X'){
                alert('INVALID CHARACTER OCCURED!');
            }
        }
    }
}
*/

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
 
const r2 = 0.7;
const a1 = 10;
const a2 = 60;
const d = 137.5;
const wr = 0.707;
*/


/**
 * NETESTOVANO D.D
 */
const r1 = 0.9;

function getPlant1Prescription(originStr, generation) {
    var oldStr = originStr;
    var newStr = '';
    console.log('len of origin string', oldStr.length);
    while (generation > 0) {
        for (let i = 0; i < oldStr.length; i++) {
            switch (oldStr[i]) {
                case 'F':
                    newStr += 'Y[++++++MF][-----NF][^^^^^OF][&&&&&PF]';
                    break;
                case 'M':
                    newStr += 'Z-M';
                    break;
                case 'N':
                    newStr += 'Z+N';
                    break;
                case 'O':
                    newStr += 'Z&O';
                    break;
                case 'P':
                    newStr += 'Z^P';
                    break;
                case 'Y':
                    newStr += 'Z-ZY+';
                    break;
                case 'Z':
                    newStr += 'ZZ';
                    break;
                default:
                    break;
            }
        }
        oldStr = newStr;
        generation--;
    }
    return newStr;
}

function drawPlant(str, step, angle) {
    console.log('str in drawPlant', str);
    var stack = [];
    for (let i = 0; i < str.length; i++) {
        switch (str[i]) {
            case 'F':
                console.log('forward');
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
                stack.push([t.coordinates, t.transofrmationM])
                break;
            case ']':
                [coordinates, transofrmationM] = stack.pop();
                t.penUp();
                t.setPosition(coordinates);
                t.setHeading(transofrmationM);
                t.penDown();
                break;
            default:
                break;
        }
    }
}

var curve = function(ch){
    switch(ch) {
    case 'X':
        return "^\\XF^\\XFX-F^//XFX&F+//XFX-F/X-/"
    default:
        return ch;
    }
}

var hilbertCurve = function(ch){
    switch(ch) {
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

var getNextGen = function(prevString, prodRules){
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
        if (i == gens-1) {
            console.log("before viewer");
            viewer(string, step, angle);
        }
    }
};
    
// MAIN
const STEP = 3;
const TURN_ANGLE = 90;
const START_POSITION = [0, -5, -30];
const START_HEADING = [0, 180, 0];
const COLOR = 'darkgreen'
const START_SYMBOL = 'X';
const GENERATIONS = 2;

var t = new Turtle(START_POSITION, START_HEADING, COLOR);

createObject(START_SYMBOL, GENERATIONS, curve, drawPlant, STEP, TURN_ANGLE);
//createObject(START_SYMBOL, GENERATIONS, hilbertCurve, drawPlant, STEP, TURN_ANGLE);

/*
var plantStr = '';
plantStr = getPlant1Prescription('F', 3);
console.log('plant1 string:', plantStr);
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
// console.log('t.pos', t.pos);    

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
