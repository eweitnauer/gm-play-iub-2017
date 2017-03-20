var tutorial_data = {};

var xhr = new XMLHttpRequest();
xhr.open("GET", "tutorial-data-levels.json", true);
currentContext = this;
xhr.onload = function(){
	currentContext.callback.call(currentContext, this.responseText);
};
xhr.send();


function callback(rt){
	level_data = JSON.parse(rt);
	for (var level in level_data) {
		var level_problemSet = level_data[level];
		for(var problem_index in level_problemSet){
			var tutorial = level_problemSet[problem_index]["tutorial"];
			for(var property in level_problemSet[problem_index]){
				if(property!="tutorial"){
					tutorial[property] = level_problemSet[problem_index][property];
				}
			}
			if(tutorial_data[level])
				tutorial_data[level].push(tutorial);
			else
				tutorial_data[level] =[tutorial];
		}

	}
	console.log(tutorial_data);
}
