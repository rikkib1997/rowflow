var W = 640;
var H = 480;
var FR = 60;

var boatImage;
var paalImage
var backgroundImage;
var bgpos = 0;
var gestart = false;
var textbox;

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
    //ortho(-W / 2, W / 2, -H / 2, H / 2, 1, 500);
    angleMode(DEGREES);

    textbox = createP("0").addClass("distance");



     

    imageMode(CENTER)
    boat1 = new Boat(300 - W / 2, 330 - H / 2, 0, boatImage, paalImage);
    boat2 = new Boat(300 - W / 2, 100 - H / 2, 1, boatImage, paalImage);
}

function draw() {
    
    
    orbitControl();
     
    textbox.html(floor(boat1.distance))
    
    bgpos -= boat1.xspeed;
    boat1.distance += boat1.xspeed;

    
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

    

    console.log(boat1.distance);
    rect(-W / 2, -H / 2, W, H);
    boat1.display();
    boat2.display()
    boat2.xspeed = 8;
    boat2.xspeed = boat2.xspeed-boat1.xspeed;

    if(gestart){
        boat2.move()
    }
    

    

}


function keyPressed() {
    boat1.haal();
    //boat2.haal();
    gestart = true;
}



function keyReleased(){
    if(boat1.paal.inhaal){
    console.log(boat1.paal.inhaal);
    boat1.haal();
    }
    
}



function mousePressed(){
    keyPressed();
}
function mouseReleased(){
    keyReleased();
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





        //this.distance += this.xspeed;
        //console.log(this.distance);
        
        //console.log(this.xspeed);
        this.xspeed += this.paal.accel*4*map(this.xspeed,0,10,0.3,1.1); 

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
        
        this.xspeed -= this.xspeed*this.xspeed*0.013


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
            console.log("inpik")
            this.inhaal = true;
            
            }
        } else {
            console.log("uitpik")
            this.inhaal = false;

            this.zrotation = 0;
        }

    }












}