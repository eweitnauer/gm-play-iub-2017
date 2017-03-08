// create unique namespace to avoid conflicts with libraries we might be using
var DinoEggs = DinoEggs || {}; // if objects exists use it, else create a new object

DinoEggs.game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div');

DinoEggs.game.state.add('Boot',new DinoEggs.Boot());
DinoEggs.game.state.add('Preload',new DinoEggs.Preload());
DinoEggs.game.state.add('MainMenu',new DinoEggs.MainMenu());
DinoEggs.game.state.add('Game', new DinoEggs.Game());
DinoEggs.game.state.start('Boot');