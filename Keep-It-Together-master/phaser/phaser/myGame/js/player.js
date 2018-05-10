function Player (game, key, frame) {
	Phaser.Sprite.call(this, game, 20, 475, key, frame);
	
	this.anchor.set(0.5);
	this.scale.setTo(2, 2);
	
	game.physics.enable(this);
	this.body.immovable = false;
	
		game.physics.arcade.enable(this); // add physics to the playa
		this.body.gravity.y = 450; // succumb to gravity mortal fool
		this.body.collideWorldBounds = true; // don't fall through the earth

	
	}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	
	var cursors = game.input.keyboard.createCursorKeys();
	
	if(cursors.up.justPressed){ //press up to jump
		player.body.velocity.y = -150;
		console.log('jump');
	}
	
	if (cursors.left.isDown){
		//  go left
		player.body.velocity.x = -150;
	}
	
	else if (cursors.right.isDown){
		//  go right
		player.body.velocity.x = 150;
	}
	
	else {
		//  go right
		player.body.velocity.x = 0;
	}
}
