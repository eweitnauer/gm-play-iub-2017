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
    this.GMCanvas.controller.reset();
    this.GMCanvas.model.createElement('derivation', { eq: equation, pos: { x: 'center', y: 50 }, font_size:30, handle_stroke_color:'#fff' });
}

Rock.prototype.createRockEqDiv = function(inputId, inputX, inputY, inputEq, rockProducedIndex){
    this.newGMDiv = document.createElement("div");
    var newGMDivId = "gmeq_" + (rockProducedIndex+1) + "_" + inputId;
    this.newGMDiv.setAttribute("id", newGMDivId);
    this.newGMDiv.setAttribute("class", "gm-game-rock");
    this.newGMDiv.style.left = inputX + 'px';
    this.newGMDiv.style.top = inputY + 'px';
    this.newGMDiv.style.display = "none";
    document.body.appendChild(this.newGMDiv);
        
    var canvas = new gmath.Canvas('#' + newGMDivId, {use_toolbar: false, vertical_scroll: false });
    console.log("inputEq:"+inputEq);
    var derivation = canvas.model.createElement('derivation', { eq: inputEq, pos: { x: 'center', y: 50 }, font_size:30, handle_stroke_color:'#fff' });        
    return canvas;
},

Rock.prototype.displayGMEquation = function(){
    this.newGMDiv.style.display="block";
},
//.......................................................

//-------------------------------------------------------
Egg = function (game, x, y, equation) {

    Phaser.Sprite.call(this, game, x, y, 'egg');
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 300;
    this.body.bounce.y =  0.5; 
    this.body.collideWorldBounds = true;
    
    this.equ = equation;
    this.hitCounter=0;
    //add click event to egg
    this.inputEnabled = true;
    //this.events.onInputDown.add(populateSolveEqCanvas, this, this);
    
    this.animations.add('hatch',['egg.png','hatch1.png','hatch2.png','hatch3.png','hatch4.png','hatch5.png','hatch6.png','hatch7.png','hatch8.png','hatch9.png','hatch10.png','hatch11.png','hatch12.png','hatch13.png','hatch14.png'],6,false);
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

Egg.prototype.createEggEqDiv = function(inputX, inputY, inputEq, eggProducedIndex){
    this.newGMDiv = document.createElement("div");
    var newGMDivId = "gseq_" + (eggProducedIndex+1);
    this.newGMDiv.setAttribute("id", newGMDivId);
    this.newGMDiv.setAttribute("class", "gm-game-egg");
    this.newGMDiv.style.left = inputX + 'px';
    this.newGMDiv.style.top = (inputY + 50) + 'px';
    this.newGMDiv.style.display = "block";
    document.body.appendChild(this.newGMDiv);
        
    var canvas = new gmath.Canvas('#' + newGMDivId, {use_toolbar: false, vertical_scroll: false });
    console.log("inputEq:"+inputEq);
    var derivation = canvas.model.createElement('derivation', { eq: inputEq, pos: { x: 'center', y: 50 }, font_size:30, handle_stroke_color:'#fff' });        
    return canvas;
}
