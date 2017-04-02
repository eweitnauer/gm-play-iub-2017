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
        this.g_numRocks = this._jsonData["numRocks"];
        this.g_numEggs = this._jsonData["numEggs"];
        this.rocksRemainingText = null;
        this.currentLevelText = null;
        
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
            //this.g_parsedCanvasExpression = this.g_canvasExpression.replace(/\*/g, "");
            this.g_parsedCanvasExpression = this.g_canvasExpression;
        }
        
        //power up variables
        this.g_powerupDuration = 5;
        this.isPowerupUsed = false;
        this.powerupID = -1;
    },

    create:function(){
        this.initVaribles();
        //set world dimensions
        //this.game.world.setBounds(0, 0, 1920, 1920);
        
        //load both GM canvases
        //!preserve bindings
        var currentObj = this;
        loadGM(function(){
         currentObj.initCanvas();   
        
        }, { version: '1.0.4' });
        
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
        
        this.dino = this.game.add.sprite(567, 275, 'dino');
        var move = this.dino.animations.add('move',['1.png','2.png','3.png','4.png'],24,true);
        
        //  Rocks group
        this._rocksGroup = this.game.add.group();
        this._rocksGroup.enableBody = true;
        this._rocksGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.rocksTospawn = [];
        
        //  Eggs group
        this._eggsGroup = this.game.add.group();
        this._eggsGroup.enableBody = true;
        this._eggsGroup.physicsBodyType = Phaser.Physics.ARCADE;
         
        
        //  The score[]
        this.scoreText = this.game.add.text(700, 16, 'Score: 0', { fontSize: '16px', fill: '#000' });
        
        //Current Level Number
        this.currentLevelText = this.game.add.text(600, 16, 'Level: '+(this._levelNumber), { fontSize: '16px', fill: '#000' });
        
        // Number of Remaining Rocks
        if(this._levelNumber != 1){
             var barConfig = {x: 230, y: 25};
             this.myHealthBar = new HealthBar(this.game, barConfig);
             this.rocksRemainingText = this.game.add.text(20, 16, 'Rocks Left: '+(this.g_numRocks), { fontSize: '16px', fill: '#000' });
        }
        else{
            this.rocksRemainingText = "";
            this.myHealthBar = new HealthBar(this.game, barConfig);
            this.myHealthBar.setPercent(100);
        }
    
        
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

        //create Rocks
        if(this._levelNumber != 1){
            this.createRocks(this.g_numRocks);        
            //create rock wave - (rockinterval between consecutive rocks, number of rocks)       
            this.startRockWave(6,this.g_numRocks,this.g_numEggs);
        }
        
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
        
        //power up
        this.pterodactyl = this.game.add.sprite(0, 50, 'pterodactyl');
        this.pterodactyl.scale.setTo(0.2,0.2);
        this.pterodactyl.visible = false;
        
        
        //powerups appear randomly
        var powerupInterval = this.getRandomRange(20, 50);
        console.log("Power up appearing in "+powerupInterval+" seconds");
        this.game.time.events.add(Phaser.Timer.SECOND * powerupInterval, this.showPowerup, this);
        
        //Game controls
        this.pauseButton = this.game.add.button(this.game.world.width , this.scoreText.y + this.scoreText.height , 'pauseButton', this.pauseClicked, this);
        this.pauseButton.x = this.pauseButton.x - this.pauseButton.width;
        this.game.input.onDown.add(this.unpause, this);
        this.playOrMute = false;
        //mute and unmute game
        this.muteButton = this.game.add.button(this.game.world.width ,this.pauseButton.y + this.pauseButton.height, 'musicOn', this.muteMusic, this, 2, 1, 0);
        this.muteButton.x = this.muteButton.x - this.muteButton.width;
    },
    muteMusic:function(){
          if (this.playOrMute == false) {
                this.music.pause();
                this.playOrMute =true;
                this.muteButton.loadTexture('musicOff', 0 );
          } else {
              this.music.resume();
              this.playOrMute = false;
              this.muteButton.loadTexture('musicOn', 0 );
        }
    },
    restartGame: function() {
            //this.music.destroy();
            this.destructGameObjectsBeforeGameOver();
            this.state.start('Game');
    },
    exitToMain:function(){
            //this.music.destroy();
            this.destructGameObjectsBeforeGameOver();
            this.state.start('LevelSelect');
    },
    unpause:function(event){
                // Only act if paused
        if(this.game.paused){
            // Calculate the corners of the menu
            var x1 = this.game.world.width/2 - 325/2, 
                x2 = this.game.world.width/2 + 325/2,
                y1 = this.game.world.height/2 - 233/2, 
                y2 = this.game.world.height/2 + 233/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                
                this.game.paused = false;
                
                if(this._rocksGroup.countLiving() > 0){
                    $("#eq-match-div").show();
                }else{
                     $("#eq-solve-div").show();
                }
                
                // The choicemap is an array that will help us see which item was clicked
                var choicemap = ['one', 'two', 'three', 'four'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice 
                var choice = Math.floor(x / 162.5) + 2*Math.floor(y / 116.5);
                switch(choice){
                case 0: //play
                        // Remove the menu and the label
                        this.menu.destroy();
                        this.choiceLabel.destroy();
                        break;
                case 1: //restart
                        this.restartGame();
                        break;
                case 2: //tutorial
                        this.game.paused = true;
                        break;
                case 3: //exit game
                        this.exitToMain();
                        break;
            }
                

                // Display the choice
                this.choiceLabel.text = 'You chose menu item: ' + choicemap[choice];
            }
            
        }
    },
    pauseClicked: function(){   
        // When the pause button is pressed, we pause the game
        this.game.paused = true;

        // Then add the menu
        this.menu = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'buttonsMenu');
        this.menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        this.choiceLabel = this.game.add.text(this.game.world.width / 2, this.game.world.height -150, 'Paused', { font: '30px Arial', fill: '#000' });
        this.choiceLabel.anchor.setTo(0.5, 0.5);
        
        $("#eq-match-div").hide();
        $("#eq-solve-div").hide();
    },
    showPowerup:function(){
        //check level number from where we want to show powerup
        //show power up only when at least one rock is present
        //Show the power up until it is acquired by player (atleast one time within level)
        if(this._levelNumber >= 3 && !this.isPowerupUsed){
            if(this._rocksGroup.countLiving() > 0 && this._eggsGroup.countLiving() > 0){
                //check whether we can get a unique equation for powerup
                var uniqueEq = this.getEquationForPowerup();
                if(uniqueEq != null){
                    this.pterodactyl.visible = true;  
                    this.powerUpTween = this.game.add.tween(this.pterodactyl).to( { x: this.game.world.width - this.pterodactyl.width , y: 50 }, 7000, Phaser.Easing.Quadratic.InOut, true); 
                    this.powerUpTween.onComplete.addOnce(this.handlePowerupTween, this); 

                    var pStyle = { font: "24px Comic Sans MS", fill: "#000", wordWrap: true, wordWrapWidth: this.pterodactyl.width, align: "center"};
                    this.powerupText = this.game.add.text(this.pterodactyl.x + this.pterodactyl.width / 2 , this.pterodactyl.y + this.pterodactyl.height * (5.4/6)  , uniqueEq, pStyle); 
                    this.powerupText.anchor.set(0.5);
                }
            }else{
                this.clearGMCanvas(this.matchExpCanvas); 
                this.showBoard('Click egg ','and solve for x');
                this.dino.animations.play('move', 10, true);
            }
            
            var powerupInterval = this.getRandomRange(20, 50);
            console.log("Power up appearing in "+powerupInterval+" seconds");
            this.game.time.events.add(Phaser.Timer.SECOND * powerupInterval, this.showPowerup, this);  
        } 
    },
    showRockInstructions:function(){
        this.showBoard('Match rock ','expression to burst');
        this.dino.animations.play('move', 10, true);
    },
    update:function(){
        this.game.physics.arcade.collide(this._eggsGroup, this._platforms);
        this.game.physics.arcade.overlap(this._rocksGroup, this._platforms, this.disappearRockOnGround, null, this);
        this.game.physics.arcade.overlap(this._rocksGroup, this._eggsGroup, this.hitEgg, null, this);
        
        //check collision for lightning
         this.game.physics.arcade.overlap(this._lightningGroup, this._rocksGroup, this.lightningStruck, null, this);
        
        //check if the rocks are falling:
        if(this._rocksGroup.countLiving() != 0){    
            this._eggsGroup.setAll('inputEnabled',false);
        }
        else{
            this._eggsGroup.setAll('inputEnabled',true);
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
          rock.GMCanvas.style.left = Math.floor(rock.x + rock.width / 2);
            //console.log("rock.GMCanvas.style.left "+rock.GMCanvas.style.left);
          //rock.GMCanvas.style.top = rock.y;
            //rock.GMCanvas.style.transform = "translate(" + rock.x + "," + rock.y + ") !important";
            $("#"+rock.GMCanvas.id).css({top: rock.y, left: rock.x + 350, position:'absolute'});
            //console.log("rock.GMCanvas.id "+rock.GMCanvas.id);
            //console.log("rock.GMCanvas.style.top "+rock.GMCanvas.style.top);
        });
        
        //render power up equation text
        if(this.pterodactyl.visible == true){
         this.powerupText.x = Math.floor(this.pterodactyl.x + this.pterodactyl.width / 2);
         this.powerupText.y = Math.floor(this.pterodactyl.y + this.pterodactyl.height * (5.4/6));   
        }

    },
    
    disappearRockOnGround: function(rock, platform){
        this.rockBurst(rock);
    },
    getUnicodeNum:function(number, ch){
        if(ch==='ᴺ'){
            switch(number){
                case 1: return '¹';
                case 2: return '²';
                case 3: return '³';
                case 4: return '⁴';
                case 5: return '⁵';
                case 6: return '⁶';
                case 7: return '⁷';
                case 8: return '⁸';
                case 9: return '⁹';
                case 0: return '⁰';
            }
        }
        else if(ch==='ₙ'){
            switch(number){
                case 1: return '₁';
                case 2: return '₂';
                case 3: return '₃';
                case 4: return '₄';
                case 5: return '₅';
                case 6: return '₆';
                case 7: return '₇';
                case 8: return '₈';
                case 9: return '₉';
                case 0: return '₀';
            }
        }
        return number;     
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
                
                //No equations to be displayed on the eggs for this level as no equation solving is there 
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
                
                if(this._eggsGroup.countLiving() > 0 ){
                    if(this.solveEqCanvas)
                        this.clearGMCanvas(this.solveEqCanvas);
                    if(this.matchExpCanvas)
                        this.clearGMCanvas(this.matchExpCanvas);
                    document.getElementById("eq-match-div").style.display="block";
                    document.getElementById("eq-solve-div").style.display="none";
                    this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } }); 
                    this.currentCanvasEqu = this.g_parsedCanvasExpression;
                    if(this._levelNumber > 2){    
                        this.createRocks(this.g_numRocks);           
                        this.startRockWave(6,this.g_numRocks,this.g_numEggs);
                    }
                }
                else{
                     
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
                if(eggSprite.hitCounter > 2 && eggSprite.hitCounter != 10000){
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
                        if(this._eggsGroup.children[j].hitCounter > 2 && this._eggsGroup.children[j].hitCounter != 10000){
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
                
                if(this._eggsGroup.countLiving() > 0 && this.powerupID != "4" ){
                    this.clearGMCanvas(this.solveEqCanvas);
                    this.clearGMCanvas(this.matchExpCanvas);
                    document.getElementById("eq-match-div").style.display="block";
                    document.getElementById("eq-solve-div").style.display="none";
                    if(this.matchExpCanvas)
                        this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } }); 
                    this.currentCanvasEqu = this.g_parsedCanvasExpression;
                    if(this._levelNumber > 1){
                        this.createRocks(this.g_numRocks);             
                        this.startRockWave(6,this.g_numRocks,this.g_numEggs);          
                    }
                }
                else{
                    this.powerupID = -1;
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
        this.rockPositions = this.linspace(this.g_x_start,this.g_x_end,this.g_numEggs);
        if(this.rockPositions.length>0){
            
            for (var i = 0; i < numRocks; i++){
                var randIndex = Math.floor(Math.random() * this.rockPositions.length);
                var randposX = this.rockPositions[randIndex];
                this.rockPositions.splice(randIndex,1);
                //place the postionX at the end of array for reuse
                this.rockPositions.push(randposX);
                var parsed_n_match = this.getMatchEquationOnRock();
                var rock = new Rock(this.game,randposX, 50, parsed_n_match);
                rock.body.velocity.y = 0;
                rock.visible = false;
                rock.equationText.visible = false;
                this._rocksGroup.add(rock);
                this.rocksTospawn.push(rock);
                rock.GMCanvas = this.createEqDiv(i, randposX, 50, parsed_n_match);
            }
        }

    },

    createEqDiv: function(inputId, inputX, inputY, inputEq){
        var newGMDiv = document.createElement("div");
        var newGMDivId = "gmeq_" + (this.g_rockProducedIndex+1) + "_" + inputId;
        newGMDiv.setAttribute("id", newGMDivId);
        newGMDiv.setAttribute("class", "gm-game-rock");
        newGMDiv.style.left = inputX + 'px';
        newGMDiv.style.top = inputY + 'px';
        newGMDiv.style.display = "none";
        document.body.appendChild(newGMDiv);
        
        var canvas = new gmath.Canvas('#' + newGMDivId, {use_toolbar: false, vertical_scroll: false });
        console.log("inputEq:"+inputEq);
        canvas.model.createElement('derivation', { eq: inputEq, pos: { x: 'center', y: 50 }, font_size:30, handle_stroke_color:'#fff' });        
        return newGMDiv;
    },

    calculateScore: function(hitCount){
        if (hitCount == 0) {
            return "+50";
        } else if (hitCount == 1){
            return "+40";
        } else if (hitCount == 2){
             return "+30";
        } else if(hitCount == 10000){
            return "+100";
        }else {
            return "+20";
        }
    },

    runToMom: function(egg_x, isSad){
        var hatchling = null;
        if(isSad){
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
    updateRocksRemaining: function(){
          this.rocksRemainingText.text = 'Rocks Left: ' +(this.g_numRocks-this.g_rockProducedIndex-1);
          this.myHealthBar.setPercent(((this.g_numRocks-this.g_rockProducedIndex-1)/this.g_numRocks)*100); 
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
        if(this.board){
            this.clearBoard();
            this.dino.animations.stop(null, true);
        }
        document.getElementById("eq-solve-div").style.display="block";
        document.getElementById("eq-match-div").style.display="none";        
        this.selectedEgg = selectedEgg;
        this.clearGMCanvas(this.solveEqCanvas);
        this.clearGMCanvas(this.matchExpCanvas);
        this.solveEqCanvas.model.createElement('derivation', { eq: selectedEgg.equ, pos: { x: 'center', y: 50 } });
    },
    
    startRockWave: function(rockIntervalSec, numRocks,numEggs){
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
        //do not spawn any rock if freeze rock power up has been activated
        console.log("spawnrock");
        if(this.rocksTospawn && this.rocksTospawn.length > 0 && this.powerupID != "1"  ){
            this.g_rockProducedIndex++;
            this.updateRocksRemaining();         
            var rock = this.rocksTospawn.pop();
            //replace rock equation
            if(rock.getEquation() == this.currentCanvasEqu || (this.pterodactyl.visible && this.powerupText.text == rock.getEquation())){
                rock.setEquation(this.getMatchEquationOnRock());
                while(rock.getEquation() == this.currentCanvasEqu || (this.pterodactyl.visible && this.powerupText.text == rock.getEquation())){
                    rock.setEquation(this.getMatchEquationOnRock());
                }
                
            }
            rock.body.velocity.y = this._jsonData["velocity"];
            rock.visible = true;
            //rock.equationText.visible=true;
            rock.GMCanvas.style.display = "block";    
    }
    },
    handlePowerupTween:function(){
        this.g_powerupDuration--;  
        if(this.g_powerupDuration > 0 && this._rocksGroup.countLiving() > 0 && this._eggsGroup.countLiving() > 0){
            x_pos = 0;
            if(this.pterodactyl.x == 0){
                x_pos = this.game.world.width - this.pterodactyl.width;
            }
            
            this.powerUpTween = this.game.add.tween(this.pterodactyl).to( { x: x_pos , y: 50 }, 7000, Phaser.Easing.Quadratic.InOut, true);
 
            this.powerUpTween.onComplete.addOnce(this.handlePowerupTween, this);  
        }else{
            //kill the powerup even when there are no rocks on screen
            this.pterodactyl.visible = false;
            this.pterodactyl.kill();
            this.pterodactyl.x = 0;
            this.powerupText.kill();  
            
            //reset the powerup duration
            this.g_powerupDuration = 5;
           
            if(this._rocksGroup.countLiving() == 0){
                this.clearGMCanvas(this.matchExpCanvas); 
                this.showBoard('Click egg ','and solve for x');
                this.dino.animations.play('move', 10, true);
            }
            
        }     
    },
    
    hitEgg: function(rock, egg){
        this.rockBurst(rock);

        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex +1 == this.g_numRocks){    
            this.clearGMCanvas(this.matchExpCanvas);    
        }
        
        //if this egg is not golden egg, only then change the egg color
        
        if(egg.tint != 0xccac00){
            var hits = ++egg.hitCounter;
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
                        this.showBoard('Sad dino','Please hatch eggs!')
                        egg.animations.play('wiggleContinous');
                        this.dino.animations.play('move', 10, true);
                         break;

            }
        }else{
            egg.animations.play('wiggleOnce');
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
        rock.GMCanvas.parentElement.removeChild(rock.GMCanvas);
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
                    this.showBoard('Click egg ','and solve for x');
                    this.dino.animations.play('move', 10, true);
                    this._eggsGroup.callAll('animations.play', 'animations', 'wiggleOnce');
                }
            }
        }

    },
    
    hatchAllEggs: function(){
        this._eggsGroup.callAll('animations.play', 'animations', 'hatch');
    },
    
    destroyObject: function(obj) {
        if(obj != undefined)
            obj.destroy();
    },
    
    managePause:function(){
        //To be implemented
    },
    
    gameOver: function() {    
        
        this.destructGameObjectsBeforeGameOver();
        
        var gameOverText = this.game.add.text( this.game.world.width*0.5 - 50, this.game.world.height*0.5 - 40, 'Score:' + this.score, { fontSize: '22px', fill: '#000' });
        
        var stars = this.endStar();
        if (stars > 0){
            this.updatePlayerData(stars);
        }        
        
        //next level button
        if(DinoEggs.PLAYER_DATA[this._levelNumber] > -1 ){ //playerdata[currentlevel] = playerdata[this._levelNumber - 1]
            var nextLevelButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 50, 'nextlevel', function(){
                DinoEggs._selectedLevel = DinoEggs._selectedLevel + 1; //parseFloat(this._levelNumber) + 1;
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
        
        this.isPowerupUsed = false;
        
        //add celebration
         this.celebrationEmitter.start(false, 10000, 100);
    },
    destructGameObjectsBeforeGameOver : function(){
        //pass the score as a parameter 
        if(this.board){
            this.clearBoard();
        }
        
        this.scoreText.destroy();
        if(this._levelNumber!=1){
            this.rocksRemainingText.destroy();
            this.myHealthBar.kill();
        }
        this.currentLevelText.destroy();
        if(this.solveEqCanvas)
            this.clearGMCanvas(this.solveEqCanvas);
        
        if(this.matchExpCanvas)
            this.clearGMCanvas(this.matchExpCanvas);
        
        this.music.stop();
        var elem = document.getElementById("undo_button");
        if(elem){
            elem.parentNode.removeChild(elem);
        }
        
        while(this._rocksGroup.countLiving() > 0){
            this.rockBurst(this._rocksGroup.children[0]);
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
        //var parsedEq = equation.replace(/\*/g, "");
        var parsedEq = equation;
        //console.log("parsed: "+parsedEq);
        //if(this._levelNumber != 2){
            // be careful for expressions with *. Might need to use algebra model instead
            this.currentCanvasEqu = parsedEq;
        //}
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            //console.log("before if: "+this._rocksGroup.children[i].equ);
            if(this._rocksGroup.children[i].visible && this._rocksGroup.children[i].equ == parsedEq){
                //add rock obj to array;
                //console.log("inside if - matched: "+ this._rocksGroup.children[i].equ);
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
            
        this.undoBtn.disabled = false;
        var lastEq = evt.last_eq;
        
        //checking for powerup
        if(this.pterodactyl.visible == true){
            var parsedEq = lastEq.replace(/\*/g, "");
            if(this.powerupText.text == parsedEq){
                this.acquirePowerup();
            }
        }
        var matchedEqRockArray = this.matchEquationOnRocks(lastEq);
        if (matchedEqRockArray.length > 0 && this._rocksGroup.countLiving() > 0) {
            for(var j = 0; j < matchedEqRockArray.length ; j++){
                 //set the rock velocity to 0
                 var matchedRock = matchedEqRockArray[j];                    
                 matchedRock.body.velocity.y = 0;

                 //initiate lightning weapon from match exp canvas towards the rock to burst it open
                 this.initiateLightningWeaponForRock(matchedRock);

            }
            if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){
                this.clearGMCanvas(this.matchExpCanvas); 
                this.showBoard('Click egg ','and solve for x');
                this.dino.animations.play('move', 10, true);
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
       this.undoBtn.style.cssFloat = "left";
    
       var contextRef = this;
       this.undoBtn.onclick = function(){
           if(contextRef._rocksGroup.countLiving() > 0){
               contextRef.matchExpCanvas.controller.undo();
           }else{
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
        var originalEquationAscii = this.rock_levelProblemSet[indexToChoose];
        var equation =  this.rock_levelProblemSet[indexToChoose];
        var parsedEquation = equation.replace(/\*/g, "");
        return parsedEquation;
    },
    getEquationForPowerup: function(){
        var i = this.rock_levelProblemSet.length - 1;
        var uniqueEqFound = true;
        while(i >= 0){
            uniqueEqFound = true;
            var equation =  this.rock_levelProblemSet[i][1];
            var parsedEquation = equation.replace(/\*/g, "");
            if(parsedEquation != this.currentCanvasEqu){
                    for(j = 0 ; j < this._rocksGroup.children.length; j++){
                        if(this._rocksGroup.children[j].visible){
                            
                            var rockEq = this._rocksGroup.children[j].equ.replace(/\*/g, "");
                            //console.log("visible rock : "+rockEq);
                            if(rockEq == parsedEquation){
                                //console.log("Matches rock : "+rockEq);
                                uniqueEqFound = false;
                                break;
                            }
                        }
                    } 
            }else{
                uniqueEqFound = false;
            }
            if(uniqueEqFound){
                return parsedEquation;
                break;
            }
            i--;
        }
        return null;
    },
    setCharAt:function(str, index, chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    },
    
    createEggEquation: function(){
            //get random expression format from current level ProblemSet
            var rndm = Math.random();    
            equation_format = this.egg_levelProblemSet[Math.floor(rndm*this.egg_levelProblemSet.length)];
            num_of_coefficients = (equation_format.match(/N/g)||[]).length;
            //console.log(num_of_coefficients);
            equation = equation_format;
            for(var i=0;i<num_of_coefficients;i++){
                var indx = equation.indexOf('N');
                var chr = Math.floor((Math.random() * 10) + 1);
                equation = this.setCharAt(equation, indx, chr);
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
    },
    
    
    
    //Power ups code
    acquirePowerup:function(){
        this.isPowerupUsed = true;
        
        //kill pterodactyl, power up text and show a cool message that player acquired a powerup
        this.pterodactyl.visible = false;
        this.pterodactyl.kill();
        this.pterodactyl.x = 0;
        this.powerupText.kill();
        this.g_powerupDuration = 5;
        
        //randomly choose available powerups 
        //Move below code somewhere else while refactoring
        var powerupsArray = [];
        var freezePowerup = {"id": "1", "name" : "Rocks Freeze", "handler" : "freezeRocks", "spriteName": "freezeRocks"};
        powerupsArray.push(freezePowerup);
        var destroyAllRocksPowerup = {id: "2", name : "Destroy All Rocks", handler : "destroyRocks", "spriteName": "destroyRocks"};
        powerupsArray.push(destroyAllRocksPowerup);
        var goldenEggPowerup = {id: "3", name : "Unlocked Golden Egg", handler : "addGoldenEgg", "spriteName": "goldenEgg"};   
        powerupsArray.push(goldenEggPowerup);
        var hatchEggPowerup = {id: "4", name : "Hatch any egg", handler : "hatchRandomEgg", "spriteName": "hatchEgg"};
        powerupsArray.push(hatchEggPowerup);
        
        //var indexToChoose = 1;
        var indexToChoose = this.getRandomRange(0, powerupsArray.length - 1);
        var chosenPowerup = powerupsArray[indexToChoose];
          
        //Show powerup name
        //powerName = this.game.add.text(0,0, chosenPowerup.name, { fontSize: '32px', fill: '#000' });
		powerName = this.game.add.sprite(0,0, chosenPowerup.spriteName);
        powerName.anchor.setTo(0.5,0.5);
        powerName.scale.setTo(0,0);
        powerName.x=this.game.width/2;
        powerName.y=this.game.height/3;
        
        var powerNameTween = this.game.add.tween(powerName.scale).to({ x: 1,y:1}, 5000,  Phaser.Easing.Bounce.Out,true);
        powerNameTween.onComplete.add(exitTween, this);
        function exitTween () {
            this.game.add.tween(powerName.scale).to({ x: 0,y:0}, 500,  Phaser.Easing.Bounce.Out,true);
        }

        //handle selected powerup
        console.log(chosenPowerup.name);
        this.powerupID = chosenPowerup.id; 
        this[chosenPowerup.handler]();
    },
    freezeRocks:function(){
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            this._rocksGroup.children[i].body.velocity.y = 0;
        }
        this.game.time.events.add(Phaser.Timer.SECOND * 15, this.unfreezeRocks, this);
    },
    unfreezeRocks:function(){
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            this._rocksGroup.children[i].body.velocity.y = 15;
        } 
        this.powerupID = -1;
        this.game.time.events.repeat(Phaser.Timer.SECOND * 6, this.g_numRocks - this.g_rockProducedIndex - 1, this.spawnRock, this);
    },
    destroyRocks:function(){
        var i = this.g_rockProducedIndex;
        while(i >= 0){
            this.rockBurst(this._rocksGroup.children[this._rocksGroup.children.length - 1]);
            i--;
        }
        
        //clear both canvas
        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){
            this.clearGMCanvas(this.matchExpCanvas); 
            this.showBoard('Click egg ','and solve for x');
            this.dino.animations.play('move', 10, true);
            this.powerupID = -1;
        }
    },
    addGoldenEgg:function(){
        var eggIndex = this.getRandomRange(0, this._eggsGroup.countLiving() - 1);
        //Can we get a dead egg here ?
        var eggToReplace = this._eggsGroup.children[eggIndex];  
        eggToReplace.tint = 0xccac00;
        eggToReplace.hitCounter = 10000; // provide a better logic to recognize the golden egg
        this.powerupID = -1;
    },
    hatchRandomEgg:function(){    
        var eggIndex = this.getRandomRange(0, this._eggsGroup.children.length - 1);
        this.selectedEgg = this._eggsGroup.children[eggIndex];
        this.selectedEgg.animations.play('hatch', 6, false);
        this.selectedEgg = null;
    }
    

}

