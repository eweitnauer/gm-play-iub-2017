/*Game Common level*/
//the actual game
var DinoEggs = DinoEggs || {}; 

DinoEggs.Game = function(){
    Phaser.State.call(this);
    
    this._eggsGroup = null;
    this._rocksGroup = null;
    this._platforms = null;
    this._spawnRockTimer = 0;
    this.g_x_start = 32;
    this.g_x_end = 400;
    this.matchExpCanvas = null;
    this.solveEqCanvas = null;
    this.selectedEgg = null;        
    this.score = 0;
    this.scoreText = null;
    this.boardText1 = null;
    this.boardText2 = null;
    this.board = null;
    this.matchExpDerivation = null;    
    this.g_equation="";
    this.g_parsedEquation="";
    this.g_rockProducedIndex = -1;
    this.music=null;
    this.rockPositions =[];
    this.undoBtn = null;
    this.currentCanvasEqu ="";
};
DinoEggs.Game.prototype = Object.create(Phaser.State.prototype);
DinoEggs.Game.prototype.constructor = DinoEggs.Game;

DinoEggs.Game.prototype = {
    //set variables based on level number
    initVaribles:function(){
        this._levelNumber = DinoEggs._selectedLevel;
        console.log("selected level:"+DinoEggs._selectedLevel);
        this._jsonData = DinoEggs.jsonLevelObject[DinoEggs._selectedLevel];
        console.log(DinoEggs.jsonLevelObject);
        this.g_numRocks = this._jsonData["numRocks"];
        this.g_numEggs = this._jsonData["numEggs"];
        
        //------[EGGS] set problem mode according to problem set. 0:match expression, 1: solve equation , 2: simplify expression---------
        //including two types of problem-formats from simplify expression set
        
        this.egg_problemMode = this._jsonData["eggProblemMode"];
        if(this.egg_problemMode == 1){
            this.egg_levelProblemSet = g_solveForXEqProblemsFormat[this._jsonData["eggLevelProblemSet"]];
        }
        else{
            this.egg_levelProblemSet = g_simplifyExpressionFormat[this._jsonData["eggLevelProblemSet"]];
        }
        //--------------------------------------------------------------------
        
        //------[ROCKS] set problem mode according to problem set. 0:match expression, 1: solve equation , 2: simplify expression---------
        //including two types of problem-formats from simplify expression set
        //this.isRockFlag = this._jsonData["isRockFlag"];
        
        if(this._levelNumber != 1){
            this.rock_levelProblemSet = g_matchExpressionFormat[this._jsonData["rockLevelProblemSet"]];
            this.rock_problemMode = this._jsonData["rockProblemMode"];
            this.g_canvasExpression = this.rock_levelProblemSet[this._jsonData["canvasExpression"]];
            this.g_parsedCanvasExpression = this.g_canvasExpression.replace(/\*/g, "");
        }
    },

    create:function(){
        this.initVaribles();
        //set world dimensions
        //this.game.world.setBounds(0, 0, 1920, 1920);
        
        //load both GM canvases
        //console.log("loading canvas");
        //!preserve bindings
        var currentObj = this;
        loadGM(function(){
         currentObj.initCanvas();   
        
        }, { version: '0.12.6' });
        
        g_countDinoForGameOver = 0;
        //hatchling positioning
        //this.hatchlingXLeftLimit = g_x_end + 10;
        //this.hatchlingXRightLimit = this.hatchlingXLeftLimit + 139; //139 is the width of a single dino hatchling
        this.hatchlingXRightLimit = 200;
        this.hatchlingXFinalPos = this.hatchlingXRightLimit;
        //this.hatchlingXRange = this.hatchlingXRightLimit - this.hatchlingXLeftLimit;
        this.hatchlingXSpacing = 50;
        
        this.hatchlingYUpperLimit = 40;
        this.hatchlingYLowerLimit = 80;
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
        var ground = this._platforms.create(0, this.game.world.height - 12, 'ground');
        ground.scale.setTo(2,6);
        ground.body.immovable = true;
        
        //dino mom
        //console.log("instruction clear, dino no animiation");
        this.dino = this.game.add.sprite(567, 275, 'dino');
        var move = this.dino.animations.add('move',['1.png','2.png','3.png','4.png'],24,true);
//        this.dino.animations.play('move', 10, true);
//        this.game.add.tween(this.dino).to({y: 275}, 2400, Phaser.Easing.Bounce.InOut, true);
        
        //  Rocks group
        this._rocksGroup = this.game.add.group();
        this._rocksGroup.enableBody = true;
        this._rocksGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.rocksTospawn = [];
        
        //  Eggs group
        this._eggsGroup = this.game.add.group();
        this._eggsGroup.enableBody = true;
        this._eggsGroup.physicsBodyType = Phaser.Physics.ARCADE;
         
        
        //  The score
        this.scoreText = this.game.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        
        //music 
        this.music = this.game.add.audio('bg_music');
        this.music.play();
        
        //create Eggs
        this.createEggs(this.g_numEggs);
        
        rockwave = this.game.add.sprite(0,0, "rockwave");
		rockwave.anchor.setTo(0.5,0.5);
        rockwave.x=this.game.width/2;
        rockwave.y=this.game.height/3;
	    rockwave.scale.setTo(0,0);

        //_________________________________________________________________________
        //create Rocks
         if(this._levelNumber != 1){
            this.createRocks(this.g_numRocks);        
            //create rock wave - (rockinterval between consecutive rocks, number of rocks)       
            this.startRockWave(6,this.g_numRocks,this.g_numEggs);
         }
        //__________________________________________________________________________


        //end celebration 
        this.celebrationEmitter = this.game.add.emitter(this.game.world.centerX, -32, 50);
        
         //  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
         this.celebrationEmitter.makeParticles(['jewel_red', 'jewel_purple', 'jewel_white','jewel_green','jewel_yellow']);
        this.celebrationEmitter.gravity = 0;
        
        this.celebrationEmitter.width = 800;



        this.celebrationEmitter.maxParticleScale = 1;
        this.celebrationEmitter.minParticleScale = 0.5;
        this.celebrationEmitter.setYSpeed(100, 200);
        this.celebrationEmitter.gravity = 0;
        this.celebrationEmitter.width = this.game.world.width * 1.5;
        this.celebrationEmitter.minRotation = 0;
        this.celebrationEmitter.maxRotation = 40;
   
       
        awesome = this.game.add.sprite(0,0, "awesome");
		awesome.anchor.setTo(0.5,0.5);
        awesome.x=this.game.width/2;
        awesome.y=this.game.height/3;
	    awesome.scale.setTo(0,0);
        
        
        //lightning group 
         this._lightningGroup = this.game.add.group();
         this._lightningGroup.enableBody = true;
         this._lightningGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.lightRockMap ={}
        
        //show instructions after 2 seconds
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showRockInstructions, this);
    },
    showRockInstructions:function(){
        this.showBoard('Match rock ','expression to burst');
        this.dino.animations.play('move', 10, true);
        console.log("show instruction then animiation dino shows");
    },
    update:function(){
        this.game.physics.arcade.collide(this._eggsGroup, this._platforms);
        this.game.physics.arcade.overlap(this._rocksGroup, this._platforms, this.disappearRockOnGround, null, this);
        this.game.physics.arcade.overlap(this._rocksGroup, this._eggsGroup, this.hitEgg, null, this);
        
        //check collision for lightning
         this.game.physics.arcade.overlap(this._lightningGroup, this._rocksGroup, this.lightningStruck, null, this);
        
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
        if(this._levelNumber == 2){
            //eggs fall from center of canvas onto ground 
        var egg_y = this.game.world.height/2;

        //  Here we'll create eggs evenly spaced apart
        var egg_x_array = this.linspace(this.g_x_start,this.g_x_end,numEggs);

        for (var i = 0; i < numEggs; i++){
        
            if(this._levelNumber != 2){
                var egg = new Egg(this.game,egg_x_array[i],egg_y,this.createEggEquation());
            }
            else{
                //No equations to be displayed on the eggs for this level as no equation solvinf is there 
                var egg = new Egg(this.game,egg_x_array[i],egg_y,"");    
            }
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
                if(this.solveEqCanvas)
                    this.clearGMCanvas(this.solveEqCanvas);
                if(this.matchExpCanvas)
                    this.clearGMCanvas(this.matchExpCanvas);
                if(this._eggsGroup.countLiving() > 0){
                    document.getElementById("eq-match-div").style.display="block";
                    document.getElementById("eq-solve-div").style.display="none";
                    this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } }); 
                    this.currentCanvasEqu = this.g_parsedCanvasExpression;
                    //_________________________________________________________________________

                    if(this._levelNumber > 2){
                        //                    //create Rocks and start rockwave
                        this.createRocks(this.g_numRocks);        
                        //                    //create rock wave - (rockinterval between consecutive rocks, number of rocks)       
                        this.startRockWave(6,this.g_numRocks,this.g_numEggs);
                    }
                }
                else{
                    //add celebration animation for game over
                }
            }, this);
            
            //add click event to egg
            if(this._levelNumber != 2){
                egg.inputEnabled = true;
                egg.events.onInputDown.add(this.populateSolveEqCanvas, this, egg);
            }
            this._eggsGroup.add(egg);
    
        }
        }
        else{
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
                    if(this.matchExpCanvas)
                        this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } }); 
                    this.currentCanvasEqu = this.g_parsedCanvasExpression;
                    //_________________________________________________________________________
                    //create Rocks and start rockwave
                     if(this._levelNumber != 1){
                        this.createRocks(this.g_numRocks);        
                        //create rock wave - (rockinterval between consecutive rocks, number of rocks)       
                        this.startRockWave(6,this.g_numRocks,this.g_numEggs);
                     }
                    //__________________________________________________________________________
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
        }
    },
    createRocks: function(numRocks){
        //  create rocks
        console.log("creatting rocks");
        this.rockPositions = this.linspace(this.g_x_start,this.g_x_end,this.g_numEggs);
        if(this.rockPositions.length>0){
            
            for (var i = 0; i < numRocks; i++){
                var randIndex = Math.floor(Math.random() * this.rockPositions.length);
                var randposX = this.rockPositions[randIndex];
                this.rockPositions.splice(randIndex,1);
                //place the postionX at the end of array for reuse
                this.rockPositions.push(randposX);
                var rock = new Rock(this.game,randposX, 0, this.getMatchEquationOnRock());
                rock.body.velocity.y = 0;
                rock.visible = false;
                rock.equationText.visible = false;
                this._rocksGroup.add(rock);
                this.rocksTospawn.push(rock);
                //this.g_rockProducedIndex++;            
    
            }
        }
        console.log(this._rocksGroup.children.length+" rocks created");

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
        var hatchling = null;
        if(isSad){
            //hatchling.tint = 0xff0000;
            hatchling = this.game.add.sprite(egg_x,this.game.world.height-100, 'hatchling_sad');
        }
        else{
            hatchling = this.game.add.sprite(egg_x,this.game.world.height-100, 'hatchling');
        }
        hatchling.anchor.setTo(0.5, 0.5);
        hatchling.animations.add('run');
        hatchling.animations.play('run', 10, true);

        // params are: properties to tween, time in ms, easing and auto-start tweenthis.
        var runningDinoTween = this.game.add.tween(hatchling).to({x: this.game.world.width - this.hatchlingXFinalPos, y: this.game.world.height-this.hatchlingYFinalPos}, 3000, Phaser.Easing.Quadratic.InOut, true);
        
        this.hatchlingYFinalPos -= this.hatchlingYSpacing;
        if(this.hatchlingYFinalPos <= this.hatchlingYUpperLimit){
            this.hatchlingXFinalPos += this.hatchlingXSpacing;
            this.hatchlingYFinalPos = this.hatchlingYLowerLimit;
        }
        runningDinoTween.onComplete.addOnce(this.stopDino, this,hatchling);  


    },
    stopDino: function(hatchling){
        //  This method will reset the frame to frame 1 after stopping
        hatchling.animations.stop(null, true);

        if(this._levelNumber == 2)//if(this.isSingleRockWave)
            g_countDinoForGameOver++;
        
        //to(properties, duration, ease, autoStart, delay, repeat, yoyo) 
        /*var jumpingTween = this.game.add.tween(hatchling).to({x: 600,y : this.game.world.height-110}, 1000, Phaser.Easing.Bounce.InOut, true,0,-1,false);*/
        
        if(this._eggsGroup.countLiving() == 0)
        {
            if(this._levelNumber == 2){
                 if(g_countDinoForGameOver==this.g_numEggs)
                     this.gameOver(); 
            }
            else{
                this.gameOver();   
            }
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
        console.log("populatecanvas");
        if(this.board){
            console.log("pop canvas clearboard");
            this.clearBoard();
            this.dino.animations.stop(null, true);
            console.log("instruction clear, dino no animiation");
        }
        console.log("egg clicked");
        document.getElementById("eq-solve-div").style.display="block";
        document.getElementById("eq-match-div").style.display="none";        
        this.selectedEgg = selectedEgg;
        this.clearGMCanvas(this.solveEqCanvas);
        this.clearGMCanvas(this.matchExpCanvas);
        this.solveEqCanvas.model.createElement('derivation', { eq: selectedEgg.equ, pos: { x: 'center', y: 50 } });
    },
    
    startRockWave: function(rockIntervalSec, numRocks,numEggs){
        console.log("startingrockwave");
        var t = this.game.add.tween(rockwave.scale).to({ x: 1,y:1}, 5000,  Phaser.Easing.Bounce.Out,true);
                        t.onComplete.add(exitTween, this);
                        function exitTween () {
                            this.game.add.tween(rockwave.scale).to({ x: 0,y:0}, 500,  Phaser.Easing.Bounce.Out,true);
                        }
        //this.game.time.events.add(Phaser.Timer.SECOND * 2, this.shakeCamera, this);
        this.g_rockProducedIndex = -1;
        this.rockPositions = this.linspace(this.g_x_start,this.g_x_end,numEggs);
        this.game.time.events.repeat(Phaser.Timer.SECOND * rockIntervalSec, numRocks, this.spawnRock, this);
    },
    shakeCamera: function(){
      this.game.camera.shake(0.005, 1000);  
    },
    spawnRock: function(){
        console.log("spawnrock");
        if(this.rocksTospawn){
            this.g_rockProducedIndex++;
            console.log(this.g_rockProducedIndex);
            var rock = this.rocksTospawn.pop();
            console.log("current eq ",this.currentCanvasEqu);
            console.log("rock eq ",rock.getEquation());
            console.log(rock.getEquation() == this.currentCanvasEqu);
            //replace rock equation
            if(rock.getEquation() == this.currentCanvasEqu){
                console.log("replacing equation");
                rock.setEquation(this.getMatchEquationOnRock());
                while(rock.getEquation() == this.currentCanvasEqu){
                    rock.setEquation(this.getMatchEquationOnRock());
                }
            }
            
            //rock.body.velocity.y = 15;
            rock.body.velocity.y = this._jsonData["velocity"];
            rock.visible = true;
            rock.equationText.visible=true;
        }
    
    },
    
    hitEgg: function(rock, egg){
        var hits = ++egg.hitCounter;
        this.rockBurst(rock);

        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex +1 == this.g_numRocks){    
            this.clearGMCanvas(this.matchExpCanvas);    
        }
       
        switch(hits){
            case 1 : egg.tint = 0x00ff00; 
                    egg.animations.play('wiggleOnce');
                     break;
            case 2 : egg.tint = 0xff0000;
                    var style = {font: "20px Arial", fill: "#111111", wordWrap: true, wordWrapWidth: egg.width, align: "center"};
                    egg.setEquStyle(style);
                    egg.animations.play('wiggleOnce');
                    break
            case 3 :  egg.tint = 0x2412ff;
                    blackdino_popup = true;
                    console.log("sad dino board");
                    this.showBoard('Sad dino','Please hatch eggs!')
                     egg.animations.play('wiggleContinous');
                    this.dino.animations.play('move', 10, true);
                     break;

        }
        this.rockBurst(rock);
        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex +1 == this.g_numRocks){    
            this.clearGMCanvas(this.matchExpCanvas);    
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
        
        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex +1 == this.g_numRocks){
            this.clearGMCanvas(this.matchExpCanvas);
            
            if(this._levelNumber == 2){
                this.hatchAllEggs();
            }
            else{
                if(this._eggsGroup.countLiving()>0){
                    console.log("click egg dino board");
                    this.showBoard('click egg ','and solve for x');
                    this.dino.animations.play('move', 10, true);
                    console.log("show instruction then animiation dino shows");
                    this._eggsGroup.callAll('animations.play', 'animations', 'wiggleOnce');
                }
            }
        }

    },
    
    hatchAllEggs: function(){
        //console.log("hatch anim for all eggs")
        this._eggsGroup.callAll('animations.play', 'animations', 'hatch');
        //this.selectedEgg = null;
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
        if(this.board){
            //console.log("pop canvas clearboard");
            this.clearBoard();
        }
        
        this.scoreText.destroy();
        if(this.solveEqCanvas)
            this.clearGMCanvas(this.solveEqCanvas);
        
        if(this.matchExpCanvas)
            this.clearGMCanvas(this.matchExpCanvas);
        var gameOverText = this.game.add.text( this.game.world.width*0.5 - 50, this.game.world.height*0.5 - 40, 'Score:' + this.score, { fontSize: '22px', fill: '#000' });
        
        var stars = this.endStar();
        if (stars>0){
            this.updatePlayerData(stars);
        }        
        
        //next level button
        if(DinoEggs.PLAYER_DATA[this._levelNumber] > -1 ){ //playerdata[currentlevel] = playerdata[this._levelNumber - 1]
            var nextLevelButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 50, 'nextlevel', function(){
                console.log("common before addition:"+DinoEggs._selectedLevel);
                console.log(this._levelNumber);
                DinoEggs._selectedLevel = DinoEggs._selectedLevel + 1; //parseFloat(this._levelNumber) + 1;
                console.log("common after addition:"+DinoEggs._selectedLevel);
                this.state.start('NextLevel');
            }, this.game, 1, 0, 2);
            nextLevelButton.anchor.set(0.5);
        }
        
        
        var restartButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 20, 'restart', function(){
            this.state.start('Game');
        }, this.game, 1, 0, 2);
        restartButton.anchor.set(0.5);
        
        var mainMenuButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 80, 'menu', function(){
            this.state.start('MainMenu');
        }, this.game, 1, 0, 2);
        mainMenuButton.anchor.set(0.5);
        
        this.music.stop();
        
        //add celebration
         this.celebrationEmitter.start(false, 10000, 100);
        var elem = document.getElementById("undo_button");
        if(elem){
            elem.parentNode.removeChild(elem);
        }
    },
    
    simplifyEqCheck:function(evt){
        this.undoBtn.disabled = false;
                //condition to check if equation is solved  
                if (!isNaN(evt.last_eq)){
                    if(this.selectedEgg){
                        var t = this.game.add.tween(awesome.scale).to({ x: 1,y:1}, 500,  Phaser.Easing.Bounce.Out,true);
                        t.onComplete.add(exitTween, this);
                        function exitTween () {
                            this.game.add.tween(awesome.scale).to({ x: 0,y:0}, 500,  Phaser.Easing.Bounce.Out,true);
                        }
                        this.selectedEgg.animations.play('hatch', 6, false);
                        this.selectedEgg = null;

                        /*document.getElementById("eq-match-div").style.display="block";
                        document.getElementById("eq-solve-div").style.display="none";*/
                        this.showBoard();
                    }

                }
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
        
        //console.log("player data");
        //console.log(DinoEggs.PLAYER_DATA);
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
    
    showBoard: function(line1,line2) {
        if(this.board)
            this.clearBoard();
        this.board = this.game.add.sprite(500,250,'board');
        this.board.scale.setTo(0.8,0.7);
        this.boardText1 = this.game.add.text(520,270, line1, { fontSize: '15px', fill: '#000' });
        this.boardText2 = this.game.add.text(510,300, line2, { fontSize: '15px', fill: '#000' });
    },
    
    clearBoard: function() {
        this.board.destroy();
        this.boardText1.destroy();
        this.boardText2.destroy();
},
    
    matchEquationOnRocks: function(equation){
        var matchedEqRocks= [];
        var parsedEq = equation.replace(/\*/g, "");
        
        //if(this._levelNumber != 2){
            // be careful for expressions with *. Might need to use algebra model instead
            this.currentCanvasEqu = parsedEq;
        //}
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            if(this._rocksGroup.children[i].visible && this._rocksGroup.children[i].equ == parsedEq){
                //add rock obj to array;
                matchedEqRocks.push(this._rocksGroup.children[i]);
            }
            
        }
        //return -1;
        return matchedEqRocks;
    },
    matchEqCheck:function(evt){
        if(this.board)
            this.clearBoard();
            this.dino.animations.stop(null, true);
            console.log("instruction clear, dino no animiation");
        this.undoBtn.disabled = false;
        var lastEq = evt.last_eq;
        
        var matchedEqRockArray = this.matchEquationOnRocks(lastEq);
        console.log(matchedEqRockArray);
            if (matchedEqRockArray.length > 0 && this._rocksGroup.countLiving() > 0) {
                for(var j = 0; j < matchedEqRockArray.length ; j++){
                    //this.rockBurst(this._rocksGroup.children[matchedEqIndexArray[j]]);
                    //Add and update the score
                    //this.score += 10;
                    //this.scoreText.text = 'Score: ' + this.score;
                     //set the rock velocity to 0
                     var matchedRock = matchedEqRockArray[j];                    
                     matchedRock.body.velocity.y = 0;
                     
                     //initiate lightning weapon from match exp canvas towards the rock to burst it open
                     this.initiateLightningWeaponForRock(matchedRock);

                }
                console.log("Index");
                console.log(this.g_rockProducedIndex);
                console.log("Num rocks");
                console.log(this.g_numRocks);
                if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){
                    this.clearGMCanvas(this.matchExpCanvas); 
                    console.log("click egg dino board");
                    this.showBoard('click egg ','and solve for x');
                     this.dino.animations.play('move', 10, true);
                    console.log("show instruction then animiation dino shows");
                }

            }
    },
    initiateLightningWeaponForRock:function(rock){
        
         var lightning = this.game.add.sprite(this.game.world.centerX,600, 'lightning');
         //lightning.scale.setTo(0.2,0.2);
         lightning.anchor.setTo(0.5, 0.5);
         this.game.physics.enable(lightning, Phaser.Physics.ARCADE);
         lightning.body.allowRotation = false;
         //create ID for lightning object: used to map to rockObj 
         lightning.nameId = this.makeid();
         
         this._lightningGroup.add(lightning);
         lightning.rotation = this.game.physics.arcade.moveToObject(lightning, rock, 5, 500); 
         
         //Add to map
         this.lightRockMap[lightning.nameId] = rock;
     },
    makeid: function()
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
     lightningStruck:function(lightning, rock){
         
     
         var currentMatchExp = this.matchExpDerivation.getLastModel().to_ascii().replace(/\*/g, "");
         //check if the lightning struck on correct rock, only then,burst the rock, else do nothing and continue moving towards target
         //console.log(this.lightRockMap[lightning.nameId] == rock);
         //console.log(this.lightRockMap[lightning.nameId]);
         //console.log(rock)
         if(this.lightRockMap[lightning.nameId] == rock){
             if(rock.equationText.text != currentMatchExp){
                return;
             }
             var obtainedScoreText = this.game.add.text(rock.x, rock.y, "+10", { fontSize: '32px', fill: '#000' });
             this.rockBurst(rock);
             delete this.lightRockMap[lightning.nameId];
             this._lightningGroup.remove(lightning);

             //animate and update score 
             var scoreTween = this.game.add.tween(obtainedScoreText).to({x: 700, y: 16}, 3000, Phaser.Easing.Quadratic.InOut, true);
             scoreTween.onComplete.addOnce(this.updateScore,this,obtainedScoreText); 
         }
     },
    solveEqCheck:function(evt){
       
                //condition to check if equation is solved  
                if ((evt.last_eq.startsWith("x=") && !isNaN(evt.last_eq.slice(2)))||
                   (evt.last_eq.endsWith("=x")&& !isNaN(evt.last_eq.slice(0,-2)))){
                    if(this.selectedEgg){
                        
                        var t = this.game.add.tween(awesome.scale).to({ x: 1,y:1}, 2000,  Phaser.Easing.Bounce.Out,true);
                        t.onComplete.add(exitTween, this);
                        function exitTween () {
                            this.game.add.tween(awesome.scale).to({ x: 0,y:0}, 50,  Phaser.Easing.Bounce.Out,true);
                        }
                        
                        this.selectedEgg.animations.play('hatch', 6, false);
                        this.selectedEgg = null;

                        /*document.getElementById("eq-match-div").style.display="block";
                        document.getElementById("eq-solve-div").style.display="none";*/
                    }

                }
    },
    simplifyEqCheck:function(evt){
        this.undoBtn.disabled = false;
                //condition to check if equation is solved  
                if (!isNaN(evt.last_eq)){
                    if(this.selectedEgg){
                        var t = this.game.add.tween(awesome.scale).to({ x: 1,y:1}, 2000,  Phaser.Easing.Bounce.Out,true);
                        t.onComplete.add(exitTween, this);
                        function exitTween () {
                            this.game.add.tween(awesome.scale).to({ x: 0,y:0}, 50,  Phaser.Easing.Bounce.Out,true);
                        }
                        this.selectedEgg.animations.play('hatch', 6, false);
                        this.selectedEgg = null;

                        /*document.getElementById("eq-match-div").style.display="block";
                        document.getElementById("eq-solve-div").style.display="none";*/
                    }
                }
    },
    initCanvas: function(){
        //solveEqCanvas is for Equation Solving and simplifying            
        if(this._jsonData["isSimplify"]!=false){ // || this._jsonData["isSolve"] !=false){
            document.getElementById("eq-match-div").style.display="none";
            document.getElementById("eq-solve-div").style.display="block";
            this.solveEqCanvas = new gmath.Canvas('#gmath1-div', {use_toolbar: false, vertical_scroll: false });
            //!preserve binding
            var thisObj =this;
            this.solveEqCanvas.model.on('el_changed', function(evt) {
                if(thisObj.egg_problemMode==1){
                    thisObj.solveEqCheck(evt);
                }
                else if(thisObj.egg_problemMode==2){
                    thisObj.simplifyEqCheck(evt);
                }
            });
        }
        //matchExpCanvas is for Pattern Matching
        if(this._jsonData["isMatch"] !=false){
            document.getElementById("eq-match-div").style.display="block";
            document.getElementById("eq-solve-div").style.display="none";
            this.matchExpCanvas = new gmath.Canvas('#gmath2-div', {use_toolbar: false, vertical_scroll: false });                

            this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } });

            //!preserve binding
            var thisObj =this;
            this.matchExpCanvas.model.on('el_changed', function(evt) {	
                thisObj.matchEqCheck(evt);
            });
        }            
        this.currentCanvasEqu = this.g_parsedCanvasExpression;
       
       //Create the search button
       this.undoBtn = document.createElement("input");
        
       //Set the attributes
       this.undoBtn.setAttribute("type","button");
       this.undoBtn.setAttribute("value","Undo");
       this.undoBtn.setAttribute("name","undobtn");
       this.undoBtn.setAttribute("id","undo_button");
       this.undoBtn.style.postion = "absolute";
       this.undoBtn.style.top = "0";
       this.undoBtn.style.marginLeft = "100px";
      
        //document.getElementById("undo_button").className = "btn-danger";
        this.undoBtn.style.cssFloat = "left";
    
       var contextRef = this;
       this.undoBtn.onclick = function(){
           if(contextRef._rocksGroup.countLiving() > 0){
               contextRef.matchExpCanvas.controller.undo();
           }else{
               if(this._jsonData["isSimplify"]!=false)// || this._jsonData["isSolve"] !=false)
                    contextRef.solveEqCanvas.controller.undo();
           }
           
       };
        
       //Add the button to the body
        document.getElementById("game-div").appendChild(this.undoBtn);
       
       this.undoBtn.disabled = true;
        $('#undo_button').addClass('btn-warning');
        $('#undo_button').addClass('btn-lg');
        
    },
    
    clearGMCanvas: function(canvasObj){
        //clear canvas
        if(canvasObj){
            while(canvasObj.model.elements().length > 0){
            canvasObj.model.removeElement(canvasObj.model.elements()[0]); 
        }
     }
    },
    
    //utility functions
    //.............................................................
    // random range generator
    getRandomRange: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getMatchEquationOnRock: function(){
        var indexToChoose = this.getRandomRange(1, this.rock_levelProblemSet.length - 1);
        this.g_equation =  this.rock_levelProblemSet[indexToChoose];
        this.g_parsedEquation = this.g_equation.replace(/\*/g, "");
        return this.g_parsedEquation;
    },
    createEggEquation: function(){
            //get random expression format from current level ProblemSet
            equation_format = this.egg_levelProblemSet[Math.floor(Math.random()*this.egg_levelProblemSet.length)];
            num_of_coefficients = (equation_format.match(/N/g)||[]).length;
            //console.log(num_of_coefficients);
            equation = equation_format;
        
            for(var i=0;i<num_of_coefficients;i++){
                equation=equation.replace(/N/, Math.floor((Math.random() * 10) + 1));                
            }
   
            return equation;
    },
    //http://www.numericjs.com/index.php
    linspace: function(a,b,n) {
        if(n == 1)
            return (a+b)/2;
        
        else if(n==2){
            var ret = Array(n);
            ret[0] = (a+b)/2.5;
            ret[1] = (a+b)/1.25 ;
            return ret; 
        }
        
        else{
            if(typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
            if(n<2) { return n===1?[a]:[]; }
            var i,ret = Array(n);
            n--;
            for(i=n;i>=0;i--) { ret[i] = (i*b+(n-i)*a)/n; }
            return ret;
        }
    }
    

}

