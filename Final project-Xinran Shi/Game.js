// Game.js
let serial;                             // variable to hold an instance of the serialport library                            // for incoming serial data
let dataMode;
let buttonData;
let potentiometerData;

let game; // Main game program
let resources = {
     //definition of "null", reference: https://processing.org/reference/null.html
    bgm: null,
    bgm2: null,
    font: null,
    minionImg: [],
    foodImg: [],
   bombImg: [],
    minionIcon: null,
    foodIcon: null,
    failureIcon: null
};

function preload() {
    resources.bgm = loadSound("asset/music.mp3");
    resources.bgm2 = loadSound("asset/shout.mp3");
    resources.font = loadFont("asset/Brutal Honesty Demo.ttf");
    resources.homeEating1 = loadImage("asset/images/home eating.png");
    resources.homeEating2 = loadImage("asset/images/home eating2.png");
    resources.minionIcon = loadImage("asset/images/MinionIcon.png");
    resources.foodIcon = loadImage("asset/images/foodIcon.png");
    resources.failureIcon = loadImage("asset/images/gameOver.png");
    for (let i = 0; i < 3; i++) 
        resources.minionImg[i] = loadImage("asset/images/Minion/Minion" + i + ".png");

    for (let i = 0; i < 9; i++) 
        resources.foodImg[i] = loadImage("asset/images/food/food" + i + ".png");

   for (let i = 0; i <3; i++) 
       resources.bombImg[i] = loadImage("asset/images/bomb/bomb" + i + ".png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
 //reference: inspired from the starter code generated from p5.serialcontrol
 serial = new p5.SerialPort();
 serial.list();
 serial.openPort('/dev/tty.usbmodem144201');
 serial.on('connected', serverConnected);
 serial.on('list', gotList);
 serial.on('data', gotData);
 serial.on('error', gotError);
 serial.on('open', gotOpen);
 serial.on('close', gotClose);

 frameRate(30);
    game = new Game();
}

//set the three game sections' values
let GameStage = {
    WELCOME: 0,
    GAMEPLAY: 1,
    GAMEOVER: 2,
}

class Game {
    constructor() {
        this.components = {
            foods: new FoodSystem(resources.foodImg),
           bombs: new BombSystem(resources.bombImg),
            minion: new Minion(resources.minionImg),
            UI: new UI(),
            music: new Music(resources.bgm)
        };
        this.stage = GameStage.WELCOME;
        this.components.foods.loadMinion(this.components.minion);
       this.components.bombs.loadMinion(this.components.minion);
        this.components.UI.loadFoodSystem(this.components.foods);
        this.components.UI.loadMinion(this.components.minion);
    }

    run() {
    //example of "switch" and "cases", reference: https://editor.p5js.org/esztvi/sketches/yuvIkGYR3
        switch (this.stage) {
            case 0: this.welcome(); break;
            case 1: this.gamePlay(); break;
            case 2: this.gameOver(); break;
        }
    }

    welcome() {
      
        this.components.UI.showWelcomeMessage();
        image(resources.homeEating1,width/6-20, height/2);//eatting Minion stands at both sides
        image(resources.homeEating2,width*3/4, height/2);
       //Tap the button to start the game
       if (buttonData==1) {
        this.stage = GameStage.GAMEPLAY
    }
        else{this.stage = GameStage.WELCOME}
    }
   
    gamePlay() {
        [this.components.foods,
           this.components.bombs,
            this.components.minion
        ].forEach(element => element.run());
        //show how many lifes left 
        this.components.UI.showGameplayHUD();
        this.components.music.play();
        this.checkGameOver();
        this.cheat();
        this.NoCheat();
    }

    checkGameOver() {
        if (this.components.minion.life < 1) {
            this.stage = GameStage.GAMEOVER;
            this.components.music.stop();
        }
    }

    gameOver() {
       this.components.UI.showMinionLife();
        this.components.UI.showFoodNumber();
        this.components.UI.showGameOverMessage();
        this.checkNewGame();
        image(resources.failureIcon,width / 2, height-81)
    }

    //tap the button to start the game again
    checkNewGame() {
           if (buttonData==1) {
            this.stage = GameStage.GAMEPLAY;
            [this.components.minion,
                this.components.foods,
               this.components.bombs
            ].forEach(element => element.reload());
        }else{this.stage = GameStage.GAMEOVER}
        }
    
//press "c" will have 100 lives for the Minion
//(input, obj, function) is also mentioned in "operation.js"
    cheat() {
        keyEvent('C', this, obj => obj.components.minion.life = 100);
        keyEvent('c', this, obj => obj.components.minion.life = 100);
    }

//Press "n" will quit the game
    NoCheat() {
        keyEvent('N', this, obj => obj.components.minion.life = 0);
        keyEvent('n', this, obj => obj.components.minion.life = 0);
    }
    }

class Music {
    constructor(bgm) {
        this.bgm = bgm;
        this.firstPlay = true;
    }

    play() {
        if (this.firstPlay) { // Start to play background music
            this.bgm.play();
            this.firstPlay = false;
        }
        else if (!this.bgm.isPlaying()) // Loop
        //definition of jump, reference from: https://p5js.org/reference/#/p5.SoundFile/jump
            this.bgm.jump(2.12);//the length of the music
    }

    stop() {
        this.firstPlay = true;
        this.bgm.stop();
    }
}

class UI {
    constructor() {
        this.staticText = { // prepare fixed textobj resources
            title: new Text({
                content: "MINIONS EATING",
                align: [CENTER, CENTER],
                position: new Point(width / 2, height / 4),
                size: 130
            }),

            guide: new Text({
                content: "Collect foods and dodge bombs\nTwist the pot to control\n'C' is cheating key (=100 lives)\n 'N' is quitting key\n\nTap BUTTON to start",
                align: [CENTER, CENTER],
                position: new Point(width / 2, height * 0.6),
                size: 40
            }),

            gameOver: new Text({
                content: "GAME OVER",
                align: [CENTER, CENTER],
                position: new Point(width / 2, height / 4),
                size: 130
            }),
            
            playAgain: new Text({
                content: "The Minion is dead\n\nTap BUTTON to start a new meal",
                align: [CENTER, CENTER],
                position: new Point(width / 2, height * 0.6),
                size: 40
            }),
        }
        this.minionIcon = resources.minionIcon; // Load HUD(heads up display) display icons-lives
        this.foodIcon = resources.foodIcon; //Load HUD(heads up display) display icons-food amount
    }

    showWelcomeMessage() {
        let textobj = [this.staticText.title, this.staticText.guide];
        textobj.forEach(element => element.display());
    }

    showGameplayHUD() {
        this.showMinionLife();
        this.showFoodNumber();
    }

    showMinionLife() {
        imageMode(CENTER); // minion icon
        image(this.minionIcon, 50, 60);
        new Text({ // minion life number
            content: this.minion.life,
            align: [LEFT, CENTER],
            position: new Point(100, 60),
            size: 40
        }).display();
    }

    showFoodNumber() {
        imageMode(CENTER);// food icon
        image(this.foodIcon, width -70, 60);
        new Text({ // food collected number
            content: this.foods.collected,
            align: [RIGHT, CENTER],
            position: new Point(width -120, 60),
            size: 40
        }).display();
    }

    loadMinion(minion) {
        this.minion = minion;
    }

    loadFoodSystem(fs) {
        this.foods = fs;
    }

    showGameOverMessage() {
        let textobj = [this.staticText.gameOver, this.staticText.playAgain];
        textobj.forEach(element => element.display());
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
      //use the previous dataMode to give value to "potentiometer" and "button" 
    else if(dataMode === "potentiometer") {
        potentiometerData = inString
      } else if (dataMode === "button") {
        buttonData = inString
      }
  }

  function draw() {
    background(150,120,176);
    textFont(resources.font);
    fill(255);
    game.run();
}

  //reference: inspired from the starter code generated from p5.serialcontrol
  function serverConnected() {
    print("Connected to Server");
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