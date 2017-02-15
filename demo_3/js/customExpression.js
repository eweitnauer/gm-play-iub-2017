var canvas;
var expectedValue = 1;
var totalScore = 0;
var eqList = new Array();
var checkPause = -1; // if -1 pause the script
/*var seconds_left = 15;*/
var min = 1;
var sec = 15;

//var gameStatus = 0;
loadGM(initCanvas, { version: '0.12.6' });
function initCanvas() {
        canvas = new gmath.Canvas('#gm-div', {use_toolbar: false, vertical_scroll: false });
        canvas.model.on('el_changed', function(evt) {
		/*console.log(!isNaN(evt.last_eq.slice(2)),evt.last_eq.slice(2));
		console.log("equ CHANGED.......");*/
		console.log("equ CHANGED......."+evt.last_eq);
		// condition to check if equation is solved
		if (evt.last_eq == g_matchExprSolution){
			totalScore += 10;
			eqList.push(g_rocks[current_rock_id].parsedEquation);
			canvas.showHint('Success :)' + totalScore);
			//generateRandomExp();
			var scoreLabel = document.getElementById("totalScore");
			scoreLabel.innerHTML = "Total Score : "+totalScore;
			clearGMCanvas();
			
			//g_dino.move();

            //find egg right below the rock to hatch
            g_eggs.forEach(function(_egg){
                if(_egg.x==g_rocks[current_rock_id].x){
                    //Test code:animate first egg
                    console.log("animate egg");
                    _egg.animMode=HATCHING;
                }
            
            });

			//remove rock from rocks array
			g_rocks.splice(current_rock_id,1);
			current_rock_id = null;
			addSound('sounds/eggCrackingMusic.mp3');

		}
		/*if (evt.last_eq.startsWith("x=") && !isNaN(evt.last_eq.slice(2)))
		{
			totalScore += 10;
			eqList.push(g_rocks[current_rock_id].equation);
			canvas.showHint('Success :)' + totalScore);
			//generateRandomExp();
			var scoreLabel = document.getElementById("totalScore");
			scoreLabel.innerHTML = "Total Score : "+totalScore;
			clearGMCanvas();
			
			g_dino.move();
			//remove rock from rocks array
			g_rocks.splice(current_rock_id,1);
			current_rock_id = null;
		}*/

	});
}
    function clearGMCanvas(){
    	//clear canvas
    	console.log("clearing canvas");
    	while(canvas.model.elements().length > 0){
        	canvas.model.removeElement(canvas.model.elements()[0]);
    	}
    }
    function createNewExpression(rock){
    	clearGMCanvas();
		canvas.model.createElement('derivation', { eq: rock.equation, pos: { x: 'center', y: 50 }});
    }

    function generateRandomExp(){
        //create random constants for equation
        a = Math.floor((Math.random() * 10) + 1);
        b = Math.floor((Math.random() * 10) + 1);
        c = Math.floor((Math.random() * 10) + 1);

        str = "";
        eq1 = str+a+"x+"+b+"="+c;
        expectedValue = ((c - b) / a);
        expectedValue = Math.round(expectedValue * 1000) / 1000;        
        return eq1;
    }
    $(function () {
        // Instance the tour
	if(typeof(sessionStorage.setVisit)=='undefined' || sessionStorage.setVisit==''){
        sessionStorage.setVisit='yes';
		
        var tour = new Tour({
            name: 'TourOne',
            steps: [
                {
                    element: "#gm-div",
                    title: "Equation",
                    smartPlacement: true,
                    backdrop: true,
                    content: "This is your equation which you have to solve"
                },
                {
                    element: "#startPauseButton",
                    title: "start",
                    smartPlacement: true,
                    backdrop: true,
                    content: "Click here to start, pause and resume"
                },
                {
                    element: "#timeLeft",
                    title: "Timer",
                    smartPlacement: true,
                    backdrop: true,
                    content: "Timer for the Game"
                },
                {
                    element: "#totalScore",
                    title: "Game Score",
                    smartPlacement: true,
                    backdrop: true,
                    content: "Your Game Score will be displayed here"
                }
            ]/*,
            onEnd: function (tour) {startGame();}*/
        });
        // Initialize the tour
        tour.init();
        // Start the tour
        tour.restart();
    }});
	


    var optChosen = "1";
    function loadExprFormat(e){
        var dvAns = document.getElementById("dvAnswer");
        dvAns.innerHTML = " ";
        var opt1 = document.getElementById("opt1");
        var opt2 = document.getElementById("opt2");
        var opt3 = document.getElementById("opt3");
        switch(e.value){
            case "1": opt1.style.display="block";
                opt2.style.display="none";
                opt3.style.display="none";
                break;
            case "2": opt1.style.display="none";
                opt2.style.display="block";
                opt3.style.display="none";
                break;
            case "3": opt1.style.display="none";
                opt2.style.display="none";
                opt3.style.display="block";
                break;
        }
        optChosen = e.value;
    }
    function calculate(){
        //alert("in calculate");
        var dvAns = document.getElementById("dvAnswer");
        var x1 = 0, x2 = 0;
        var finalString1 = "", finalString2 = "";
        //alert(optChosen);
        switch(optChosen){
            case "2":
                var a = document.getElementById("opt2inp1").value;
                var b = document.getElementById("opt2inp2").value;
                x1 = (a+b) * (a+b);
                finalString1 = x1+"";
                break;
            case "3":
                var a = document.getElementById("opt3inp1").value;
                var b = document.getElementById("opt3inp2").value;
                x1 = (a+b) * (a+b) * (a+b);
                finalString1 = x1+"";
                break;
            case "":
            case "0":
            case "1":
            default:
                var a = document.getElementById("opt1inp1").value;
                var b = document.getElementById("opt1inp2").value;
                var c = document.getElementById("opt1inp3").value;
                x1 = (c-b)/a;
                break;
        }
        dvAns.innerHTML = x1;
    }
    function addToCanvas(){
        switch(optChosen){
            case "3":
                var a = document.getElementById("opt3inp1").value;
                var b = document.getElementById("opt3inp2").value;
                finalString1 = ""+a+"^3"+"3*"+a+"^2*3+"+a+"*"+b+"^2+"+b+"^3";
                finalString2 = "("+a+"+"+b+")^3";
                break;
            case "2":
                var a = document.getElementById("opt2inp1").value;
                var b = document.getElementById("opt2inp2").value;
                finalString1 = ""+a+"^2+2*"+a+"*"+b+"+"+b+"^2";
                finalString2 = "("+a+"+"+b+")^2";
                break;
            case "":
            case "0":
            case "1":
            default:
                var a = document.getElementById("opt1inp1").value;
                var b = document.getElementById("opt1inp2").value;
                var c = document.getElementById("opt1inp3").value;
                x1 = (c-b)/a;
                finalString1 = ""+a+"x+"+b+"="+c;
                finalString2 = "";
                break;
        }
        canvas2.model.reset();
        canvas2.model.createElement('derivation', { eq: finalString1, pos: { x: 'center', y: 50 } });
        canvas2.model.createElement('derivation', { eq: finalString2, pos: { x: 'center', y: 150 } });
    }
