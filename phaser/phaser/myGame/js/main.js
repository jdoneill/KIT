var game = new Phaser.Game(800, 500, Phaser.AUTO);

// P L A Y E R
//var Pboi; // it's a player
var playerV = 10; //changable for each level
var player;

// O B S T A C L E S

// S O U N D S
var music;

// L E V E L  O N E 
var level1 = function(game) {};
level1.prototype = {
	preload: function() { // pre game loop
		console.log('First level: preload');
		game.load.atlas('sheeet', 'assets/img/spritesheet.png', 'assets/img/sprites.json'); // load the stuff


		},
	create: function() {
		console.log('First level: create');
		
		game.physics.startSystem(Phaser.Physics.ARCADE); // stole this from the tutorial to add physics
		
		game.add.sprite(0, 0, 'sheeet', 'Background1'); // add da background

        player = new Player(game, 'sheeet', 'Body');	
        game.add.existing(player);
		

		},
	update: function() {
		// main menu logic

	}
}


//travel cutscene---------------------------------------------------------------------------
var load2 = function(game) {};
load2.prototype = {
	preload: function() { // pre game loop
		console.log('load2: preload');

		},
	create: function() {
		console.log('load2: create');

		},
	update: function() {
		// main menu logic

		}
	}

// L E V E L  T W O
var level2 = function(game) {};
level2.prototype = {
	preload: function() { // pre game loop
		console.log('second level: preload');

		},
	create: function() {
		console.log('second level: create');

		},
	update: function() {
		// main menu logic

		}
	}


//travel cutscene---------------------------------------------------------------------------
var load3 = function(game) {};
load3.prototype = {
	preload: function() { // pre game loop
		console.log('load3: preload');

		},
	create: function() {
		console.log('load3: create');

		},
	update: function() {
		// main menu logic

		}
	}

// L E V E L  T H R E E
var level3 = function(game) {};
level3.prototype = {
	preload: function() { // pre game loop
		console.log('thrid level: preload');

		},
	create: function() {
		console.log('third level: create');

		},
	update: function() {
		// main menu logic

		}
	}


//travel cutscene---------------------------------------------------------------------------
var load4 = function(game) {};
load4.prototype = {
	preload: function() { // pre game loop
		console.log('load4: preload');

		},
	create: function() {
		console.log('load4: create');

		},
	update: function() {
		// main menu logic

		}
	}

// L E V E L  F O U R
var level4 = function(game) {};
level4.prototype = {
	preload: function() { // pre game loop
		console.log('fourth level: preload');

		},
	create: function() {
		console.log('fourth level: create');

		},
	update: function() {
		// main menu logic

		}
	}

//travel cutscene---------------------------------------------------------------------------
var load5 = function(game) {};
load5.prototype = {
	preload: function() { // pre game loop
		console.log('load5: preload');

		},
	create: function() {
		console.log('load5: create');

		},
	update: function() {
		// main menu logic

		}
	}

// L E V E L  F I V E
var level5 = function(game) {};
level5.prototype = {
	preload: function() { // pre game loop
		console.log('fifth level: preload');

		},
	create: function() {
		console.log('fifth level: create');

		},
	update: function() {
		// main menu logic

		}
	}

//travel cutscene---------------------------------------------------------------------------
var endLoad = function(game) {};
endLoad.prototype = {
	preload: function() { // pre game loop
		console.log('endLoad: preload');

		},
	create: function() {
		console.log('endLoad: create');

		},
	update: function() {
		// main menu logic

		}
	}

// E N D  C U T S C E N E
var endCutscene = function(game) {};
endCutscene.prototype = {
	preload: function() { // pre game loop
		console.log('endCutscene: preload');

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