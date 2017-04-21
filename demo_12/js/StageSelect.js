// https://github.com/BdR76/phaserlevelselect

var DinoEggs = DinoEggs || {}; 


DinoEggs.StageSelect = function(){
    Phaser.State.call(this);
};

DinoEggs.StageSelect.prototype = Object.create(Phaser.State.prototype);
DinoEggs.StageSelect.prototype.constructor = DinoEggs.StageSelect;


DinoEggs.StageSelect.prototype = {

	preload: function() {
		this.game.load.image('grade4', 'assets/grade4.png');
        this.game.load.image('grade7', 'assets/grade7.png');	
	},

	create: function() {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
        this.game.add.text(200, 24,'Select your grade set', {font:"48px kalam"});
        
        //create stage icons
        var stageAIcon = this.game.add.sprite(this.game.world.width/6,this.game.height/3 , 'grade4');
        stageAIcon.Id = 1;
        stageAIcon.scale.setTo(0,0);
        var stageBIcon = this.game.add.sprite(this.game.world.width/2, this.game.height/3, 'grade7');
        stageBIcon.Id = 2;
        stageBIcon.scale.setTo(0,0);
        
        // input handler
        stageAIcon.inputEnabled = true;
        stageAIcon.events.onInputDown.add(this.onSpriteDown, this);
        stageAIcon.input.useHandCursor = true;
        
        stageBIcon.inputEnabled = true;
        stageBIcon.events.onInputDown.add(this.onSpriteDown, this);
        stageBIcon.input.useHandCursor = true;
        
        //animate icons
        this.game.add.tween(stageAIcon.scale).to({ x: 1,y:1}, 500,  Phaser.Easing.Bounce.Out,true);
        this.game.add.tween(stageBIcon.scale).to({ x: 1,y:1}, 500,  Phaser.Easing.Bounce.Out,true);
        
        $("div#gm-holder-div").css("visibility","hidden");
	},
    
    onSpriteDown: function(sprite, pointer){
        if(sprite.Id == 1){
            DinoEggs.stageNumber=1;
        }
        else if(sprite.Id == 2){
            DinoEggs.stageNumber=2;
        }
        else{
            DinoEggs.stageNumber=-1;
        }
        this.state.start('LevelSelect');
    },

	update: function() {
	}	
    
};