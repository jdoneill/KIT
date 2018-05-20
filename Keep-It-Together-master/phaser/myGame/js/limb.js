function Limb (game, key, frame) {
	var playerXPos = player.x + 80;
	var playerYPos = player.y;
	Phaser.Sprite.call(this, game, playerXPos, playerYPos, key, frame);
	
	this.scale.setTo(1, 1.5);
	this.angle = 90;
	
	game.physics.enable(this);
	this.body.immovable = false;

	var canJump = false;

	game.physics.arcade.enable(this); // add physics to the playa
	this.body.gravity.y = 450; // change this to a var for water level gravity change
	this.body.collideWorldBounds = true; // don't fall through the earth

	}
Limb.prototype = Object.create(Phaser.Sprite.prototype);
Limb.prototype.constructor = Limb;

Limb.prototype.update = function(){
	
	var cursors = game.input.keyboard.createCursorKeys();
	
	// P L A Y E R  M O V E M E N T
	// J U M P
/* 	if(Phaser.Keyboard.W.isDown && limb.body.touching.down)
    	{ //press up to jump (taken from phaser.io example code)
    		if(canJump == true)
        	{
        		limb.body.velocity.y = -420;
        		console.log('jump');
			canJump = false;
			}
    	}
    	// makes it so you have to press up each time you want to jump
    	if(Phaser.Keyboard.W.isUp)
    	{
        	canJump = true;
    	} */
	

	
}