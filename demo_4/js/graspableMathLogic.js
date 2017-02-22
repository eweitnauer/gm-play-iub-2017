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
