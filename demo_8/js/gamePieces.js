//------------------------------------------------------
Rock = function (game, x, y, equations) {

    Phaser.Sprite.call(this, game, x, y, 'rock');
    
    this.game.physics.arcade.enable(this);
    //set velocity in game while spawning rock
    this.body.velocity.y = 15;
    this.body.collideWorldBounds = true;
    this.equ = equations[1];
    this.equDisplay = equations[0];
    //Add equation text on rock sprite. TO DO: change font size when sprite size is altered
    var text = this.game.add.text(Math.floor( this.width / 2), Math.floor(this.height / 2), this.equDisplay, { font: "25px Comic Sans MS", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.width, align: "center"});
    
    
    /*var bmd = game.make.bitmapData(400,200);
    bmd.ctx.beginPath();    
    bmd.ctx.rect(0,0,400,200);    
    bmd.ctx.fillStyle = '#FF0000';    
    bmd.ctx.fill();    
    bmd.ctx.fillStyle = '#000000';    
    bmd.ctx.font = '32px Revalia';    
    bmd.ctx.fillText(Math.random(),40,40);  
    bmd.x = 0;
    bmd.y = 0;
    spr = game.add.sprite(100,100,bmd);    
    spr.inputEnabled = true;    
    spr.input.enableDrag();
    */
    
    
    ////////////////////////////
    
    /*var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'render-text', { preload: preload, create: create });var bmd = null;var spr = null;
    //  The Google WebFont Loader will look for this object, so create it before loading the script.
    
    WebFontConfig = {    
        active: function() { 
            game.time.events.add(Phaser.Timer.SECOND, createText, this); 
        },    
        google: {      
            families: ['Revalia']    }
    };
    
    function preload() {    
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    }*/
    ////////////////////////////
    
    
    //var text = null;
    //create new div
    //add html4 content to div corresponding to the equation
    //attach div to this using phaser add div
    
    text.anchor.set(0.5);
    this.equationText = text;
    //this.equationText = bmd;
};

Rock.prototype = Object.create(Phaser.Sprite.prototype);
Rock.prototype.constructor = Rock;

Rock.prototype.getEquation = function(){
    return this.equ;
}
Rock.prototype.setEquation = function(equations){
    this.equationText.destroy();
    this.equ = equations[1];
    this.equDisplay = equations[0];
    //Add equation text on rock sprite. TO DO: change font size when sprite size is altered
    var text = this.game.add.text(Math.floor( this.width / 2), Math.floor(this.height / 2), this.equDisplay, { font: "25px Comic Sans MS", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    this.equationText = text;
}


//.......................................................

//-------------------------------------------------------
Egg = function (game, x, y, equations) {

    Phaser.Sprite.call(this, game, x, y, 'egg');
    this.game.physics.arcade.enable(this);
    this.body.gravity.y = 300;
    this.body.bounce.y =  0.5; 
    this.body.collideWorldBounds = true;
    
    this.equ = equations[0];
    this.equDisplay = equations[1];
    var text = this.game.add.text(Math.floor(this.width / 2), Math.floor(this.height / 2), this.equDisplay, {font: "20px Comic Sans MS", fill: "#111111",wordWrap: true, wordWrapWidth: this.width, align: "center"});
    text.anchor.set(0.5);
    
    this.equationText = text;
    
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

