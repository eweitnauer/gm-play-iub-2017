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
        this.initHighScore();
        console.log("high score is " + DinoEggs.HIGH_SCORE);
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
      
        document.getElementById("eq-match-div").style.display="block";
        document.getElementById("eq-solve-div").style.display="none";
                

    },
    update:function(){
        //	Do some nice funky main menu effect here
    },
    startGame:function(){
        
        //this.music.stop();
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