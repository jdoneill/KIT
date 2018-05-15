var game = new Phaser.Game(800, 500, Phaser.AUTO);

//var game = new Phaser.Game(800, 500, Phaser.AUTO, 'Keep It Together', { preload: preload, create: create, update: update, render: render });

// P L A Y E R
var playerV = 10; //changable for each level
var player;
var cutscene;
var size;
var falling = false;
var rArm;
var rArmOn = true;
var lArm;
var lArmOn = true;
var rLeg;
var rLegOn = true;
var lLeg;
var lLegOn = true;

var level;

// O B S T A C L E S
var buttons;

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
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		game.add.sprite(0, 0, 'back', 'Background1'); // add da background
		game.add.text(0, 0, 'Oh, you got here early...\n We still need to build most of the puzzles,\n but feel free to look around. -> \n...Oh and use the arrow keys to move\n If you want to skip to any stage press space', { fontSize: '30px', fill: '#000' });

		// Assigns the audio to a global variable
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		music = game.add.audio('claireDeLune',2,true);
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
		

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		
		// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
		}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor()){ //press up to make jump sfx
				jumping.play();
				
				if(walking.play()){//pause walking sound when jumping
					walking.pause();
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
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || player.x > 760)
			{
				game.state.start('load2')
				rArmOn = false;
				level = level +1;
			}
	}

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
		game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
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
		
		game.add.sprite(0, 0, 'back', 'Background2'); // add da background

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music.destroy();
			music2.volume = 2;
			
					// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
			
			
		}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor()){ //press up to make jump sfx
				
				jumping.play();
				
				
				//pause walking sound when jumping
				if(walking.play()){
					walking.pause();
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
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || player.x > 760)
		{
			game.state.start('load3')
			lArmOn = false;
			level = level +1;
		}

		

	}
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
		game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
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
		
		game.add.sprite(0, 0, 'back', 'Background3'); // add da background

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music2.destroy();
			music3.volume = 2;
			
					// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
			
			
		}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			music2.destroy();
			music3.volume = 2;
			if(cursors.up.isDown && player.body.onFloor()){ //press up to make jump sfx
				
				jumping.play();
				
				
				//pause walking sound when jumping
				if(walking.play()){
					walking.pause();
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
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || player.x > 760)
			{
				game.state.start('load4')
				rLegOn = false;
				level = level +1;
			}


	}
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
		game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
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
		
		game.add.sprite(0, 0, 'back', 'Background4'); // add da background

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music3.destroy();
			music4.volume = 2;
			
					// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
			
			
		}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor()){ //press up to make jump sfx
				
				jumping.play();
				
				
				//pause walking sound when jumping
				if(walking.play()){
					walking.pause();
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
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || player.x > 760)
		{
			game.state.start('load5')
			lLegOn = false;
			level = level +1;
		}

		

	}
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
		game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
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
		game.load.atlas('puzzle', 'assets/img/puzzles.png', 'assets/img/puzzles.json'); // load the stuff
		game.load.audio('pressed', 'assets/audio/sadTrombone.mp3');
		game.load.audio('glitchF', 'assets/audio/glitch sfx.mp3');

		

		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		game.add.sprite(0, 0, 'back', 'Background5'); // add da background
				
		buttons = game.add.sprite(700, 480, 'puzzle', 'buttonUp'); // add da background
		game.physics.enable(buttons, Phaser.Physics.ARCADE);
		buttons.body.immovable = true;
		buttons.collideWorldBounds = true;
		buttons.body.checkCollision.up = true;
		buttonPressed = game.add.audio('pressed',1,false);
		buttonPressed.pause();
		
        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		size = 1;
		
		music5 = game.add.audio('glitchF',2,true);
		music5.play();

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			music4.destroy();
			
					// Figures out if the player is falling then adds a landing sfx.
		if(player.body.velocity.y > 0)
		{
			falling = true;
			
			
		}
		
		if (player.body.onFloor() && falling == true)
		{
			thud.play();
			falling = false;
			console.log('Landed');
		}
			
			if(cursors.up.isDown && player.body.onFloor()){ //press up to make jump sfx
				
				jumping.play();
				
				
				//pause walking sound when jumping
				if(walking.play()){
					walking.pause();
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
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || player.body.collide) //collide with button
		{
			game.state.start('endLoad')
			level = level +1;
		}
		function buttonPress (player, buttons) {//press the button to "win"
			game.state.start('endLoad')
//add sfx
		//	buttonPressed.play();

	}
		game.physics.arcade.collide(player, buttons, buttonPress, null, this);

	}
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
		game.add.sprite(0, 0, 'back', 'BackgroundCutscene'); // add da background
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
		game.add.sprite(0, 0, 'back', 'Background5'); // add da background
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
		game.add.sprite(0, 0, 'back', 'Background5'); // add da background
		music.destroy();
		music2.destroy();
		music3.destroy();
		music4.destroy();

		music5.destroy();
		game.add.text(280, 200, 'Game Over', { fontSize: '50px', fill: '#000' });
		},
	update: function() {
		// main menu logic
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level1')//switch level
		}
		}
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
