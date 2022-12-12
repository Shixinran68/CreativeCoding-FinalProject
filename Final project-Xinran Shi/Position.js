// Position.js

//collision point
class Point {
    constructor(px = 0, py = 0) {
        this.x = px;
        this.y = py;
    }

    distance(pos) {
        let dx = this.x - pos.x;
        let dy = this.y - pos.y;
    //about how to use sqrt(relate to Math), reference: https://p5js.org/reference/#/p5/sqrt
        return Math.sqrt(dx * dx + dy * dy);
    }

       //no matter what the postion is, as long as the coordinate distance is within range, there will be a collision
    isInsideSquare(pos, radius) {
        return (pos.x > this.x - radius
            && pos.x < this.x + radius
            && pos.y > this.y - radius
            && pos.y < this.y + radius)
    }
}

class Text {
    constructor(textobj) {
        Object.assign(this, textobj);//about how to use object.assign(), reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    }
    
     //more details about setting text can be found in the file "Game.js"
    display() {
        textAlign(this.align[0], this.align[1]);
        textSize(this.size);
        text(this.content, this.position.x, this.position.y);
    }
}

