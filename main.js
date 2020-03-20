var W = 640;
var H = 480;
var FR = 60;

var boatimage;

function preload() {
    boatimage = loadImage('empacher.png');
    paalimage = loadImage('paal.png');
    frameRate(FR);
}

function setup() {
    createCanvas(W, H, WEBGL);
    stroke(31);
    strokeWeight(4);
    noFill();
    angleMode(DEGREES);


    imageMode(CENTER)
    boat1 = new Boat(300 - W / 2, 300 - H / 2, boatimage, paalimage);
}

function draw() {

    background(206, 253, 253)
    rect(-W / 2, -H / 2, W, H);
    boat1.display()




}


function keyPressed() {
    boat1.haal();
}



class Boat {
    constructor(x, y, boatimage, paalimage) {
        this.x = x;
        this.y = y;
        this.xspeed = 0;
        this.yspeed = 0;

        this.h = 10;
        this.w = 70;
        this.boatimage = boatimage;

        this.paal = new Paal(this.x, this.y, paalimage)

    }

    display() {


        image(this.boatimage, this.x, this.y);
        this.paal.update(this.x, this.y - 50);
        this.paal.display();
        this.move()

    }
    move() {

        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    haal() {
        this.paal.haal();
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

    }


    display() {


        translate(this.x, this.y, 100)
        rotate(180);


        //console.log(this.rotation)
        //console.log(this.zrotation)


        rotateY(this.rotation);
        rotateZ(this.zrotation)
        this.rotate();
        image(this.image, 0, 0);





    }
    rotate() {

        this.rotation += this.rspeed;


    }

    update(x, y) {
        this.x = x;
        this.y = y;

        console.log(this.inhaal, this.rspeed, this.rotation);


        if (this.inhaal) {
            this.rspeed = FR/15;
            this.zrotation = this.zrotation = sin(this.rotation) * 20


            if (this.rotation >= 180) {
                this.rspeed = 0;
                this.inhaal = false;

            }

        } else { 
            if (this.rotation <= 0) {
                this.rspeed = 0;
                this.inhaal = false;
            } else {
                this.rspeed = -FR/20;
            }



        }
    }


    haal() {
        if (!this.inhaal && this.rotation < 100) {
            this.inhaal = true;
        } else {

            this.inhaal = false;
            //this.rspeed = 0;
            //this.rotation = 0;
            this.zrotation = 0;
        }

    }












}