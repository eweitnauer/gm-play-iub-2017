var iteration = 0;
var isGameStarted = false;
var _y = 150;
var g_timeout = 200;
var g_eggs = [];  // global array to hold all eggs
var g_rocks = [];	// global array to hold all rocks

var g_levelNum = new RegExp('[\?&]lvl=([^]*)').exec(window.location.href);
var g_dinoPos = [];

var g_curr_pos = 0;//holds dino's current position = i in g_dino_pos[i]
var current_rock_id = null;

//Solution for match expression (Level 1)
var g_matchExprSolution = g_problems[0][0];
var g_parsedExprSolution = g_matchExprSolution.replace(/\*/g, "");

var g_dino = null;

const HAPPY = 0;
const CRYING = 1;
const HATCHING = 2;
const RUNNING = 3;

if (g_levelNum == null){
	g_levelNum = 1;
}

// random range generator
function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
	this.interval = setInterval(updateGameArea, 300);
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
	console.log("main loop");
	//game over conditions
	if(g_eggs.length>0){
		if(g_rocks.length==0){
			totalScore += g_eggs.length;
			totalScore += minutes*60 + seconds;
			g_hasPlayerWon = true;
		}
		else{
			g_hasPlayerWon = false;//game in progress
		}
	}
	else{
		if(g_rocks.length>0){
			totalScore += g_rocks.length;
			totalScore += minutes*60 + seconds;
		}
		else{
			totalScore += minutes*60 + seconds;
		}
		g_hasPlayerWon = true;		
	}
	
	//display message that the player has won
	if(g_hasPlayerWon==true){
		//alert("won");
		addSound('sounds/winningMusic.mp3');
		finishText = "Good job !!! You solved "+eqList.length+" equations in 15 seconds.<br />";
		for(var i = 0 ; i < eqList.length ; i++){
			finishText += eqList[i] + "<br />";
		}
		minutes=0;
		seconds=0;
		g_rocks = [];
		//g_eggs = [];
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
			_rock.hitEgg();
			_rock.update();

		});
    }


	/*if(g_dinoPos){
		g_dinoPos.forEach(function(_dinoPosition){
			_dinoPosition.placeOnCanvas();
		});
    }*/

	g_dino.paint();
	/*if(g_dino.hasSavedEgg == false) // && condition needed for equation solved
	{  //dino hasnt saved eggs yet and equation is solved
		g_dino.move();
	}*/



	//This code shows the expression to match on Canvas.
	/*myGameArea.context.font = "20px Arial";
	myGameArea.context.fillStyle = "black";

	//Need to check the args in this
	myGameArea.context.fillText(g_parsedExprSolution, 600,400);*/
}


