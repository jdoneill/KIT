var game = new Phaser.Game(800, 500, Phaser.AUTO);
//var game = new Phaser.Game(1920, 1500, Phaser.AUTO);

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
var buttonPressed;
var thud;

// L E V E L  O N E 
var level1 = function(game) {};
level1.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
		game.load.atlas('plat', 'assets/img/platforms.png', 'assets/img/platforms.json'); //load platforms
		game.load.atlas('puzzles', 'assets/img/puzzles.png', 'assets/img/puzzles.json'); //load platforms
		game.load.image('rightArm', 'assets/img/armRside.png');
		
		// L O A D  A U D I O
		game.load.audio('walkNoise', 'assets/audio/rub.mp3');
		game.load.audio('claireDeLune', 'assets/audio/Clair De lune.mp3');
		game.load.audio('glitch1', 'assets/audio/glitch2.mp3');
		game.load.audio('glitch2', 'assets/audio/glitch3.mp3');
		game.load.audio('glitch3', 'assets/audio/glitch4.mp3');
		game.load.audio('thudSFX', 'assets/audio/paperTapTable.mp3');

		game.load.audio('paperTap', 'assets/audio/jumpSFX.mp3');
		
		},
	create: function() {
		console.log('First level: create');

		var bg = game.add.sprite(0, 0, 'back', 'Background1'); // add da background
		bg.scale.setTo(3, 3); //scale the background		

		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		rArmOn = true;
		lArmOn = true;
		rLegOn = true;
		lLegOn = true;

		//game.add.text(0, 0, 'Oh, you got here early...\n We still need to build most of the puzzles,\n but feel free to look around. -> \n...Oh and use the arrow keys to move\n If you want to skip to any stage press space', { fontSize: '30px', fill: '#000' });

		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		music = game.add.audio('claireDeLune',1,true);
		music2 = game.add.audio('glitch1',0,true);
		music3 = game.add.audio('glitch2',0,true);
		music4 = game.add.audio('glitch3',0,true);
		thud = game.add.audio('thudSFX', 1, false);
		jumping = game.add.audio('paperTap',1,false);
	
        	player = new Player(game, 'guy', 'Body');	
        	game.add.existing(player);

		walking.play();
		music.play();
		music2.play();
		music3.play();
		music4.play();

		size = 1;
		level = 1;
		rArmOn = true;
		lArmOn = true;
		rLegOn = true;
		lLegOn = true;
		
		limb = game.add.sprite(1920, 400, 'rightArm');
	    game.physics.arcade.enable(limb); // add physics to the playa
		limb.scale.setTo(1.5, 1);
		limb.body.gravity.y = 450; // succumb to gravity mortal fool
		limb.body.collideWorldBounds = true; // don't fall through the earth

		//level layout
			//adds the platforms to level 1
		this.platforms = game.add.group(); //create platforms group
		this.platforms.enableBody = true; //enable physics to for platforms

		//create platforms and stuff
		
		var ledge = this.platforms.create(1375, 800, 'plat', 'bigBox'); // puzzle roof
		ledge.body.immovable = true;
		ledge.scale.setTo(1.5, 1.05);
		ledge = this.platforms.create(1375, 1100, 'plat', 'midBox'); // puzzle wall
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
		//add a movable floor for puzzle solving
		ledge = this.platforms.create(30, 1427, 'plat', 'lilBox'); //floor left
		ledge.body.immovable = true;
		ledge.scale.setTo(2, 2);
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
		
		//Puzzle for level 1
		buttons = game.add.sprite(1690, 1395, 'puzzles', 'buttonUp');
		buttons.scale.setTo(1.9, 2);
		indicator = game.add.sprite(610, 1400, 'puzzles', 'indicatorRed');
		indicator.scale.setTo(.95, .7);

			// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		       
		touching = game.physics.arcade.collide(player, this.platforms); //allows player to collide with walls and platforms and stuff
		touchingLimb = game.physics.arcade.collide(limb, this.platforms); //allows player to collide with walls and platforms and stuff

		
		// Figures out if the player is falling then adds a landing sfx.
		// C H A NG E  T H I S  A F T E R  T E S T I N G
		if (game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) /*&& rArmOn == true*/){//press space to remove limbs
			console.log('arm off');
			rArmOn = false;
			rArm.destroy();
			limb.x = player.x + 40;
			limb.y = player.y;
		}
		
		if(player.body.velocity.y > 0)
		{
			falling = true;
		}
		
		if(cursors.up.isUp)
			{
				yesJump = true;
			}
		
		if (touching == true && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && touching == true)
			{ //press up to make jump sfx
				if(yesJump == true)
				{
					jumping.play();
					yesJump = false;
					if(walking.play())
					{//pause walking sound when jumping
						walking.pause();
					}
				}
			}
			
			if(player.body.onFloor() != true)
			{
				walking.pause();

			}
			if (cursors.left.isDown || cursors.right.isDown){
				if(touching == true){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
					//  Play walk sound
					walking.resume();
				}
			}
			else {
				//  Pause music/sfx
				 walking.pause();
			}
			
	// L I M B ------------------------------------
	
		// W A L K I N G
