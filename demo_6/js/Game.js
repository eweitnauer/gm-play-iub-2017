//the actual game
var DinoEggs = DinoEggs || {}; 

DinoEggs.Game = function(){
    Phaser.State.call(this);
    
    this._eggsGroup =null;
    this._rocksGroup =null;
    this._platforms =null;
    this._spawnRockTimer = 0;
    this.g_x_start = 32;
    this.g_x_end = 400;
    this.matchExpCanvas = null;
    this.solveEqCanvas=null;
    this.selectedEgg=null;
    
    this.score=0;
    this.scoreText=null;
    //DinoEggs._scoreText = null;
    //DinoEggs._score = 0;
    this.g_problems = [
        
        [
          'm*x+n*x'
        , 'm*x+x*n'
        , 'n*x+m*x'
        , 'n*x+x*m'
        , 'x*n+m*x'
        , 'x*n+x*m'
        , 'x*m+n*x'
        , 'x*m+x*n'
        , '(m+n)*x'
        , 'x*(m+n)'
        , '(n+m)*x'
        , 'x*(n+m)'
        ]
    ];
    this.g_canvasExpression = this.g_problems[0][0];
    this.g_parsedCanvasExpression = this.g_canvasExpression.replace(/\*/g, "");
    this.g_equation="";
    this.g_parsedEquation="";
    
    this.music=null;
    
    this.c =["sjkdhjkdh"];

};
DinoEggs.Game.prototype = Object.create(Phaser.State.prototype);
DinoEggs.Game.prototype.constructor = DinoEggs.Game;

