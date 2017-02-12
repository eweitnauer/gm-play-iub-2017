/*// <![CDATA[*/
function MainTimer(obnm){
	// http://coursesweb.net/javascript/

	var minutes = 0;  // minutes
	var seconds = 0;  // seconds
	var startchr = 0;  // used to control when to read data from form, and script finished

	/*isGameStarted = false;
	isGameRunning = false;*/

	//get html elms.
	var showMinutesSpan = document.getElementById('showMinutesSpan');
	var showSecondsSpan = document.getElementById('showSecondsSpan');
	var minutesText = document.getElementById('minutesText');
	var secondsText = document.getElementById('secondsText');
	var startPauseBtn = document.getElementById('startPauseButton');
	var restartBtn = document.getElementById('restartButton');
	var controlButtonState = -1; //This means we have to pause the game
	var endct =0;  // it is set to 1 when script starts
	
	//to start/pause/resume Countdown Timer
	function startPauseClickListener(){
		//startGame();
		if(parseInt(minutesText.value) > 0 || parseInt(secondsText.value)> 0 || endct == 1){
			controlButtonState *= -1;
		   
			if(controlButtonState == 1/*!isGameStarted && !isGameRunning*/){ //Start and set next click as Pause
				/*isGameStarted = true;
				isGameRunning = true;*/
				
				console.log("Testing buttons - one")
				document.getElementById("gm-div").style.display = 'block';
				startPauseBtn.value ='PAUSE';
				
				/*setTimeout(obnm +'.countdownTimer()', 1000);*/
				var scoreLabel = document.getElementById("totalScore");
				scoreLabel.innerHTML = "Total Score : 0";
				generateRandomExp();
				window[obnm].countdownTimer();
			}
			 //happens after clicking pause
			  else /*if(isGameStarted && isGameRunning)*/{
				console.log("Testing buttons - two")
				document.getElementById("gm-div").style.display = 'none';
				startPauseBtn.value ='RESUME';
				/*isGameStarted = true;
				isGameRunning = false;*/
				updateGameArea();
				
			  }

		  //Game is paused, we need to resume. This happens after clicking resume
		 /* else if(isGameStarted && !isGameRunning){
			
				document.getElementById("gm-div").style.display = 'block';
				startPauseBtn.value ='PAUSE';
				isGameStarted = true;
				isGameRunning = true;
				window[obnm].countdownTimer();
				
		  }
		  else {
			console.log("Canvas corrupted. Please reload"); 
			}*/
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
	
	if(minutes >0 || seconds >0) endct =1;  //to can call endCT() at the ending

	// if minutes and seconds are 0, call endCT()
    if(minutes==0 && seconds==0 && endct ==1){
      startchr =0;
      controlButtonState = -1;
      endct =0;
      startPauseBtn.value ='START';
      endCT();
    }

	else if(startchr == 1 && controlButtonState == 1/*isGameRunning*/){
		// decrease seconds, and decrease minutes if seconds reach to 0
		seconds--;
		if(seconds < 0){
			if(minutes > 0) {
				seconds = 59;
				minutes--;
			}else{
				addSound('Fanfare-sound.mp3');
				minutes = 0;  // minutes
				seconds = 0;  // seconds



				/*isGameStarted = false;
				isGameRunning = false;*/

				startPauseBtn.value = 'START'
				minutesText.value = 0;
				secondsText.value = 0;
			
				//clear canvas
				while(canvas.model.elements().length > 0){
					canvas.model.removeElement(canvas.model.elements()[0]);
				}

				var finishText = "Good job !!! You solved "+eqList.length+" equations in 15 seconds.<br />";
				for(var i = 0 ; i < eqList.length ; i++){
					//console.log("Past Eq : "+eqList[i]);
					finishText += eqList[i] + "<br />";
				}
				/*finishText += "Your total score is "+totalScore;*/
				$("#equationSolved").html(finishText);
				$("#gameOverScore").html(totalScore);

				//add finish image
				//canvas.model.createElement('image',{src : 'download.png' });
				var historyText="This is the order of steps in which equations were solved.<br />";
				for(var equ in eqHistory){
					if(eqHistory[equ].length>0){
						historyText += "<strong>"+equ +"</strong><br >"
						for(var k = 0; k < eqHistory[equ].length; k++)
							historyText +=  eqHistory[equ][k]+ "<br />";
					}
				}
				$("#history").html(historyText);
				$('#gameOverModal').modal('show');
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
if(restartBtn) restartBtn.addEventListener('click', function(){ startchr =0; if(controlButtonState ==-1) startPauseClickListener(); });

}
//set object of CountdownTimer class
var obCT = new MainTimer('obCT');
//$("#startPauseBtn").click(function(){startGame();});
//startGame();
