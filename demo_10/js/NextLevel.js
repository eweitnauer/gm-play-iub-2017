var DinoEggs = DinoEggs || {}; 

DinoEggs.NextLevel = function(){
    Phaser.State.call(this);
}

DinoEggs.NextLevel.prototype = Object.create(Phaser.State.prototype);
DinoEggs.NextLevel.prototype.constructor = DinoEggs.NextLevel;



DinoEggs.NextLevel.prototype = {

	create: function () {
		this.state.start('Game');
	}

};