DinoEggs.Game.prototype = {

    create:function(){
        //set world dimensions
        //this.game.world.setBounds(0, 0, 1920, 1920);
        
        //load both GM canvases
        console.log("loading canvas");
        //!preserve bindings
        var currentObj = this;
        loadGM(function(){
         currentObj.initCanvas();   
        
        }, { version: '0.12.6' });
        
        
        //background
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
        
        //set ground
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this._platforms = this.game.add.group();
        this._platforms.enableBody = true;
        var ground = this._platforms.create(0, this.game.world.height - 64, 'ground');
        ground.scale.setTo(2,6);
        ground.body.immovable = true;
        
        //dino mom
        this.dino = this.game.add.sprite(600,350, 'dino');
        var move = this.dino.animations.add('move',['2.png','3.png','4.png','5.png'],24,true);
        this.dino.animations.play('move', 10, true);
        this.game.add.tween(this.dino).to({y: 350}, 2400, Phaser.Easing.Bounce.InOut, true);
        
        //  Rocks group
        this._rocksGroup = this.game.add.group();
        this._rocksGroup.enableBody = true;
        this._rocksGroup.physicsBodyType = Phaser.Physics.ARCADE;

        
        //  Eggs group
        this._eggsGroup = this.game.add.group();
        this._eggsGroup.enableBody = true;
        this._eggsGroup.physicsBodyType = Phaser.Physics.ARCADE;
         
        
        //  The score
        this.scoreText = this.game.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        
        //music 
        this.music = this.game.add.audio('bg_music');
        //this.music.play();
        
        //create Eggs
        this.createEggs(4);
        
        //create rock wave - (rockinterval, number of rocks)
        this.startRockWave(2,6);
 

        
        
    },
    
    update:function(){
        this.game.physics.arcade.collide(this._eggsGroup, this._platforms);
        this.game.physics.arcade.overlap(this._rocksGroup, this._platforms, this.disappearRockOnGround, null, this);
        this.game.physics.arcade.overlap(this._rocksGroup, this._eggsGroup, this.hitEgg, null, this);
        
        //check if the rocks are falling:
        if(this._rocksGroup.countLiving() != 0){    
            this.game.input.enabled = false;
        }
        else{
            this.game.input.enabled = true;
        }

    },
    
    disappearRockOnGround: function(rock, platform){
        this.rockBurst(rock);
    },
    
    createEggs: function(numEggs){
        //eggs fall from center of canvas onto ground 
        var egg_y = this.game.world.height/2;

        //  Here we'll create eggs evenly spaced apart
        var egg_x_array = this.linspace(this.g_x_start,this.g_x_end,numEggs);

        for (var i = 0; i < numEggs; i++){
            var egg = new Egg(this.game,egg_x_array[i],egg_y,this.createEggEquation());
            
            //add animation callback on complete !maintain parameter bindings
            egg.animations.getAnimation('hatch').onComplete.add(function(eggSprite, animation){
                //get x position for egg to hatch
                var egg_x = eggSprite.x;
                var isSad = false;
                if(eggSprite.hitCounter > 2){
                    isSad = true;
                }
                this._eggsGroup.remove(eggSprite);        
                this.runToMom(egg_x, isSad);
            }, this);
            
            //add click event to egg
            egg.inputEnabled = true;
            egg.events.onInputDown.add(this.populateSolveEqCanvas, this, egg);
            
            this._eggsGroup.add(egg);
        }
    },

    runToMom: function(egg_x, isSad){
        var hatchling = this.game.add.sprite(egg_x,this.game.world.height-100, 'hatchling');
        if(isSad){
            hatchling.tint = 0xff0000;
        }

        hatchling.anchor.setTo(0.5, 0.5);
        hatchling.animations.add('run');
        hatchling.animations.play('run', 10, true);

        // params are: properties to tween, time in ms, easing and auto-start tweenthis.
        var runningDinoTween = this.game.add.tween(hatchling).to({x: 600, y: this.game.world.height-100}, 3000, Phaser.Easing.Quadratic.InOut, true);
        runningDinoTween.onComplete.addOnce(this.stopDino, this,hatchling);  


        if(this._eggsGroup.countLiving() == 0){
            this.gameOver();            
        }else{
            this.startRockWave(2,6);
        }

    },
    stopDino: function(hatchling){
        //  This method will reset the frame to frame 1 after stopping
        hatchling.animations.stop(null, true);

        //to(properties, duration, ease, autoStart, delay, repeat, yoyo) 
        var jumpingTween = this.game.add.tween(hatchling).to({x: 600,y : this.game.world.height-110}, 1000, Phaser.Easing.Bounce.InOut, true,0,-1,false);
    },
    
    populateSolveEqCanvas: function(selectedEgg){ 
        this.selectedEgg=selectedEgg;
        this.clearGMCanvas(this.solveEqCanvas);
        this.clearGMCanvas(this.matchExpCanvas);
        this.solveEqCanvas.model.createElement('derivation', { eq: selectedEgg.equ, pos: { x: 'center', y: 50 } });
        //this.clearGMCanvas(this.matchExpCanvas);
    },
    
    startRockWave: function(rockIntervalSec, numRocks){
        this.game.time.events.repeat(Phaser.Timer.SECOND * rockIntervalSec, numRocks, this.spawnRock, this);
    },
    
    spawnRock: function(){
        console.log("spawnrock");
        var rock = new Rock(this.game,this.game.world.randomX, 0, this.getMatchEquationOnRock());
        this._rocksGroup.add(rock);
    
    },
    
    hitEgg: function(rock, egg){
        var hits = ++egg.hitCounter;
        this.rockBurst(rock);

        if(this._rocksGroup.countLiving() == 0){    
            this.clearGMCanvas(this.matchExpCanvas);    
        }
        egg.animations.play('wiggle');
        switch(hits){
            case 1 : egg.tint = 0x00ff00; 
                break;
            case 2 : egg.tint = 0xff0000;
                    var style = {font: "20px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: egg.width, align: "center"};
                    egg.setEquStyle(style);
                    break
            case 3 :  egg.tint = 0x2412ff;
                     break;

        }
    },
    
    rockBurst: function(rock){    
    
         //burst emitter for rocks
        var rock_emitter = this.game.add.emitter(0, 0, 100);

        rock_emitter.makeParticles('star');
        rock_emitter.gravity = 0;

        rock_emitter.x = rock.x;
        rock_emitter.y = rock.y;

        //explode / milliseconds before particle disappear/ doesn't matter/ number of particles emitted at a time
        rock_emitter.start(true, 2000, null, 5);

        this._rocksGroup.remove(rock);

        //  And 2 seconds later we'll destroy the emitter
        this.game.time.events.add(2000, this.destroyObject, this, rock_emitter);
        
        if(this._rocksGroup.countLiving() == 0){
            this.clearGMCanvas(this.matchExpCanvas);
        }

    },
    
    destroyObject: function(obj) {
        if(obj != undefined)
            obj.destroy();
    },
    
    managePause:function(){
        //To be implemented
    },
    
    gameOver: function() {    
        //pass the score as a parameter 
        this.scoreText.destroy();
        this.clearGMCanvas(this.solveEqCanvas);
        this.clearGMCanvas(this.matchExpCanvas);
        var gameOverText = this.game.add.text( this.game.world.width*0.5 - 50, this.game.world.height*0.5 - 40, 'Score:' + this.score, { fontSize: '22px', fill: '#000' });
        
        var restartButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 20, 'restart', function(){
            this.state.start('Game');
        }, this.game, 1, 0, 2);
        restartButton.anchor.set(0.5);
        
        var mainMenuButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 50, 'menu', function(){
            this.state.start('MainMenu');
        }, this.game, 1, 0, 2);
        mainMenuButton.anchor.set(0.5);
        this.endStar();
        this.music.stop();
    },
    
    endStar: function() {
        var starPostion =0;
        var scoreBase =50;
        var starNumber=0;
        while (this.score > 0){
           this.game.add.sprite(this.game.world.width*0.5 - 50 + starPostion, this.game.world.height*0.5 - 80, 'star');
            starPostion = starPostion + 20;
            this.score = this.score - scoreBase; 
            starNumber++;
            if (starNumber == 5){
                break;
            }
        }
        var greyStar = 5 - starNumber;
        while(greyStar > 0){
            var star1 =  this.game.add.sprite(this.game.world.width*0.5 - 50 + starPostion, this.game.world.height*0.5 - 80, 'star');
            star1.tint= 0x232323;
            starPostion = starPostion + 20;
            greyStar--;
        }
    },
    matchEquationOnRocks: function(equation){
        var matchedEqIndexArray = [];
        var parsedEq = equation.replace(/\*/g, "");

        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            if(this._rocksGroup.children[i].equ == parsedEq){
                //return i;
                matchedEqIndexArray.push(i);
            }
            
        }
        //return -1;
        return matchedEqIndexArray;
    },
    matchEqCheck:function(evt){
        var lastEq = evt.last_eq;
        console.log(this);
        var matchedEqIndexArray = this.matchEquationOnRocks(lastEq);

            if (matchedEqIndexArray.length > 0 && this._rocksGroup.countLiving() > 0) {
                console.log("Matched")
                for(var j = 0; j < matchedEqIndexArray.length ; j++){
                    this.rockBurst(this._rocksGroup.children[matchedEqIndexArray[j]]);
                    //Add and update the score
                    this.score += 10;
                    this.scoreText.text = 'Score: ' + this.score;

                }            		
                if(this._rocksGroup.countLiving() == 0){
                    this.clearGMCanvas(this.matchExpCanvas); 
                }

            }
    },
    solveEqCheck:function(evt){
        console.log(!isNaN(evt.last_eq.slice(2)),evt.last_eq.slice(2));
                //condition to check if equation is solved
                console.log("equation being changed");
                console.log(evt.last_eq.startsWith("x=") && !isNaN(evt.last_eq.slice(2)));
                if (evt.last_eq.startsWith("x=") && !isNaN(evt.last_eq.slice(2))){
                    console.log("solved");
                    console.log(this.selectedEgg);
                    if(this.selectedEgg){
                        
                        if (this.selectedEgg.hitCounter == 0) {
                            this.score += 50;
                            console.log("hit 0 means + 50" );
                        } else if (this.selectedEgg.hitCounter == 1){
                            this.score += 30;
                             console.log("hit 1 means + 30" );
                        } else if (this.selectedEgg.hitCounter == 2){
                             this.score += 20;
                             console.log("hit 2 means + 20" );
                        } else {
                            this.score += 10;
                            console.log("hit more means + 10");
                        }

                        this.scoreText.text = 'Score: ' + this.score;

                        this.selectedEgg.animations.play('hatch', 2, false);
                        console.log("clearing canvas");
                        console.log(this.clearGMCanvas);
                        this.clearGMCanvas(this.solveEqCanvas);
                        this.clearGMCanvas(this.matchExpCanvas);
                        if(this._eggsGroup.countLiving() > 1){
                            this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } }); 
                        }
                        this.selectedEgg = null;
                    }

                }
    },
    initCanvas: function(){
        //GM Code
        
            //solveEqCanvas is for Equation Solving
            //matchExpCanvas is for Pattern Matching
            this.solveEqCanvas = new gmath.Canvas('#gmath1-div', {use_toolbar: false, vertical_scroll: false });
            this.matchExpCanvas = new gmath.Canvas('#gmath2-div', {use_toolbar: false, vertical_scroll: false });

            this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } });
            //this.clearGMCanvas(this.solveEqCanvas);

            //disabling the solveEq canvas
            
            //!preserve binding
            var thisObj =this;
            this.matchExpCanvas.model.on('el_changed', function(evt) {	
                thisObj.matchEqCheck(evt);
            });
            //!preserve binding
            this.solveEqCanvas.model.on('el_changed', function(evt) {
                 thisObj.solveEqCheck(evt);
            });
        

    },
    clearGMCanvas: function(canvasObj){
        //clear canvas

        while(canvasObj.model.elements().length > 0){
        canvasObj.model.removeElement(canvasObj.model.elements()[0]); 
     }
    },
    
    //utility functions
    //.............................................................
    // random range generator
    getRandomRange: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getMatchEquationOnRock: function(){
        var indexToChoose = this.getRandomRange(1, this.g_problems[0].length - 1);
        this.g_equation =  this.g_problems[0][indexToChoose];
        this.g_parsedEquation = this.g_equation.replace(/\*/g, "");
        return this.g_parsedEquation;
    },
    createEggEquation: function(){
            //create random constants for equation
            a = Math.floor((Math.random() * 10) + 1);
            b = Math.floor((Math.random() * 10) + 1);
            c = Math.floor((Math.random() * 10) + 1);

            str = "";
            equation = str+a+"x+"+b+"="+c;   
            return equation;
    },
    //http://www.numericjs.com/index.php
    linspace: function(a,b,n) {
        if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
        if(n<2) { return n===1?[a]:[]; }
        var i,ret = Array(n);
        n--;
        for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
        return ret;
    }
    

}

