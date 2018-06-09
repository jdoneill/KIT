//var game = new Phaser.Game(800, 500, Phaser.AUTO);
var game = new Phaser.Game(1920, 1500, Phaser.AUTO); //rffv
//rffv means remove from final version (word search through document to find these before the final push)

// P L A Y E R
var playerVel = 150;
var player;
var finalPlayer;
var cutscene;
var size;
var falling = false;
var yesJump = true; 
var yesSFX = true;
var rArm;
var rArmOn;
var lArm;
var lArmOn;
var rLeg;
var rLegOn;
var lLeg;
var lLegOn;
var touching;
var limb;
var touchingLimb;
var distance;
var trapped = false;
var flipped = false;
var octocaught = false;

// L E V E L  T R A C K E R 
var level = 0;
var currentLevel;

// O B S T A C L E S
var buttons;
var platforms;
var door;
var doorHit = 0;
var buttonTrap;
var canShred = true;
var canBreak = false;
var canBreak2 = false;
var canBreak3 = false;
var rockDes1 = false;
var rockDes2 = false;
var rockDur = 0;
var tako;
var suckers;
var octoCanCharge = true;
var octoFlip = false;
var canRip = true;

// S O U N D S
var music;
var music2;
var music3;
var music4;
var music5;
var walking;
var fallSFX;
var jumping;
var thud;
var limbRip;
var levelRip;
var crack;
var paperSlice;
var bearTrap;
var shredBuzz;

// T I M E R  &  S H A K E
var timer;
var timerlvl5;
var shakeIntensity = .01;
var shakeLength = 100;
var time = 5000;

//---------------------------------------------------------------------------
// L E V E L  O N E 
//---------------------------------------------------------------------------

var level1 = function(game) {};
level1.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		// L O A D  I M A G E S
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
		game.load.atlas('plat', 'assets/img/platforms.png', 'assets/img/platforms.json'); //load platforms
		game.load.atlas('puzzles', 'assets/img/puzzles.png', 'assets/img/puzzles.json'); //load platforms
		game.load.atlas('enemies', 'assets/img/Enemies.png', 'assets/img/Enemies.json'); //load platforms
		// L O A D  A U D I O
		game.load.audio('walkNoise', 'assets/audio/rub.mp3');
		game.load.audio('claireDeLune', 'assets/audio/Clair De lune.mp3');
		game.load.audio('glitch1', 'assets/audio/glitch2.mp3');
		game.load.audio('glitch2', 'assets/audio/glitch3.mp3');
		game.load.audio('glitch3', 'assets/audio/glitch4.mp3');
		game.load.audio('thudSFX', 'assets/audio/paperTapTable.mp3');
		game.load.audio('paperTap', 'assets/audio/jumpSFX.mp3');
		game.load.audio('limbSound', 'assets/audio/rip.mp3');
		game.load.audio('levelShift', 'assets/audio/tear.mp3');
		},
	create: function() { //make the game world
		var bg = game.add.sprite(0, 0, 'back', 'Background1'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = true; //reset limb variables in case of restart
		lArmOn = true;
		rLegOn = true;
		lLegOn = true;

		// M U S I C  A N D  S F X 
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		walking.pause();//only play when walking //THIS LINE MIGHT BE UNNECESSARY SEE LINE 126
		music = game.add.audio('claireDeLune',1,true);
		music2 = game.add.audio('glitch1',0,true); //0 vol so the songs match accross levels
		music3 = game.add.audio('glitch2',0,true);
		music4 = game.add.audio('glitch3',0,true);
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
	
        player = new Player(game, 'guy', 'Body', 400, 0);// add player from prefab
        game.add.existing(player);

		walking.play();
		//play the music so it lines up across all levels (excluding final level)
		music.play();
		music2.play();
		music3.play();
		music4.play();

		// I N S T R U C T I O N S
		var walkTxt = game.add.text(80, 1200, 'Use the arrow keys to move', { fontSize: '20px', fill: '#595959' }); 
		var jumpTxt = game.add.text(780, 1375, 'Press the up key \nto jump', { fontSize: '20px', fill: '#595959' }); 
		var armTxt = game.add.text(1185, 950, 'Press the spacebar \nto remove your arm', { fontSize: '20px', fill: '#595959' });
		var beetTxt = game.add.text(1000, 1285, 'Music is \nClaire de Lune \nby Beethoven', { fontSize: '20px', fill: '#595959' });
		var restartText = game.add.text(1220, 1205, 'Press the R key \nto restart any \nlevel', { fontSize: '20px', fill: '#595959' });
		
		size = 1; //N O T E : figure out what this is for
		var level = 1; // set first level (THIS MIGHT NOT ACTUALLY DO SOMETHING)
		
		limb = game.add.sprite(1920, 400, 'guy', 'armRside'); //add the controlable limb in where the player can't see
	    game.physics.arcade.enable(limb);
		limb.scale.setTo(1.5, 1);
		limb.body.gravity.y = 450; // same physics as player
		limb.body.collideWorldBounds = true; // don't fall through the earth

		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds		
		var ledge = this.platforms.create(1375, 800, 'plat', 'bigBox'); // puzzle roof
		ledge.body.immovable = true;
		ledge.scale.setTo(1.5, 1.05);
		ledge = this.platforms.create(1375, 1100, 'plat', 'midBox'); // puzzle wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(30, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		//add a movable floor for puzzle solving
		door = this.platforms.create(337, 1427, 'puzzles', 'puzzleDoor'); //door
		door.body.immovable = true;
		door.scale.setTo(2, 2);
		ledge = this.platforms.create(620, 1427, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge.scale.setTo(8, 2);
 		ledge = this.platforms.create(1850, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(0, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(1220, 1170, 'plat', 'lilBox'); // upper step
		ledge.body.immovable = true;
		ledge = this.platforms.create(780, 1330, 'plat', 'lilBox'); // lower step
		ledge.body.immovable = true;
		ledge = this.platforms.create(1000, 1250, 'plat', 'lilBox'); // middle step
		ledge.body.immovable = true;
		
		// P U Z Z L E 
		buttons = game.add.sprite(1690, 1395, 'puzzles', 'buttonUp'); //add a pressable button
		buttons.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttons); // so the button can be pressed
		buttons.body.immovable = true;
		indicator = game.add.sprite(610, 1400, 'puzzles', 'indicatorRed'); //add an indicator to show the player what the button does
		indicator.scale.setTo(.95, .7);

		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff
		touchingLimb = game.physics.arcade.collide(limb, this.platforms); //allows limb to collide with walls and platforms and stuff

		// Figures out if the player is falling then adds a landing sfx.
		// C H A N G E  T H I S  A F T E R  T E S T I N G -------------v 			//rffv remove commet block
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && rArmOn == true){//press space to remove limbs
			var armMoveTxt = game.add.text(1380, 1050, 'Use the a and d keys to move the arm ', { fontSize: '20px', fill: '#595959' });
			console.log('arm off');
			limbRip.play();
			rArmOn = false;
			rArm.destroy();
			limb.x = player.x + 40; // teleport controllable limb to player
			limb.y = player.y;
			game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6); //follow the limb with the camera
		}
		if(player.body.velocity.y > 0){ // check for falling
			falling = true;
		}
		if(cursors.up.isUp){// check for jumping			{
				yesJump = true;
			}
		if (touching == true && falling == true){ // landing sound effect (100% polish)
			thud.play();
			falling = false;
			console.log('Landed');
		}
		if(cursors.up.isDown && touching == true){ //press up to make jump sfx
			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			if(yesJump == true ){
				jumping.play();
				yesJump = false; // player can't hold up to jump
				if(walking.play()){//pause walking sound when jumping
					walking.pause();
				}
			}
		}
		if(player.body.onFloor() != true){// pause walking sound when not on ground
			walking.pause();
		}
		if (cursors.left.isDown || cursors.right.isDown){
			if(touching == true){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
				walking.resume();//  Play walk sound
				game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			}
		}
		else {//  Pause music/sfx
			 walking.pause();
		}
			
	// L I M B	
		// W A L K I N G
 	if (game.input.keyboard.isDown(Phaser.Keyboard.A) && rArmOn == false){// go left
		limb.body.velocity.x = -playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && rArmOn == false){// go right
		limb.body.velocity.x = playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	} 
	else {//  don't move
		limb.body.velocity.x = 0;
	}
	//L E V E L  L O G I C
	if (player.body.y > 1970){//next state
		rArmOn = false;
		game.state.start('load2')
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)){ //R to restart
		game.state.start('level1')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
		walking.pause();

	}		

	function buttonPressed (limbs, buttons) {//press the button
		door.destroy(); // remove door
		levelRip.play(); // play an indicator noise
		buttons.destroy();
		buttons = game.add.sprite(1690, 1397, 'puzzles', 'buttonDown');//replace with button pressed sprite
		buttons.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttons); // add physics to the button (line might be unnecessary) //rffv
		buttons.body.immovable = true;
		indicator = game.add.sprite(610, 1400, 'puzzles', 'indicatorGreen'); //show the player that something has happened
		indicator.scale.setTo(.95, .7);
		
	}
	game.physics.arcade.collide(limb, buttons, buttonPressed, null, this);// check for buttonPressed
	
	//state shifts for level development //rffv
		if (game.input.keyboard.isDown(Phaser.Keyboard.TWO)){
			game.state.start('Credits')
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.THREE)){
			game.state.start('level3')
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.FOUR)){
			game.state.start('level4')
		}
		if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE)){
			game.state.start('level5')
		}
	
	},
