//------------------------------------------------------
Rock = function (game, x, y, equation) {

    Phaser.Sprite.call(this, game, x, y, 'rock');
    
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 50;
    this.body.collideWorldBounds = true;
    this.scale.x = 0.15;
    this.scale.y = 0.15;
    
    this.equ = equation;
    
    //Add equation text on rock sprite. TO DO: change font size when sprite size is altered
    var text = this.game.add.text(Math.floor( this.width / 2), Math.floor(this.height / 2), this.equ, { font: "150px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    this.addChild(text);    

};

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.getEquation = function(){
    return this.equ;
}

/*
Rock.prototype.setEquation = function(equation){
    this.equ = equation;
    this.children.forEach(function(c){ this.removeChild(c)})
    var text = this.game.add.text(Math.floor(this.width / 2), Math.floor(this.height / 2), this.equ,{ font: "150px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    this.addChild(text);  
}*/

//.......................................................

//-------------------------------------------------------
Egg = function (game, x, y, equation) {

    Phaser.Sprite.call(this, game, x, y, 'egg');
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 300;
    this.body.bounce.y =  0.5; 
    this.body.collideWorldBounds = true;
    
    this.equ = equation;
    
    var text = this.game.add.text(Math.floor(this.width / 2), Math.floor(this.height / 2), this.equ, {font: "20px Arial", fill: "#ff0044",wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    this.addChild(text);
    
    this.hitCounter=0;
    
    //add click event to egg
    this.inputEnabled = true;
    //this.events.onInputDown.add(populateSolveEqCanvas, this, this);
    
    this.animations.add('hatch',['egg1.png','egg2.png','egg3.png','egg4.png','egg5.png','egg6.png','egg7.png','egg8.png']);
    this.animations.add('wiggle',['wiggle1.png','wiggle2.png','wiggle3.png','wiggle2.png','wiggle4.png','wiggle5.png','wiggle4.png','egg1.png'],24,false);

};

Egg.prototype = Object.create(Phaser.Sprite.prototype);
Egg.prototype.constructor = Egg;
//                 ___________________
Egg.prototype.getEquation = function(){
    return this.equ;
}

/*Egg.prototype.setEquation = function(equation){
    this.equ = equation;
    this.children.forEach(function(c){ this.removeChild(c)})
    var text = this.game.add.text(Math.floor(this.x + this.width / 2), Math.floor(this.y + this.height / 2), this.equ, {font: "150px Arial", fill: "#ffffff"});
    text.anchor.set(0.5);
    this.addChild(text);  
}*/
Egg.prototype.setEquStyle = function(style){
    this.children.forEach(function(c){ c.setStyle(style)});
}

