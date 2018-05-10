var game = new Phaser.Game(800, 500, Phaser.AUTO);

// P L A Y E R
var playerV = 10; //changable for each level
var player;

// O B S T A C L E S

// S O U N D S
var music;
var walking;

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

		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		game.add.sprite(0, 0, 'back', 'Background1'); // add da background
		
		walking = game.add.audio('walkNoise', 1, true); // add walk sfx, vol 1, looping true
		music = game.add.audio('claireDeLune',2,true);

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);

		walking.play();
		music.play();
		

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
			
			if(cursors.up.isDown){ //press up to make jump sfx
				
				console.log('jumpSound');
			}
			
			if (cursors.left.isDown || cursors.right.isDown){
				//  Play walk sound
				walking.resume();
				
			}
			
			else {
				//  Pause music/sfx
				 walking.pause();
				
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			{
				game.state.start('load2')
			}

	}
}


//travel cutscene---------------------------------------------------------------------------
var load2 = function(game) {};
load2.prototype = {
	preload: function() { // pre game loop
		console.log('load2: preload');
		game.load.atlas('guy', 'assets/img/Player.png', 'assets/img/Player.json'); // load the stuff
		game.load.atlas('back', 'assets/img/Backgrounds.png', 'assets/img/Backgrounds.json'); // load the stuff

		},
	create: function() {
		console.log('load2: create');

		},
	update: function() {
		// main menu logic
		
		// Pauses SFX
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level2')
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
		

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		
		if(cursors.up.isDown){ //press up to make jump sfx
			
			console.log('jumpSound');
		}
		
		if (cursors.left.isDown || cursors.right.isDown){
			//  Play walk sound
			walking.resume();
			
		}
		
		else {
			//  Pause music/sfx
			 walking.pause();
			
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('load3')
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
		console.log('load3: create');

		},
	update: function() {
		// main menu logic
		
		walking.pause();
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level3')
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
		

		},
	update: function() {
			var cursors = game.input.keyboard.createCursorKeys();
			
			if(cursors.up.isDown){ //press up to make jump sfx
				
				console.log('jumpSound');
			}
			
			if (cursors.left.isDown || cursors.right.isDown){
				//  Play walk sound
				walking.resume();
				
			}
			
			else {
				//  Pause music/sfx
				 walking.pause();
				
			}
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			{
				game.state.start('load4')
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
		console.log('load4: create');

		},
	update: function() {
		// main menu logic
		
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level4')
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
		

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		
		if(cursors.up.isDown){ //press up to make jump sfx
			
			console.log('jumpSound');
		}
		
		if (cursors.left.isDown || cursors.right.isDown){
			//  Play walk sound
			walking.resume();
			
		}
		
		else {
			//  Pause music/sfx
			 walking.pause();
			
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('load5')
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
		console.log('load5: create');

		},
	update: function() {
		// main menu logic
		
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('level5')
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


		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		game.add.sprite(0, 0, 'back', 'Background5'); // add da background

        player = new Player(game, 'guy', 'Body');	
        game.add.existing(player);
		

		},
	update: function() {
		var cursors = game.input.keyboard.createCursorKeys();
		
		if(cursors.up.isDown){ //press up to make jump sfx
			
			console.log('jumpSound');
		}
		
		if (cursors.left.isDown || cursors.right.isDown){
			//  Play walk sound
			walking.resume();
			
		}
		
		else {
			//  Pause music/sfx
			 walking.pause();
			
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('endLoad')
		}

		

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
		console.log('endLoad: create');

		},
	update: function() {
		// main menu logic
		walking.pause();
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('endCutscene')
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

		},
	update: function() {
		// main menu logic

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

		},
	update: function() {
		// main menu logic

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