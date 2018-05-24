function Player (game, key, frame, playerX, playerY) {
	Phaser.Sprite.call(this, game, playerX, playerY, key, frame);
	
	this.anchor.set(0.5);
	this.scale.setTo(2, 2);
	
	game.physics.enable(this);
	this.body.immovable = false;

	var canJump = false;
	var canRight = false;
	var canLeft = false;
	distance = 4; 
	
	limbs = game.add.group(); // gotta have a ground to stand on
	limbs.enableBody = true; // gotta make the ground stand on-able
	
	if(rArmOn == true){
    rArm = limbs.create(this.body.x, this.body.y, 'guy', 'armR'); //add right armL
    rArm.scale.setTo(1, 1.5);
	}
	if(lArmOn == true){
	lArm = limbs.create(this.body.x - 77, this.body.y, 'guy', 'armL'); //add left armL
	lArm.scale.setTo(1, 1.5);
	}
	if(rLegOn == true){
	rLeg = limbs.create(this.body.x - 20, this.body.y + 40, 'guy', 'legR'); //add right legL
    rLeg.scale.setTo(1, 1.5);
	}
	if(lLegOn == true){
	lLeg = limbs.create(this.body.x - 50, this.body.y + 40, 'guy', 'legL'); //add left leg
    lLeg.scale.setTo(1, 1.5);
	}

		game.physics.arcade.enable(this); // add physics to the playa
		this.body.gravity.y = 450; // change this to a var for water level gravity change
		this.body.collideWorldBounds = false; // don't fall through the earth (changing this after we get platform collision)

	game.camera.follow(player, 800, 500);

	}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
	
	var cursors = game.input.keyboard.createCursorKeys();
	
		rArm.x = player.x + 32;
		rArm.y = player.y;
		
		lArm.x = player.x - 41;
		lArm.y = player.y;
		
		rLeg.x = player.x + 17;
		rLeg.y = player.y + 42;
		
		lLeg.x = player.x - 24;
		lLeg.y = player.y + 42;

	if(lLegOn != true){//no limbs
		this.body.setSize(32,53,0,0);
		playerVel = 50; //decrease velocity
	}
	else if(rLegOn != true){//no right legL
		this.body.setSize(32,67,0,0);//same as no arms
		playerVel = 70; //decrease velocity
	}
	else if(lArmOn != true){// no arms
		this.body.setSize(32,67,0,0);
		playerVel = 90; //decrease velocity
	}
	else if(rArmOn != true){// no right armL
		this.body.setSize(38,67,-6,0);
		playerVel = 110; //decrease velocity
	}
	else{//all limbs
		this.body.setSize(43,67,-6,0);
		playerVel = 150 //set velocity
	}
	
	// P L A Y E R  M O V E M E N T
	// J U M P
	
	if( level == 5)
	{
		canJump = false;
	}
	if(cursors.up.isDown && player.body.touching.down)
    	{ //press up to jump (taken from phaser.io example code)
    		if(canJump == true)
        	{
        		player.body.velocity.y = -330;
        		console.log('jump');
			canJump = false;
			}
    	}
    	// makes it so you have to press up each time you want to jump
    	if(cursors.up.isUp && lLegOn == true)
    	{
        	canJump = true;
    	}
	
	// W A L K I N G
	if (cursors.left.isDown && level != 5){
		//  go left
		player.body.velocity.x = -playerVel;
	}
	
	else if (cursors.right.isDown && level != 5){
		//  go right
		player.body.velocity.x = playerVel;
	}
	// P L A Y E R  M O V E M E N T
	// R I G H T

		else if(cursors.right.isDown && player.body.touching.down && level == 5 )
			{
	    		{ //press right to move
	    			if(canRight == true)
	        		{
	        			player.body.x = player.body.x + distance;
	        			console.log('right');
					canRight = false;
					// Makes you move slower towards the end.
					
					
					}
					if(level == 5 && player.body.x >= 1400)
					{
						distance = 2;
					}
	    		}
			}
		
    		// makes it so you have to press up each time you want to jump
    		else if(cursors.right.isUp){
        	canRight = true;
    		}
		
	// L E F T
	 if(cursors.left.isDown && player.body.touching.down && level == 5)
    	{ //press left to move
    		if(canLeft == true)
        	{
        		player.body.x = player.body.x - distance;
        		console.log('left');
			canLeft = false;
			}
    	}
    	// makes it so you have to press up each time you want to jump
    	else if(cursors.left.isUp)
		{
        	canLeft = true;
    	}

	if (cursors.left.isUp && cursors.right.isUp) 
	{
		//  don't move
		player.body.velocity.x = 0;
	}
	
}