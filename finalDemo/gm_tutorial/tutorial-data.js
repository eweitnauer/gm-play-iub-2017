var tutorial_data = {};
var tutorial_data2 = {};

var xhr = new XMLHttpRequest();
xhr.open("GET", "tutorial-data-levels.json", true);
currentContext = this;
xhr.onload = function(){
	currentContext.callback.call(currentContext, this.responseText);
};
xhr.send();


function callback(rt){
	stage_data = JSON.parse(rt);
	//for(var stage in stage_data){
        var level_data = stage_data[1];
        for (var level in level_data[0]) {
            var level_problemSet = level_data[0][level];
            for(var problem_index in level_problemSet){
                var tutorial = level_problemSet[problem_index]["tutorial"];
                for(var property in level_problemSet[problem_index]){
                    if(property!="tutorial"){
                        tutorial[property] = level_problemSet[problem_index][property];
                        //console.log(tutorial);
                    }
                }
                if(tutorial_data[level])
                    tutorial_data[level].push(tutorial);
                else
                    tutorial_data[level] =[tutorial];
            }
        }
        var level_data = stage_data[2];
        for (var level in level_data[0]) {
            var level_problemSet = level_data[0][level];
            for(var problem_index in level_problemSet){
                var tutorial = level_problemSet[problem_index]["tutorial"];
                for(var property in level_problemSet[problem_index]){
                    if(property!="tutorial"){
                        tutorial[property] = level_problemSet[problem_index][property];
                        //console.log(tutorial);
                    }
                }
                if(tutorial_data2[level])
                    tutorial_data2[level].push(tutorial);
                else
                    tutorial_data2[level] =[tutorial];
            }
            
        //}
        }
	//console.log(tutorial_data);
}