/* 	render: function() {// setup debug rendering (comment out when not debugging) //rffv
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(limb);
	}, */
}

//---------------------------------------------------------------------------
//travel cutscene
//---------------------------------------------------------------------------

var load2 = function(game) {}; //fix the cutscenes camera and assets
load2.prototype = {
	preload: function() { // pre game loop
		console.log('load2: preload');
		game.load.atlas('scene', 'assets/img/cutscenes.png', 'assets/img/cutscenes.json'); // load the stuff
		game.load.audio('flip', 'assets/audio/flip.mp3');
		game.load.audio('crackSFX', 'assets/audio/crumple.mp3');
		game.load.audio('buzzSFX', 'assets/audio/vaccum.mp3');
		},
	create: function() {
		console.log('load2: create');
		var bgC1 = game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
		bgC1.scale.setTo(1.25, 1.4); //scale cutscene background
		cutscene = new Cutscene(game, 'scene', 'cuscenePlayer1');
       	game.add.existing(cutscene);
		fallSFX = game.add.audio('flip', 1, false);
		fallSFX.play();
	},
	update: function() {
		// main menu logic
		// leftArm
		// Pauses SFX
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level2')//switch level
		}
		if(cutscene.body.y >820){
			game.state.start('level2')//switch level
		}
	}
}

//---------------------------------------------------------------------------
// L E V E L  T W O
//---------------------------------------------------------------------------