/* 	if (game.input.Phaser.keyboard.A.isDown){
		//  go left
		limb.body.velocity.x = -playerVel;
	}
	
	else if (cursors.D.isDown){
		//  go right
		limb.body.velocity.x = playerVel;
	}
	
	else {
		//  don't move
		limb.body.velocity.x = 0;
	} */
			
	if (cursors.down.isDown)
			{
				game.state.start('load2')
				rArmOn = false;
				level = level +1;
			}
	},
	
	render: function() {
		// setup debug rendering
			game.debug.bodyInfo(limb, 32, 32);
			game.debug.body(limb);
	},
	

}


//travel cutscene---------------------------------------------------------------------------
var load2 = function(game) {};
load2.prototype = {
	preload: function() { // pre game loop
		console.log('load2: preload');
		game.load.atlas('scene', 'assets/img/cutscenes.png', 'assets/img/cutscenes.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
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

// L E V E L  T W O
var level2 = function(game) {};
level2.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff


		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		var bg2 = game.add.sprite(0, 0, 'back', 'Background2'); // add da background
		bg2.scale.setTo(1.25, 1.4); //scale the background


        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;
			// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music.destroy();
			music2.volume = 1;
			
		// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
		}
		
		if(cursors.up.isUp)
			{
				yesJump = true;
			}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor())
			{ //press up to make jump sfx
				if(yesJump == true)
				{
					jumping.play();
					yesJump = false;
					if(walking.play())
					{//pause walking sound when jumping
						walking.pause();
					}
				}
			}

			if(player.body.onFloor() != true)
			{
				walking.pause();

			}
			if (cursors.left.isDown || cursors.right.isDown){
				if(player.body.onFloor()){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
					//  Play walk sound
					walking.resume();
				}
			}
			else {
				//  Pause music/sfx
				 walking.pause();
			}
		if (cursors.down.isDown)
		{
			game.state.start('load3')
			lArmOn = false;
			level = level +1;
		}

		

	},
/* 		render: function() {
		// setup debug rendering
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
	}, */
	}


//travel cutscene---------------------------------------------------------------------------
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

// L E V E L  T H R E E
var level3 = function(game) {};
level3.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff


		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		var bg3 = game.add.sprite(0, 0, 'back', 'Background3'); // add da background
		bg3.scale.setTo(1.25, 1.4); //scale the background

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;

		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music2.destroy();
			music3.volume = 1;
			
					// Figures out if the player is falling then adds a landing sfx.
		// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
		}
		
		if(cursors.up.isUp)
			{
				yesJump = true;
			}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor())
			{ //press up to make jump sfx
				if(yesJump == true)
				{
					jumping.play();
					yesJump = false;
					if(walking.play())
					{//pause walking sound when jumping
						walking.pause();
					}
				}
			}

			if(player.body.onFloor() != true)
			{
				walking.pause();

			}
			if (cursors.left.isDown || cursors.right.isDown){
				if(player.body.onFloor()){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
					//  Play walk sound
					walking.resume();
				}
			}
			else {
				//  Pause music/sfx
				 walking.pause();
			}
	if (cursors.down.isDown)
			{
				game.state.start('load4')
				rLegOn = false;
				level = level +1;
			}
	},
