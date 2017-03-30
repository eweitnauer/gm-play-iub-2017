var DinoEggs = DinoEggs || {}; 

DinoEggs.NextLevel = function(){
    Phaser.State.call(this);
}

DinoEggs.NextLevel.prototype = Object.create(Phaser.State.prototype);
DinoEggs.NextLevel.prototype.constructor = DinoEggs.NextLevel;



DinoEggs.NextLevel.prototype = {

	create: function () {
        //this.game.add.sprite(0, 0, '');
        console.log("next level:"+DinoEggs._selectedLevel);
		this.state.start('Game');
	}

};