var level2 = function(game) {};
level2.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		//nothing to load

		},
	create: function() { //make the game world
		console.log('First level: create');
		var bg = game.add.sprite(0, 0, 'back', 'Background2'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = false; //reset limb variables in case of restart
		lArmOn = false; //setting to false cause of how I'm doing the puzzle
		rLegOn = true;
		lLegOn = true;
		trapped = true;
				//Do we need to reassign these vars?
		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		walking.pause();
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
		crack = game.add.audio('crackSFX', 1, false);
		shredBuzz = game.add.audio('buzzSFX', .5, true);
		
		music.destroy();
		music2.volume = 1;
		
		// Uses timer to shake
		timer = game.time.create(false);
		//  Set a TimerEvent to occur after 5 seconds
		// Parameters are the times in between, the function it calls when the time is up
		timer.loop(time, shake, this);
	
		var hooked = game.add.sprite(865, 40, 'enemies', 'hooked'); //Rock (make it look like a rock)
		hooked.scale.setTo(1.5, 1.5);
	
        player = new Player(game, 'guy', 'Body', 940, 355);// add player from prefab
        game.add.existing(player);
		player.body.gravity.y = 0; // change this to a var for water level gravity change

		walking.play(); //play the music so it lines up across all levels (excluding final level)

		size = 1; //N O T E : figure out what this is for
		level = 2; // set first level
		
		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds
		var ledge = this.platforms.create(30, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(5.4, 2);

		ledge = this.platforms.create(1150, 1427, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge.scale.setTo(5, 2);
 		ledge = this.platforms.create(1850, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(0, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);
		//add some platforms to jump on
		ledge = this.platforms.create(1460, 1310, 'plat', 'lilBox');
		ledge.body.immovable = true;
		ledge.body.velocity.x = -500; //move the platforms to the left at different speeds

		ledge.checkWorldBounds = true; //check if the platforms go past the world bounds
		ledge.events.onOutOfBounds.add(this.wrapPlat, this); //wrap the platforms once they go past the world bounds
		//DELETE ^THESE^ IF STATEMENTS IF YOU CAN'T GET THEM TO WORK
		ledge = this.platforms.create(800, 1200, 'plat', 'lilBox');
		ledge.body.immovable = true;
		ledge.body.velocity.x = 500;
		ledge.checkWorldBounds = true;
		ledge.events.onOutOfBounds.add(this.wrapPlat, this);
		ledge = this.platforms.create(1320, 1090, 'plat', 'lilBox');
		ledge.body.immovable = true;
		ledge.body.velocity.y = -500;
		ledge.checkWorldBounds = true;
		ledge.events.onOutOfBounds.add(this.wrapPlat, this);

		// P U Z Z L E 
		//add a breakable rock floor for puzzle solving
		door3 = game.add.sprite(865, 1426, 'puzzles', 'rock3'); //Rock (make it look like a rock)
		game.physics.enable(door3);
		door3.body.immovable = true;
		door3.scale.setTo(2.26, 2.2);
		
		door2 = game.add.sprite(865, 1427, 'puzzles', 'rock2'); //Rock (make it look like a rock)
		game.physics.enable(door2);
		door2.body.immovable = true;
		door2.scale.setTo(2.26, 2.2);
		door = game.add.sprite(865, 1428, 'puzzles', 'rock1'); //Rock (make it look like a rock)
		game.physics.enable(door);
		door.body.immovable = true;
		door.scale.setTo(2.26, 2.2);
		//rock floor
		
		//S H R E D D E R
		shredder = game.add.sprite(-700, 900, 'enemies', 'angryScaryShredder'); //adds the shredder
		game.physics.enable(shredder); //give shredder physics
		

		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},

	wrapPlat: function(sprite){ //wrap the platforms around the level
		if(sprite.x + sprite.width/2 < 0){
			sprite.x = 1920 + sprite.width/2;
		}else if(sprite.x - sprite.width/2 > 1500){
			sprite.x = 0 - sprite.width/2;
		}else if(sprite.y + sprite.height/2 < 0){
			sprite.y = 1500;
		}else if(sprite.y - sprite.height/2 > 1500){
			sprite.y = 0;
		}
	},

	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff

		var shred = game.physics.arcade.collide(player, shredder); //variable for colliding with shredder

		// Figures out if the player is falling then adds a landing sfx.
		// C H A N G E  T H I S  A F T E R  T E S T I N G -------------v
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) /*&& lArmOn == true*/){//press space to remove limbs
			console.log('arm off');
			limbRip.play();
			lArmOn = false;
			player.body.gravity.y = 450; // change this to a var for water level gravity change
			trapped = false;
			
			// Starts timer on button press, so that it only shakes after you drop
			timer.start();
			
			// Makes it so the shredder only starts to move after you hit space.
			shredder.body.velocity.x = 25;
			shredBuzz.play()
		}
		else{
			playerVel = 70;
		}
		
		 if(shredder.body.x > 550){
            timer.pause();
        }
		
		if(player.body.velocity.y > 0){ // check for falling
			falling = true;
		}
		if(cursors.up.isUp){// check for jumping			{
				yesJump = true;
			}
		if (touching == true && falling == true){ // landing sound effect (100% polish)
			thud.play();
			falling = false;
			console.log('Landed');
		}
		if(cursors.up.isDown && touching == true){ //press up to make jump sfx
			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			if(yesJump == true){
				jumping.play();
				yesJump = false; // player can't hold up to jump
				if(walking.play()){//pause walking sound when jumping
					walking.pause();
				}
			}
		}
		if(player.body.onFloor() != true){// pause walking sound when not on ground
			walking.pause();
		}
		if (cursors.left.isDown || cursors.right.isDown){
			if(touching == true){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
				walking.resume();//  Play walk sound
				game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			}
		}
		else {//  Pause music/sfx
			 walking.pause();
		}
		
		//P U Z Z L E
		// All this is to break the different rocks
		// IMPORTANT: Change the number to change how far you need to fall
		if(player.body.y < 1150 && falling == true)
        {
            canBreak = true;
        }

        if(touching == true)
        {
            canBreak = false;
			canBreak2 = false;
			canBreak3 = false;

        }
        if(game.physics.arcade.collide(door,player) && canBreak == true)
        {
			thud.play();
			door.destroy();
			// canBreak2 = false;
			rockDur++;
			rockDes1 = true;
        }
		
		// debug stuff	
		// this.game.debug.cameraInfo(this.game.camera, 32, 32);

		// This ensures that the rocks can only break one at a time & then when they collide it destroys the top layered sprite.
		if(rockDes1 == true && player.body.y < 1150 && falling == true)
		{
			canBreak2 = true;
		}
		
	    if(game.physics.arcade.collide(door2,player) && canBreak2 == true)
		{
			thud.play();
			door2.destroy();
			rockDur++;
			rockDes2 = true;
		}
		
		if(rockDes2 == true && player.body.y < 1150 && falling == true)
		{
			canBreak3 = true;
		}
		
	    if(game.physics.arcade.collide(door3,player) && canBreak3 == true)
		{
			thud.play();
			crack.play();
			door3.destroy();
			rockDur++;
			//rockDes3 = true;
		}
		
	    // rock breaking ends here

	if (player.body.y > 1970 || cursors.down.isDown){//next state
		lArmOn = false;
		game.state.start('load3')
	}
	if(shred == true)
	{
		limbRip.play();
	}
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)){ //R to restart or if shredder gets the player
		game.state.start('level2')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
		walking.pause();
		shredBuzz.pause();
		rockDur = 0;
        rockDes1 = false;
        rockDes2 = false;
        canBreak = false;
        canBreak2 = false;
        canBreak3 = false;
	}
	if (shred == true){ //R to restart or if shredder gets the player
		game.state.start('gameOver')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
		walking.pause();
		shredBuzz.pause();
		rockDur = 0;
        rockDes1 = false;
        rockDes2 = false;
        canBreak = false;
        canBreak2 = false;
        canBreak3 = false;
	}

	game.physics.arcade.collide(player, door);
	
	},