/* 			render: function() {
		// setup debug rendering
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
	}, */
	}


//travel cutscene---------------------------------------------------------------------------
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

// L E V E L  F O U R
var level4 = function(game) {};
level4.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff


		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		var bg4 = game.add.sprite(0, 0, 'back', 'Background4'); // add da background
		bg4.scale.setTo(1.25, 1.4); //scale the background

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;
		
			// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music3.destroy();
			music4.volume = 1;
			
					// Figures out if the player is falling then adds a landing sfx.
		// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
		}
		
		if(cursors.up.isUp)
			{
				yesJump = true;
			}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor())
			{ //press up to make jump sfx
				if(yesJump == true)
				{
					jumping.play();
					yesJump = false;
					if(walking.play())
					{//pause walking sound when jumping
						walking.pause();
					}
				}
			}

			if(player.body.onFloor() != true)
			{
				walking.pause();

			}
			if (cursors.left.isDown || cursors.right.isDown){
				if(player.body.onFloor()){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
					//  Play walk sound
					walking.resume();
				}
			}
			else {
				//  Pause music/sfx
				 walking.pause();
			}
	if (cursors.down.isDown)
		{
			game.state.start('load5')
			lLegOn = false;
			level = level +1;
		}

		

	},
/* 			render: function() {
		// setup debug rendering
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
	}, */
	}

//travel cutscene---------------------------------------------------------------------------
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

// L E V E L  F I V E
var level5 = function(game) {};
level5.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff
		game.load.audio('glitchF', 'assets/audio/glitch sfx.mp3');

		

		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		var bg5 = game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		bg5.scale.setTo(1.25, 1.4); //scale the background

		buttons = game.add.sprite(700, 480, 'puzzles', 'buttonUp'); // add da background
		game.physics.enable(buttons, Phaser.Physics.ARCADE);
		buttons.body.immovable = true;
		buttons.collideWorldBounds = true;
		buttons.body.checkCollision.up = true;
		buttonPressed = game.add.audio('pressed',1,false);
		buttonPressed.pause();
		
        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;
		
		music5 = game.add.audio('glitchF',1,true);
		music5.play();

		// C A M E R A  S T U F F
		game.world.setBounds(0,0,1920, 1500);
		game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.6, 0.6);
		// game.input.onDown.add(shake, this);
		
		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music4.destroy();
		// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
		}
		
		if(cursors.up.isUp)
			{
				yesJump = true;
			}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor())
			{ //press up to make jump sfx
				if(yesJump == true)
				{
					jumping.play();
					yesJump = false;
					if(walking.play())
					{//pause walking sound when jumping
						walking.pause();
					}
				}
			}

			if(player.body.onFloor() != true)
			{
				walking.pause();

			}
			if (cursors.left.isDown || cursors.right.isDown){
				if(player.body.onFloor()){ //play sound when player is moving on the ground (taken from phaser.io exmaple code)
					//  Play walk sound
					walking.resume();
				}
			}
			else {
				//  Pause music/sfx
				 walking.pause();
			}
	if (cursors.down.isDown)
		{
			game.state.start('endLoad')
			level = level +1;
		}
		function buttonPress (player, buttons) {//press the button to "win"
			game.state.start('endLoad')

	}
		game.physics.arcade.collide(player, buttons, buttonPress, null, this);

	},
	
/* 		render: function() {
		// setup debug rendering
			game.debug.bodyInfo(player, 32, 32);
			game.debug.body(player);
	},
	 */
	
	}

//travel cutscene---------------------------------------------------------------------------
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

// E N D  C U T S C E N E
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
	
// G A M E  O V E R
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
