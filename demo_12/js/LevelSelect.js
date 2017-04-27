// https://github.com/BdR76/phaserlevelselect

var DinoEggs = DinoEggs || {}; 


DinoEggs.LevelSelect = function(){
    Phaser.State.call(this);
    
    //DinoEggs.PLAYER_DATA = null;
	this.levelIcons = [];
};

DinoEggs.LevelSelect.prototype = Object.create(Phaser.State.prototype);
DinoEggs.LevelSelect.prototype.constructor = DinoEggs.LevelSelect;


DinoEggs.LevelSelect.prototype = {

	preload: function() {
        //this.game.load.spritesheet('levelselecticons', 'assets/levelselecticons.png', 96, 96);
		this.game.load.spritesheet('levelIcons', 'assets/levelIcons/level_icons.png', 73.83, 82);
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
        var prev = this.game.add.sprite(this.game.width,this.game.height-100, "prev");
        prev.anchor.setTo(0.5,0.5);
        // input handler
        prev.inputEnabled = true;
        prev.events.onInputDown.add(this.navListener, this);
        prev.input.useHandCursor = true;
        
        this.add.tween(prev).to({x: this.game.width/2, y: this.game.height-100}, 1000, Phaser.Easing.Exponential.Out, true);
        
        $("div#gm-holder-div").css("visibility","hidden");
	},

	update: function() {
	},
	
	initLevelData: function() {

		//if (!DinoEggs.PLAYER_DATA) {
            
            var valueForPlayerData = null;
            //check for loggedin user
            if(DinoEggs.UserMode && isLoggedIn()){
                //console.log("Level Select user mode");
                var LSPlayData = window.localStorage.getItem('LoggedInUserProgress');
                JSON.parse(LSPlayData, (key, value) => {
                  if(key==="level_1_stars")
                    valueForPlayerData = JSON.parse(value);
                });
            }
            //guest
            else{
                var str = window.localStorage.getItem('DinoGameProgress');
                valueForPlayerData = JSON.parse(str);
            }
            
            try {
                DinoEggs.PLAYER_DATA = valueForPlayerData;
            } catch(e){
                DinoEggs.PLAYER_DATA = [[],[]];
            };
            if (Object.prototype.toString.call( DinoEggs.PLAYER_DATA ) !== '[object Array]' ) {
                DinoEggs.PLAYER_DATA = [[],[]];
            };
		//};
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
                playdata = DinoEggs.PLAYER_DATA[DinoEggs.stageNumber-1][levelNumber-1];
                
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
        //console.log("done count ", document.getElementById("tFrame").contentWindow.g_done_count);

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