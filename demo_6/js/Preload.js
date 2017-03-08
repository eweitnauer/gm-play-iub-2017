/*load game assets(images, spritesheets, audio, textures, etc) and 
    setup loading screen ->bar from 0 to 4 as files are being loaded*/

var DinoEggs = DinoEggs || {}; 

DinoEggs.Preload = function(){
    "use strict";
    Phaser.State.call(this);
    
    this.preloadBar = null;
};
DinoEggs.Preload.prototype = Object.create(Phaser.State.prototype);
DinoEggs.Preload.prototype.constructor = DinoEggs.Preload;

DinoEggs.Preload.prototype = {
    preload:function(){
        //TO DO: show logo in loading screen
        //setting up preload bar
        this.preloadBar = this.add.sprite(this.game.world.centerX,this.game.world.centerY,'preloadBar');
        this.preloadBar.anchor.setTo(0.5,0.5);
        this.time.advancedTiming = true; // better way of handling game time: Needs review
        
        //make a sprite into a loading bar.
        this.load.setPreloadSprite(this.preloadBar);
        
        //load all game assets
        this.load.image('rock', 'assets/rock.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('fragment', 'assets/star.png');    
        this.load.atlasJSONHash('egg', 'assets/eggSpritesheet.png','assets/eggSpritesheet.json');
        this.load.spritesheet('hatchling', 'assets/hatchling_run.png', 139, 89);
        this.load.image('star', 'assets/star.png');
        this.load.atlasJSONHash('dino', 'assets/dino.png','assets/dino.json');
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('button', 'assets/button.png', 120, 40);

        //background music
        this.load.audio('bg_music',['assets/bg_music.mp3']);
        this.load.image('restart', 'assets/restart.png');
        this.load.image('menu', 'assets/main_menu.png');
        this.load.image('board', 'assets/game_board.png');

        

        this.load.image('nextlevel', 'assets/nextlevel.png');
        //celebration particles
        this.load.image('jewel_red', 'assets/particles/jewel_red.png');
        this.load.image('jewel_purple', 'assets/particles/jewel_purple.png');
        this.load.image('jewel_white', 'assets/particles/jewel_white.png');
        this.load.image('jewel_green', 'assets/particles/jewel_green.png');
        this.load.image('jewel_yellow', 'assets/particles/jewel_yellow.png');
       
    },
    create:function(){
        this.state.start('Level1');
    }
}

