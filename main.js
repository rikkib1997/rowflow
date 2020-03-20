var W = 640;
var H = 480;
var FR = 60;

var boatImage;
var paalImage
var backgroundImage;
var bgpos = 0;

function preload() {
    boatImage = loadImage('empacher.png');
    paalImage = loadImage('paal.png');
    backgroundImage = loadImage('bg.jpg');
    frameRate(FR);
}

function setup() {
    createCanvas(W, H, WEBGL);
    stroke(31);
    strokeWeight(4);
    noFill();
    angleMode(RADIANS);
    perspective(PI / 3.0, W / H, 0.1, 500);
    //ortho(-W / 2, W / 2, -H / 2, H / 2, 1, 500);
    angleMode(DEGREES);
     

    imageMode(CENTER)
    boat1 = new Boat(300 - W / 2, 330 - H / 2, 0, boatImage, paalImage);
    boat2 = new Boat(300 - W / 2, 100 - H / 2, 1, boatImage, paalImage);
}

function draw() {
    
    orbitControl();
     
    
    
    bgpos -= boat1.xspeed;


    
    background(206, 253, 253);

    push();
    scale(1.5);
    
    translate(0,-10)
    image(backgroundImage,bgpos,0) 
    image(backgroundImage,bgpos+W-50,0)
    pop();
    if(bgpos<-W){ 
        bgpos = -50;
    }

    rect(-W / 2, -H / 2, W, H);
    boat1.display()
    boat2.display()
    boat2.xspeed = 7.5;
    boat2.xspeed = boat2.xspeed-boat1.xspeed;

    boat2.move()
    
    

    

}


function keyPressed() {
    boat1.haal();
    //boat2.haal();
}

function mouseClicked(){
    boat1.haal();
}



class Boat {
    constructor(x, y,speed, boatimage, paalimage) {
        this.x = x;
        this.y = y;
        this.xspeed = speed;
        this.yspeed = 0;

        this.h = 10;
        this.w = 70;
        this.boatimage = boatimage;

        this.distance = 0;

        this.paal = new Paal(this.x, this.y, paalimage)

    }
 
    display() {
        push();
        translate(0,0, 150) 
        scale(0.6)
        image(this.boatimage, this.x, this.y);
        
        this.paal.update(this.x, this.y - 50);
        this.paal.display();
        pop()

        this.distance += this.xspeed;
        //console.log(this.distance);
        
        //console.log(this.xspeed);
        this.xspeed += this.paal.accel*3;

        this.xspeed -= this.xspeed*this.xspeed*0.001 + 0.003;
        if(this.xspeed < 0){
            this.xspeed = 0;
        }
        
        

    }
    move() {

        this.x += this.xspeed;
        this.y += this.yspeed;
    }

    haal() {
        
        this.paal.haal();
        console.log("inpik")
        this.xspeed -= this.xspeed*this.xspeed*0.01


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
        
        translate(this.x, this.y, 30)
        rotate(180);
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

        //console.log(this.inhaal, this.rspeed, this.rotation);


        if (this.inhaal) {
            this.rspeed = FR/15;
            this.zrotation = this.zrotation = sin(this.rotation) * 20
            this.accel = 0.004*this.zrotation

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
            this.accel = 0;

        }
    }

    haal() {
        if (!this.inhaal) {
            if(this.rotation < 100){
            this.inhaal = true;
            
            }
        } else {

            this.inhaal = false;

            this.zrotation = 0;
        }

    }












}