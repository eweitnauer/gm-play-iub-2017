var DinoEggs = DinoEggs || {}; 

DinoEggs.MainMenu = function(){
    "use strict";
    Phaser.State.call(this);
    this.music = null;
    this.startGuestButton = null;
    this.startButton = null;
    DinoEggs.HIGH_SCORE = null;
    DinoEggs.isLoggedIn = false;
    
};
DinoEggs.MainMenu.prototype = Object.create(Phaser.State.prototype);
DinoEggs.MainMenu.prototype.constructor = DinoEggs.MainMenu;

DinoEggs.MainMenu.prototype = {
    create:function(){        
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'sky');
//        this.background.autoScroll(-20, 0);         //give it speed in x
        
         //game logo
        this.logo = this.game.add.sprite(this.game.world.width*0.5,this.game.world.height*0.25, 'logo');
        this.logo.anchor.set(0.5);
        
        //logo tween
        //var logoTween = this.game.add.tween(this.logo.scale).to({ x: 0.7,y:0.8}, 5000, Phaser.Easing.Bounce.Out,true).loop(true);
        var a = this,
        b = 350;
        this.logo.alpha = 0, this.logo.scale.set(1.3, 1.3), this.game.add.tween(this.logo).to({
            alpha: 1
        }, 300, Phaser.Easing.Cubic.Out, !0, b), this.game.add.tween(this.logo.scale).to({
            x: 1,
            y: 1
        }, 600, Phaser.Easing.Back.Out, !0, b).onComplete.addOnce(function() {
            a.game.add.tween(a.logo.scale).to({
                y: .94,
                x: 1.06
            }, 800, Phaser.Easing.Sinusoidal.InOut, !0, 0, 1e3, !0)
        })
        
        
        //init high score
        this.initHighScore();
    
       //start button
        this.startButton = this.game.add.button(0,this.game.world.height*0.7 , 'startButton', function() {
            DinoEggs.UserMode = true;
            if(!isLoggedIn()||window.localStorage.getItem('LoggedInUserProgress')==null){
                var googleLoginWindow = window.open("https://graspablemath.com/auth/google", 'Authorize Graspable Math','left=20,top=20,width=500,height=500,toolbar=1'); 

                var timer = setInterval(checkAuth, 500);

                function checkAuth() {
                    if (googleLoginWindow.closed) {
                        clearInterval(timer);
                        
                        if(!isLoggedIn()){
                            //console.log("user didn't login, falling back to guest mode");
                            g_dino_eggs_mainmenu.startGame();
                        }
                        else{
                            //check for existing data if not, initialize
                            queryUserData(function(error, data) {
                              if (!error) {
                                  window.gm_logged_in = true;
                                  get_data();
                                  g_dino_eggs_mainmenu.game.time.events.remove(g_dino_eggs_mainmenu.blink_event);
                                  g_dino_eggs_mainmenu.state.start('StageSelect');
                              }
                                else{
                                    g_dino_eggs_mainmenu.startGame();
                                }
                            });
                        }
                    }
                }
            }
           else{
                this.game.time.events.remove(this.blink_event);
                this.state.start('StageSelect');
           }
        }, this, 1, 0, 2);
        
        this.startButton.anchor.set(0.5);
        this.startButton.scale.set(0.5);
        
        //start as Guest button
        this.startGuestButton = this.game.add.button(this.game.world.width+100,this.game.world.height*0.7, 'startGuestButton', this.startGame, this, 1, 0, 2);
        this.startGuestButton.anchor.set(0.5);
        this.startGuestButton.scale.set(0.5);
        
        //scoreboard button
        this.scoreboardButton = this.game.add.button(0,this.game.world.height*0.8, 'scoreboardButton', this.goToScoreboard, this, 1, 0, 2);
        this.scoreboardButton.anchor.set(0.5);
        this.scoreboardButton.scale.set(0.5);

        //Animate buttons
        this.game.add.tween(this.startButton).to( { x:this.game.world.width*0.5,y:this.game.world.height*0.6 }, 1000, Phaser.Easing.Exponential.Out, true);
		    this.game.add.tween(this.startGuestButton).to( { x:this.game.world.width*0.5,y:this.game.world.height*0.7 }, 1000, Phaser.Easing.Exponential.Out, true);
        this.game.add.tween(this.scoreboardButton).to( { x:this.game.world.width*0.5,y:this.game.world.height*0.8 }, 1000, Phaser.Easing.Exponential.Out, true);

        //Animate baby dino and mom
        this.mom = this.game.add.sprite(this.game.world.width*0.6, 300, 'dino'); 
        m_lean_anim = this.mom.animations.add('reachOutToBaby',['mom.png','mom_lean2.png','mom_lean3.png','mom_lean3.png','mom_lean2.png','mom.png'],1,false);
        m_idle_anim = this.mom.animations.add('idle',['mom.png','mom_idle2.png','mom_idle3.png','mom_idle4.png','mom_idle3.png','mom_idle2.png','mom.png'],1,false);
        m_blink_anim = this.mom.animations.add('blink',['mom.png','mom_idle5.png','mom.png','mom.png','mom.png','mom.png','mom.png','mom.png','mom.png','mom.png'],6,false);
        
        m_anim_objs =[m_idle_anim,m_blink_anim,m_lean_anim];
        //Add repeating random animations
        m_anim_objs.forEach(function(anim_obj) {
            anim_obj.onComplete.add(function(mom, animation){
             anims=['idle','blink'];
             mom.animations.play(anims[Math.floor(Math.random()*anims.length)]);
            });
        });
        //-------------------------------------------------------------------------------------
        //baby anim
        this.baby = this.game.add.sprite(300,this.game.world.height-100, 'hatchling');
        this.baby.scale.setTo(1.25,1.25);
        this.baby.anchor.setTo(0.5, 0.5);
            hatchling = this.baby;
            h_run_anim = hatchling.animations.add('run',['baby.png','baby_run2.png','baby_run3.png','baby_run4.png','baby_run3.png','baby_run2.png','baby.png','baby_run5.png'],10,true);
            h_idle_anim = hatchling.animations.add('idle',['baby.png','baby_idle2.png','baby_idle3.png','baby_idle2.png','baby.png'],3,false);
            h_speak_anim = hatchling.animations.add('speak',['baby.png','baby_speak2.png','baby_speak3.png','baby_speak4.png','baby_speak3.png','baby_speak2.png','baby.png'],3,false);
            h_jump_anim = hatchling.animations.add('jump',['baby.png','baby_jump2.png','baby_jump3.png','baby_jump4.png','baby_jump5.png','baby_jump6.png','baby_jump5.png','baby_jump4.png','baby_jump3.png','baby_jump2.png','baby.png'],5,false);
            h_blink_anim = hatchling.animations.add('blink',['baby.png','baby_idle4.png','baby.png','baby.png','baby.png','baby.png','baby.png','baby.png','baby.png','baby.png',],6,false);

            h_anim_objs =[h_idle_anim,h_speak_anim,h_jump_anim,h_blink_anim]
            //Add repeating random animations
            h_anim_objs.forEach(function(anim_obj) {
                anim_obj.onComplete.add(function(hatchling, animation){
                 anims=['idle','speak','jump','blink'];
                 hatchling.animations.play(anims[Math.floor(Math.random()*anims.length)]);
                });
            });
            hatchling.animations.play('run');
        //------------------------------------------------------------------------
        // params are: properties to tween, time in ms, easing and auto-start tweenthis.
        var runningBabyTween = this.game.add.tween(this.baby).to({x: this.mom.x, y: this.game.world.height-50}, 6000, Phaser.Easing.Quadratic.InOut, true);
        runningBabyTween.onComplete.addOnce(this.stopBaby, this,this.baby);  
        
        //this.hatchlingStatic.animations.add('blink');
        //this.hatchlingStatic.animations.play('blink', 5, true);
        
        document.getElementById("eq-match-div").style.display="block";
        document.getElementById("eq-solve-div").style.display="none";
                

    },
    stopBaby: function(baby){
        this.baby.animations.stop(null, true);
        this.baby.animations.play('idle');
        this.mom.animations.play('reachOutToBaby');
        
    },
    update:function(){
        //	Do some nice funky main menu effect here
    },
        
    startGame:function(){
        //this.music.stop();
        DinoEggs.UserMode = false;
        //console.log("not logged in, guest mode");
        DinoEggs.isLoggedIn = false;
        this.game.time.events.remove(this.blink_event);
        this.state.start('StageSelect');
        
    }, 
    goToScoreboard: function(){
        this.game.time.events.remove(this.blink_event);
        this.state.start('Scoreboard');
    },
    
    initHighScore: function() {

		if (DinoEggs.HIGH_SCORE == null) {
			var str = window.localStorage.getItem('HighScore');
			try {
				DinoEggs.HIGH_SCORE = JSON.parse(str);
			} catch(e){
				DinoEggs.HIGH_SCORE = 0;
			};
		};
	},
}