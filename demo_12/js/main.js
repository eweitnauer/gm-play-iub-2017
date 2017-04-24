// create unique namespace to avoid conflicts with libraries we might be using
var DinoEggs = DinoEggs || {}; // if objects exists use it, else create a new object

DinoEggs.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div');

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { /*DinoEggs.game.time.events.add(Phaser.Timer.SECOND, createText, this);*/ },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Revalia']
    }

};

DinoEggs.game.state.add('Boot',new DinoEggs.Boot());
DinoEggs.game.state.add('Preload',new DinoEggs.Preload());
DinoEggs.game.state.add('MainMenu',new DinoEggs.MainMenu());
DinoEggs.game.state.add('Scoreboard',new DinoEggs.Scoreboard());
DinoEggs.game.state.add('StageSelect', new DinoEggs.StageSelect());
DinoEggs.game.state.add('LevelSelect', new DinoEggs.LevelSelect());
DinoEggs.game.state.add('Game', new DinoEggs.Game());
DinoEggs.game.state.add('NextLevel', new DinoEggs.NextLevel());
DinoEggs.game.state.start('Boot');