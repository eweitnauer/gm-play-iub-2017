// https://www.joshmorony.com/part-1-building-a-word-search-game-in-html5-with-phaser/

var DinoEggs = DinoEggs || {}; 

DinoEggs.Scoreboard = function(){
    Phaser.State.call(this);
};

DinoEggs.Scoreboard.prototype = Object.create(Phaser.State.prototype);
DinoEggs.Scoreboard.prototype.constructor = DinoEggs.Scoreboard;


DinoEggs.Scoreboard.prototype = {
    init: function(){
        //  The Google WebFont Loader will look for this object, so create it before loading the script.
        var ctx = this;
        WebFontConfig = {

            //  'active' means all requested fonts have finished loading
            //  We set a 1 second delay before calling 'createText'.
            //  For some reason if we don't the browser cannot render the text the first time it's created.
            active: function() { 
                ctx.game.time.events.add(Phaser.Timer.SECOND, ctx.createText, ctx); 
            },

            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
              families: ['Revalia']
            }

        };

    },

	preload: function() {
		this.game.load.image('prev', 'assets/arrows/prev.png');
        //  Load the Google WebFont Loader script
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	},
    createText :function(){
        var scoreboardTitle = this.game.add.text(this.game.width/2, this.game.height * 0.1,'Score Board', {fontSize:"60px"}); 
        scoreboardTitle.font = 'Revalia';
        scoreboardTitle.fontSize = 60;
        scoreboardTitle.anchor.setTo(0.5, 0.5);

        //  x0, y0 - x1, y1
        var grd = scoreboardTitle.context.createLinearGradient(0, 0, 0, scoreboardTitle.canvas.height);
        grd.addColorStop(0, '#EED600');   
        grd.addColorStop(1, '#FF4CB3');
        scoreboardTitle.fill = grd;

        scoreboardTitle.align = 'center';
        scoreboardTitle.stroke = '#000000';
        scoreboardTitle.strokeThickness = 2;
        scoreboardTitle.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    },

	create: function() {
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
        $("div#gm-holder-div").css("visibility","hidden");
                
        var str = window.localStorage.getItem('DinoGameScoreHistory');
        try { 
            this.data = JSON.parse(str);
        } catch(e){
            this.data = [];
            this.data[0] = {grade: "Grade",level : "Level", score : "Score"};
            this.data[1] = {grade: "-",level : "-", score : "-"};
        };
        
        if(this.data == null){
            this.data = [];
            this.data[0] = {grade: "Grade",level : "Level", score : "Score"};
            this.data[1] = {grade: "-",level : "-", score : "-"};
        }
        
        
        
        //This will hold all of the tile sprites
        this.tiles = this.game.add.group();
        
        this.tileWidth = 200;
        this.tileHeight = 50;
        
        //Keep a reference to the total grid width and height
        this.boardWidth =  3 * this.tileWidth;
        this.boardHeight = this.data.length * this.tileHeight;

        //We want to keep a buffer on the left and top so that the grid
        //can be centered
        this.leftBuffer = (this.game.width - this.boardWidth) / 2;
        this.topBuffer = (this.game.height - this.boardHeight) / 2;
 

        //Set up some initial tiles 
        this.initTiles();
        
        var prev = this.game.add.sprite(this.game.width,this.game.height-100, "prev");
        prev.anchor.setTo(0.5,0.5);
        // input handler
        prev.inputEnabled = true;
        prev.events.onInputDown.add(this.navListener, this);
        prev.input.useHandCursor = true;
        
        this.add.tween(prev).to({x: this.game.width/2, y: this.game.height-100}, 1000, Phaser.Easing.Exponential.Out, true);
 
	},
    initTiles: function(){

 
    //Loop through each column in the grid
    for(var i = 0; i < 3; i++){
        //console.log("Row : "+i);
 
        //Loop through each position in a specific column, starting from the top
        for(var j = 0; j < this.data.length ; j++){
 
            //Add the tile to the game at this grid position
            var tile = this.addTile(i, j);
        }
    }
 
    },
    addTile: function(x, y){
        //Choose a random tile to add
        var tileText = '';
        var tileColor = '#ecf4ad';
        if(y == 0){
            tileColor = '#cc3344';
        }

        if(x == 2){
            tileText = this.data[y]["score"];
        }else if(x == 1){
            tileText = this.data[y]["level"];
        }else if(x == 0){
            tileText = this.data[y]["grade"];
        }
        
        //var tileColor = '#ecf4ad';
        var tileToAdd = this.createTile(tileText, tileColor);   

        //Add the tile at the correct x position, but add it to the top of the game (so we can slide it in)
        var tt = this.leftBuffer + (x * this.tileWidth) + this.tileWidth / 2;
        //console.log("Tile created at : "+tt);
        var tile = this.tiles.create(this.leftBuffer + (x * this.tileWidth) + this.tileWidth / 2, 0, tileToAdd);
        var yy = this.topBuffer + (y*this.tileHeight+(this.tileHeight/2));
        //console.log("Tile will tween to : "+yy);

        //Animate the tile into the correct vertical position
        this.game.add.tween(tile).to({y:this.topBuffer + (y*this.tileHeight+(this.tileHeight/2))}, 500, Phaser.Easing.Linear.In, true)

        //Set the tiles anchor point to the center
        tile.anchor.setTo(0.5, 0.5);

        return tile;

},
    createTile: function(letter, color){
 
 
    var tile = this.game.add.bitmapData(this.tileWidth, this.tileHeight);
 
    tile.ctx.rect(5,7, this.tileWidth - 5, this.tileHeight - 5);
    tile.ctx.fillStyle = color;
    tile.ctx.fill();
 
    tile.ctx.font = '30px kalam';
    tile.ctx.textAlign = 'center';
    tile.ctx.textBaseline = 'middle';
    tile.ctx.fillStyle = '#000';
    tile.ctx.fillText(letter, this.tileWidth / 2, this.tileHeight / 2);
 
    return tile;
 
},
navListener: function(sprite, pointer){
    this.state.start('MainMenu');
},

update: function() {
}	
    
};