/* 	render: function() {// setup debug rendering (comment out when not debugging)
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(door);
	}, */
}

//---------------------------------------------------------------------------
//travel cutscene
//---------------------------------------------------------------------------

var load3 = function(game) {};
load3.prototype = {
	preload: function() { // pre game loop
		console.log('load3: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
		game.load.audio('krakenCry', 'assets/audio/paperSlicer.mp3');
		game.load.audio('CrUnCh', 'assets/audio/crumple.mp3');
		},
	create: function() {
		shredBuzz.pause();
		console.log('load2: create');
		var bgC2 = game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
		bgC2.scale.setTo(1.25, 1.4); //scale cutscene background
		cutscene = new Cutscene(game, 'scene', 'cuscenePlayer2');
        game.add.existing(cutscene);
		
		// Restarts falling noise
		fallSFX.restart();
		},
	update: function() {
		// main menu logic
		
		// Pauses SFX
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level3')//switch level
		}
		if(cutscene.body.y >820){
			game.state.start('level3')//switch level

		}
		}
	}

//---------------------------------------------------------------------------
// L E V E L  T H R E E
//---------------------------------------------------------------------------

var level3 = function(game) {};
level3.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		//nothing to load

		},
	create: function() { //make the game world
		console.log('First level: create');
		var bg = game.add.sprite(0, 0, 'back', 'Background3'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = false; //reset limb variables in case of restart
		lArmOn = false;
		rLegOn = true;
		lLegOn = true;
				//Do we need to reassign these vars?
		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		walking.pause();
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('CrUnCh', 1, false);
		paperSlice = game.add.audio('krakenCry', 1, false);
		
		// Destroy last music and unmute new track
		music2.destroy();
		music3.volume = 1;
	
		var warning = game.add.sprite(420, 315, 'puzzles', 'tentacleSign');//add octopus
		warning.scale.setTo(0.3, 0.3);
	
        player = new Player(game, 'guy', 'Body', 180, 0);// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)

		size = 1; //N O T E : figure out what this is for
		level = 3; // set first level
		
		limb = game.add.sprite(1920, 400, 'guy', 'legRside'); //add the controlable limb in where the player can't see
	    game.physics.arcade.enable(limb);
		limb.scale.setTo(1.5, 1);
		limb.body.gravity.y = 450; // same physics as player
		limb.body.collideWorldBounds = true; // don't fall through the earth

		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		var ledge = this.platforms.create(30, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(5.4, 2);
		ledge = this.platforms.create(1100, 1427, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge.scale.setTo(5, 2);
 		ledge = this.platforms.create(1850, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(0, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);
		ledge = this.platforms.create(67, 400, 'plat', 'midBox'); // spawn platform
		ledge.body.immovable = true;
		ledge.scale.setTo(3, 2);
		ledge = this.platforms.create(1300, 400, 'plat', 'lilBox'); //upper floor left
		ledge.body.immovable = true;
		ledge = this.platforms.create(1000, 400, 'plat', 'lilBox'); //upper floor mid
		ledge.body.immovable = true;
		ledge = this.platforms.create(700, 400, 'plat', 'lilBox'); //upper floor right
		ledge.body.immovable = true;
	
		//O C T O P U S
		tako = game.add.sprite(350, 1170, 'enemies', 'scaryTako');//add octopus
		tako.anchor.set(.5,.5);
		game.physics.arcade.enable(tako);
		tako.body.immovable = true;
		tako.scale.setTo(-0.5, 0.5);
		// (Width, height, offset x, offset y)
		tako.body.setSize(1000, 900, 350, 100);
		
		// P U Z Z L E 
		var Water = game.add.sprite(0, 410, 'puzzles', 'water'); // water level

		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
		
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff
		touchingLimb = game.physics.arcade.collide(limb, this.platforms); //allows limb to collide with walls and platforms and stuff
		suckers = game.physics.arcade.collide(tako, limb); // A collision for the octo 
		
		var chomped = game.physics.arcade.collide(player, tako); //variable for getting eaten
		
		// Trying to add in movement for the octo
		if(player.body.y >= 1100 && octoCanCharge == true)
		{
			// while(tako.body.x <= player.body.x)
			//{
				//tako.body.x++;
			//}
			if(player.body.x < tako.body.x && octoFlip == false){
				tako.scale.x *= -1;
				octoFlip = true;
			}
			paperSlice.play();
			game.add.tween(tako).to( {x: player.body.x }, 500, Phaser.Easing.Linear.Out, true);
			octoCanCharge = false;
		}
		if(rLegOn == false && limb.body.y >= 1100 && octoCanCharge == true)
		{
			//while(tako.body.x <= limb.body.x)
			//{
				//tako.body.x++;
			//}
			if(limb.body.x < tako.body.x && octoFlip == false){
				tako.scale.x *= -1;
				octoFlip = true;
			}
			paperSlice.play();
			game.add.tween(tako).to( {x: limb.body.x + 150 }, 500, Phaser.Easing.Linear.Out, true);
			octoCanCharge = false;
		}
		
		if(tako.body.x < 0 && octoCanCharge == false && tako.body.velocity.x == 0)
		{
			//game.add.tween(tako).to( {x: 300}, 300, Phaser.Easing.Bounce.Out, true);
			octoCanCharge = true;
			
		}
		
		
		if(player.body.y > 410 && player.body.y < 1940){ //lower the gravity so that when the player is underwater they sink slower
			player.body.velocity.y = 100;
		   	if(cursors.up.isDown){
				player.body.velocity.y = -200;
			}
		}
		else{
			player.body.gravity.y = 450;
		}
		if(limb.body.y > 410 && limb.body.y < 1940){ //lower the gravity so that when the player is underwater they sink slower
			limb.body.velocity.y = 100;
		}
		else{
			limb.body.gravity.y = 450;
		}
		// Figures out if the player is falling then adds a landing sfx.
		// C H A N G E  T H I S  A F T E R  T E S T I N G -------------v
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) /*&& rLegOn == true*/){//press space to remove limbs
			console.log('arm off');
			limbRip.play();
			rLegOn = false;
			rLeg.destroy();
			limb.x = player.x + 20; // teleport controllable limb to player
			limb.y = player.y + 20;
			game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6); //follow the limb with the camera
		}
		if(player.body.velocity.y > 0){ // check for falling
			falling = true;
		}
		if(cursors.up.isUp){// check for jumping			{
				yesJump = true;
			}
		if (touching == true && falling == true)
		{ // landing sound effect (100% polish)
			if(player.body.y < 300 )
				{
				thud.play();
				falling = false;
				console.log('Landed');
				}
		}
		if(cursors.up.isDown && touching == true){ //press up to make jump sfx
			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			if(yesJump == true)
			{
				if(player.body.y < 300 )
				{
					jumping.play();
					yesJump = false; // player can't hold up to jump
					if(walking.play())
					{//pause walking sound when jumping
					walking.pause();
					}
				}
			}
		}
		if(player.body.onFloor() != true){// pause walking sound when not on ground
			walking.pause();
		}
		if (cursors.left.isDown || cursors.right.isDown){
			if(touching == true){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
				walking.resume();//  Play walk sound
				game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			}
		}
		else {//  Pause music/sfx
			 walking.pause();
		}
			
	// L I M B	
		// W A L K I N G
 	if (game.input.keyboard.isDown(Phaser.Keyboard.A) && rLegOn == false && octocaught == false){// go left
		limb.body.velocity.x = -playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && rLegOn == false && octocaught == false){// go right
		limb.body.velocity.x = playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	} 
	else {//  don't move
		limb.body.velocity.x = 0;
	} 
								//v rffv
	if (player.body.y > 1970){//next state
		rLegOn = false;
		game.state.start('load4')
	}
	if(chomped == true && canRip == true)
	{
		limbRip.play();
	}
	
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)){ //R to restart
		game.state.start('level3')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
		walking.pause();
		octoCanCharge = true;
		octoFlip = false;
		canRip = true;
		
	}
		if (chomped == true){ //R to restart
		game.state.start('gameOver')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
		walking.pause();
		octoCanCharge = true;
		octoFlip = false;
		canRip = true;
		
	}
	
	function limbCaught (limb, tako) {//press the button
		octocaught = true;
		limb.body.gravity = 0;
		limb.body.x = tako.body.x + 60;
		limb.body.y = tako.body.y + 60;
		limb.body.velocity.x = 0;
		limb.body.velocity.x = 0;
		if(canRip == true)
		{
		levelRip.play(); // play an indicator noise
		canRip = false;
		}
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
		tako.body.velocity.x = -80;
	}
	if(tako.body.x < 150){
		tako.body.velocity.x = 0;
		//octoCanCharge = true;

	}
	game.physics.arcade.collide(limb, tako, limbCaught, null, this);// check for buttonPressed
	
	// Trying to get the octo to relaunch itself if the player gets by it	
	if(octocaught == false && tako.body.velocity.x == 0)
	{
		octoCanCharge = true;
	}
	
	},
	
