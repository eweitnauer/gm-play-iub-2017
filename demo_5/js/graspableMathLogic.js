var g_problems = [
    [
      'm*x+n*x'
    , 'm*x+x*n'
    , 'n*x+m*x'
    , 'n*x+x*m'
    , 'x*n+m*x'
    , 'x*n+x*m'
    , 'x*m+n*x'
    , 'x*m+x*n'
    , '(m+n)*x'
    , 'x*(m+n)'
    , '(n+m)*x'
    , 'x*(n+m)'
    ]
];
var g_parsedProblems = [
    [
      'mx+nx'
    , 'mx+xn'
    , 'nx+mx'
    , 'nx+xm'
    , 'xn+mx'
    , 'xn+xm'
    , 'xm+nx'
    , 'xm+xn'
    , '(m+n)x'
    , 'x(m+n)'
    , '(n+m)x'
    , 'x(n+m)'
    ]
];


var g_canvasExpression = g_problems[0][0];
var g_parsedCanvasExpression = g_canvasExpression.replace(/\*/g, "");
var g_equation;
var g_parsedEquation;



// random range generator
function getRandomRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMatchEquationOnRock(){
    var indexToChoose = getRandomRange(1, g_problems[0].length - 1);
    g_equation =  g_problems[0][indexToChoose];
    g_parsedEquation = g_equation.replace(/\*/g, "");
    return g_parsedEquation;
}

function createEggEquation(){
        //create random constants for equation
        a = Math.floor((Math.random() * 10) + 1);
        b = Math.floor((Math.random() * 10) + 1);
        c = Math.floor((Math.random() * 10) + 1);

        str = "";
        equation = str+a+"x+"+b+"="+c;   
        return equation;
}
   
function showHide(x) {
   if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
    
 function clearGMCanvas(canvasObj){
   	//clear canvas
   	console.log("clearing canvas");
   	while(canvasObj.model.elements().length > 0){
    canvasObj.model.removeElement(canvasObj.model.elements()[0]); 
 }
}