// A-FRAME
var scene = document.getElementById('scene01');

// SUBFUNCTIONS
var drawLine = function(x0, y0, x1, y1, deg, len){
    x = x0 + (x1 - x0) / 2; // middle of x0 x1
    y = y0 + (y1 - y0) / 2; // middle of y0 y1
    
    deg = deg - 90; // rotation around z axis 0 means 90 degrees in math
    
    let el = document.createElement('a-cylinder');
    
    zPos = -3; // z position
    var position = '' + x + ' ' + y + ' ' + zPos;
    
    el.setAttribute('position', position);
    el.setAttribute('height', len)

    rad = len/10; // radius is 1/20 of length
    el.setAttribute('radius', rad);
    el.setAttribute('color', 'green');
    
    var rotation = '0 0 ' + deg;
    el.setAttribute('rotation',rotation);
    el.setAttribute('shadow');
    scene.appendChild(el);
}

// TURTLE
const Turtle = function(d=90, x=0, y=0, color='black'){
    //this.canvas = ctx.canvas;
    [this.X, this.Y] = [x, y];
    this.deg = d;
    this.heading = Math.PI*this.deg/180;
    this.penIsDown = true;

    this.forward = function(length){
        newX = this.X + length*Math.cos(this.heading);
        newY = this.Y + length*Math.sin(this.heading);
        drawLine(this.X, this.Y, newX, newY, this.deg, length);
        [this.X, this.Y] = [newX, newY];
    };
  
    this.left = function(deg){
        this.heading = this.heading + Math.PI*deg/180;
        this.deg += deg;
    };
  
    this.right = function(deg){
        this.heading = this.heading - Math.PI*deg/180;
        this.deg -= deg;
    };
  
    this.penup = function(){
        this.penIsDown = false;
    };
    this.pendown = function(){
        this.penIsDown = true;
    };
    this.setposition = function(x, y){
        [this.X, this.Y] = [x, y];
    };
    this.setheading = function(h){
        this.heading = h;
        this.deg = 180*h/Math.PI;
    };
};

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
const step_length = 0.03;
const turn_angle = 25;
const start_angle = 90;
const color = 'darkgreen'
var t = new Turtle(start_angle, 0, 0, color)
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