/* 	render: function() {// setup debug rendering (comment out when not debugging)
			game.debug.bodyInfo(tako, 32, 32);
			game.debug.body(tako);
	},  */
}

//---------------------------------------------------------------------------
//travel cutscene
//---------------------------------------------------------------------------

var load4 = function(game) {};
load4.prototype = {
	preload: function() { // pre game loop
		console.log('load4: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
	create: function() {
		console.log('load2: create');
		var bgC3 = game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
		bgC3.scale.setTo(1.25, 1.4); //scale cutscene background
		cutscene = new Cutscene(game, 'scene', 'cuscenePlayer3');
        game.add.existing(cutscene);

		// Restarts falling noise
		fallSFX.restart();
		},
	update: function() {
		// main menu logic
		
		// Pauses SFX
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level4')//switch level
		}
		if(cutscene.body.y >820){
			game.state.start('level4')//switch level

		}	
		}
	}

//---------------------------------------------------------------------------
// L E V E L  F O U R
//---------------------------------------------------------------------------

var level4 = function(game) {};
level4.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
			game.load.audio('bearTrap', 'assets/audio/bearTrap.mp3');
			
		},
	create: function() { //make the game world
		console.log('First level: create');
		var bg = game.add.sprite(0, 0, 'back', 'Background4'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = false; //reset limb variables in case of restart
		lArmOn = false;
		rLegOn = false;
		lLegOn = true;
				//Do we need to reassign these vars?
		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		walking.pause();
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
		bearTrap = game.add.audio('bearTrap', 2, false);
	
        player = new Player(game, 'guy', 'Body', 400, 250);// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)
		
		// Destroy last music and unmute new track
		music3.destroy();
		music4.volume = 1;

		size = 1; //N O T E : figure out what this is for
		level = 4; // set first level

		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds
		var ledge = this.platforms.create(30, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(5.4, 2);
		//add a breakable rock floor for puzzle solving
		door = this.platforms.create(850, 1427, 'puzzles', 'puzzleDoor'); //Rock (make it look like a rock)
		game.physics.enable(door);
		door.body.immovable = true;
		door.scale.setTo(2, 2);
		ledge = this.platforms.create(1100, 1427, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge.scale.setTo(5, 2);
 		ledge = this.platforms.create(1850, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(0, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);
		
		// P U Z Z L E 
		//buttons part 2
		buttonTrap = game.add.sprite(1690, 1395, 'puzzles', 'buttonUp'); //add a pressable button
		buttonTrap.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttonTrap); // so the button can be pressed
		buttonTrap.body.immovable = true;
		indicator = game.add.sprite(1100, 1400, 'puzzles', 'indicatorRed'); //add an indicator to show the player what the button does
		indicator.scale.setTo(.55, .7);
		
		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff

		// Figures out if the player is falling then adds a landing sfx.
		// C H A N G E  T H I S  A F T E R  T E S T I N G ----------------------------------v
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) && trapped == true/*&& lLegOn == true*/){//press space to remove limbs
			console.log('arm off');
			limbRip.play();
			lLegOn = false;
			lLeg.destroy();
			trapped = false;
			player.body.x = 1680;
			player.body.gravity.y = 450;
		}
		if(player.body.velocity.y > 0){ // check for falling
			falling = true;
		}
		if(cursors.up.isUp){// check for jumping			{
				yesJump = true;
			}
		if (touching == true && falling == true){ // landing sound effect (100% polish)
			thud.play();
			falling = false;
			console.log('Landed');
		}
		if(cursors.up.isDown && touching == true && trapped == false){ //press up to make jump sfx
			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			if(yesJump == true && lLegOn == true){
				jumping.play();
				yesJump = false; // player can't hold up to jump
				if(walking.play()){//pause walking sound when jumping
					walking.pause();
				}
			}
		}
		if(player.body.onFloor() != true){// pause walking sound when not on ground
			walking.pause();
		}
		if ((cursors.left.isDown && trapped == false) || (cursors.right.isDown && trapped == false)){
			if(touching == true){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
				walking.resume();//  Play walk sound
				game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			}
		}
		else {//  Pause music/sfx
			 walking.pause();
		}
			
	// L I M B	
		// W A L K I N G
	// no limb movement in this level

	if (player.body.y > 1970 || cursors.down.isDown){//next state
		rLegOn = false;
		game.state.start('load5')
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)){ //R to restart
		game.state.start('level4')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
		walking.pause();

	}
	
	function trapPressed (player, buttonTrap) {//press the button
		buttonTrap.destroy();
		trapped = true; // find a way to make the player immovable
		
		buttons = game.add.sprite(80, 1397, 'puzzles', 'buttonUp');//replace with trap sprite I M P O R T A N T
		buttons.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttons); // so the button can be pressed
		buttons.body.immovable = true;
		indicator = game.add.sprite(860, 1400, 'puzzles', 'indicatorRed'); //add an indicator to show the player what the button does
		indicator.scale.setTo(-.55, .7);
		
		buttonTrap = game.add.sprite(1690, 1240, 'puzzles', 'playerTrapped');//replace with trap sprite I M P O R T A N T
		indicator = game.add.sprite(1100, 1400, 'puzzles', 'indicatorGreen'); //just to tease them
		indicator.scale.setTo(.55, .7);
		
		player.body.y = 1215;
		player.body.x = 1755;
		player.body.velocity.y = 0;
		player.body.velocity.x = 0;
		player.body.gravity.y = 0;
		lLegOn = false;
		lLeg.destroy();
		
		bearTrap.play();
		// Make a sound to let the player know they are trapped
	}
	function buttonPressed (player, buttons) {//press the button
		door.destroy(); // remove door
		levelRip.play(); // play an indicator noise
		buttons.destroy();
		buttons = game.add.sprite(80, 1397, 'puzzles', 'buttonDown');//replace with trap sprite I M P O R T A N T
		buttons.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttons); // so the button can be pressed
		buttons.body.immovable = true;
		indicator = game.add.sprite(860, 1400, 'puzzles', 'indicatorGreen'); //add an indicator to show the player what the button does
		indicator.scale.setTo(-.55, .7);
		
	}
	game.physics.arcade.collide(player, buttonTrap, trapPressed, null, this);// check for buttonPressed
	game.physics.arcade.collide(player, buttons, buttonPressed, null, this);// check for buttonPressed

	},
