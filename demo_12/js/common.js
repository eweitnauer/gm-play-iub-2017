/*Game Common level*/
//the actual game
var DinoEggs = DinoEggs || {}; 
var g_isMuteOn = false;
var g_isMusicPlaying = true;
var g_isFirstClickOnMute = true;

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
    this.pauseReason = "";
    
    
};
DinoEggs.Game.prototype = Object.create(Phaser.State.prototype);
DinoEggs.Game.prototype.constructor = DinoEggs.Game;

DinoEggs.Game.prototype = {
    //set variables based on level number
    initVaribles:function(){
        this._levelNumber = DinoEggs._selectedLevel;
        this._stageNumber = DinoEggs.stageNumber;
        console.log("stage number is " + this._stageNumber);
        this.scoreBase = this._levelNumber * 30;
        console.log("selected level:"+DinoEggs._selectedLevel);
        this._jsonData = DinoEggs.jsonLevelObject[DinoEggs.stageNumber][DinoEggs._selectedLevel];
        this._jsonProblemData = DinoEggs.jsonProblemsObject[DinoEggs.stageNumber][DinoEggs._selectedLevel];
        this.g_numRocks = this._jsonData["numRocks"];
        this.g_numEggs = this._jsonData["numEggs"];
        this.rocksRemainingText = null;
        this.currentLevelText = null;
        

        if(this._levelNumber != 1){
            var randIndex = Math.floor(Math.random()*this._jsonProblemData["rock"].length)
            this.rock_levelProblemSet = this._jsonProblemData["rock"][randIndex]["solutions"];
            this.g_canvasExpression = this._jsonProblemData["rock"][randIndex]["problem"];
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
        
        //performance fix: don't reload GM if already loded in index.html
        if(gmath)
            currentObj.initCanvas();
        else
            loadGM(currentObj.initCanvas(), { version: '2.0.0' });
        
          //music 
        if(!this.music){
            this.music = this.game.add.audio('bg_music');
            this.music.loopFull();
            this.music.play();
        }
        
        this.g_countDinoForGameOver = 0;
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
        this.scoreText = this.game.add.text(700, 16, 'Score: 0', { font: '16px kalam', fill: '#000' });
        
        //Current Level Number
        this.currentLevelText = this.game.add.text(600, 16, 'Level: '+(this._levelNumber), { font: '16px kalam', fill: '#000' });
        
        // Number of Remaining Rocks
        if(this._levelNumber != 1){
             var barConfig = {x: 230, y: 25};
             this.myHealthBar = new HealthBar(this.game, barConfig);
             this.rocksRemainingText = this.game.add.text(20, 16, 'Rocks Left: '+(this.g_numRocks), { font: "16px kalam", fill: '#000' });
        }
        else{
            this.rocksRemainingText = "";
            this.myHealthBar = new HealthBar(this.game, barConfig);
            this.myHealthBar.setPercent(100);
        }
    
        //create Eggs
        this.createEggs(this.g_numEggs);
        
        rockwave = this.game.add.sprite(0,0, "rockwave");
		rockwave.anchor.setTo(0.5,0.5);
        rockwave.x=this.game.width/2;
        rockwave.y=this.game.height/3;
	    rockwave.scale.setTo(0,0);

        //create Rocks
        if(this._levelNumber != 1){
            //hide egg divisions
            //$("div[id*='gseq_']").hide();
            $("div[id*='gseq_']").css("visibility", "hidden");
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

        congratulations = this.game.add.sprite(0,100, "congratulations");
		congratulations.anchor.setTo(0.5,0.5);
        congratulations.x=this.game.width/2;
        congratulations.y=this.game.height/4;
	    congratulations.scale.setTo(0,0);
        
        
        //lightning group 
        this._lightningGroup = this.game.add.group();
        this._lightningGroup.enableBody = true;
        this._lightningGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.lightRockMap ={}
        
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
        //mute and unmute game
        this.muteButton = this.game.add.button(this.game.world.width ,this.pauseButton.y + this.pauseButton.height, 'musicOn', this.muteMusic, this, 2, 1, 0);
        this.muteButton.x = this.muteButton.x - this.muteButton.width;
        g_isMusicPlaying = JSON.parse(localStorage.getItem("g_isMusicPlaying"));
        
        if(g_isMusicPlaying == true){
            this.music.resume();
            this.muteButton.loadTexture('musicOn', 0 );
        }else if(g_isMusicPlaying == false){
            this.music.pause();
             this.muteButton.loadTexture('musicOff', 0 );
        }
            
        this.questionButton = this.game.add.button(this.game.world.width ,this.muteButton.y + this.muteButton.height, 'questionButton', this.questionClicked, this, 2, 1, 0);
        this.questionButton.x = this.questionButton.x - this.questionButton.width;
        
        
        
        this.forceDisplayTutorial = false;
        var levelStars = DinoEggs.PLAYER_DATA[DinoEggs.stageNumber - 1][this._levelNumber - 1];
        if(levelStars == undefined || levelStars < 2){
            this.forceDisplayTutorial = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showTutorial, this);    
        }else{
            if(this._levelNumber > 1){
                this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showRockInstructions, this);
            }else{
                this.game.time.events.add(Phaser.Timer.SECOND * 2, this.showEggInstructions, this);
            }
        }
        

        //this.input.mouse.capture = true;

    },
    showTutorial: function(){  
        $("#eq-match-div").hide();
        $("#eq-solve-div").hide();
        this.game.paused = true;
        $('#tutorialModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        $('#tutorialModal').modal('show');
        $('#tFrame').contents().find('.levelTutorial').hide()
        $('#tFrame').contents().find("#"+this._levelNumber).show();
        document.getElementById("tFrame").contentWindow.g_done_count = 0;
    },
    
    muteMusic:function(){
          if (g_isMuteOn == true || g_isFirstClickOnMute) {
                this.music.pause();
                g_isMuteOn =false;
                g_isMusicPlaying = false;
                g_isFirstClickOnMute = false;
                this.muteButton.loadTexture('musicOff', 0 );
          } else if (g_isMuteOn == false) {
              this.music.resume();
              g_isMuteOn = true;
              g_isMusicPlaying = true;
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
            this.music.pause();
            this.destructGameObjectsBeforeGameOver();
            this.state.start('LevelSelect');
    },
    unpause:function(event){
                // Only act if paused
        if(this.game.paused){

            if (this.pauseReason == "pauseClicked") {

            // Calculate the corners of the menu
            
            var x1 = this.game.world.width/2 - 380/2 +35, 
                x2 = x1 + 70,
                x3 = x2 + 70, 
                x4 = x3 + 70,
                x5 = x4 + 70,
                y1 = this.game.world.height/2 + 50;
                y2 = y1 + 80;
               
            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x5 && event.y > y1 && event.y < y2 ){
                
                this.game.paused = false;
                
                if(this._rocksGroup.countLiving() > 0){
                    $("#eq-match-div").show();
                }else{
                     $("#eq-solve-div").show();
                }
                
                // The choicemap is an array that will help us see which item was clicked
                var choicemap = ['one', 'two', 'three', 'four'];

                var x =  event.x;
                // Calculate the choice 
                if(x >= x1 && x < x2){
                    // Remove the menu and the label
                    this.menu.destroy();
                    $("div.noShow").removeClass("noShow");
                }else if(x >= x2 && x < x3){
                    this.restartGame();
                }else if(x >= x3 && x < x4){
                    this.showTutorial();
                }else if(x >= x4 && x < x5){ 
                     this.exitToMain();
                }
             
             
            }          
                
            }
       }
    },
    
    
       
    questionClicked: function(){
        this.game.paused = true;
        this.pauseReason = "questionClicked";
        $('#questionModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        
        
       $('#questionModal').modal('show');
         if (this._rocksGroup.countLiving() > 0) {
            $('#modalTitle').html('Click the expression on rock!<button type="button" style="color:white" class="close" data-dismiss="modal">&times;</button>'); 
            $('#qFrame').contents().find('#rock').show();
            $('#qFrame').contents().find('#egg').hide();
         } else {
            $('#modalTitle').html('Click an egg to hatch it!<button type="button" style="color:white" class="close" data-dismiss="modal">&times;</button>');
            $('#qFrame').contents().find('#egg').show();
            $('#qFrame').contents().find('#rock').hide();
         }
},
        
    pauseClicked: function(){   
        // When the pause button is pressed, we pause the game
        this.game.paused = true;
        this.pauseReason = "pauseClicked";
        $("div.gm-game-rock").addClass("noShow");
        $("div.gm-game-egg").addClass("noShow");
        $("div.gm-game-powerup").addClass("noShow");
        // Then add the menu
        this.menu = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'buttonsMenu');
        this.menu.anchor.setTo(0.5, 0.5);        
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
                if(uniqueEq != null && !this.pterodactyl.visible){
                    this.powerupEq = uniqueEq;
                    this.createPowerupEqDiv(this.powerupEq);
                    this.pterodactyl.visible = true;  
                    this.powerUpTween = this.game.add.tween(this.pterodactyl).to( { x: this.game.world.width - this.pterodactyl.width - this.pauseButton.width , y: 50 }, 7000, Phaser.Easing.Quadratic.InOut, true); 
                    this.powerUpTween.onComplete.addOnce(this.handlePowerupTween, this); 
                }
            }else{
                this.clearGMCanvas(this.matchExpCanvas); 
                this.showEggInstructions();
            }
            
            var powerupInterval = this.getRandomRange(20, 50);
            console.log("Power up appearing in "+powerupInterval+" seconds");
            this.game.time.events.add(Phaser.Timer.SECOND * powerupInterval, this.showPowerup, this);  
        } 
    },
    createPowerupEqDiv : function(equation){
        if(this.powerupGMDiv == undefined){
            this.powerupGMDiv = document.createElement("div");
            this.powerupGMDiv.setAttribute("id", "powerup_eq");
            this.powerupGMDiv.setAttribute("class", "gm-game-powerup");
            this.powerupGMDiv.style.left = '300px';
            this.powerupGMDiv.style.top = '200px';
            var gameDivContainer = document.getElementById("game-div");
            gameDivContainer.appendChild(this.powerupGMDiv);
            this.powerupCanvas = new gmath.Canvas('#powerup_eq', {use_toolbar: false, vertical_scroll: false });     
        }
        var derivation = this.powerupCanvas.model.createElement('derivation', { eq: equation, pos: { x: 'center', y: 50 }, font_size:20, handle_stroke_color:'#000' });
        this.powerupGMDiv.style.display = "block";
    },
    showRockInstructions:function(){
        this.showBoard('Match rock ','expression to burst');
        this.dino.animations.play('move', 10, true);
    },
    showEggInstructions:function(){
        this.showBoard('Click egg and','       solve');
        this.dino.animations.play('move', 10, true);
    },
    update:function(){
        this.game.physics.arcade.collide(this._eggsGroup, this._platforms);
        this.game.physics.arcade.overlap(this._rocksGroup, this._platforms, this.disappearRockOnGround, null, this);
        this.game.physics.arcade.overlap(this._rocksGroup, this._eggsGroup, this.hitEgg, null, this);
        
        //check collision for lightning
         this.game.physics.arcade.overlap(this._lightningGroup, this._rocksGroup, this.lightningStruck, null, this);
     
        //var bcrt = document.getElementById("game-div").getBoundingClientRect();
        //render egg equations
        this._eggsGroup.forEach(function(egg){
          if(egg.newGMDiv){
            $("#"+egg.newGMDiv.id).css({top: egg.y+30, left: egg.x, position:'absolute'});
          }
        });
        
        //render rock equations
        this._rocksGroup.forEach(function(rock){
            $("#"+rock.newGMDiv.id).css({top: rock.y, position:'absolute'});
        });
        
        //render power up equation text
        if(this.pterodactyl.visible == true){
         $("#powerup_eq").css({top: this.pterodactyl.y + this.pterodactyl.height * (2/3), left: this.pterodactyl.x + this.pterodactyl.width * 2/3, position:'absolute'});
        }

        //move selected egg's halo along with the egg on dropping the eggs initially
        if(this.selectedEgg){
            this.halo.x=this.selectedEgg.x+this.selectedEgg.width/2;
            this.halo.y=this.selectedEgg.y+this.selectedEgg.height/2-2;
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
        
           // generate random index array
            var randomIndexArr = [];
            if(this._levelNumber != 2){
                while(randomIndexArr.length < this.g_numEggs){
                    var randomnumber = Math.ceil(Math.random()*this._jsonProblemData["egg"].length - 1)
                    if(randomIndexArr.indexOf(randomnumber) > -1) continue;
                    randomIndexArr[randomIndexArr.length] = randomnumber;
                }
            }
            for (var i = 0; i < numEggs; i++){
                
                if(this._levelNumber != 2){
                    var eggEquationAndSol = this.getRandomEggEquationAndSolutions(randomIndexArr, i);
                    var eggEquation = eggEquationAndSol[0];
                    var eggSolutions = eggEquationAndSol[1];
                    var egg = new Egg(this.game,egg_x_array[i],egg_y, eggEquation, eggSolutions);
                    egg.createEggEqDiv(egg_x_array[i], egg_y, eggEquation, i);

                }else{
                    var egg = new Egg(this.game,egg_x_array[i],egg_y,"");   
                }
                
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
                    var obtainedScoreText = this.game.add.text(eggSprite.x, eggSprite.y, score, { font: '32px kalam', fill: '#000' });

                    //score animation
    //                this.clearBoard();
                    var scoreTween = this.game.add.tween(obtainedScoreText).to({x: 700, y: 16}, 3000, Phaser.Easing.Quadratic.InOut, true);
                    scoreTween.onComplete.addOnce(this.updateScore,this,obtainedScoreText); 

                    //check for any existing blue eggs
                    //This blue eggs should not be considered for '-10' calculation in Level 2 (when all eggs hatch simultaneously)
                    if(eggSprite.hitCounter <= 2 && this._levelNumber != 2){
                        for (var j = 0; j < this._eggsGroup.length; j++){
                            if(this._eggsGroup.children[j].hitCounter > 2 && this._eggsGroup.children[j].hitCounter != 10000){
                                var blackEggScoreText = this.game.add.text(this._eggsGroup.children[j].x, this._eggsGroup.children[j].y, "-10", { font: '32px kalam', fill: '#000' });
                                var blackEggTween = this.game.add.tween(blackEggScoreText).to({x: 700, y: 16}, 3000, Phaser.Easing.Quadratic.InOut, true);
                                blackEggTween.onComplete.addOnce(this.updateScore,this,blackEggScoreText); 
                            }
                        }
                    }

                    //eggSprite.equationText.destroy();
                    if(eggSprite.newGMDiv)
                        eggSprite.newGMDiv.parentElement.removeChild(eggSprite.newGMDiv);
                    
                    //check if egg is golden
                    var isGoldenEgg = eggSprite.hitCounter == 10000 ? true : false;
                    this._eggsGroup.remove(eggSprite); 
                    
                    this.runToMom(egg_x, isSad, isGoldenEgg);

                    if(this._eggsGroup.countLiving() > 0 && this.powerupID != "4" ){
                        this.clearGMCanvas(this.solveEqCanvas);
                        this.clearGMCanvas(this.matchExpCanvas);
                        document.getElementById("eq-match-div").style.display="block";
                        document.getElementById("eq-solve-div").style.display="none";

                        if(this._levelNumber > 2){
                            this.createRocks(this.g_numRocks);             
                            this.startRockWave(6,this.g_numRocks,this.g_numEggs);          
                        }
                    }
                    else{
                        this.powerupID = -1;
                    }
                }, this);
                
            //add click event to egg
            if(this._levelNumber != 2){
                egg.inputEnabled = true;
                egg.events.onInputDown.add(this.populateSolveEqCanvas, this, egg);
            }
                
            egg.canvasId = "gseq_"+(i+1);
            this._eggsGroup.add(egg);     
            }
        
        //disable egg clicks for all eggs except level 1
        if(this._levelNumber != 1){
            this._eggsGroup.setAll('inputEnabled',false);
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
                var match_eq = this.getMatchEquationOnRock();
                var rock = new Rock(this.game,randposX, 50, match_eq);
                rock.body.velocity.y = 0;
                rock.visible = false;
                rock.GMCanvas = rock.createRockEqDiv(i, randposX, 50, match_eq, this.g_rockProducedIndex);
                this._rocksGroup.add(rock);
                this.rocksTospawn.push(rock);
                
            }
        }

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

    runToMom: function(egg_x, isSad, isGoldenEgg){
        
        //enable egg click for level 1
        if(this._levelNumber == 1){
            this._eggsGroup.setAll('inputEnabled',true);
        }
        var hatchling = null;
        if(isSad){
            hatchling = this.game.add.sprite(egg_x,this.game.world.height-100, 'hatchling_sad');
        }
        else if(isGoldenEgg){
            hatchling = this.game.add.sprite(egg_x,this.game.world.height-100, 'triplets');
        }else{
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
        if(this._levelNumber == 2){//if(this.isSingleRockWave)
            this.g_countDinoForGameOver++;
        }
        
        if(this._eggsGroup.countLiving() == 0)
        {
            if(this._levelNumber == 2){
                 if(this.g_countDinoForGameOver == this.g_numEggs)
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
            this._eggsGroup.callAll('animations.stop', 'animations');
            
            for(var i = 0; i < this._eggsGroup.children.length ; i++){
                 this._eggsGroup.children[i].frame = 0;
            }   
        }
        
        if(this._levelNumber != 1){
            //hide other egg equations if they are visible
            //$("div[id*='gseq_']").hide();
            $("div[id*='gseq_']").css("visibility","hidden");
            //show the equation on selected egg
             var eggCanvasId = selectedEgg.canvasId;   
             var eggDivName = "div#"+eggCanvasId;
             $(eggDivName).css("visibility","visible");
        }
        
        document.getElementById("eq-solve-div").style.display="block";
        document.getElementById("eq-match-div").style.display="none"; 
       
        this.selectedEgg = selectedEgg;
        this.clearGMCanvas(this.solveEqCanvas);
        this.clearGMCanvas(this.matchExpCanvas);
        
        //enable wiggle on gm canvas equations for 1st and 2nd level
        if(this._levelNumber==1)
            this.solveEqCanvas.model.createElement('derivation', { eq: selectedEgg.equ, pos: { x: 'center', y: 50 }, wiggle:["+","*","-","/"] });
        else
            this.solveEqCanvas.model.createElement('derivation', { eq: selectedEgg.equ, pos: { x: 'center', y: 50 } });
        
        if(this.halo)
            this.halo.kill();
        this.halo = this.game.add.sprite(0,0, "halo");
		this.halo.anchor.setTo(0.5,0.5);
        this.halo.x=selectedEgg.x+this.selectedEgg.width/2;
        this.halo.y=selectedEgg.y+this.selectedEgg.height/2-2;
    },
    
    startRockWave: function(rockIntervalSec, numRocks,numEggs){
        var t = this.game.add.tween(rockwave.scale).to({ x: 1,y:1}, 5000,  Phaser.Easing.Bounce.Out,true);
        t.onComplete.add(exitTween, this);
        function exitTween () {
            this.game.add.tween(rockwave.scale).to({ x: 0,y:0}, 500,  Phaser.Easing.Bounce.Out,true);
            if(this.matchExpCanvas){
                if(this._levelNumber==2){
                    this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 }, wiggle:["+","-","*","/"] });
                }
                else
                    this.matchExpDerivation = this.matchExpCanvas.model.createElement('derivation', { eq: this.g_parsedCanvasExpression, pos: { x: "center", y: 10 } });
            }
            this.currentCanvasEqu = this.g_parsedCanvasExpression;
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
        if(this.rocksTospawn && this.rocksTospawn.length > 0 && this.powerupID != "1"  ){
            this.g_rockProducedIndex++;
            this.updateRocksRemaining();         
            var rock = this.rocksTospawn.pop();
            
            //replace rock equation
            if(rock.getEquation() == this.currentCanvasEqu || (this.pterodactyl.visible && this.powerupEq == rock.getEquation())){
                rock.setEquation(this.getMatchEquationOnRock());
                while(rock.getEquation() == this.currentCanvasEqu || (this.pterodactyl.visible && this.powerupEq == rock.getEquation())){
                    rock.setEquation(this.getMatchEquationOnRock());
                } 
            }
            
            rock.body.velocity.y = this._jsonData["velocity"];
            rock.visible = true;
            rock.newGMDiv.style.visibility = "visible";
            //rock.displayGMEquation();
    }
    },
    handlePowerupTween:function(){
        this.g_powerupDuration--;  
        if(this.g_powerupDuration > 0 && this._rocksGroup.countLiving() > 0 && this._eggsGroup.countLiving() > 0){
            x_pos = 0;
            if(this.pterodactyl.x == 0){
                x_pos = this.game.world.width - this.pterodactyl.width - this.pauseButton.width;
            }
            
            this.powerUpTween = this.game.add.tween(this.pterodactyl).to( { x: x_pos , y: 50 }, 7000, Phaser.Easing.Quadratic.InOut, true);
 
            this.powerUpTween.onComplete.addOnce(this.handlePowerupTween, this);  
        }else{
            //kill the powerup even when there are no rocks on screen
            this.killPowerup();
           
            if(this._rocksGroup.countLiving() == 0){
                this.clearGMCanvas(this.matchExpCanvas); 
                this.showEggInstructions();
            }
            
        }     
    },
    killPowerup: function(){
        
        this.pterodactyl.visible = false;
        this.pterodactyl.kill();
        this.pterodactyl.x = 0; 
        this.powerupEq = "";
        this.powerupCanvas.controller.reset();
        this.powerupGMDiv.style.display = "none";
        
        //reset the powerup duration
        this.g_powerupDuration = 5;
    },
    
    hitEgg: function(rock, egg){

        
        //if this egg is not golden egg, only then change the egg color
        
        if(egg.tint != 0xccac00){
            var hits = ++egg.hitCounter;
            switch(hits){
                case 1 : 
                        egg.tint = 0x00ff00; 
                        egg.animations.play('wiggleOnce');
                         break;
                case 2 : egg.tint = 0xff0000;
                        var style = {font: "20px Arial", fill: "#111111", wordWrap: true, wordWrapWidth: egg.width, align: "center"};
//                        egg.setEquStyle(style);
                        egg.animations.play('wiggleOnce');

                        if(egg.newGMDiv){
                            var eqSymbols = egg.newGMDiv.getElementsByClassName('text');
                            Array.prototype.forEach.call(eqSymbols, function(eqSymbol) {
                                eqSymbol.style.color = "white";
                            });

                            var eqSymbols2 = egg.newGMDiv.getElementsByClassName('line');
                            Array.prototype.forEach.call(eqSymbols2, function(eqSymbol) {
                                eqSymbol.style.backgroundColor = "white";
                            });
                        }
                        break;
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
        
        //rock.equationText.destroy();
        rock.newGMDiv.parentElement.removeChild(rock.newGMDiv);
        this._rocksGroup.remove(rock);

        //  And 2 seconds later we'll destroy the emitter
        this.game.time.events.add(2000, this.destroyObject, this, rock_emitter);
        
        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex +1 == this.g_numRocks){
            
            this._eggsGroup.setAll('inputEnabled',true);
            this.clearGMCanvas(this.matchExpCanvas);
            
            if(this._levelNumber == 2){
                this.hatchAllEggs();
            }
            else{
                if(this._eggsGroup.countLiving()>0){
                    this.showEggInstructions();
                    this._eggsGroup.callAll('animations.play', 'animations', 'wiggleContinous');
                }
            }
            
            //check powerup and kill if visible
            if(this.pterodactyl.visible == true){
                this.killPowerup();
            }
            
        }

    },
    removeHalo:function(){
        if(this.halo)
            this.halo.kill();    
    },
    
    hatchAllEggs: function(){
        this.removeHalo();
        this._eggsGroup.callAll('animations.play', 'animations', 'hatch');
    },
    
    destroyObject: function(obj) {
        if(obj != undefined)
            obj.destroy();
    },
    gameOver: function() {    
        
        this.destructGameObjectsBeforeGameOver();
        
        var starHeight = 22;
        var gameOverText = this.game.add.text( this.game.world.width*0.5, this.game.world.height*0.5 + starHeight, 'Score:' + this.score, { font: '22px kalam', fill: '#000' });
        gameOverText.anchor.set(0.5);
        var stars = this.endStar();
        if (stars > 0){
            this.updatePlayerData(stars);
        }        
        
        //next level button
        if(this._levelNumber <= 9 ) {
            if(DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][this._levelNumber] > -1 ){ 
            
            //Next level button
            var nextLevelButton = this.game.add.button(this.game.world.width*0.5, gameOverText.y + gameOverText.height + 10, 'nextlevel', function(){
                DinoEggs._selectedLevel = DinoEggs._selectedLevel + 1; 
                this.state.start('NextLevel');
            }, this.game, 1, 0, 2);
            nextLevelButton.anchor.set(0.5);
            nextLevelButton.scale.setTo(2,2);
                
            //restart button
            var restartButton = this.game.add.button(this.game.world.width*0.5 - 40, nextLevelButton.y + nextLevelButton.height, 'restart', function(){
                this.state.start('Game');
            }, this.game, 1, 0, 2);
            restartButton.anchor.set(0.5);
            var mus = this;
            var mainMenuButton = this.game.add.button(restartButton.x + restartButton.width , nextLevelButton.y + nextLevelButton.height, 'menu', function(){
                mus.music.pause();
                this.state.start('MainMenu');
           
            }, this.game, 1, 0, 2);
            mainMenuButton.anchor.set(0.5); 
        } 
        }else {
             var t = this.game.add.tween(congratulations.scale).to({ x: 1,y:1}, 2000,  Phaser.Easing.Bounce.Out,true);
            var style = { font: "30px Arial", fill: "#fff", align: "center" };
            if (this._stageNumber == 1) {
                var conText1 = this.game.add.text(this.game.width/2, this.game.height/2 + 30, "You have completed all the levels for grade 4-7!", style);
                conText1.anchor.set(0.5);
            } else {
                var conText2 = this.game.add.text(this.game.width/2, this.game.height/2 + 30, "Congratulations! You have completed all the levels for grade 7-9!", style);
                conText2.anchor.set(0.5);
            }
            var nextGameStageButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.5 + 50, 'gradeSetlevel', function(){
                this.state.start('StageSelect');
            }, this.game, 1, 0, 2);
                nextGameStageButton.anchor.set(0.5);
         }
 
        this.isPowerupUsed = false;
        
        //add celebration
         this.celebrationEmitter.start(false, 10000, 100);
        
        this.pauseButton.inputEnabled = false;
        this.muteButton.inputEnabled = false;
        this.questionButton.inputEnabled = false;
        
        //destroy game controls
        this.pauseButton.destroy();
        this.questionButton.destroy();
        this.muteButton.destroy();  
    },
    autoStartNextLevel: function(){
        g_autoStartClock--;
        
        autoStartTxt.text = 'Next Level starts in '+g_autoStartClock+' seconds';
        if(g_autoStartClock<1){
            autoStartTxt.kill();
            DinoEggs._selectedLevel = DinoEggs._selectedLevel + 1; //parseFloat(this._levelNumber) + 1;
            this.state.start('NextLevel');
        }
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
        
        this.matchExpCanvas = null;
        this.solveEqCanvas = null;
        
        
        
       // set the current state of game music to local storage
       localStorage.setItem("g_isMusicPlaying", JSON.stringify(g_isMusicPlaying)); 
        
        var elem = document.getElementById("undo_button");
        if(elem){
            elem.parentNode.removeChild(elem);
        }
        
        while(this._rocksGroup.countLiving() > 0){
            this.rockBurst(this._rocksGroup.children[0]);
        }
        
        this._eggsGroup.forEach(function(_egg){
            if(_egg.newGMDiv)
                _egg.newGMDiv.parentElement.removeChild(_egg.newGMDiv);
        });
        
        // reset powerup
        $("#powerup_eq").remove();
        this.powerupGMDiv = undefined;   
    },
    
    updatePlayerData: function(stars) {
		// set number of stars for this level
		DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][this._levelNumber-1] = stars;

		// unlock next level
		if (this._levelNumber < DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1].length) {
			if (DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][this._levelNumber] < 0) { // currently locked (=-1)
				DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][this._levelNumber] = 0; // set unlocked, 0 stars
			}
		};
		// and write to local storage
		window.localStorage.setItem('DinoGameProgress', JSON.stringify(DinoEggs.PLAYER_DATA));
	},   
    
    updateHighScore: function(highScore) {
        DinoEggs.HIGH_SCORE = highScore;
         window.localStorage.setItem('HighScore', JSON.stringify(DinoEggs.HIGH_SCORE));
    },
    
    endStar: function() {
        
        var singleStarWidth = 24;
        var singleStarHeight = 22;
        var starSpriteWidth = 3 * singleStarWidth;
        var starNumber = 0;
        if (this.score > DinoEggs.HIGH_SCORE){
            this.updateHighScore(this.score);
        }
        var starStartPosition = this.game.world.width/2 - starSpriteWidth/2;
        while (this.score > 0){
           this.game.add.sprite(starStartPosition, this.game.world.height*0.5 - singleStarHeight, 'star');
           starStartPosition = starStartPosition + singleStarWidth;
           this.score = this.score - this.scoreBase; 
           starNumber++;
           if (starNumber == 3){    
               break;
           }
        }
        var greyStar = 3 - starNumber;
        while(greyStar > 0){
            var star1 =  this.game.add.sprite(starStartPosition, this.game.world.height*0.5 - singleStarHeight, 'star');
            starStartPosition = starStartPosition + singleStarWidth;
            star1.tint= 0x232323;
            greyStar--;
        }
        return starNumber;
    },
    
    showBoard: function(line1,line2) {
        if(this.board)
            this.clearBoard();
        this.board = this.game.add.sprite(490,220,'board');
        this.board.scale.setTo(0.8,0.7);
        var style = { font: "14px kalam", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" };
        
        this.boardText1 = this.game.add.text(520,250, line1, style);
        this.boardText2 = this.game.add.text(505,270, line2, style);
    },
    
    clearBoard: function() {
        this.board.destroy();
        this.boardText1.destroy();
        this.boardText2.destroy();
},
    
    matchEquationOnRocks: function(equation){
        var matchedEqRocks= [];
        var parsedEq = equation;
        this.currentCanvasEqu = parsedEq;
       
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            if(this._rocksGroup.children[i].visible && this._rocksGroup.children[i].equ == parsedEq){
                //add rock obj to array;
                matchedEqRocks.push(this._rocksGroup.children[i]);
            }
            
        }
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
            if(this.powerupEq == lastEq){
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
                this.showEggInstructions();
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
         //check if the lightning struck on correct rock, only then,burst the rock, else do nothing and continue moving towards target
         if(this.lightRockMap[lightning.nameId] == rock){
                 var obtainedScoreText = this.game.add.text(rock.x, rock.y, "+10", { font: '32px kalam', fill: '#000' });
                 this.rockBurst(rock);
                 
                 //animate and update score 
                 var scoreTween = this.game.add.tween(obtainedScoreText).to({x: 700, y: 16}, 3000, Phaser.Easing.Quadratic.InOut, true); scoreTween.onComplete.addOnce(this.updateScore,this,obtainedScoreText);   
                delete this.lightRockMap[lightning.nameId];
                this._lightningGroup.remove(lightning);
         }
     },


    eggEqCheck:function(evt){         
        if(this.selectedEgg){
            for(var index in this.selectedEgg.solutions){
                //condition to check if equation is solved
                if(evt.last_eq == this.selectedEgg.solutions[index]){
                    this._eggsGroup.setAll('inputEnabled',false);
                    var t = this.game.add.tween(awesome.scale).to({ x: 1,y:1}, 2000,  Phaser.Easing.Bounce.Out,true);
                    t.onComplete.add(exitTween, this);
                    function exitTween () {
                        this.game.add.tween(awesome.scale).to({ x: 0,y:0}, 50,  Phaser.Easing.Bounce.Out,true);
                    }
                    this.removeHalo();
                    this.selectedEgg.animations.play('hatch', 6, false);
                    this.selectedEgg = null;
                    break;
                }

            }
        }


    },
    initCanvas: function(){
        //solveEqCanvas is for Equation Solving and simplifying            
        if(this._jsonData["hasEggEq"]==true){
            document.getElementById("eq-match-div").style.display="none";
            document.getElementById("eq-solve-div").style.display="block";
            this.solveEqCanvas = new gmath.Canvas('#gmath1-div', {use_toolbar: false, vertical_scroll: false });
            //!preserve binding
            var thisObj =this;
            this.solveEqCanvas.model.on('el_changed', function(evt) {
                    thisObj.eggEqCheck(evt);
            });
        }
        //matchExpCanvas is for Pattern Matching
        if(this._jsonData["hasRockEq"] ==true){
            document.getElementById("eq-match-div").style.display="block";
            document.getElementById("eq-solve-div").style.display="none";
            this.matchExpCanvas = new gmath.Canvas('#gmath2-div', {use_toolbar: false, vertical_scroll: false });                

            //!preserve binding
            var thisObj =this;
            this.matchExpCanvas.model.on('el_changed', function(evt) {	
                thisObj.matchEqCheck(evt);
            });
        }

        //Unpause game after the Exiting question mark click
        var questionCtx = this;
        $("#questionModal").on("hidden.bs.modal", function() {
              if(questionCtx.game.paused )
                  questionCtx.game.paused = false;
        });
        
       //Create the search button
       this.undoBtn = document.createElement("input");
        
       //Set the attributes
       this.undoBtn.setAttribute("type","button");
       this.undoBtn.setAttribute("value","Undo");
       this.undoBtn.setAttribute("name","undobtn");
       this.undoBtn.setAttribute("id","undo_button");
       this.undoBtn.style.postion = "absolute";
       //this.undoBtn.style.top = "0";
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
        //document.getElementById("game-div").appendChild(this.undoBtn);
       document.body.appendChild(this.undoBtn);
       this.undoBtn.disabled = true;
        $('#undo_button').addClass('btn-warning');
        $('#undo_button').addClass('btn-lg');
        
        
        //Tutorial close listener to unpause the game
        var gameCtx = this;
        $("#tutorialModal").on("hidden.bs.modal", function() {
            if(gameCtx.game.paused && gameCtx.forceDisplayTutorial){
                gameCtx.game.paused = false;
                gameCtx.forceDisplayTutorial = false;
                if(gameCtx._levelNumber > 1){
                     gameCtx.showRockInstructions();
                     $("#eq-match-div").show();
                }else{
                     gameCtx.showEggInstructions();
                     $("#eq-solve-div").show();
                }
            }
            
        });
    
        
    },
    
    clearGMCanvas: function(canvasObj){
        //clear canvas
        if(canvasObj){    
            canvasObj.controller.reset();
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
        var equation =  this.rock_levelProblemSet[indexToChoose];
        return equation;
    },
    getEquationForPowerup: function(){
        var i = this.rock_levelProblemSet.length - 1;
        var uniqueEqFound = true;
        while(i >= 0){
            uniqueEqFound = true;
            var equation =  this.rock_levelProblemSet[i];

            if(equation != this.currentCanvasEqu){
                    for(j = 0 ; j < this._rocksGroup.children.length; j++){
                        if(this._rocksGroup.children[j].visible){
                            var rockEq = this._rocksGroup.children[j].equ;
                            if(rockEq == equation){
                                uniqueEqFound = false;
                                break;
                            }
                        }
                    }
            }else{
                uniqueEqFound = false;
            }
            if(uniqueEqFound){
                return equation;//.replace(/\*/g, "");
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
    /*setDecimalDivision: function(equation_format){
        var n = Math.floor((Math.random() * 10) + 1);
        var product = Math.floor((Math.random() * 10) + 1);
        return equation_format.replace(/N\/N/g, ""+(product*n)+"/"+n);
    },*/
    getRandomEggEquationAndSolutions: function(randomIndexArr, index){
        //get random expression format from current level ProblemSet 
        equation = this._jsonProblemData["egg"][randomIndexArr[index]]["problem"];
        solutions = this._jsonProblemData["egg"][randomIndexArr[index]]["solutions"];
        return [equation,solutions];
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
        
        this.powerUpTween.pause();
        this.pterodactyl.alpha = 0.8;
        
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
        
        //check if rocks freeze is acquired,
        //In that case, if there are no rocks, player should acquire new powerup
        var killedRocks = this.g_numRocks - this._rocksGroup.countLiving();
        if(indexToChoose == 0  && killedRocks == this.g_rockProducedIndex + 1){
                indexToChoose = this.getRandomRange(1, 3);     
        }
        
        var chosenPowerup = powerupsArray[indexToChoose]; 
        
        //Show powerup name
		powerName = this.game.add.sprite(this.pterodactyl.x + this.pterodactyl.width/2,this.pterodactyl.y + this.pterodactyl.height * 2/3, chosenPowerup.spriteName); 
        powerName.anchor.setTo(0.5,0.5);
        powerName.scale.setTo(0.3,0.3);    
       
        var powerNameScaleTween = this.game.add.tween(powerName.scale).to({ x: 1,y:1}, 5000,  Phaser.Easing.Bounce.Out,true);
        var powerNameTween = this.game.add.tween(powerName).to({ x: this.game.width/2,y:this.game.height/3}, 5000,  Phaser.Easing.Bounce.Out,true);
        
        powerNameScaleTween.chain(powerNameTween);
        powerNameTween.onComplete.add(exitPowerNameTween, this);
        
        function exitPowerNameTween () { 
            this.killPowerup();
            this.game.add.tween(powerName.scale).to({ x: 0,y:0}, 500,  Phaser.Easing.Bounce.Out,true);   
        }
        
        //handle selected powerup
        this.powerupID = chosenPowerup.id; 
        this[chosenPowerup.handler]();
         
    },
    freezeRocks:function(){
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            this._rocksGroup.children[i].body.velocity.y = 0;
        }
        //update clock for every 1 second
        g_clock_sec =0;
        hourglass = this.game.add.sprite(this.game.width/2, 50, "clock");
        hourglass.anchor.setTo(0.5,0.5);
        hourglass.alpha = 0.75;
        g_freezeRockTimerEvent = this.game.time.events.repeat(Phaser.Timer.SECOND,16,  this.updateClock, this);
    },
    updateClock:function(){
        g_clock_sec++;
        hourglass.angle +=24;        
        if(g_clock_sec > 15){
            hourglass.kill();
            this.unfreezeRocks();
        }
        
        var killedRocks = this.g_numRocks - this._rocksGroup.countLiving();
        if(killedRocks == this.g_rockProducedIndex + 1){   
            this.game.time.events.remove(g_freezeRockTimerEvent);
            hourglass.kill();
            this.unfreezeRocks();
        }
        
    },
    unfreezeRocks:function(){
        for(var i = 0 ; i < this._rocksGroup.children.length ; i++){
            this._rocksGroup.children[i].body.velocity.y = 15;
        } 
        this.powerupID = -1;
        this.game.time.events.repeat(Phaser.Timer.SECOND * 6, this.g_numRocks - this.g_rockProducedIndex - 1, this.spawnRock, this);
    },
    destroyRocks:function(){
        /*var i = this.g_rockProducedIndex;
        while(i >= 0){
            this.rockBurst(this._rocksGroup.children[this._rocksGroup.children.length - 1]);
            i--;
        }*/
        while(this._rocksGroup.children[this._rocksGroup.children.length - 1].visible == true){
            this.rockBurst(this._rocksGroup.children[this._rocksGroup.children.length - 1]);
        }
        
        //clear both canvas
        if(this._rocksGroup.countLiving() == 0 && this.g_rockProducedIndex == this.g_numRocks){
            this.clearGMCanvas(this.matchExpCanvas); 
            this.showEggInstructions();
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
        this.removeHalo();
        var eggIndex = this.getRandomRange(0, this._eggsGroup.children.length - 1);
        this.selectedEgg = this._eggsGroup.children[eggIndex];
        this.selectedEgg.animations.play('hatch', 6, false);
        this.selectedEgg = null;
    }
    

}
