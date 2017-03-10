// https://github.com/BdR76/phaserlevelselect

var DinoEggs = DinoEggs || {}; 


DinoEggs.LevelSelect = function(){
    "use strict";
    Phaser.State.call(this);
    
    DinoEggs.PLAYER_DATA = null;
	this.levelIcons = [];
};

DinoEggs.LevelSelect.prototype = Object.create(Phaser.State.prototype);
DinoEggs.LevelSelect.prototype.constructor = DinoEggs.LevelSelect;


DinoEggs.LevelSelect.prototype = {

	preload: function() {
        //this.game.load.spritesheet('levelselecticons', 'assets/levelselecticons.png', 96, 96);
		this.game.load.spritesheet('levelIcons', 'assets/level_icons.png', 73.83, 82);		
		this.initLevelData();
	},

	create: function() {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
		//this.game.stage.backgroundColor = 0x80a0ff;
        this.game.add.text(256, 24,'Select a level', {font:"48px Arial"});

		this.createLevelIcons();
		this.animateLevelIcons();
        
        document.getElementById("eq-match-div").style.display="block";
        document.getElementById("eq-solve-div").style.display="none";
	},

	update: function() {
	},
	
	initLevelData: function() {

		if (!DinoEggs.PLAYER_DATA) {
			var str = window.localStorage.getItem('DinoGame_Progress');
			try {
				DinoEggs.PLAYER_DATA = JSON.parse(str);
			} catch(e){
				DinoEggs.PLAYER_DATA = [];
			};
			if (Object.prototype.toString.call( DinoEggs.PLAYER_DATA ) !== '[object Array]' ) {
				DinoEggs.PLAYER_DATA = [];
			};
		};
	},

	createLevelIcons: function() {
		var levelNumber = 0;

		for (var y=0; y < 3; y++) {
			for (var x=0; x < 4; x++) {
				// next level
				levelNumber = levelNumber + 1;
				
				// check if array not yet initialised
				if (typeof DinoEggs.PLAYER_DATA[levelNumber-1] !== 'number') {
					if (levelNumber == 1) {
						DinoEggs.PLAYER_DATA[levelNumber-1] = 0; // level 1 should never be locked
					} else {
						DinoEggs.PLAYER_DATA[levelNumber-1] = -1;
					};
				};

				// player progress info for this level
				var playdata = DinoEggs.PLAYER_DATA[levelNumber-1];

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
		var frame = 0;
		if (isLocked == false) {frame = 1};
		
		// add background
		var icon1 = this.game.add.sprite(0, 0, 'levelIcons', frame);
		IconGroup.add(icon1);

		// add stars, if needed
		if (isLocked == false) {
            var txt = this.game.add.text(24, 16,''+levelNumber, {font:"45px Arial"});
			var icon2 = this.game.add.sprite(0, 0, 'levelIcons', (2+stars));
			
			IconGroup.add(txt);
			IconGroup.add(icon2);
		};
		
		return IconGroup;
	},

	onSpriteDown: function(sprite, pointer) {

		// retrieve the iconlevel
		var levelNumber = sprite.health;

		if (DinoEggs.PLAYER_DATA[levelNumber-1] < 0) {
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
		// pass levelNumber variable to 'Game' state
		//this.game.state.states['game']._levelNumber = levelNumber;
        console.log(levelNumber);
        console.log("player data");
        console.log(DinoEggs.PLAYER_DATA);
		switch(levelNumber){
            case 1: this.state.start('Level1'); break;
            case 2: this.state.start('Game'); break;                
        }
	}
};