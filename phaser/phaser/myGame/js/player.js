function Player (game, key, frame) {
	Phaser.Sprite.call(this, game, 400, 250, key, frame);
	
	this.anchor.set(0.5);
	this.scale.setTo(2, 2);
	
	game.physics.enable(this);
	this.body.collideWorldBounds = true; //set to false later
	game.physics.startSystem(Phaser.Physics.ARCADE);
	this.body.velocity.x = 0;
	
	}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	var cursors = game.input.keyboard.createCursorKeys();
		console.log('Player update called');

	//game.input.keyboard.justPressed(Phaser.Keyboard.up)

	if(cursors.up.justPressed && this.body.touching.down){ //press up to jump
		Player.y = Player.y - playerV;
		console.log('jump');
	}
	
	if(cursors.left.isDown){ //press left to go left
	this.body.velocity.x = -10;
		console.log('left');

	}
	
	if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
		this.body.velocity.x = this.body.velocity.x + 100;
		console.log('right');

	}
	
	/*if(cursors.up.justPressed && this.player.body.touching.down && hitPlatform){
		this.player.body.velocity.y = -305;
	}
	*/
}
