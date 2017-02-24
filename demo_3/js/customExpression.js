
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
