/*// <![CDATA[*/
var g_controlButtonState = -1; //This means we have to pause the game
var g_canvasState = 0;
var g_isGameInProgress = false;
var g_hasPlayerWon = null;
var minutes = 0;  // minutes
var seconds = 0;  // seconds
function MainTimer(obnm){
	// http://coursesweb.net/javascript/

	//var minutes = 0;  // minutes
	//var seconds = 0;  // seconds
	var startchr = 0;  // used to control when to read data from form, and script finished
	

	//get html elms.
	var showMinutesSpan = document.getElementById('showMinutesSpan');
	var showSecondsSpan = document.getElementById('showSecondsSpan');
	var minutesText = document.getElementById('minutesText');
	var secondsText = document.getElementById('secondsText');
	var startPauseBtn = document.getElementById('startPauseButton');
	var restartBtn = document.getElementById('restartButton');
	
	var endct = 0;  // it is set to 1 when script starts
	
	//to start/pause/resume Countdown Timer
	function startPauseClickListener(){
		if(parseInt(minutesText.value) > 0 || parseInt(secondsText.value)> 0 || endct == 1){
			if(!g_isGameInProgress){
				g_isGameInProgress = true;
				startGame();				
			}
			
			g_controlButtonState *= -1;
		   
			if(g_controlButtonState == 1){ //Start and set next click as Pause
			
			    
				/*document.getElementById("gm-div").style.display = 'block';
				document.getElementById("dvGame").style.display = 'block';*/
				document.getElementById("gm-div").disabled = false;
				document.getElementById("dvGame").disabled = false;
				$("div#dvGame").css("filter","blur(0px)");
				$("div#gm-div").css("filter","blur(0px)");
				startPauseBtn.value ='PAUSE';	
				setTimeout(obnm +'.countdownTimer()', 1000);
				var scoreLabel = document.getElementById("totalScore");
				scoreLabel.innerHTML = "Total Score : 0";	
			}
			 //happens after clicking pause
			else {
				document.getElementById("gm-div").disabled = true;
				document.getElementById("dvGame").disabled = true;
				$("div#dvGame").css("filter","blur(5px)");
				$("div#gm-div").css("filter","blur(14px)");	
				BootstrapDialog.alert('Game Paused. Press OK to resume', function(){
						$("#startPauseButton").click();
				});				  
				//g_canvasState = document.getElementById("dvGame").save();
				startPauseBtn.value ='RESUME';
			  }
		}
	}
	
	
	// HERE YOU CAN ADD TO EXECUTE JavaScript instructions WHEN COUNTDOWN TIMER REACHES TO 0
  function endCT(){
    // HERE ADD YOUR CODE
    return false;
  }
// HERE YOU CAN ADD TO EXECUTE JavaScript instructions WHEN COUNTDOWN TIMER REACHES TO 0

	this.countdownTimer = function(){
		
		// if $startchr is 0, and form fields exists, gets data for minutes and seconds, and sets $startchr to 1
		if(startchr == 0 && minutesText && secondsText) {
			// makes sure the script uses integer numbers
			minutes = parseInt(minutesText.value);
			seconds = parseInt(secondsText.value);
			// if data not a number, sets the value to 0
			if(isNaN(minutes)) minutes = 0;
			if(isNaN(seconds)) seconds = 0;
			// rewrite data in form fields to be sure that the fields for minutes and seconds contain integer number
			minutesText.value = minutes;
			secondsText.value = seconds;
			startchr = 1;
		}
		
		if(minutes >0 || seconds >0) endct = 1;  //to can call endCT() at the ending

		// if minutes and seconds are 0, call endCT()
		if(minutes == 0 && seconds == 0 && endct ==1){
			startchr =0;
			g_controlButtonState = -1;
			endct =0;
			startPauseBtn.value ='START';
			endCT();
					
			minutes = 0;  // minutes
			seconds = 0;  // seconds
			startPauseBtn.value = 'START'

			/*if(g_eggs.length>0)
				g_hasPlayerWon = false;
			else{
				if(g_rocks.length>0)
					totalScore += g_rocks.length;
				g_hasPlayerWon = true;
			}*/

			//successful level completion
			var finishText = "";
			//if(totalScore > 0){
			if(g_hasPlayerWon==true){
				addSound('sounds/winningMusic.mp3');
				finishText = "Good job !!! You solved "+eqList.length+" equations in 15 seconds.<br />";
				for(var i = 0 ; i < eqList.length ; i++){
					finishText += eqList[i] + "<br />";
				}
			}
			//unsuccessful level over
			else{
				alert("lost");
				addSound('sounds/losingMusic.mp3');
				finishText = "You lost. Have another go !!";
			}


			minutesText.value = 0;
			secondsText.value = 0;

			$("#equationSolved").html(finishText);
			$("#gameOverScore").html("Total Score : " +totalScore);
			g_isGameInProgress = false;
			$('#gameOverModal').modal('show');
		}

		else if(startchr == 1 && g_controlButtonState == 1){
			// decrease seconds, and decrease minutes if seconds reach to 0
			seconds--;
			if(seconds < 0){
				if(minutes > 0) {
					seconds = 59;
					minutes--;
				}else{
					
				}
			}
			setTimeout(obnm +'.countdownTimer()', 1000); //auto-calls this function after 1 seccond
			// display the time in page
			showMinutesSpan.innerHTML = minutes;
			showSecondsSpan.innerHTML = seconds;
		}

	}
	//set event to button that starts the Countdown Timer
	if(startPauseBtn) startPauseBtn.addEventListener('click', startPauseClickListener);

	//restart Countdown Timer from the initial values
	if(restartBtn) restartBtn.addEventListener('click', function(){ 
		startchr = 0; 
		g_isGameInProgress = false;
		g_controlButtonState = -1;
		startPauseClickListener(); 
	});
}
//set object of CountdownTimer class
var obCT = new MainTimer('obCT');

