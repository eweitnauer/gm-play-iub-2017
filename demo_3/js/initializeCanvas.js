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