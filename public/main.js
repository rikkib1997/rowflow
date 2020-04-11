var W = 640;
var H = 300;
var FR = 60;

var boatImage;
var paalImage
var backgroundImage;
var bgpos = 0;
var gestart = false;
var textbox;
var timer = 0;
var finishline = 10000;

var clients = [];


function preload() {
    boatImage = loadImage('assets/empacher.png');
    paalImage = loadImage('assets/paal.png');
    backgroundImage = loadImage('assets/bg.jpg');
    frameRate(FR);
    inconsolata = loadFont('assets/Inconsolata.otf');
}

function setup() {
    createCanvas(W, H, WEBGL);
    stroke(31);
    strokeWeight(4);
    noFill();
    angleMode(RADIANS);
    perspective(PI / 3.0, W / H, 0.1, 500);
    ortho(-W / 2, W / 2, -H / 2, H / 2, 1, 500);
    angleMode(DEGREES);

    distancetext = createP("0").addClass("distance");
    timetext = createP("0").addClass("time");
    finishedtext = createP().addClass("finished");






    imageMode(CENTER)
    boat1 = new Boat(300 - W / 2, 330 - H / 2, 0, boatImage, paalImage);
    boat2 = new Boat(300 - W / 2, 100 - H / 2, 1, boatImage, paalImage);

    socket = io.connect('http://localhost:3000');


    var data = {
        distance: boat1.distance, 
    
    };
    socket.emit('start', data);

    socket.on('heartbeat', function(data) {
        clients = data;
        
    });

}

function draw() {
    
    orbitControl();

    distancetext.html(floor(boat1.distance));
    timetext.html(floor(timer));

    bgpos -= 0.8 * boat1.xspeed;
    boat1.distance += boat1.xspeed;
    background(206, 253, 253);

    

    push();
    scale(1.5);

    translate(0, -10)
    image(backgroundImage, bgpos, 0)
    image(backgroundImage, bgpos + W - 50, 0)
    pop();
    if (bgpos < -W) {
        bgpos = -50;
    }



    rect(-W / 2, -H / 2, W, H);
    boat1.display();
    boat2.xspeed = 9.5;
    boat2.distance += boat2.xspeed;
    boat2.xspeed = boat2.xspeed - boat1.xspeed;

    boatsUpdate();

    if (gestart) {
        boat2.move()
        if (frameCount % FR == 0) {
            timer++;
        }
    }
    if(boat1.distance >= 2000){
        boat1.finished = true;
    }


    var data = {
        distance: boat1.distance,
        rotation: boat1.paal.rotation,
        zrotation: boat1.paal.zrotation,   
        finished: boat1.finished,
      };
    socket.emit('update', data);



}

function boatsUpdate(){
    for (var i = 0; i < clients.length; i++) {
        var id = clients[i].id;
        var otherDistance = clients[i].distance;
        var otherRotation = clients[i].rotation;
        var otherZRotation = clients[i].zrotation;

        if (id !== socket.id) {
            if(abs(boat1.distance - otherDistance) < W + boatImage.width/2){
            
                boat = new Boat(300 - W / 2, 100 - H / 2, 1, boatImage, paalImage);
                boat.distance = clients[i].distance;
                boat.x = boat.distance - boat1.distance;
                

                boat.paal.rotation = otherRotation;
                boat.paal.zrotation = otherZRotation;

                boat.display();
                
                
                console.log(boat.distance);
            }

        }
    }

}


function keyPressed() {
    boat1.haal();
    gestart = true;
}



function keyReleased() {
    if (boat1.paal.inhaal) {
        boat1.haal();
    }

}



function mousePressed() {
    keyPressed();
}
function mouseReleased() {
    keyReleased();
}



class Boat {
    constructor(x, y, speed, boatimage, paalimage) {
        this.x = x;
        this.y = y;
        this.xspeed = speed;
        this.yspeed = 0;

        this.h = 10;
        this.w = 70;
        this.boatimage = boatimage;

        this.distance = 0;
        this.finished = false;

        this.paal = new Paal(this.x, this.y, paalimage)

    }

    display() {
        push();
        translate(0, 0, 150)
        scale(0.6)
        image(this.boatimage, this.x, this.y);

        this.paal.update(this.x, this.y - 50);
        this.paal.display();
        pop()






        this.xspeed += this.paal.accel * 4 * map(this.xspeed, 0, 10, 0.3, 1.1);

        this.xspeed -= this.xspeed * this.xspeed * 0.0006 + 0.0035;
        if (this.xspeed < 0) {
            this.xspeed = 0;
        }



    }
    move() {

        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    haal() {

        this.paal.haal();

        this.xspeed -= this.xspeed * this.xspeed * 0.013


    }

}




class Paal {

    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.rspeed = 0;
        this.rotation = 0;
        this.zspeed = 0;
        this.zrotation = 0;

        this.image = image;

        this.w = this.image.width;
        this.h = this.image.height;

        this.inhaal = false;

        this.accel = 0;

    }


    display() {
        push();
        translate(this.x, this.y, 30)
        rotate(180);





        rotateY(this.rotation);
        rotateZ(this.zrotation)
        this.rotate();
        image(this.image, 0, 0);
        pop();

    }
    rotate() {
        this.rotation += this.rspeed;

    }

    update(x, y) {
        this.x = x;
        this.y = y;



        if (this.inhaal) {
            this.rspeed = FR / 15;
            this.zrotation = this.zrotation = sin(this.rotation) * 20
            this.accel = 0.004 * this.zrotation

            if (this.rotation >= 180) {
                this.rspeed = 0;
                this.inhaal = false;
            }

        } else {
            if (this.rotation <= 0) {

                this.rspeed = 0;
                this.inhaal = false;
            } else {

                this.rspeed = -FR / 20;
            }
            this.accel = 0;

        }
    }

    haal() {
        if (!this.inhaal) {
            if (this.rotation < 100) {
                this.inhaal = true;

            }
        } else {
            this.inhaal = false;

            this.zrotation = 0;
        }

    }


}