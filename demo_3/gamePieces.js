function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var iteration = 0;
var isGameStarted = false;
var _y = 150; 
var g_timeout = 200;
var g_eggs = [];  // global array to hold all eggs
var g_rocks = [];	// global array to hold all rocks -- for future use, not required at present

var g_levelNum = new RegExp('[\?&]lvl=([^]*)').exec(window.location.href);
var g_dinoPos = [];

var g_curr_pos = 0;//holds dino's current position = i in g_dino_pos[i]
var current_rock_id = null;


var g_dino = null;
if (g_levelNum == null){
	g_levelNum = 1;
}


// The Canvas holder
var myGameArea = {
canvas : document.createElement("canvas"),
start  : function() {
	this.canvas.width = 960;
	this.canvas.height = 540;
	this.context = this.canvas.getContext("2d");
	//document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	$("#dvGame").append(this.canvas);

	// Add event listener for `click` events.
	this.canvas.addEventListener('click', function(event) {
		var x_clicked =  event.pageX - document.getElementById("dvGame").getBoundingClientRect().left - this.offsetLeft;
		var y_clicked = event.pageY - this.offsetTop;
		
		// Collision detection between clicked offset and element.
		console.log("check each rock");
		
		//g_rocks.forEach(function(rock) {
		for(var i = 0;i < g_rocks.length; i++){
			var rock = g_rocks[i];
			console.log(event.pageX,event.pageY);
			console.log(x_clicked,y_clicked);
			console.log(rock.x,rock.x + rock.width,rock.y,rock.y + rock.height);
			
			if (y_clicked > rock.y && y_clicked < rock.y + rock.height 
				&& x_clicked > rock.x && x_clicked < rock.x + rock.width) {
					
				//What does this mean ? Is this for loading the selected rock expression on Canvas ?
				createNewExpression(rock);
				current_rock_id = i;
			}
		}//); 

		
		//Are we creating the expression even if user has not selected any rock ?
		//Can the rock ever be null ?
		canvas.model.createElement('derivation', { eq: rock, pos: { x: 'center', y: 50 }});

	 }, false);

	 
	//I hope the interval is for the complete game ? Not each rock selection?
	this.interval = setInterval(updateGameArea, 150);
	},
clear : function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

//main game loop
function updateGameArea() {
	
	if(g_controlButtonState == -1){
		return;
	}
		
	//clear context every time before painting the changes
	myGameArea.clear();
	
	//Display eggs
	g_eggs.forEach(function(_egg){
		_egg.paint();
	});

    //Display rocks
	if(g_controlButtonState == 1){
		g_rocks.forEach(function(_rock,i){
			if(i!=current_rock_id){
				_rock.y += 2.5;
			}
			_rock.update();
			_rock.hitBottom();
		});
    }
	
	
	if(g_dinoPos){
		g_dinoPos.forEach(function(_dinoPosition){
			_dinoPosition.placeOnCanvas();
		});
    }

	g_dino.paint();
	if(g_dino.hasSavedEgg == false /*&& condition needed for equation solved*/)
	{  //dino hasnt saved eggs yet and equation is solved
		g_dino.move();               
	}
}


function rock(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.equation = generateRandomExp();    
	ctx = myGameArea.context;
	ctx.fillStyle = color;

	this.update = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.font = "20px Arial";
		ctx.fillStyle = "black";
		
		//Need to check the args in this
		ctx.fillText(this.equation,this.x + 20,this.y + 20);
	}
	var egg_broke = false;
	var rockbottom = myGameArea.canvas.height - this.height;//commented? shree
	this.hitBottom = function() {
		var rockbottom = myGameArea.canvas.height - this.height;
		if (this.y > rockbottom) {
			this.y = rockbottom;
			var xPosition = this.x;
			for(var i = 0; i < g_eggs.length; i++){
				if(g_eggs[i].x == xPosition){
					g_eggs.splice(i, 1);
					egg_broke = true;
					console.log(g_eggs);
				}
			}
			if(egg_broke)
			{
				addSound('beep2.mp3');
				egg_broke = false;
			}  
			//this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}
	}
}

function addSound(sound_file){
	var win = new Audio(sound_file);
	win.play();
}

function dino() {
	this.width = 40;
	this.height = 40;
	if(g_dinoPos){
		var _dinoPos = g_dinoPos[0];
		if(_dinoPos){
			this.x = _dinoPos.x;
			this.y = _dinoPos.y;
		}
	}

	this.paint = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}			

	this.move = function(newX, newY){
		ctx = myGameArea.context;
		ctx.fillStyle = "red";
		
		/*if(g_curr_pos >= g_dinoPos.length)
			return null;*/
		g_curr_pos++;
		if(g_curr_pos < g_dinoPos.length){
			var nextPosXY = g_dinoPos[g_curr_pos];
			if(nextPosXY){
				this.x= nextPosXY.x;
				this.y= nextPosXY.y;
			}
		}
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	
	this.hasSavedEgg = function(){

		//if dino is at the last position, level complete
		if(g_curr_pos==g_dinoPos.length-1){
			if(this.x == g_curr_pos.x && this.y == g_curr_pos.y){
				console.log("saved egg!");
				return true;
			}
		}
		return false;
	}
}


function egg(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;    
	ctx = myGameArea.context;
	ctx.fillStyle = color;

	this.paint = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
}

//function used only for testing, to be deleted before release
function testMoveDino(){
	if(g_dino){
		g_dino.move();
	}
}

//An object to store x y coordinates {X, Y}
function dinoPosition(_x, _y) {
	this.x = _x;
	this.y = _y;    
	this.width = 20;
	this.height = 20;

	this.placeOnCanvas = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = "Purple";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

// funtion to be used during game board setup
function InitDinoPositions(numLoc){
	var gameDim = myGameArea.canvas.getBoundingClientRect();
	var limitTop = (gameDim.bottom-gameDim.top) - (gameDim.bottom-gameDim.top)/2;
	var limitLeft = (gameDim.right-gameDim.left) - (gameDim.right-gameDim.left)/3;

	for(var i=0; i<numLoc; i++){
		var _pos = new dinoPosition(getRandomRange(limitLeft, gameDim.right), getRandomRange(limitTop, gameDim.bottom));
		_pos.placeOnCanvas();
		g_dinoPos.push(_pos);
	}
}

function CreateEggs(numEggs){
	var colors = ["red", "green", "blue"];
	var w = 100, h = 50, x = 50, y = 490;
	for(var i=0; i<numEggs; i++){
		var _egg = new egg(w, h, colors[i%numEggs], x, y);
		x = x+200;
		g_eggs.push(_egg);
	}
}

function AddRock(rockType, _x, _y){
	var w = 100, h = 50, c = "";
	switch(rockType){
		case "normal": c = "gray"; break;
		case "urgent": c = "red"; break;
	}

	var _rock = new rock(w,h,c,_x,_y);//width, height, color, x and y coordinates
	g_rocks.push(_rock);
	//alert(g_rocks);
}

function CreateRocks(numRocks){
	var _y = 200, _x = 50;
	for(var i=0; i<numRocks; i++){
		AddRock("normal",_x, _y + (i * 50));
		_x = _x+200;
	}
}

function startGame() {
	var _mins = $("#minutesText").val;
	var _scs = $("#secondsText").val;
	
		
	if(_mins||_scs){
		totalScore = 0;
		eqList = new Array();
	
		myGameArea.start();
			
		//reset game board and clear variables
		g_eggs = [];
		g_rocks = [];

		//setup board
		CreateEggs(3);
		CreateRocks(g_levelNum+2);
		InitDinoPositions(g_levelNum+10);
		g_dino = new dino();
	}


	
}