/* 	render: function() {// setup debug rendering (comment out when not debugging)
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(limb);
	}, */
}

//---------------------------------------------------------------------------
//travel cutscene
//---------------------------------------------------------------------------

var load5 = function(game) {};
load5.prototype = {
	preload: function() { // pre game loop
		console.log('load5: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
		game.load.audio('finalGlitch', 'assets/audio/glitchSFX.mp3');

		},
	create: function() {
		console.log('load2: create');
		var bgC4 = game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
		bgC4.scale.setTo(1.25, 1.4); //scale cutscene background
		cutscene = new Cutscene(game, 'scene', 'cuscenePlayer4');
        game.add.existing(cutscene);
		
		// Restarts falling noise
		fallSFX.restart();
		},
	update: function() {
		// main menu logic
		
		// Pauses SFX
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level5')//switch level
		}
		if(cutscene.body.y >820){
			game.state.start('level5')//switch level

		}
		}
	}

//---------------------------------------------------------------------------
// L E V E L  F I V E
//---------------------------------------------------------------------------

var level5 = function(game) {};
level5.prototype = {
	preload: function() { // pre game loop
		console.log('last level: preload');
		//nothing to load rn
		
		},
	create: function() { //make the game world
		console.log('First level: create');
		var bg = game.add.sprite(0, 0, 'back', 'Background5'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = false; //reset limb variables in case of restart
		lArmOn = false;
		rLegOn = false;
		lLegOn = false;
				//Do we need to reassign these vars?
		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		walking.pause();
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);

        player = new Player(game, 'guy', 'tearBody', 80, 0);// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)
		
		// Destroy last music and add new track
		music4.destroy();
		music5 = game.add.audio('finalGlitch',1,true);
		music5.play();
	

		size = 1; //N O T E : figure out what this is for
		level = 5; // set first level
		
		
		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds
		/*
		floor right
		floor left
		roof
		*/
		var ledge = this.platforms.create(0, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2); //12.4, 2
		ledge = this.platforms.create(300, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(600, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(900, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1200, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1500, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1800, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		
		ledge = this.platforms.create(-65, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);
		//add some platforms to jump on
		
		ledge = this.platforms.create(300, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 6.9);
		
		//  C E I L I N G
		
		ledge = this.platforms.create(300, 1000, 'plat', 'lilBox'); //roof left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(600, 1050, 'plat', 'lilBox'); //roof left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(900, 1100, 'plat', 'lilBox'); //roof left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1200, 1150, 'plat', 'lilBox'); //roof left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1500, 1200, 'plat', 'lilBox'); //roof left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1800, 1250, 'plat', 'lilBox'); //roof left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		
		ledge = this.platforms.create(-65, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);
		
		//  Set a TimerEvent to occur after 5 seconds
		timerlvl5 = game.time.create(false);
		timerlvl5.loop(100, shakelvl5, this);

		
		// P U Z Z L E 
		//comtemplation

		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff
		touchingLimb = game.physics.arcade.collide(limb, this.platforms); //allows limb to collide with walls and platforms and stuff
		
		// Falls over
		// Makes player flip over
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && flipped == false)
		{
		player.anchor.setTo(.5, .7);
		while (player.angle < 90) 
		{
			player.angle = player.angle + 1;
		}
		flipped = true;
		}


		// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0){ // check for falling
			falling = true;
		}
		if(cursors.up.isUp){// check for jumping			{
				yesJump = true;
			}
		if (touching == true && falling == true){ // landing sound effect (100% polish)
			thud.play();
			falling = false;
			console.log('Landed');
		}
		if(cursors.up.isDown && touching == true){ //press up to make jump sfx
			game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
			if(yesJump == true){
				// jumping.play();
				yesJump = false; // player can't hold up to jump
				
			}
		}
		if(player.body.onFloor() != true){// pause walking sound when not on ground
			walking.pause();
		}
	
		if (cursors.left.isDown || cursors.right.isDown){
			timerlvl5.start();

			if(touching == true)
				{ 
					if(yesSFX == true)
					{
					walking.resume();//  Play walk sound
					yesSFX == false;
					}
					game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
				}
				//walking.pause();

		}
		// Makes it so the walking sound doesn't constantly play.
		
		if (cursors.left.isUp && cursors.right.isUP)
		{
			yesSFX = true;
		}
		
		else {//  Pause music/sfx
			 walking.pause();
		}
	if (player.body.x > 1927){//next state
		music5.destroy();
		game.state.start('endLoad')
	}
	
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
				game.state.start('endLoad')	
			}
		
	},
}

