function Cutscene (game, key, frame) {
	Phaser.Sprite.call(this, game, 500, -20, key, frame);
	
	size = 1;
	
	this.anchor.set(0.5);
	this.scale.setTo(size, size);
	
	game.physics.enable(this);
	this.body.immovable = false;
	
		game.physics.arcade.enable(this); // add physics to the playa
		this.body.gravity.y = 175; // succumb to gravity mortal fool
		this.body.collideWorldBounds = false; // don't fall through the earth

	}
Cutscene.prototype = Object.create(Phaser.Sprite.prototype);
Cutscene.prototype.constructor = Cutscene;

Cutscene.prototype.update = function(){

	cutscene.angle +=5;
	size -= .01;

}
