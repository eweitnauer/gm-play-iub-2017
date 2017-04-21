// https://github.com/BdR76/phaserlevelselect

var DinoEggs = DinoEggs || {}; 


DinoEggs.LevelSelect = function(){
    Phaser.State.call(this);
    
    DinoEggs.PLAYER_DATA = null;
	this.levelIcons = [];
};

DinoEggs.LevelSelect.prototype = Object.create(Phaser.State.prototype);
DinoEggs.LevelSelect.prototype.constructor = DinoEggs.LevelSelect;


DinoEggs.LevelSelect.prototype = {

	preload: function() {
        //this.game.load.spritesheet('levelselecticons', 'assets/levelselecticons.png', 96, 96);
		this.game.load.spritesheet('levelIcons', 'assets/levelIcons/level_icons.png', 73.83, 82);
        this.game.load.image('prev', 'assets/arrows/prev.png');
		this.initLevelData();
	},

	create: function() {
        
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
		//this.game.stage.backgroundColor = 0x80a0ff;
        this.game.add.text(256, 24,'Select a level', {font:"48px kalam"});

		this.createLevelIcons();
		this.animateLevelIcons();
        
        document.getElementById("eq-match-div").style.display="block";
        document.getElementById("eq-solve-div").style.display="none";
        
        this.selectedLevel = -1;
        
        //-----------------------------------
        /*optionsGroup = this.game.add.group();
		optionsGroup.x = this.game.width*0.5;
		optionsGroup.y = this.game.height*0.5;
        optionsGroup.setAll('anchor.x', 0.5);
	    optionsGroup.setAll('anchor.y', 0.5);
		optionsGroup.scale.setTo(0,0);
        optionsBg = this.game.add.sprite(0,0, "options");
		optionsBg.anchor.setTo(0.5,0.5);
        	
		msg = this.game.add.text(optionsBg.x-150, optionsBg.y+50,'Choose an option', { fontSize: '25px', fill: '#000' });
		
		tutorial = this.game.add.sprite(optionsBg.x-150,msg.y+20, "tutorial");
        tutorial.scale.setTo(0.7,0.7);     
        tutorial.alpha = 0.8;
		tutorial.inputEnabled = true;
		tutorial.events.onInputDown.add(this.tut_listener,this);
        tutorial.events.onInputOver.add(this.over, this);
	    tutorial.events.onInputOut.add(this.out, this);
		
		play = this.game.add.sprite(optionsBg.x+50,msg.y+20, "play");
        play.scale.setTo(0.7,0.7);     
        play.alpha = 0.8;
		play.inputEnabled = true;
		play.events.onInputDown.add(this.play_listener,this);
        play.events.onInputOver.add(this.over, this);
	    play.events.onInputOut.add(this.out, this);
        
        exit = this.game.add.sprite(optionsBg.x-200,optionsBg.y+10, "exit");
        exit.scale.setTo(0.7,0.7);        
		exit.inputEnabled = true;
        exit.events.onInputDown.add(this.exit_listener,this);
        exit.alpha = 0.8;
        exit.events.onInputOver.add(this.over, this);
	    exit.events.onInputOut.add(this.out, this);
        
        optionsGroup.add(optionsBg);
        optionsGroup.add(msg);
        optionsGroup.add(tutorial);
        optionsGroup.add(play);
        optionsGroup.add(exit);*/
        //---------------------------------------------
        var prev = this.game.add.sprite(this.game.width/2,this.game.height-100, "prev");
        prev.anchor.setTo(0.5,0.5);
        // input handler
        prev.inputEnabled = true;
        prev.events.onInputDown.add(this.navListener, this);
        prev.input.useHandCursor = true;
        
        $("div#gm-holder-div").css("visibility","hidden");
	},

	update: function() {
	},
	
	initLevelData: function() {

		if (!DinoEggs.PLAYER_DATA) {
			var str = window.localStorage.getItem('DinoGameProgress');
			try {
				DinoEggs.PLAYER_DATA = JSON.parse(str);
			} catch(e){
				DinoEggs.PLAYER_DATA = [[],[]];
			};
			if (Object.prototype.toString.call( DinoEggs.PLAYER_DATA ) !== '[object Array]' ) {
				DinoEggs.PLAYER_DATA = [[],[]];
			};
		};
	},

	createLevelIcons: function() {
		var levelNumber = 0;

		for (var y=0; y < 3; y++) {
			for (var x=0; x < 4; x++) {
                
                //Limits to 10 level icons
                if(x == 2 && y == 2){
                    break;
                }
				// next level
				levelNumber = levelNumber + 1;
				
				// check if array not yet initialised
				if (typeof DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][levelNumber-1] !== 'number') {
					if (levelNumber == 1) {
						DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][levelNumber-1] = 0; // level 1 should never be locked
					} else {
						DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][levelNumber-1] = -1;
					};
				};

				// player progress info for this level
				var playdata = DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][levelNumber-1];

				// decide which icon
				var isLocked = true; // locked
				var stars = 0; // no stars
				
				// check if level is unlocked
				if (playdata > -1) {
					isLocked = false; // unlocked
					if (playdata < 4) {stars = playdata;}; // 0 to 3 stars
				};

				// calculate position on screen
				var xpos = 160 + (x*128);
				var ypos = 120 + (y*128);
				
				// create icon
				this.levelIcons[levelNumber-1] = this.createLevelIcon(xpos, ypos, levelNumber, isLocked, stars);
				var backicon = this.levelIcons[levelNumber-1].getAt(0);

				// keep levelNumber, used in onclick method
				backicon.health = levelNumber;

				// input handler
				backicon.inputEnabled = true;
				backicon.events.onInputDown.add(this.onSpriteDown, this);
                backicon.input.useHandCursor = true;
			};
		};
	},

	// -------------------------------------
	// Add level icon buttons
	// -------------------------------------
	createLevelIcon: function(xpos, ypos, levelNumber, isLocked, stars) {

		// create new group
		var IconGroup = this.game.add.group();
		IconGroup.x = xpos;
		IconGroup.y = ypos;

		// keep original position, for restoring after certain tweens
		IconGroup.xOrg = xpos;
		IconGroup.yOrg = ypos;

		// determine background frame
		var frame = 5;
		if (isLocked == false) {frame = 4};
		
		// add background
		var icon1 = this.game.add.sprite(0, 0, 'levelIcons', frame);
		IconGroup.add(icon1);

		// add stars, if needed
		if (isLocked == false) {
            var txt = this.game.add.text(24, 16,''+levelNumber, {font:"45px Arial"});
			var icon2 = this.game.add.sprite(0, 0, 'levelIcons', (3 -stars));
			
			IconGroup.add(txt);
			IconGroup.add(icon2);
		};
		
		return IconGroup;
	},

	onSpriteDown: function(sprite, pointer) {

		// retrieve the iconlevel
		var levelNumber = sprite.health;

		if (DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][levelNumber-1] < 0) {
			// indicate it's locked by shaking left/right
			var IconGroup = this.levelIcons[levelNumber-1];
			var xpos = IconGroup.xOrg;

			var tween = this.game.add.tween(IconGroup)
				.to({ x: xpos+6 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos-5 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos+4 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos-3 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos+2 }, 20, Phaser.Easing.Linear.None)
				.to({ x: xpos }, 20, Phaser.Easing.Linear.None)
				.start();
		} else {
			// simulate button press animation to indicate selection
			var IconGroup = this.levelIcons[levelNumber-1];
			var tween = this.game.add.tween(IconGroup.scale)
				.to({ x: 0.9, y: 0.9}, 100, Phaser.Easing.Linear.None)
				.to({ x: 1.0, y: 1.0}, 100, Phaser.Easing.Linear.None)
				.start();
				
			// it's a little tricky to pass selected levelNumber to callback function, but this works:
			tween.onComplete.add(function(){this.onLevelSelected(sprite.health);}, this);
		};
	},
    navListener: function(sprite, pointer){
        this.state.start('StageSelect');
    },

	animateLevelIcons: function() {

		// slide all icons into screen
		for (var i=0; i < this.levelIcons.length; i++) {
			// get variables
			var IconGroup = this.levelIcons[i];
			IconGroup.y = IconGroup.y + 600;
			var y = IconGroup.y;

			// tween animation
			this.game.add.tween(IconGroup).to( {y: y-600}, 500, Phaser.Easing.Back.Out, true, (i*40));
		};
	},

	onLevelSelected: function(levelNumber) {
        //this.game.add.tween(optionsGroup.scale).to({ x: 1,y:1}, 500,  Phaser.Easing.Bounce.Out,true);
        this.selectedLevel=levelNumber;
        
        DinoEggs._selectedLevel = this.selectedLevel;
        this.state.start('Game');
	},
    tut_listener: function(){
          $('#tutorialModal').modal({
                        backdrop: 'static',
                        keyboard: false
        });
        $('#tutorialModal').modal('show');
        $('#tFrame').contents().find('.levelTutorial').hide()
        $('#tFrame').contents().find("#"+this.selectedLevel).show();
        document.getElementById("tFrame").contentWindow.g_done_count = 0;
        console.log("done count ", document.getElementById("tFrame").contentWindow.g_done_count);

    },
    
//    play_listener: function(){
//        DinoEggs._selectedLevel = this.selectedLevel;
//        this.state.start('Game');
//        /*
//        switch(this.selectedLevel){
//            case 1: this.state.start('Level1'); break;
//            case 2: this.state.start('Level2'); break;
//            case 3: this.state.start('Game'); break;
//        }*/
//    },
    
    exit_listener: function(){
        this.game.add.tween(optionsGroup.scale).to({ x: 0,y:0}, 500,  Phaser.Easing.Bounce.Out,true);
    },
    over: function(item) {
			item.alpha=1;
    },
    out: function(item) {
            item.alpha=0.8;
    }
    
};