/*
VERZE 0.3.1 J.L.
*/

// A-FRAME
var scene = document.getElementById('scene01');

// SUBFUNCTIONS
function addMatrices(mA, mB) {
    return math.add(mA,mB);
}

/*
FUNGUJE D.D
*/
function multiplyMatrixs(mA, mB) {
    return math.multiply(mA, mB);
}
/*
FUNGUJE D.D.
*/
function matrix_invert(M) {
    return math.inv(M);
    /*if (M.length !== M[0].length) { return; }

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
    return I;*/
}
/*
NEJDE STŘEDNÍ BOD v03
FUNGUJE DOBŘE J.L.
*/
function getMiddlePoint(originPoint, endPoint) {
    x = originPoint[0] + (endPoint[0] - originPoint[0]) / 2;
    y = originPoint[1] + (endPoint[1] - originPoint[1]) / 2;
    z = originPoint[2] + (endPoint[2] - originPoint[2]) / 2;

    return [x, y, z];
}

/*
PŘEDDEFINOVÁNO
*/
function getRotationXMatrix(angle) {
    return math.matrix([
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, -Math.sin(angle), Math.cos(angle)]
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
NEFUNGUJE, OPRAVENÁ FUNKCE O KUS NÍŽ J.L.
*/
/*
    function getLenght(originPoint, endPoint) {
        x = originPoint[0] + (endPoint[0] - originPoint[0])
        y = originPoint[1] + (endPoint[1] - originPoint[1])
        z = originPoint[2] + (endPoint[2] - originPoint[2])
        return Math.sqrt((x*x)+(y*y)+(z*z));
    }
*/
/*
SPOČÍTÁ DÉLKU DANÉHO VEKTORU vO3
*/
function getVecLen(startPoint, endPoint) {
    x0 = startPoint[0];
    y0 = startPoint[1];
    z0 = startPoint[2];
    console.log('x0, y0, z0', x0, y0, z0);

    x1 = endPoint[0];
    y1 = endPoint[1];
    z1 = endPoint[2];
    console.log('x1, y1, z1', x1, y1, z1);

    return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2 + (z1 - z0) ** 2);
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
    return multiplyMatrixs(vector, base);
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

function arrFromVec(vec) {
    return [vec.x, vec.y, vec.z];
}

const Vector = function (arr) {
    this.x = arr[0];
    this.y = arr[1];
    this.z = arr[2];


    this.getArray = function(){
        return [this.x,this.y,this.z];
    }
};

// TURTLE
/*
NETESTOVÁNO V0.2.3 J.L.
*/
const Turtle = function (positions = [0, 0, 0], rotations = [0, 0, 0], color = 'green') {
    this.pos = new Vector(positions);
    this.rot = new Vector(rotations);
    console.log('arrFromVec(this.rot)', arrFromVec(this.rot));
    ////console.log('this.pos.x, this.pos.y, this.pos.z', this.pos.x, this.pos.y, this.pos.z);
    //// console.log('this.pos', this.pos);    
    this.penIsDown = true;
    this.color = color;
    this.transpM = getUnitMatrix();

    this.oldBase = getUnitMatrix();
    this.newBase = getUnitMatrix();

    this.originPoint = [-2, 0, -2];
    this.endPoint = [0, 0, 0];

    this.vector = [0, 1, 0];

    this.rollRight = function (angle) {
        angle = Math.PI * angle / 180;
        this.newBase = multiplyMatrixs(this.oldBase, getRotationYMatrix(angle));
        ///                console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.rollLeft = function (angle) {
        angle = 2 * Math.PI - (Math.PI * angle / 180);
        this.newBase = multiplyMatrixs(this.oldBase, getRotationYMatrix(angle));
        ///                 console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.turnRight = function (angle) {
        angle = Math.PI * angle / 180;
        this.newBase = multiplyMatrixs(this.oldBase, getRotationXMatrix(angle));
        ///                   console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.turnLeft = function (angle) {
        angle = 2 * Math.PI - (Math.PI * angle / 180);
        this.newBase = multiplyMatrixs(this.oldBase, getRotationXMatrix(-angle));
        ///                   console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.up = function (angle) {
        angle = Math.PI * angle / 180;
        this.newBase = multiplyMatrixs(this.oldBase, getRotationZMatrix(angle));
        ///                     console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.down = function (angle) {
        angle = 2 * Math.PI - (Math.PI * angle / 180);
        this.newBase = multiplyMatrixs(this.oldBase, getRotationZMatrix(-angle));
        ///                     console.log('oldBase:', this.oldBase, 'newBase:', this.newBase);
    };

    this.penup = function () {
        this.penIsDown = false;
    };

    this.pendown = function () {
        this.penIsDown = true;
    };

    this.setPosition = function (x, y, z) {
        [this.pos.x, this.pos.y, this.pos.z] = [x, y, z];
        console.log('arrFromVec(this.pos)', arrFromVec(this.pos));
        this.originPoint = [x, y, z];
    };

    this.setOrientation = function (orientation) {

    };

    /*
    Z BODŮ NAJDE STŘEDY, ÚHLY A DÉLKU, ZAVOLÁ DRAWCYLINDER J.L.
    */
    this.drawLine = function (endPos, startPos = arrFromVec(this.pos)) {
        //this.drawLine = function ([x1, y1, z1], [x0, y0, z0]=[0,0,0], len) {
        ///            console.log('startPos', startPos);
        x0 = startPos[0];
        y0 = startPos[1];
        z0 = startPos[2];
        console.log('x0,y0,z0', x0, y0, z0);
        [x0, y0, z0] = [startPos[0], startPos[1], startPos[2]];
        console.log('[x0, y0, z0]', [x0, y0, z0]);

        console.log('endPos', endPos);
        x1 = endPos[0];
        y1 = endPos[1];
        z1 = endPos[2];
        console.log('x1, y1, z1:', x1, y1, z1);
        [x1, y1, z1] = [endPos[0], endPos[1], endPos[2]];
        console.log('[x1, y1, z1]', [x1, y1, z1]);

        vector = [x1 - x0, y1 - y0, z1 - z0];
        this.endPoint = getEndPoint(this.originPoint, vector);
        ///         console.log('vector in unit Base:',vector);
        //change vector to rotated base
        vector = getVectorInBase(vector, this.newBase);
        ///        console.log('vector in Base:',vector);

        //get end point in unit base
        this.endPoint = getEndPoint(this.originPoint, vector);
        //console.log('end point:',this.endPoint);


        //console.log('originPoint:',this.originPoint, 'endPoint:',this.endPoint);
        //middlePoint = getMiddlePoint(this.originPoint, this.endPoint);
        //console.log('middle point',middlePoint);

        vectorLen = getVecLen(startPos, endPos);
        console.log('vectorLen', vectorLen);

        centerPos = getMiddlePoint(startPos, endPos);
        ///        console.log('centerPos:',centerPos);

        // STŘEDY VÁLCE V OSÁCH
        cX = centerPos[0];
        cY = centerPos[1];
        cZ = centerPos[2];
        ///       console.log('cX,cY,cZ:',cX,cY,cZ);

        // DÉLKY JEDNOTLIVÝCH OS
        dX = x1 - x0;
        dY = y1 - y0;
        dZ = z1 - z0;
        ///        console.log('dX,dY,dZ:',dX,dY,dZ);

        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        ROTACE SE UPLATŇUJÍ POPOŘADĚ, NEJDŘÍV X PAK Y PAK Z
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        */

        // SPOČÍTÁ ROTACI V OSE X ROTX
        ///          console.log('dY/vectorLen:',dY/vectorLen);
        ///         console.log('Math.acos(dY/vectorLen):',Math.acos(dY/vectorLen));
        ///         console.log('Math.acos(dY/vectorLen)/Math.PI*180:',Math.acos(dY/vectorLen)/Math.PI*180);
        rotX = Math.acos(dY / vectorLen) / Math.PI * 180;
        ///          console.log('rotX', rotX);

        // SPOČÍTÁ ROTACI V OSE Y, PODLE KVADRANTU BUĎ NECHÁ, NEBO ODEČTE OD 360 STUPŇŮ
        ///          console.log('dZ/Math.sqrt(dX**2+dZ**2)',dZ/Math.sqrt(dX**2+dZ**2));
        ///           console.log('Math.acos(dZ/Math.sqrt(dX**2+dZ**2))/Math.PI*180:',Math.acos(dZ/Math.sqrt(dX**2+dZ**2))/Math.PI*180);
        rotY180 = Math.acos(dZ / Math.sqrt(dX ** 2 + dZ ** 2)) / Math.PI * 180;
        ///           console.log('rotY180', rotY180);
        //console.log("test of tanges", Math.tan(dX/dZ)/Math.PI*180)
        rotY = (dX > 0) ? rotY180 : 360 - rotY180;
        ///           console.log('rotY', rotY);
        this.drawCylineder(centerPos, [rotX, rotY, 0], 15);

        /*
        ZAKOMENTOVÁNO, LOGIKA OKOLU UKLÁDÁNÍ, TRANSFORMACE JSEM NEZKOUMAL, TO BE DONE J.L.
        */

        len = getLenght(this.originPoint, this.endPoint);
        //console.log('len',len);

        //z-roration
        rotY = Math.atan((this.endPoint[0] - this.originPoint[0]) / (this.endPoint[2] - this.originPoint[2]));
        rotZ = Math.asin((this.endPoint[1] - this.originPoint[1]) / len);
        //console.log(rotY, rotZ);

        rotZ = 180 * rotZ / Math.PI;
        rotY = 180 * rotY / Math.PI;

        console.log(rotY, rotZ);
        //turnDeg = turnDeg - 90; // rotation around z axis 0 means 90 turnDegrees in math

        let el = document.createElement('a-entity');

        start = this.originPoint[0] + ' ' + this.originPoint[1] + ' ' + this.originPoint[2];
        end = this.endPoint[0] + ' ' + this.endPoint[1] + ' ' + this.endPoint[2];
        color = '#000000';
        el.setAttribute('line', 'start:' + start + ';end:' + end + ';color:' + color);

        scene.appendChild(el);

        this.originPoint = this.endPoint;
        this.oldBase = this.newBase;
    };

    /*
    JENOM NAKRESLÍ VÁLEC, SE STŘEDOVÝMI SOUŘADNICEMI, ROTACEMI A DÉLKOU V03 JL
    */
    this.drawCylineder = function (centerPos, rotations, len) {
        let el = document.createElement('a-cylinder');

        //zPos = -3; // z position
        var position = '' + centerPos[0] + ' ' + centerPos[1] + ' ' + centerPos[2];
        ///           console.log('position', position);
        el.setAttribute('position', position);
        el.setAttribute('height', len);

        rad = len / 10; // radius is 1/20 of length
        //rad = 10;

        el.setAttribute('radius', rad);
        el.setAttribute('color', this.color);

        var rotation = '' + rotations[0] + ' ' + rotations[1] + ' ' + (rotations[2] + 360) % 360;
        ///        console.log('rotation', rotation);
        el.setAttribute('rotation', rotation);
        el.setAttribute('shadow');
        scene.appendChild(el);
    };

    this.forward = function (length) {
        vector = [0, length, 0];
        
        
        rotVector = multiplyMatrixs(this.transpM, vector);
        rotVector = [0, length, 0]
        console.log('rotVector', rotVector);

        console.log(arrFromVec(this.pos));

        newPos = this.pos.x + this.pos.getArray() + rotVector;
        console.log('newPos', newPos);

        if (this.penIsDown) {
            this.drawLine(newPos, this.pos.getArray());
            this.setPosition(...newPos);

            /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            var vectorInBase = getVectorInBase(this.vector, this.newBase);
            this.drawLine(modifyLenghtOfVector(vectorInBase, length));
            !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
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
/*
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
*/
/*
var getNextGen = function(sP){
    var sN = '';
    var len = sP.length;
    for (j = 0; j < len; j++) { 
        sN += plant(sP.charAt(j));
    }
    return sN;
}
*/
// MAIN
/*
* TODO : zmenit cary na cylindery
*        porad nefunguje tak jak by melo, zrejme chyba prace s bázemi
*        otestovat
*        nedari se mi oddelit turn left/right, up/down, rollright/rollleft, dvojice delaji totez
*/
//var t = new Turtle();
var STEP = 1;
var t = new Turtle([0, 3, -10], [0, 0, 0]);
//t.drawLine([-10,-10,-5]);
t.forward(STEP);

/*
t.turnRight(90);
t.forward(STEP);
t.turnRight(90);
t.forward(STEP);
*/


//// POMOCNÉ DEBUGGOVACÍ OBRAZCE, NA KTERÝCH JE DOBŘE VIDĚT JAK SETO CHOVÁ ////
// t.setPosition(10, 0, 100);
// console.log('t.pos', t.pos);    


//t.drawCylineder([0,0,-10], [0,0,0], 5)
//t.drawCylineder([0,0,-10], [30,0,0], 5)
//t.drawLine([0,0,-10], [10,-5,-20]);
//t.drawLine([0,0,-10], [-10,20,-25]);


/*
t.drawLine([1,0,0]);
t.rollRight(45);
t.drawLine([1,5,2]);
*/

/*
const step_length = 0.03;
const turn_angle = 25;
const start_angle = 90;
const color = 'darkgreen'
*/

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



