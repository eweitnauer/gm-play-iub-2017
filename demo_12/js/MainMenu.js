var DinoEggs = DinoEggs || {}; 

DinoEggs.MainMenu = function(){
    "use strict";
    Phaser.State.call(this);
    this.music = null;
    this.startGuestButton = null;
    this.startButton = null;
    DinoEggs.HIGH_SCORE = null;
    DinoEggs.isLoggedIn = false;
    
};
DinoEggs.MainMenu.prototype = Object.create(Phaser.State.prototype);
DinoEggs.MainMenu.prototype.constructor = DinoEggs.MainMenu;

DinoEggs.MainMenu.prototype = {
    create:function(){
        //TO-DO: add music
        //this.music = this.add.audio('titleMusic');
		//this.music.play();
        
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
//        this.background.autoScroll(-20, 0);         //give it speed in x
        
         //game logo
        this.logo = this.game.add.sprite(this.game.world.width*0.5,this.game.world.height*0.4, 'logo');
        this.logo.anchor.set(0.5);
        this.logo.scale.setTo(0.5,0.5);
        
        //logo tween
        var logoTween = this.game.add.tween(this.logo.scale).to({ x: 0.7,y:0.8}, 5000, Phaser.Easing.Bounce.Out,true).loop(true);
        
        //start game text
       // var gameName = "Math Fun!";
        var style = { font: "30px kalam", fill: "#000", align: "right" };
        /*var t = this.game.add.text(this.game.width/2, this.logo.y + this.logo.height, gameName, style);
        t.anchor.set(0.5);*/
        
        //init high score
        this.initHighScore();
        if (DinoEggs.HIGH_SCORE == null) {
            this.highScore = "High score : " + 0;
        } else {
             this.highScore = "High score : " + DinoEggs.HIGH_SCORE;
        }
       
        var highScoreText = this.game.add.text(this.game.width * 0.8, this.game.height * 0.1, this.highScore);
        highScoreText.anchor.set(0.5);
        highScoreText.font = 'Arial';
        
        var grd = highScoreText.context.createLinearGradient(0, 0, 0, highScoreText.canvas.height);
        grd.addColorStop(0, '#f4aa42');   
        grd.addColorStop(1, '#1856b2');
        highScoreText.fill = grd;
//      var highScoreText = this.game.add.text(this.game.width * 0.8, this.game.height * 0.1, this.highScore, style);
//      highScoreText.anchor.set(0.5);
        
        //start button
        this.startButton = this.game.add.button(0,this.game.world.height*0.7 , 'startButton', function() {
            var googleLoginWindow = window.open("https://graspablemath.com/auth/google", 'Authorize Graspable Math','left=20,top=20,width=500,height=500,toolbar=1'); 
            var timer = setInterval(checkAuth, 500);

            function checkAuth() {
                if (googleLoginWindow.closed) {
                    clearInterval(timer);
                    get_data();
                }
            }
            
            this.game.time.events.remove(this.blink_event);
            this.state.start('StageSelect');
            
        }, this, 1, 0, 2);
        
        this.startButton.anchor.set(0.5);
        this.startButton.scale.set(0.5);
        
        //start as Guest button
        this.startGuestButton = this.game.add.button(this.game.world.width+100,this.game.world.height*0.8, 'startGuestButton', this.startGame, this, 1, 0, 2);
        this.startGuestButton.anchor.set(0.5);
        this.startGuestButton.scale.set(0.5);

        //Animate buttons
        this.game.add.tween(this.startButton).to( { x:this.game.world.width*0.5,y:this.game.world.height*0.7 }, 1000, Phaser.Easing.Exponential.Out, true);
		this.game.add.tween(this.startGuestButton).to( { x:this.game.world.width*0.5,y:this.game.world.height*0.8 }, 1000, Phaser.Easing.Exponential.Out, true);
                                                        
        
        //Animate baby dino and mom
        this.mom = this.game.add.sprite(this.game.world.width*0.6, 300, 'dino_intro_anim'); 
        this.mom.animations.add('reachOutToBaby',['m_1.png','m_2.png','m_3.png','m_2.png','m_1.png'],1,false);
        this.mom.animations.add('mom_blink',['m_1.png','m_4.png','m_5.png','m_4.png','m_1.png'],10,false);
        this.mom.play('mom_blink');
        
        this.baby = this.game.add.sprite(300,this.game.world.height-100, 'hatchling_intro_anim');
        this.baby.anchor.setTo(0.5, 0.5);
        this.baby.animations.add('run',['h1.png','h2.png']);
        this.baby.animations.play('run', 10, true);
        // params are: properties to tween, time in ms, easing and auto-start tweenthis.
        var runningBabyTween = this.game.add.tween(this.baby).to({x: this.mom.x, y: this.game.world.height-50}, 6000, Phaser.Easing.Quadratic.InOut, true);
        runningBabyTween.onComplete.addOnce(this.stopBaby, this,this.baby);  
        
        //this.hatchlingStatic.animations.add('blink');
        //this.hatchlingStatic.animations.play('blink', 5, true);
        
        document.getElementById("eq-match-div").style.display="block";
        document.getElementById("eq-solve-div").style.display="none";
                

    },
    stopBaby: function(baby){
        this.baby.animations.stop(null, true);
        this.baby.animations.add('baby_blink',['h1.png','h3.png','h4.png','h5.png','h4.png','h3.png','h1.png'],10,false);  
        this.blink_event = this.game.time.events.loop(Phaser.Timer.SECOND*4, this.spriteBlink, this);
        this.mom.animations.play('reachOutToBaby');
        
    },
    spriteBlink:function(){
        this.baby.animations.play('baby_blink');
        this.mom.animations.play('mom_blink');
    },
    update:function(){
        //	Do some nice funky main menu effect here
    },
        
    startGame:function(){
        //this.music.stop();
        console.log("not logged in, guest mode");
        DinoEggs.isLoggedIn = false;
        this.game.time.events.remove(this.blink_event);
        this.state.start('StageSelect');
        
    }, 
    
    initHighScore: function() {

		if (DinoEggs.HIGH_SCORE == null) {
			var str = window.localStorage.getItem('HighScore');
            console.log("init high score str from local storage" + str);
			try {
				DinoEggs.HIGH_SCORE = JSON.parse(str);
			} catch(e){
				DinoEggs.HIGH_SCORE = null;
			};
		};
	},
}