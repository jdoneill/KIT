//var game = new Phaser.Game(800, 500, Phaser.AUTO);
var game = new Phaser.Game(1920, 1500, Phaser.AUTO); //rffv
//rffv means remove from final version (word search through document to find these before the final push)

// P L A Y E R
var playerVel = 150;
var player;
var cutscene;
var size;
var falling = false;
var yesJump = true; 
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

// L E V E L  T R A C K E R 
var level;
var currentLevel;

// O B S T A C L E S
var buttons;
var platforms;
var door;

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
		game.load.image('rightArm', 'assets/img/armRside.png'); //rffv make a texture atlas
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
		console.log('First level: create');
		var bg = game.add.sprite(0, 0, 'back', 'Background1'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = true; //reset limb variables in case of restart
		lArmOn = true;
		rLegOn = true;
		lLegOn = true;

		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		music = game.add.audio('claireDeLune',1,true);
		music2 = game.add.audio('glitch1',0,true);
		music3 = game.add.audio('glitch2',0,true);
		music4 = game.add.audio('glitch3',0,true);
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
	
        player = new Player(game, 'guy', 'Body');// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)
		music.play();
		music2.play();
		music3.play();
		music4.play();

		size = 1; //N O T E : figure out what this is for
		level = 1; // set first level
		
		limb = game.add.sprite(1920, 400, 'rightArm'); //add the controlable limb in where the player can't see
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
		//game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff
		touchingLimb = game.physics.arcade.collide(limb, this.platforms); //allows limb to collide with walls and platforms and stuff

		// Figures out if the player is falling then adds a landing sfx.
		// C H A N G E  T H I S  A F T E R  T E S T I N G -------------v 			//rffv remove commet block
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) /*&& rArmOn == true*/){//press space to remove limbs
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
			game.state.start('level2')
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
		//nothing to load rn
		game.load.image('leftArm', 'assets/img/armLside.png');

		},
	create: function() { //make the game world
		console.log('First level: create');
		var bg = game.add.sprite(0, 0, 'back', 'Background2'); // add background, level 1 green for right arm
		bg.scale.setTo(3, 3); //scale the background		
		game.physics.startSystem(Phaser.Physics.ARCADE); // add physics
		rArmOn = false; //reset limb variables in case of restart
		lArmOn = true;
		rLegOn = true;
		lLegOn = true;
				//Do we need to reassign these vars?
		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
	
        player = new Player(game, 'guy', 'Body');// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)

		size = 1; //N O T E : figure out what this is for
		level = 2; // set first level
		
		limb = game.add.sprite(1920, 400, 'leftArm'); //add the controlable limb in where the player can't see
	    game.physics.arcade.enable(limb);
		limb.scale.setTo(1.5, 1);
		limb.body.gravity.y = 450; // same physics as player
		limb.body.collideWorldBounds = true; // don't fall through the earth

		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds
		/*
		floor right
		floor left
		roof
		wall right
		wall left
		parkour platforms x4
		breakable rock
		*/
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
		//add some platforms to jump on
		ledge = this.platforms.create(1650, 1310, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
	//	ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1400, 1200, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge = this.platforms.create(1150, 1090, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		
		// P U Z Z L E 
		//rock floor
		//add hook

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
		// C H A N G E  T H I S  A F T E R  T E S T I N G -------------v
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) /*&& lArmOn == true*/){//press space to remove limbs
			console.log('arm off');
			limbRip.play();
			lArmOn = false;
			lArm.destroy();
			limb.x = player.x - 40; // teleport controllable limb to player
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
			
	// L I M B	
		// W A L K I N G
 	if (game.input.keyboard.isDown(Phaser.Keyboard.A) && lArmOn == false){// go left
		limb.body.velocity.x = -playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && lArmOn == false){// go right
		limb.body.velocity.x = playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	} 
	else {//  don't move
		limb.body.velocity.x = 0;
	} 

	if (player.body.y > 1970 || cursors.down.isDown){//next state
		lArmOn = false;
		game.state.start('load3')
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)){ //R to restart
		game.state.start('level2')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
	}		

	function rockBounce (player, door) {//jump on rocks
		door.destroy(); // remove door
		//A D D  S F X  H E R E
		
		
		// Make a sound to let the player know something has changed
		// paper crumple
	}
	game.physics.arcade.collide(player, door, rockBounce, null, this);// check for rockBounce
	},
