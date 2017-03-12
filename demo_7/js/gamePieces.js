//------------------------------------------------------
Rock = function (game, x, y, equation) {

    Phaser.Sprite.call(this, game, x, y, 'rock');
    
    this.game.physics.arcade.enable(this);
    this.body.velocity.y = 10000;
    this.body.collideWorldBounds = true;
    this.equ = equation;
    
    //Add equation text on rock sprite. TO DO: change font size when sprite size is altered
    var text = this.game.add.text(Math.floor( this.width / 2), Math.floor(this.height / 2), this.equ, { font: "25px Comic Sans MS", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    this.equationText = text;
    //this.addChild(text);    

};

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.getEquation = function(){
    return this.equ;
}



//.......................................................

//-------------------------------------------------------
Egg = function (game, x, y, equation) {

    Phaser.Sprite.call(this, game, x, y, 'egg');
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 300;
    this.body.bounce.y =  0.5; 
    this.body.collideWorldBounds = true;
    
    this.equ = equation;
    
    var text = this.game.add.text(Math.floor(this.width / 2), Math.floor(this.height / 2), this.equ, {font: "20px Comic Sans MS", fill: "#111111",wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    
    this.equationText = text;
    
    this.hitCounter=0;
    
    //add click event to egg
    this.inputEnabled = true;
    //this.events.onInputDown.add(populateSolveEqCanvas, this, this);
    
    this.animations.add('hatch',['egg.png','hatch1.png','hatch2.png','hatch3.png','hatch4.png','hatch5.png','hatch6.png','hatch7.png','hatch8.png','hatch9.png','hatch10.png','hatch11.png','hatch12.png','hatch13.png','hatch14.png']);
    this.animations.add('wiggleOnce',['wiggle1.png','wiggle2.png','wiggle3.png','wiggle2.png','egg.png','wiggle4.png','wiggle5.png','wiggle4.png','egg.png'],10,false);
    this.animations.add('wiggleContinous',['wiggle1.png','wiggle2.png','egg.png','wiggle4.png','egg.png'],4,true);

};

Egg.prototype = Object.create(Phaser.Sprite.prototype);
Egg.prototype.constructor = Egg;
//                 ___________________
Egg.prototype.getEquation = function(){
    return this.equ;
}

Egg.prototype.setEquStyle = function(style){
    this.children.forEach(function(c){ c.setStyle(style)});
}

