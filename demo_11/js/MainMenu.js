/* your game’s welcome screen. 
After the preload state, all the game images are already loaded into the memory, so they can quickly accessed.*/
//scrolling background and some text.

var DinoEggs = DinoEggs || {}; 

DinoEggs.MainMenu = function(){
    "use strict";
    Phaser.State.call(this);
    
    this.music = null;
    this.startButton = null;
     DinoEggs.HIGH_SCORE = null;
    
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
        this.logo = this.game.add.sprite(this.game.world.width*0.5,this.game.world.height*0.7 - 300, 'logo');
        this.logo.anchor.set(0.5);
        
        //start game text
        var gameName = "Math Fun!";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width/2, this.logo.y + this.logo.height, gameName, style);
        t.anchor.set(0.5);
        
        //inite high score
        this.initHighScore;
        if (DinoEggs.HIGH_SCORE == null) {
            this.highScore = "welcome new players, create your high score"
        } else {
             this.highScore = "highest score is " + DinoEggs.HIGH_SCORE;
        }
       
        var highScoreText = this.game.add.text(this.game.width/2, this.logo.y + this.logo.height + 100, this.highScore, style);
        highScoreText.anchor.set(0.5);
        console.log(this.highScore + "++++" );
        
        //start button
        this.startButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.7, 'button', this.startGame, this, 1, 0, 2);
        this.startButton.anchor.set(0.5);
        
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
        var blink_event = this.game.time.events.loop(Phaser.Timer.SECOND*4, this.spriteBlink, this);
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
        this.game.time.events.remove(blink_event);
        this.state.start('StageSelect');
        
    }, 
    
    initHighScore: function() {

		if (!DinoEggs.HIGH_SCORE) {
			var str = window.localStorage.getItem('HighScore');
			try {
				DinoEggs.HIGH_SCORE = JSON.parse(str);
			} catch(e){
				DinoEggs.HIGH_SCORE = null;
			};
		};
	},
}