/* 	render: function() {// setup debug rendering (comment out when not debugging)
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(limb);
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

		},
	create: function() {
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
		//nothing to load rn
		game.load.image('rightLeg', 'assets/img/legRside.png');

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
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
	
        player = new Player(game, 'guy', 'Body');// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)

		size = 1; //N O T E : figure out what this is for
		level = 3; // set first level
		
		limb = game.add.sprite(1920, 400, 'rightLeg'); //add the controlable limb in where the player can't see
	    game.physics.arcade.enable(limb);
		limb.scale.setTo(1.5, 1);
		limb.body.gravity.y = 450; // same physics as player
		limb.body.collideWorldBounds = true; // don't fall through the earth

		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds
		/*
		floor right
		floor left
		roof
		wall right
		wall left
		parkour platforms x4
		breakable rock
		*/
		var ledge = this.platforms.create(30, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(5.4, 2);
		//add a breakable rock floor for puzzle solving
/* 		door = this.platforms.create(850, 1427, 'puzzles', 'puzzleDoor'); //Rock (make it look like a rock)
		game.physics.enable(door);
		door.body.immovable = true;
		door.scale.setTo(2, 2); */
		ledge = this.platforms.create(1100, 1427, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge.scale.setTo(5, 2);
 		ledge = this.platforms.create(1850, 0, 'plat', 'lilBoxUziVertical'); // right wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10); 
		ledge = this.platforms.create(0, 0, 'plat', 'lilBoxUziVertical'); // left wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 10);
		//add some platforms to jump on
		ledge = this.platforms.create(1650, 1310, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
	//	ledge.scale.setTo(2, 2);
		ledge = this.platforms.create(1400, 1200, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		ledge = this.platforms.create(1150, 1090, 'plat', 'lilBox'); //floor right
		ledge.body.immovable = true;
		
		// P U Z Z L E 
		//Octopus

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
			
	// L I M B	
		// W A L K I N G
 	if (game.input.keyboard.isDown(Phaser.Keyboard.A) && rLegOn == false){// go left
		limb.body.velocity.x = -playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && rLegOn == false){// go right
		limb.body.velocity.x = playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	} 
	else {//  don't move
		limb.body.velocity.x = 0;
	} 

	if (player.body.y > 1970 || cursors.down.isDown){//next state
		rLegOn = false;
		game.state.start('load4')
	}
	if (game.input.keyboard.isDown(Phaser.Keyboard.R)){ //R to restart
		game.state.start('level3')
		music.destroy(); //so the music doesn't overlap
		music2.destroy();
		music3.destroy();
		music4.destroy();
	}		

	function buttonPressed (limbs, buttons) {//press the button
		door.destroy(); // remove door
		//A D D  S F X  H E R E
		buttons.destroy();
		buttons = game.add.sprite(1690, 1397, 'puzzles', 'buttonDown');//replace with button pressed sprite
		buttons.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttons); // add physics to the button (line might be unnecessary)
		buttons.body.immovable = true;
		indicator = game.add.sprite(610, 1400, 'puzzles', 'indicatorGreen'); //show the player that something has happened
		indicator.scale.setTo(.95, .7);
		
		// Make a sound to let the player know something has changed
		levelRip.play();
	}
	game.physics.arcade.collide(limb, buttons, buttonPressed, null, this);// check for buttonPressed
	},
/* 	render: function() {// setup debug rendering (comment out when not debugging)
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(limb);
	}, */
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
		//nothing to load rn
		game.load.image('leftLeg', 'assets/img/legLside.png');

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
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
	
        player = new Player(game, 'guy', 'Body');// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)

		size = 1; //N O T E : figure out what this is for
		level = 4; // set first level
		
		limb = game.add.sprite(1920, 400, 'leftLeg'); //add the controlable limb in where the player can't see
	    game.physics.arcade.enable(limb);
		limb.scale.setTo(1.5, 1);
		limb.body.gravity.y = 450; // same physics as player
		limb.body.collideWorldBounds = true; // don't fall through the earth

		//level layout
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		// Add platforms for world bounds
		/*
		floor right
		floor left
		roof
		wall right
		wall left
		parkour platforms x4
		breakable rock
		*/
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
		//buttons part 2

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
		// C H A N G E  T H I S  A F T E R  T E S T I N G -------------v
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) /*&& lLegOn == true*/){//press space to remove limbs
			console.log('arm off');
			limbRip.play();
			lLegOn = false;
			lLeg.destroy();
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
			
	// L I M B	
		// W A L K I N G
 	if (game.input.keyboard.isDown(Phaser.Keyboard.A) && lLegOn == false){// go left
		limb.body.velocity.x = -playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	}
	else if (game.input.keyboard.isDown(Phaser.Keyboard.D) && lLegOn == false){// go right
		limb.body.velocity.x = playerVel;
		game.camera.follow(limb, Phaser.Camera.FOLLOW_LOCKON, .6, .6);
	} 
	else {//  don't move
		limb.body.velocity.x = 0;
	} 

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
	}		

	function buttonPressed (limbs, buttons) {//press the button
		door.destroy(); // remove door
		//A D D  S F X  H E R E
		buttons.destroy();
		buttons = game.add.sprite(1690, 1397, 'puzzles', 'buttonDown');//replace with button pressed sprite
		buttons.scale.setTo(1.9, 2);
	    game.physics.arcade.enable(buttons); // add physics to the button (line might be unnecessary)
		buttons.body.immovable = true;
		indicator = game.add.sprite(610, 1400, 'puzzles', 'indicatorGreen'); //show the player that something has happened
		indicator.scale.setTo(.95, .7);
		
		// Make a sound to let the player know something has changed
		levelRip.play();
	}
	game.physics.arcade.collide(limb, buttons, buttonPressed, null, this);// check for buttonPressed
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
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
		limbRip = game.add.audio('limbSound', 1, false);
		levelRip = game.add.audio('levelShift', 1, false);
	
        player = new Player(game, 'guy', 'Body');// add player from prefab
        game.add.existing(player);

		walking.play(); //play the music so it lines up across all levels (excluding final level)

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
	},
