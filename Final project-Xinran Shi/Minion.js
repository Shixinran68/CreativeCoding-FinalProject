// Minion.js
let mappedPot;

//create Minion class
class Minion {
    constructor(minionImg) {
        this.life = 5;
        this.position = new Point(width / 2, height-81);//initial position of the Minion
        this.image = minionImg;
        this.vulnerable = true;
        this.hit = false;
        this.hitDuration = 0;  
            }

    run() {
        this.exitHitStatus();
        this.addMinion();
        this.showMinion();
    }

//when Minion hits the bombs, it will change to dark grey
    showMinion() {
       push(); // avoid affecting other images
     let i = frameCount % 12;
        if (this.hit) {
            tint(79, 79, 79);//turn dark grey 
            this.hitDuration++;
            
        }
       imageMode(CENTER);
      image(this.image[int(i /5)], this.position.x, this.position.y); //setting a flipping Minion to catch food
       pop();
    }

    exitHitStatus() { //exit vulnerable status and resume to the original
        if (this.hit && this.hitDuration > 20) {
            this.hit = false;
            this.hitDuration = 0;
            this.vulnerable = true;
        }
    }

    checkEdges() {
        if (this.position.x < 0)
            this.position.x = 0;
        else if (this.position.x > windowWidth)
            this.position.x = windowWidth;
    }

//use the potentiometer to control the postion of the moving Minion
    addMinion() {
        this.position.x= map(potentiometerData , 0, 255, windowWidth, 0);    
            this.checkEdges();
          
        }
      
    hurt() {
      this.life--;
      resources.bgm2.play();
        this.vulnerable = false;
        this.hit = true;
    }

    reload() {
        this.life = 5;//Minion has 5 lives in total
        this.vulnerable = true;
        this.hit = false;
        this.hitDuration = 0;
    }
}

function gotData() {
    // read a byte from the serial port, convert it to a number:
    // readLine() reads the new value and returns to inString
    let inString = serial.readLine();
   if(inString.length <= 0) return;
  //give a value to the dataMode through "if" statement
    if (inString === "potentiometer") {
      dataMode = "potentiometer"
    } else if(inString === "button") {
      dataMode = "button"
    } 
      //use the previous dataMode to give value to "potentiometer"  and "button"
    else if(dataMode === "potentiometer") {
        potentiometerData = inString
      } else if (dataMode === "button") {
        buttonData = inString
      }
  }
  
  //reference: inspired from the starter code generated from p5.serialcontrol
  function serverConnected() {
    print("Connected to Server");
   }
  
   function gotList(thelist) {
    print("List of Serial Ports:");
    for (let i = 0; i < thelist.length; i++) {
     print(i + " " + thelist[i]);
    }
   }
   
   function gotOpen() {
    print("Serial Port is Open");
   }
   
   function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
   }
   
   function gotError(theerror) {
    print(theerror);
   }