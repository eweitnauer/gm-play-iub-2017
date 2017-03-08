/* your game’s welcome screen. 
After the preload state, all the game images are already loaded into the memory, so they can quickly accessed.*/
//scrolling background and some text.

var DinoEggs = DinoEggs || {}; 

DinoEggs.MainMenu = function(){
    "use strict";
    Phaser.State.call(this);
    
    this.music = null;
    this.startButton = null;
};
DinoEggs.MainMenu.prototype = Object.create(Phaser.State.prototype);
DinoEggs.MainMenu.prototype.constructor = DinoEggs.MainMenu;

DinoEggs.MainMenu.prototype = {
    create:function(){
        //TO-DO: add music
        //this.music = this.add.audio('titleMusic');
		//this.music.play();
        
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
        this.background.autoScroll(-20, 0);         //give it speed in x
        
        //start game text
        var text = "Welcome!";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
        t.anchor.set(0.5);
        
        //start button
        this.startButton = this.game.add.button(this.game.world.width*0.5, this.game.world.height*0.7, 'button', this.startGame, this, 1, 0, 2);
        this.startButton.anchor.set(0.5);
        
        //TODO: Display other options on menu
                

    },
    update:function(){
        //	Do some nice funky main menu effect here
    },
    startGame:function(){
        
        //this.music.stop();
        this.state.start('LevelSelect');
        
    } 
}