/*// <![CDATA[*/
function MainTimer(obnm){
	// http://coursesweb.net/javascript/

	var minutes = 0;  // minutes
	var seconds = 0;  // seconds
	var startchr = 0;  // used to control when to read data from form, and script finished

	isGameStarted = false;
	isGameRunning = false;

	//get html elms.
	var el_showmns = document.getElementById('showmns');
	var el_showscs = document.getElementById('showscs');
	var el_mns = document.getElementById('mns');
	var el_scs = document.getElementById('scs');
	var el_btnct = document.getElementById('btnct');
	/*var el_btnct_res = document.getElementById('btnct_res');
	 var el_btnct_end = document.getElementById('btnct_end');*/
	//to start/pause/resume Countdown Timer
	function startPauseCT(){
		//startGame();
		if(parseInt(el_mns.value) >0 || parseInt(el_scs.value)>0 ){
		   
			if(!isGameStarted && !isGameRunning){ //Start and set next click as Pause
				isGameStarted = true;
				isGameRunning = true;
				document.getElementById("gm-div").style.display = 'block';
				el_btnct.value ='PAUSE';
				//window[obnm].countdownTimer();
				setTimeout(obnm +'.countdownTimer()', 1000);
				var scoreLabel = document.getElementById("totalScore");
				scoreLabel.innerHTML = "Total Score : 0";
				generateRandomExp();
			}
			 //happens after clicking pause
			  else if(isGameStarted && isGameRunning){
				document.getElementById("gm-div").style.display = 'none';
				el_btnct.value ='RESUME';
				isGameStarted = true;
				isGameRunning = false;
				updateGameArea();
				
			  }

		  //Game is paused, we need to resume. This happens after clicking resume
		  else if(isGameStarted && !isGameRunning){
			
				document.getElementById("gm-div").style.display = 'block';
				el_btnct.value ='PAUSE';
				isGameStarted = true;
				isGameRunning = true;
				window[obnm].countdownTimer();
				
		  }
		  else {
			console.log("Canvas corrupted. Please reload"); 
			}
		}
	}
// HERE YOU CAN ADD TO EXECUTE JavaScript instructions WHEN COUNTDOWN TIMER REACHES TO 0

this.countdownTimer = function(){
	// if $startchr is 0, and form fields exists, gets data for minutes and seconds, and sets $startchr to 1
	
	
	
	if(startchr == 0 && el_mns && el_scs) {
		// makes sure the script uses integer numbers
		minutes = parseInt(el_mns.value);
		seconds = parseInt(el_scs.value);
		// if data not a number, sets the value to 0
		if(isNaN(minutes)) minutes = 0;
		if(isNaN(seconds)) seconds = 0;
		// rewrite data in form fields to be sure that the fields for minutes and seconds contain integer number
		el_mns.value = minutes;
		el_scs.value = seconds;
		startchr = 1;
	}

	if(startchr == 1 && isGameRunning){
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



				isGameStarted = false;
				isGameRunning = false;

				el_btnct.value = 'START'
				el_mns.value = 0;
				el_scs.value = 0;
			
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
		el_showmns.innerHTML = minutes;
		el_showscs.innerHTML = seconds;
	}

}
//set event to button that starts the Countdown Timer
if(el_btnct) el_btnct.addEventListener('click', startPauseCT);

}
//set object of CountdownTimer class
var obCT = new MainTimer('obCT');
$("#btnct").click(function(){startGame();});
//startGame();