//---------------------------------------------------------------------------
//travel cutscene
//---------------------------------------------------------------------------

var endLoad = function(game) {};
endLoad.prototype = {
	preload: function() { // pre game loop
		console.log('endLoad: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
		
	create: function() {
		console.log('load2: create');
		var bgCEnd = game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
		bgCEnd.scale.setTo(1.25, 1.4); //scale cutscene background
		cutscene = new Cutscene(game, 'scene', 'cuscenePlayer4');
        game.add.existing(cutscene);
		
		// Restarts falling noise
		fallSFX.restart();
		},
	update: function() {
		// main menu logic
		// Pauses SFX
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Credits')//switch level
		}
		if(cutscene.body.y >820){
			game.state.start('Credits')//switch level
			level = 0;
		}
		}
	}

//---------------------------------------------------------------------------
// E N D  C U T S C E N E
//---------------------------------------------------------------------------

var gameOver = function(game) {};
gameOver.prototype = {
	preload: function() { // pre game loop
		console.log('gameOver: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
	create: function() {
		level = 6;
		console.log('gameOver: create');
		var bgEnd = game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		bgEnd.scale.setTo(1.25, 1.4); //scale the background
		game.add.sprite(390, 450, 'guy', 'tearBody');
		var GOText = game.add.text(290, 200, 'Game Over', {font: '45px Arial', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});
		var restart = game.add.text(240, 300, 'Press spacebar to restart', {font: '30px Arial', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});
		
		},
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			if(level == 2){
				game.state.start('level2');
			}
			else if(level == 3){
				game.state.start('level3');
			}
			else if(level == 4){
				game.state.start('level4');
			}
			else if(level == 5){
				game.state.start('level5');
			}
			else{
				game.state.start('level1');
			}	
		}
	}
}

//---------------------------------------------------------------------------
// E N D  C R E D I T S
//---------------------------------------------------------------------------

var Credits = function(game) {};
Credits.prototype = {
	preload: function() { // pre game loop
		console.log('Credits: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
		game.load.image('Jake', 'assets/img/JakeCredit.png');
		},
	create: function() {
		var level = 0;
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = true; //reset limb variables in case of restart
		lArmOn = true;
		rLegOn = true;
		lLegOn = true;
				//Do we need to reassign these vars?
		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		walking.pause();
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);

        player = new Player(game, 'guy', 'tearBody', 180, 0);// add player from prefab
        game.add.existing(player);
		
		console.log('Credits: create');
		//var bgGO = game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		game.stage.backgroundColor = "#000";
		//bgGO.scale.setTo(1.25, 1.4); //scale the background
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms
		
		var ledge = this.platforms.create(0, 285, 'plat', 'lilBox'); //floor one
		ledge.body.immovable = true;
		ledge.scale.setTo(10, 2);
		ledge = this.platforms.create(320, 570, 'plat', 'lilBox'); //floor two
		ledge.body.immovable = true;
		ledge.scale.setTo(10, 2);
		ledge = this.platforms.create(0, 855, 'plat', 'lilBox'); //floor three
		ledge.body.immovable = true;
		ledge.scale.setTo(10, 2); //12.4, 2
		ledge = this.platforms.create(320, 1140, 'plat', 'lilBox'); //floor five
		ledge.body.immovable = true;
		ledge.scale.setTo(10, 2); //12.4, 2
		ledge = this.platforms.create(0, 1427, 'plat', 'lilBox'); //floor five
		ledge.body.immovable = true;
		ledge.scale.setTo(10, 2); //12.4, 2
		
 		ledge = this.platforms.create(1850, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(0, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);

		},
	update: function() {
		// main menu logic
		level = 6;
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff
		if(player.body.y > 285 && rArmOn == true){
			rArmOn = false;
			rArm.destroy();
			game.add.text(1570, 580, 'Ethan Chong', {font: '45px TimesNewRoman', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});

		}
		if(player.body.y > 570 && lArmOn == true){
			lArmOn = false;
			lArm.destroy();
			game.add.text(90, 865, 'Max Cronce', {font: '45px TimesNewRoman', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});

		}
		if(player.body.y > 855 && rLegOn == true){
			rLegOn = false;
			rLeg.destroy();
			game.add.image(1500, 1150, 'Jake');

		}
		if(player.body.y > 1140 && lLegOn == true){
			lLegOn = false;
			lLeg.destroy();
			game.add.text(90, 1437, 'With motivational support from Captain Punch (Our mascott)', {font: '45px TimesNewRoman', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});
		}
		
		if(player.body.y > 1970){
			game.state.start('TitleScreen')//switch level
		}
	}
}

//---------------------------------------------------------------------------
// End Screen
//---------------------------------------------------------------------------

var TitleScreen = function(game) {};
TitleScreen.prototype = {
	preload: function() { // pre game loop
		console.log('TitleScreen: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
	create: function() {
		console.log('TitleScreen: create');
		//var bgGO = game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		game.stage.backgroundColor = "#000";
		//bgGO.scale.setTo(1.25, 1.4); //scale the background

		//E V A N G E L I O N
		game.add.text(10, 70, 'Keep It', {font: '90px TimesNewRoman', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});
		game.add.text(10, 140, 'Together', {font: '170px TimesNewRoman', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});
		game.add.text(10, 345, 'Week: 10', {font: '45px Arial', fill: '#FFF', fontWeight: 'bold', strokeThickness: 3});
		game.add.text(420,420, 'This is (not) a game.', {font: '40px TimesNewRoman', fill: '#FFF', fontWeight: 'bold', strokeThickness: 2});

		},
	update: function() {
		// main menu logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level1')//switch level
		}
		}
	}
	
function shake()
{
	// Sets intensity and duration
	game.camera.shake(shakeIntensity , shakeLength)
	
	shakeIntensity *= 1.5;
	if(shakeLength < time )
	{
	shakeLength *= 1.3;
	}
	time *= 1.1;
}

function shakelvl5()
{
	shakeLength = 10000000000000000;
	game.camera.shake(.005, shakeLength)
	console.log('shakey bakey');
}

//---------------------------------------------------------------------------
// S T A T E S
//---------------------------------------------------------------------------

game.state.add('level1', level1);
game.state.add('load2', load2);
game.state.add('level2', level2);
game.state.add('load3', load3);
game.state.add('level3', level3);
game.state.add('load4', load4);
game.state.add('level4', level4);
game.state.add('load5', load5);
game.state.add('level5', level5);
game.state.add('endLoad', endLoad);
game.state.add('gameOver', gameOver);
game.state.add('TitleScreen', TitleScreen);
game.state.add('Credits', Credits);
game.state.start('level1');

