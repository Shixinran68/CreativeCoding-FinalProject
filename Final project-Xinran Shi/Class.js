// Class.js

//the idea of using "particle" is inspired by an article: "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://www.lri.fr/~mbl/ENS/IG2/devoir2/files/docs/fuzzyParticles.pdf" 
//create particle class
class Particle {
    constructor(image) {
        this.image = image;
      //all the frames for the animation
        this.totalFrame = image.length;
     //the current frame position
    //about how to use round(), reference:https://p5js.org/reference/#/p5/round
        this.curFrame = round(random(0, this.totalFrame));
    }

    show() {
    //reference about the idea of frameCount: https://p5js.org/reference/#/p5/frameCount
    //reference of "===": https://p5js.org/reference/#/p5/===
    //changing the frames of foods and bombs, the smaller number after "%", the faster changes for the foods and bombs
        this.curFrame += (frameCount % 3 === 0);
    //let the elements of particle system appears in order, and defines their positions
        let ser = this.curFrame % this.totalFrame;
        imageMode(CENTER);
        image(this.image[ser], this.position.x, this.position.y);
    }

    //if the y coordinate is larger than windowHeight, the particle will disappear
    isDead() {
        return this.position.y>windowHeight ? true : false;
    }

    //the definition of update comes from the reference: https://p5js.org/reference/#/p5.PeakDetect/update
    //the speed of the particles moving from top to bottom
    update() {
        this.position.y+= this.speed;
    }

     //the birth position of the point, the class of point can be found in another file "position.js"
    birth(point) {
        this.curFrame = round(random(0, this.totalFrame));
        this.position = point;
    }
}

//the class of the amount of particles (particle system)
class ParticleSystem {
    constructor(image) {
        this.image = image;
        this.Particle == Particle; // constructor function of particle class
        this.list = []; // for holding particles
        this.prob = 0.4; // probability of adding one particle in each frame
        this.num = 50; // maximum number of particles in the list
    }

    //set the number of particles when they "birth" at the begining
    add() {
        if (this.list.length < this.num && random() < this.prob) {
            let particle = new this.Particle(this.image);
            particle.birth( new Point(random(0,width), 0) );
            this.list.push(particle);
        }
    }

    //if one particle in the list "isDead", it will be removed from the list
    remove() {
        for (let i in this.list)
            if (this.list[i].isDead())
            //about how to use splice, reference: https://p5js.org/reference/#/p5/splice
            //clean the "dead" particle
                this.list.splice(i, 1);
    }

     //update from the begining to the last
    update() {
        this.list.forEach(p => p.update())
    }

    //show from the begining to the last
    show() {
        this.list.forEach(p => p.show())
    }

     //run all the programs
    run() {
        this.add();
        this.update();
        this.show();
        this.remove();
    }

    //reload a round of the list
    reload() {
        this.list = []
    }
}
//inherit the properties from class Particle and generate class Food
class Food extends Particle {
    constructor(image) {
        super(image);
        this.speed = 10;
    }

    isCollected(minion) {
        return this.position.isInsideSquare(minion.position, 75);
    }
}

//inherit the properties from ParticleSystem and generate class FoodSystem
class FoodSystem extends ParticleSystem {
    constructor(image) {
        super(image);
        this.Particle = Food;
        this.num =50;
        this.collected = 0;
        this.prob = 0.5;
    }

    loadMinion(minion) {
        this.minion = minion;
    }

    collectFoods() {
        for(let i in this.list) 
            if (this.list[i].isCollected(this.minion)) {
                this.collected++;
                this.list.splice(i, 1);
            }
    }

    run() {
        super.run();
        this.collectFoods();
    }

    reload() {
        super.reload();
        this.collected = 0;
    }
}

//inherit properties of class Particle and generate class Bomb
class Bomb extends Particle {
    constructor(image) {
        super(image);
        this.speed = 30;
    }

    //"vulnerable" is declared in another file "Minion.js"
    hit(minion) {
        if(minion.vulnerable && this.position.isInsideSquare(minion.position, 50))
            minion.hurt();
    }
}

//inherit properties of class ParticleSystem and generate class BombSystem
class BombSystem extends ParticleSystem {
    constructor(image) {
        super(image);
        this.Particle = Bomb;
        this.num =10;
        this.prob = 0.3;
    }

    loadMinion(minion) {
        this.minion = minion;
    }

    hit() {
        this.list.forEach(element => element.hit(this.minion));
    }

    increaseNumber() {
        this.num += (frameCount % 500 === 0);
    }

    run() {
        super.run();
        this.hit();
        this.increaseNumber();
    }

    reload() {
        super.reload();
        this.num = 5;
    }
}




