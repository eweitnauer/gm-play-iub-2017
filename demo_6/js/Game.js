//the actual game
var DinoEggs = DinoEggs || {}; 

DinoEggs.Game = function(){
    Phaser.State.call(this);
    
    this._levelNumber = 2;
    
    this._eggsGroup = null;
    this._rocksGroup = null;
    this._platforms = null;
    this._spawnRockTimer = 0;
    this.g_x_start = 32;
    this.g_x_end = 400;
    this.matchExpCanvas = null;
    this.solveEqCanvas = null;
    this.selectedEgg = null;
    this.g_numEggs = 4;
    this.score = 0;
    this.scoreText = null;
    this.boardText1 = null;
    this.boardText2 = null;
    this.board = null;

   
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
    this.g_rockProducedIndex = 0;
    this.g_numRocks = 4;
    
    this.music=null;
    
    this.rockPositions =[];
    
    this.undoBtn = null;

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
        
        //hatchling positioning
        //this.hatchlingXLeftLimit = g_x_end + 10;
        //this.hatchlingXRightLimit = this.hatchlingXLeftLimit + 139; //139 is the width of a single dino hatchling
        this.hatchlingXRightLimit = 200;
        this.hatchlingXFinalPos = this.hatchlingXRightLimit;
        //this.hatchlingXRange = this.hatchlingXRightLimit - this.hatchlingXLeftLimit;
        this.hatchlingXSpacing = 20;
        
        this.hatchlingYUpperLimit = 80;
        this.hatchlingYLowerLimit = 40;
        this.hatchlingYFinalPos = this.hatchlingYLowerLimit;
        this.hatchlingYRange = this.hatchlingYUpperLimit - this.hatchlingYLowerLimit;
        //this.hatchlingYSpacing = (this.hatchlingYUpperLimit + this.hatchlingYLowerLimit) / this.g_numEggs;
        this.hatchlingYSpacing = 10;
        
        
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
        this.game.add.tween(this.dino).to({y: 275}, 2400, Phaser.Easing.Bounce.InOut, true);
        
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
        this.createEggs(this.g_numEggs);
        
        
        //create rock wave - (rockinterval between consecutive rocks, number of rocks)

       
        this.startRockWave(6,this.g_numRocks);

        //end celebration 
        this.celebrationEmitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
        
         //  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
         this.celebrationEmitter.makeParticles(['jewel_red', 'jewel_purple', 'jewel_white','jewel_green','jewel_yellow']);
        this.celebrationEmitter.gravity = 0;
        
        this.celebrationEmitter.width = 800;

    

        this.celebrationEmitter.width = 800;


        this.celebrationEmitter.maxParticleScale = 1;
        this.celebrationEmitter.minParticleScale = 0.5;
        this.celebrationEmitter.setYSpeed(100, 200);
        this.celebrationEmitter.gravity = 0;
        this.celebrationEmitter.width = this.game.world.width * 1.5;
        this.celebrationEmitter.minRotation = 0;
        this.celebrationEmitter.maxRotation = 40;
   
       
        
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
        
        //render egg equations
        this._eggsGroup.forEach(function(egg){
          egg.equationText.x = Math.floor(egg.x + egg.width / 2);
          egg.equationText.y = Math.floor(egg.y + egg.height / 2);          
        });
        
        //render rock equations
        this._rocksGroup.forEach(function(rock){
          rock.equationText.x = Math.floor(rock.x + rock.width / 2);
          rock.equationText.y = Math.floor(rock.y + rock.height / 2);          
        });

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
                
                //get score
                var score = this.calculateScore(eggSprite.hitCounter); 
                
                //Add score text here
                var obtainedScoreText = this.game.add.text(eggSprite.x, eggSprite.y, score, { fontSize: '32px', fill: '#000' });
                
                //score animation
//                this.clearBoard();
                var scoreTween = this.game.add.tween(obtainedScoreText).to({x: 700, y: 16}, 3000, Phaser.Easing.Quadratic.InOut, true);
                scoreTween.onComplete.addOnce(this.updateScore,this,obtainedScoreText); 
                
                //check for any existing black eggs
                if(eggSprite.hitCounter <= 2){
                    for (var j = 0; j < this._eggsGroup.length; j++){
                        if(this._eggsGroup.children[j].hitCounter > 2){
                            var blackEggScoreText = this.game.add.text(this._eggsGroup.children[j].x, this._eggsGroup.children[j].y, "-10", { fontSize: '32px', fill: '#000' });
                            var blackEggTween = this.game.add.tween(blackEggScoreText).to({x: 700, y: 16}, 3000, Phaser.Easing.Quadratic.InOut, true);
                            //blackEggTweenArray.push(blackEggTween);
                        blackEggTween.onComplete.addOnce(this.updateScore,this,blackEggScoreText); 
                        }
                    }
                }
                
                eggSprite.equationText.destroy();
                this._eggsGroup.remove(eggSprite); 
                this.runToMom(egg_x, isSad);
                this.clearGMCanvas(this.solveEqCanvas);
                this.clearGMCanvas(this.matchExpCanvas);
                if(this._eggsGroup.countLiving() > 0){
                    document.getElementById("eq-match-div").style.display="block";
                    document.getElementById("eq-solve-div").style.display="none";
                    this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } }); 
                    this.startRockWave(2,this.g_numRocks);
                }
                else{
                    //add celebration animation for game over
                }
            }, this);
            
            //add click event to egg
            egg.inputEnabled = true;
            egg.events.onInputDown.add(this.populateSolveEqCanvas, this, egg);
            this._eggsGroup.add(egg);
    
        }
    },
    calculateScore: function(hitCount){
        if (hitCount == 0) {
            return "+50";
        } else if (hitCount == 1){
            return "+40";
        } else if (hitCount == 2){
             return "+30";
        } else {
            return "+20";
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
        var runningDinoTween = this.game.add.tween(hatchling).to({x: this.game.world.width - this.hatchlingXFinalPos, y: this.game.world.height-this.hatchlingYFinalPos}, 3000, Phaser.Easing.Quadratic.InOut, true);
        
        this.hatchlingYFinalPos += this.hatchlingYSpacing;
        if(this.hatchlingYFinalPos >= this.hatchlingYUpperLimit){
            this.hatchlingXFinalPos += this.hatchlingXSpacing;
            this.hatchlingYFinalPos = this.hatchlingYLowerLimit;
        }
        runningDinoTween.onComplete.addOnce(this.stopDino, this,hatchling);  


    },
    stopDino: function(hatchling){
        //  This method will reset the frame to frame 1 after stopping
        hatchling.animations.stop(null, true);

        //to(properties, duration, ease, autoStart, delay, repeat, yoyo) 
        /*var jumpingTween = this.game.add.tween(hatchling).to({x: 600,y : this.game.world.height-110}, 1000, Phaser.Easing.Bounce.InOut, true,0,-1,false);*/
        if(this._eggsGroup.countLiving() == 0)
        {
           this.gameOver();   
        }
    },
    updateScore: function(currentScoreText){
        var scoreString = currentScoreText.text;
        currentScoreText.destroy();
        
        // update the actual score
        var operation = scoreString.substring(0,1);
        if(operation == '+'){
            this.score += parseInt(scoreString.substring(1));
        }else{
            this.score -= parseInt(scoreString.substring(1));
            
            //do not allow negative scores
            if(this.score < 0){
                this.score = 0;
            }
        } 
        this.scoreText.text = 'Score: ' + this.score;
    },
    
    populateSolveEqCanvas: function(selectedEgg){
        if(this.board)
            this.clearBoard();
        console.log("egg clicked");
        document.getElementById("eq-solve-div").style.display="block";
        document.getElementById("eq-match-div").style.display="none";        
        this.selectedEgg = selectedEgg;
        this.clearGMCanvas(this.solveEqCanvas);
        this.clearGMCanvas(this.matchExpCanvas);
        this.solveEqCanvas.model.createElement('derivation', { eq: selectedEgg.equ, pos: { x: 'center', y: 50 } });
    },
    
    startRockWave: function(rockIntervalSec, numRocks){
        this.g_rockProducedIndex = 0;
        //get rock positions for rocks
        this.rockPositions = this.linspace(this.g_x_start,this.g_x_end,numRocks);
        this.game.time.events.repeat(Phaser.Timer.SECOND * rockIntervalSec, numRocks, this.spawnRock, this);
    },
    
    spawnRock: function(){
        console.log("spawnrock");
        if(this.rockPositions.length>0){
            var randIndex = Math.floor(Math.random() * this.rockPositions.length);
            var randposX = this.rockPositions[randIndex];
            this.rockPositions.splice(randIndex,1);
            var rock = new Rock(this.game,randposX, 0, this.getMatchEquationOnRock());
            this._rocksGroup.add(rock);
            this.g_rockProducedIndex++;
        }
    
    },
    
    hitEgg: function(rock, egg){
        var hits = ++egg.hitCounter;
        this.rockBurst(rock);

        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){    
            this.clearGMCanvas(this.matchExpCanvas);    
        }
       
        switch(hits){
            case 1 : egg.tint = 0x00ff00; 
                    egg.animations.play('wiggleOnce');
                     break;
            case 2 : egg.tint = 0xff0000;
                    var style = {font: "20px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: egg.width, align: "center"};
                    egg.setEquStyle(style);
                    egg.animations.play('wiggleOnce');
                    break
            case 3 :  egg.tint = 0x2412ff;
                     egg.animations.play('wiggleContinous');
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
        
        rock.equationText.destroy();
        this._rocksGroup.remove(rock);

        //  And 2 seconds later we'll destroy the emitter
        this.game.time.events.add(2000, this.destroyObject, this, rock_emitter);
        
        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){
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
        
        var stars = this.endStar();
        if (stars>0){
            this.updatePlayerData(stars);
        }        
        var restartButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 20, 'restart', function(){
            this.state.start('Game');
        }, this.game, 1, 0, 2);
        restartButton.anchor.set(0.5);
        
        var mainMenuButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 50, 'menu', function(){
            this.state.start('MainMenu');
        }, this.game, 1, 0, 2);
        mainMenuButton.anchor.set(0.5);
        
        this.music.stop();
        
        //add celebration
         this.celebrationEmitter.start(false, 10000, 100);

    },
    updatePlayerData: function(stars) {
		// set number of stars for this level
		DinoEggs.PLAYER_DATA[this._levelNumber-1] = stars;

		// unlock next level
		if (this._levelNumber < DinoEggs.PLAYER_DATA.length) {
			if (DinoEggs.PLAYER_DATA[this._levelNumber] < 0) { // currently locked (=-1)
				DinoEggs.PLAYER_DATA[this._levelNumber] = 0; // set unlocked, 0 stars
			}
		};
		// and write to local storage
		window.localStorage.setItem('DinoGame_Progress', JSON.stringify(DinoEggs.PLAYER_DATA));
        
        console.log("player data");
        console.log(DinoEggs.PLAYER_DATA);
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
            if (starNumber == 3){
                break;
            }
        }
        var greyStar = 3 - starNumber;
        while(greyStar > 0){
            var star1 =  this.game.add.sprite(this.game.world.width*0.5 - 50 + starPostion, this.game.world.height*0.5 - 80, 'star');
            star1.tint= 0x232323;
            starPostion = starPostion + 20;
            greyStar--;
        }
        return starNumber;
    },
    
    showBoard: function() {
        this.board = this.game.add.sprite(490,250,'board');
        this.boardText1 = this.game.add.text(520,270, 'click egg ', { fontSize: '15px', fill: '#000' });
        this.boardText2 = this.game.add.text(500,300, 'to solve equation', { fontSize: '15px', fill: '#000' });
    },
    
    clearBoard: function() {
        this.board.destroy();
        this.boardText1.destroy();
        this.boardText2.destroy();
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
        this.undoBtn.disabled = false;
        var lastEq = evt.last_eq;
        var matchedEqIndexArray = this.matchEquationOnRocks(lastEq);

            if (matchedEqIndexArray.length > 0 && this._rocksGroup.countLiving() > 0) {
                for(var j = 0; j < matchedEqIndexArray.length ; j++){
                    this.rockBurst(this._rocksGroup.children[matchedEqIndexArray[j]]);
                    //Add and update the score
                    this.score += 10;
                    this.scoreText.text = 'Score: ' + this.score;

                }
                console.log("Index");
                console.log(this.g_rockProducedIndex);
                console.log("Num rocks");
                console.log(this.g_numRocks);
                if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){
                    this.clearGMCanvas(this.matchExpCanvas); 
                    this.showBoard();
                }

            }
    },
    solveEqCheck:function(evt){
       
                //condition to check if equation is solved  
                if (evt.last_eq.startsWith("x=") && !isNaN(evt.last_eq.slice(2))){
                    if(this.selectedEgg){
                        
                        this.selectedEgg.animations.play('hatch', 2, false);
                        this.selectedEgg = null;

                        /*document.getElementById("eq-match-div").style.display="block";
                        document.getElementById("eq-solve-div").style.display="none";*/
                    }

                }
    },
    initCanvas: function(){

        //GM Code
            document.getElementById("eq-match-div").style.display="block";
            document.getElementById("eq-solve-div").style.display="none";

            //solveEqCanvas is for Equation Solving
            //matchExpCanvas is for Pattern Matching
            this.solveEqCanvas = new gmath.Canvas('#gmath1-div', {use_toolbar: false, vertical_scroll: false });
            this.matchExpCanvas = new gmath.Canvas('#gmath2-div', {use_toolbar: false, vertical_scroll: false });

            this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } });
            
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
        
       //Create the search button
       this.undoBtn = document.createElement("input");
        
       //Set the attributes
       this.undoBtn.setAttribute("type","button");
       this.undoBtn.setAttribute("value","Undo");
       this.undoBtn.setAttribute("name","undobtn");
       this.undoBtn.style.marginLeft = "20px";
       this.undoBtn.style.marginTop = "20px";
    
       var contextRef = this;
       this.undoBtn.onclick = function(){
           if(contextRef._rocksGroup.countLiving() > 0){
               contextRef.matchExpCanvas.controller.undo();
           }else{
                contextRef.solveEqCanvas.controller.undo();
           }
           
       };
        
       //Add the button to the body
       document.body.appendChild(this.undoBtn);
       this.undoBtn.disabled = true;
        
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

