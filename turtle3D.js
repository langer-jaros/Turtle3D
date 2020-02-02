// A-FRAME
var scene = document.getElementById('scene01');

// SUBFUNCTIONS
function multiplyMatrixs(mA, mB) {
    var result = new Array(mA.length);
    for (let i = 0; i < result.length; i++) {
        result[i] = new Array(mB[i].length)
        for (let j = 0; j < mA.length; j++) {
            result[i][j] = 0;
            for (let k = 0; k < mB.length; k++) {
                result[i][j] += mA[i][k] * mB[k][i];
            }
        }
    }
    return result;
}

function matrix_invert(M) {
    if (M.length !== M[0].length) { return; }

    var i = 0, ii = 0, j = 0, dim = M.length, e = 0, t = 0;
    var I = [], C = [];
    for (i = 0; i < dim; i += 1) {
        I[I.length] = [];
        C[C.length] = [];
        for (j = 0; j < dim; j += 1) {

            if (i == j) { I[i][j] = 1; }
            else { I[i][j] = 0; }

            C[i][j] = M[i][j];
        }
    }
    for (i = 0; i < dim; i += 1) {
        e = C[i][i];
        if (e == 0) {
            for (ii = i + 1; ii < dim; ii += 1) {
                if (C[ii][i] != 0) {
                    for (j = 0; j < dim; j++) {
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    break;
                }
            }
            e = C[i][i];
            if (e == 0) { return }
        }
        for (j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; //apply to original matrix
            I[i][j] = I[i][j] / e; //apply to identity
        }
        for (ii = 0; ii < dim; ii++) {
            if (ii == i) { continue; }

            e = C[ii][i];

            for (j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; //apply to original matrix
                I[ii][j] -= e * I[i][j]; //apply to identity
            }
        }
    }
    return I;
}

function getMiddlePoint(originPoint, endPoint) {
    x = originPoint[0] + (endPoint[0] - originPoint[0]) / 2;
    y = originPoint[1] + (endPoint[1] - originPoint[1]) / 2;
    z = originPoint[2] + (endPoint[2] - originPoint[2]) / 2;

    return [x, y, z];
}

function getRotationXMatrix(angle) {
    return [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, -Math.sin(angle), Math.cos(angle)]
    ];
}

function getRotationYMatrix(angle) {
    return [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]
    ];
}

function getRotationZMatrix(angle) {
    return [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]
    ];
}

function getUnitMatrix() {
    return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
}

function getLenght(originPoint, endPoint) {
    x = originPoint[0] + (endPoint[0] - originPoint[0])
    y = originPoint[1] + (endPoint[1] - originPoint[1])
    z = originPoint[2] + (endPoint[2] - originPoint[2])
    return Math.sqrt((x*x)+(y*y)+(z*z));
}

// TURTLE
const Turtle = function (positions=[0,0,0], rotations=[0,0,0], color='green') {
    [this.X, this.Y, this.Z] = [positions[0], positions[1], positions[2]];
    [this.rotX, this.rotY, this.rotZ] = [rotations[0], rotations[1], rotations[2]];
    this.penIsDown = true;
    this.color = color;

    this.rollRight = function (angle) {

    }

    this.rollLeft = function (angle) {

    }

    this.turnRight = function (angle) {

    }

    this.turnLeft = function (angle) {

    }

    this.up = function (angle) {

    }

    this.down = function (angle) {

    }

    this.penup = function(){
        this.penIsDown = false;
    };
    this.pendown = function(){
        this.penIsDown = true;
    };
    this.setPosition = function(x, y, z){
        [this.X, this.Y, this.Z] = [x, y, z];
    };
    this.setOrientation = function(orientation){

    };

    this.drawLine = function (x0, y0, z0, x1, y1, z1, turnDeg, len) {
        console.log([x0, y0, z0], [x1, y1, z1]);
        middlePoint = getMiddlePoint([x0, y0, z0], [x1, y1, z1]);
        console.log('middle point',middlePoint);


        len = getLenght([x0, y0, z0], [x1, y1, z1]);
        console.log('len',len);

        //z-roration
        rotY = Math.atan((x1 - x0) / (z1 - z0));
        rotZ = Math.asin((y1 - y0) / len);
        console.log(rotY, rotZ);

        rotZ =  180*rotZ/Math.PI;
        rotY =  180*rotY/Math.PI;

        console.log(rotY, rotZ);
        //turnDeg = turnDeg - 90; // rotation around z axis 0 means 90 turnDegrees in math

        let el = document.createElement('a-cylinder');

        //zPos = -3; // z position
        var position = '' + middlePoint[0] + ' ' + middlePoint[1] + ' ' + middlePoint[2];
        console.log(position);
        el.setAttribute('position', position);
        el.setAttribute('height', len)

        rad = len / 10; // radius is 1/20 of length
        el.setAttribute('radius', rad);
        el.setAttribute('color', this.color);

        var rotation = '0 ' + rotY + ' ' + rotZ;
        el.setAttribute('rotation', rotation);
        el.setAttribute('shadow');
        scene.appendChild(el);
    }

    this.forward = function (length) {
        //console.log(length, this.turnRad);
        newX = this.X + length * Math.cos(this.turnRad);
        newY = this.Y + length * Math.sin(this.turnRad);
        newZ = 0;
        this.drawLine(this.X, this.Y, this.Z, newX, newY, newZ, this.turnDeg, length);
        [this.X, this.Y, this.Z] = [newX, newY, newZ];
    };
}

// PLANT
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

var plant = function(ch){
    switch(ch) {
    case 'X':
        return 'F+[[X]-X]-F[-FX]+X'
    case 'F':
        return 'FF'
    default:
        return ch;
    }
}

var getNextGen = function(sP){
    var sN = '';
    var len = sP.length;
    for (j = 0; j < len; j++) { 
        sN += plant(sP.charAt(j));
    }
    return sN;
}

// MAIN
/*
const step_length = 0.03;
const turn_angle = 25;
const start_angle = 90;
const color = 'darkgreen'
*/
var t = new Turtle();
/*
var s = 'X';
var gens = 6;
var i;

for (i = 0; i < gens; i++) { 
    s = getNextGen(s);
    //console.log("generated string s", s)
    if (i == gens-1) {
        viewPlant(s, step_length, turn_angle);
    }
}
*/

var STEP = 2;
t.drawLine(-5,-5,-5, 5, 5, 0, 0, 0);