function rock(width, height, color, x, y, rockID) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.rockID = rockID;
	this.img = new Image();
	this.img.src = "images/rock.png";

	//Below line is used for getting linear equations on rock of form ax +b = c
	//this.equation = generateRandomExp();

    //function for supporting match expression on rock
	//Enhance this to choose correct expressions for higher levels by refactoring
    var indexToChoose = getRandomRange(1, g_problems[0].length - 1);
	this.equation =  g_problems[0][indexToChoose];
	this.parsedEquation = this.equation.replace(/\*/g, "");

	ctx = myGameArea.context;
	ctx.fillStyle = color;

	this.update = function(){
		ctx = myGameArea.context;
		//ctx.fillStyle = color;
		//ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.drawImage(this.img, this.x, this.y, this.width,this.height);
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(this.parsedEquation,this.x + 20,this.y + 20);
	}
	var eggWiggle = false;
	var rockbottom = myGameArea.canvas.height - this.height;//commented? shree

	//function to check whether the rock collided with an egg
	this.hitEgg = function() {
		var rockbottom = myGameArea.canvas.height - 100;

		if (this.y + this.height > rockbottom) {
			//this.y = rockbottom;
			var xPosition = this.x;
			for(var i = 0; i < g_eggs.length; i++){
				if(g_eggs[i].x == xPosition){
					//g_eggs.splice(i, 1);
					eggWiggle = true;
					g_eggs[i].animMode = CRYING;
					//console.log(g_eggs);
				}
			}
			if(eggWiggle)
			{
				addSound('sounds/eggScreamMusic.mp3');
				eggWiggle = false;

				//remove the rock which touched ground
				var indexToRemove = g_rocks.indexOf(this);
				console.log(indexToRemove);
				g_rocks.splice(indexToRemove, 1);
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
	this.width = 340;
	this.height = 250;
	this.x = 600;
	this.y = 300;

	//Remove below code after checking with Harsha
	/*if(g_dinoPos){
		var _dinoPos = g_dinoPos[0];
		if(_dinoPos){
			this.x = _dinoPos.x;
			this.y = _dinoPos.y;
		}
	}*/

	this.img = new Image();
	this.img.src = "images/placardDino.png";

	this.paint = function(){
		ctx = myGameArea.context;
		ctx.drawImage(this.img, this.x, this.y, this.width,this.height);
		ctx.font = "20px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(g_parsedExprSolution,this.x + 20,this.y + 75);
	}

	/*this.move = function(newX, newY){
		ctx = myGameArea.context;
		ctx.fillStyle = "red";*/

		/*if(g_curr_pos >= g_dinoPos.length)
			return null;*/
		/*g_curr_pos++;
		if(g_curr_pos < g_dinoPos.length){
			var nextPosXY = g_dinoPos[g_curr_pos];
			if(nextPosXY){
				this.x= nextPosXY.x;
				this.y= nextPosXY.y;
			}
		}
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}*/


	/*this.hasSavedEgg = function(){

		//if dino is at the last position, level complete
		if(g_curr_pos==g_dinoPos.length-1){
			if(this.x == g_curr_pos.x && this.y == g_curr_pos.y){
				console.log("saved egg!");
				return true;
			}
		}
		return false;
	}*/
}


function egg(width, height, color, x, y) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.img = new Image();
	this.img.src = "images/happy.png";
	this.frames = 8;
	ctx = myGameArea.context;
	ctx.fillStyle = color;

	this.animMode = HAPPY;
	this.eggAnimCounter =0; // rate of change in this variable in the paint method decides speed of animation
	
	this.paint = function(){
		ctx = myGameArea.context;

		if(this.animMode===HAPPY){
			this.img.src = "images/happy.png";
			ctx.drawImage(this.img,this.x, this.y, this.width,this.height);
		}
		else if (this.animMode ===CRYING){
			this.img.src = "images/cry.png";
			this.eggAnimCounter++;
			var egg_crying_mod = Math.floor(this.eggAnimCounter)%this.frames;
			console.log(egg_crying_mod);
			if (egg_crying_mod >= 5){ // after certain time change mode back to happy
				this.eggAnimCounter=0;
				this.animMode=HAPPY;
			}
			ctx.drawImage(this.img,this.x, this.y, this.width,this.height);
		}
		else if(this.animMode===HATCHING){
			this.img.src = "images/egg_spritesheet.png";
			var frameWidth = this.img.width/8;//8 images in the egg spritesheet
			var frameHeight = this.img.height;

			this.eggAnimCounter++;
			var egg_cracking_mod = Math.floor(this.eggAnimCounter)%this.frames;//egg spritesheet frames: 0,1,2,3,4,5,6,7;
			if (egg_cracking_mod >= 7){// after certain time change mode back to running
				this.eggAnimCounter=0;
				this.animMode=RUNNING;
			}
			ctx.drawImage(this.img,egg_cracking_mod*frameWidth,0,frameWidth,frameHeight, this.x, this.y, this.width,this.height);
		}
		else if(this.animMode===RUNNING){
			this.img.src="images/hatchling_run.png";
			var frameWidth = this.img.width/12;//8 images in the spritesheet
			var frameHeight = this.img.height;
			this.frames = 12;
			this.x+=20;

			this.eggAnimCounter++;
			var egg_cracking_mod = Math.floor(this.eggAnimCounter)%this.frames;//1,2,3,4,5,6,7;
			ctx.drawImage(this.img,egg_cracking_mod*frameWidth,0,frameWidth,frameHeight, this.x, this.y+10, this.width,this.height-10);//shift running sprite 10px down
		}

		//ctx.drawImage(this.img, this.x, this.y, this.width,this.height);
	};
}

//function used only for testing, to be deleted before release
/*function testMoveDino(){
	if(g_dino){
		g_dino.move();
	}
}*/

//An object to store x y coordinates {X, Y}
/*function dinoPosition(_x, _y) {
	this.x = _x;
	this.y = _y;
	this.width = 20;
	this.height = 20;

	this.placeOnCanvas = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = "Purple";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}*/

// funtion to be used during game board setup
/*function InitDinoPositions(numLoc){
	var gameDim = myGameArea.canvas.getBoundingClientRect();
	var limitTop = (gameDim.bottom-gameDim.top) - (gameDim.bottom-gameDim.top)/2;
	var limitLeft = (gameDim.right-gameDim.left) - (gameDim.right-gameDim.left)/3;

	for(var i=0; i<numLoc; i++){
		var _pos = new dinoPosition(getRandomRange(limitLeft, gameDim.right), getRandomRange(limitTop, gameDim.bottom));
		_pos.placeOnCanvas();
		g_dinoPos.push(_pos);
	}
}*/

function CreateEggs(numEggs){
	var colors = ["red", "green", "blue"];
	var w = 60, h = 100, x = 50, y = 440;
	for(var i=0; i<numEggs; i++){
		var _egg = new egg(w, h, colors[i%numEggs], x, y);
		x = x+200;
		g_eggs.push(_egg);
	}
}

function AddRock(rockType, _x, _y, rockID){
	var w = 100, h = 50, c = "";
	switch(rockType){
		case "normal": c = "gray"; break;
		case "urgent": c = "red"; break;
	}

	var _rock = new rock(w,h,c,_x,_y, rockID);//width, height, color, x and y coordinates
	g_rocks.push(_rock);
	//alert(g_rocks);
}

function CreateRocks(numRocks){
	var _y = 200, _x = 50;
	for(var i=0; i < numRocks; i++){
		AddRock("normal",_x, _y + (i * 50), 101 + i);
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
		//InitDinoPositions(g_levelNum+10);
		g_dino = new dino();

	}
}
