//------------------------------------------------------
Rock = function (game, x, y, equation) {

    Phaser.Sprite.call(this, game, x, y, 'rock');
    
    this.game.physics.arcade.enable(this);
    //set velocity in game while spawning rock
    this.body.velocity.y = 15;
    this.body.collideWorldBounds = true;
    this.equ = equation;
};

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.getEquation = function(){
    return this.equ;
}

Rock.prototype.setEquation = function(equation){
    this.equ = equation;
    //$("#gmeq_" + (this.rockProducedIndex+1) + "_" + this.inputId).remove();
    var newGMDivId = "gmeq_" + (this.rockProducedIndex+1) + "_" + this.inputId+"_"+this.inputId;
    this.newGMDiv.setAttribute("id", newGMDivId);
    this.newGMDiv.setAttribute("class", "gm-game-rock");
    this.newGMDiv.style.left = (this.inputX + 1) + 'px';
    this.newGMDiv.style.top = (this.inputY + 1) + 'px';
    this.newGMDiv.style.width = "100px";
    this.newGMDiv.style.height = "65px";
    this.newGMDiv.style.pointerEvents="none";
	this.newGMDiv.style.zIndex = 2;	
    gmath.AlgebraView.createStaticExpression(this.newGMDiv, equation);	
    document.getElementById("game-div").appendChild(this.newGMDiv);
}

Rock.prototype.createRockEqDiv = function(inputId, inputX, inputY, inputEq, rockProducedIndex){
    this.newGMDiv = document.createElement("div");
    var newGMDivId = "gmeq_" + (rockProducedIndex+1) + "_" + inputId;
    this.newGMDiv.setAttribute("id", newGMDivId);
    this.newGMDiv.setAttribute("class", "gm-game-rock");
    this.newGMDiv.style.left = (inputX + 1) + 'px';
    this.newGMDiv.style.top = (inputY + 1) + 'px';
    this.newGMDiv.style.width = "100px";
    this.newGMDiv.style.height = "65px";
    this.newGMDiv.style.pointerEvents="none";
	this.newGMDiv.style.visibility = "hidden";
	this.newGMDiv.style.zIndex = 2;    
	var gameDivContainer = document.getElementById("game-div");
    gameDivContainer.appendChild(this.newGMDiv);
	
    this.rockProducedIndex = rockProducedIndex;
    this.inputId = inputId;
    this.inputX = inputX;
    this.inputY = inputY;

    

    gmath.AlgebraView.createStaticExpression(this.newGMDiv, inputEq);
    return this.newGMDiv;
},

Rock.prototype.displayGMEquation = function(){
    this.newGMDiv.style.visibility="visible";
},
//.......................................................

//-------------------------------------------------------
Egg = function (game, x, y, equation, solutions) {

    Phaser.Sprite.call(this, game, x, y, 'egg');
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 300;
    this.body.bounce.y =  0.5; 
    this.body.collideWorldBounds = true;
    
    this.equ = equation;
    this.solutions = solutions;
    this.hitCounter=0;
    //add click event to egg
    this.inputEnabled = true;
    //this.events.onInputDown.add(populateSolveEqCanvas, this, this);
    
    this.animations.add('hatch',['egg.png','hatch1.png','hatch2.png','hatch3.png','hatch4.png','hatch5.png','hatch6.png','hatch7.png','hatch8.png','hatch9.png','hatch10.png','hatch11.png','hatch12.png','hatch13.png','hatch14.png'],6,false);
    this.animations.add('wiggleOnce',['wiggle1.png','wiggle2.png','wiggle3.png','wiggle2.png','egg.png','wiggle4.png','wiggle5.png','wiggle4.png','egg.png'],10,false);
    this.animations.add('wiggleContinous',['wiggle1.png','wiggle2.png','egg.png','wiggle4.png','egg.png'],4,true);
    this.canvasId = "gseq_0";

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

Egg.prototype.createEggEqDiv = function(inputX, inputY, inputEq, eggProducedIndex){
    this.newGMDiv = document.createElement("div");
    var newGMDivId = "gseq_" + (eggProducedIndex+1);
    this.newGMDiv.setAttribute("id", newGMDivId);
    this.newGMDiv.setAttribute("class", "gm-game-egg");
    this.newGMDiv.style.left = (inputX) + 'px';
    this.newGMDiv.style.top = (inputY + 50) + 'px';
    this.newGMDiv.style.width = "85px";
    this.newGMDiv.style.height = "65px";
    this.newGMDiv.style.pointerEvents="none";
    this.newGMDiv.style.zIndex = 2;
    var gameDivContainer = document.getElementById("game-div");
    gameDivContainer.appendChild(this.newGMDiv);
    gmath.AlgebraView.createStaticExpression(this.newGMDiv, inputEq);
    return this.newGMDiv;
}