/* 	render: function() {// setup debug rendering (comment out when not debugging)
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(limb);
	}, */
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
			game.state.start('endCutscene')//switch level
		}
		if(cutscene.body.y >820){
			game.state.start('endCutscene')//switch level

		}
		}
	}

//---------------------------------------------------------------------------
// E N D  C U T S C E N E
//---------------------------------------------------------------------------

var endCutscene = function(game) {};
endCutscene.prototype = {
	preload: function() { // pre game loop
		console.log('endCutscene: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
	create: function() {
		console.log('endCutscene: create');
		var bgEnd = game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		bgEnd.scale.setTo(1.25, 1.4); //scale the background
		game.add.sprite(390, 450, 'guy', 'Body');
		
		},
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('GameOver')//switch level
		}
		}
	}

//---------------------------------------------------------------------------
// G A M E  O V E R
//---------------------------------------------------------------------------

var GameOver = function(game) {};
GameOver.prototype = {
	preload: function() { // pre game loop
		console.log('GameOver: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
	create: function() {
		console.log('GameOver: create');
		var bgGO = game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		bgGO.scale.setTo(1.25, 1.4); //scale the background
		music.destroy();
		music2.destroy();
		music3.destroy();
		music4.destroy();
		music5.destroy();
		game.add.text(380, 300, 'Game Over', { fontSize: '50px', fill: '#000' });
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
	game.camera.shake(0.05 , 500)
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
game.state.add('endCutscene', endCutscene);
game.state.add('GameOver', GameOver);
game.state.start('level1');

