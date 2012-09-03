requirejs.config({
	baseUrl: 'js'
});
requirejs(['strategies'], function () { 
	reset();
	var then = Date.now();
	main();	
});

// Setup requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 352;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/labirinto.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "img/pacman2.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "img/ghost.png";

// Game objects
var matrix = undefined;
var hero = {
	speed: 1
};

var getMonster = function(d) {
	return {
		direction: d,
		mode: 'hunter'
	}
}

var monsters = [ getMonster(0), getMonster(1), getMonster(2), getMonster(3) ];

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2 - 15;
	hero.y = (canvas.height / 2) - 20 + 70;
	
	strategies = levelsStrategies[0];

	// Place the ghosts on the screen
	for (var i in monsters) {
		monsters[i].x = (canvas.width / 2) + (i*30) - 50;
		monsters[i].y = (canvas.height / 2) - 15;
		monsters[i].strategy = strategies[i];
		monsters[i].invert_x = false;
		monsters[i].invert_y = false;
	}
};

// --- collision stuff
var getCollisionPoints = function (pos, size) {
	var result = {
		up: [
		pos,
		{ x: pos.x + (size.w / 2), y: pos.y},
		{ x: pos.x + size.w,       y: pos.y}],

		down: [
		{ x: pos.x,                y: pos.y + size.h},
		{ x: pos.x + (size.w / 2), y: pos.y + size.h},
		{ x: pos.x + size.w,       y: pos.y + size.h}],

		left: [
		pos,
		{ x: pos.x,                y: pos.y + (size.h / 2)},
		{ x: pos.x,                y: pos.y + size.h}],

		right: [
		{ x: pos.x + size.w,       y: pos.y},
		{ x: pos.x + size.w,       y: pos.y + (size.h / 2)},
		{ x: pos.x + size.w,       y: pos.y + size.h}]
	};

	return result;
};

var checkCollisions = function (points) {
	var result = ((ctx.getImageData(points[0].x, points[0].y, 1, 1).data[2] == 0) && 
		 (ctx.getImageData(points[1].x, points[1].y, 1, 1).data[2] == 0) &&
		 (ctx.getImageData(points[2].x, points[2].y, 1, 1).data[2] == 0));
	return result;
}

var collision = function (current, pos, size) {
	size = size || { w:30, h:30 };
	var delta = { x: pos.x - current.x, y: pos.y - current.y };
	var collisionPoints = getCollisionPoints(pos, size);
	var result = { x: current.x, y: current.y };

	if ((delta.x > 0) && (checkCollisions(collisionPoints.right))) {
		result.x = pos.x;
	} else if ((delta.x < 0) && (checkCollisions(collisionPoints.left))) {
		result.x = pos.x;
	}

	if ((delta.y > 0) && (checkCollisions(collisionPoints.down))) {
		result.y = pos.y;
	} else if ((delta.y < 0) && (checkCollisions(collisionPoints.up))) {
		result.y = pos.y;
	}

	return result;
};
/// --- end of collision stuff

// Update game objects
var update = function () {
  	var pos = {x: hero.x,y: hero.y};
	if (38 in keysDown) { // Player holding up
		pos.y = hero.y - hero.speed;
		if ( (ctx.getImageData(hero.x,      pos.y, 1, 1).data[2] == 0) && 
			 (ctx.getImageData(hero.x + 15, pos.y, 1, 1).data[2] == 0) &&
			 (ctx.getImageData(hero.x + 30, pos.y, 1, 1).data[2] == 0) ) {
			hero.y = pos.y;
		}
	}

	if (40 in keysDown) { // Player holding down
		pos.y = hero.y + hero.speed;
		if ( (ctx.getImageData(hero.x,      pos.y + 30, 1, 1).data[2] == 0) && 
			 (ctx.getImageData(hero.x + 15, pos.y + 30, 1, 1).data[2] == 0) && 
			 (ctx.getImageData(hero.x + 30, pos.y + 30, 1, 1).data[2] == 0) ) {
			hero.y = pos.y;
		}
	}

	if (37 in keysDown) { // Player holding left
		pos.x = hero.x - hero.speed;
		if ( (ctx.getImageData(pos.x, hero.y,      1, 1).data[2] == 0) && 
			 (ctx.getImageData(pos.x, hero.y + 15, 1, 1).data[2] == 0) && 
			 (ctx.getImageData(pos.x, hero.y + 30, 1, 1).data[2] == 0) ) {
			hero.x = pos.x;
		}
	}
	if (39 in keysDown) { // Player holding right
		pos.x = hero.x + hero.speed;
		if ( (ctx.getImageData(pos.x + 30, hero.y,      1, 1).data[2] == 0) && 
			 (ctx.getImageData(pos.x + 30, hero.y + 15, 1, 1).data[2] == 0) && 
			 (ctx.getImageData(pos.x + 30, hero.y + 30, 1, 1).data[2] == 0) ) {
			hero.x = pos.x;
		}
	}

	//var point = collision(hero, pos);
	//hero.x = point.x;
	//hero.y = point.y;
	
	for (var i in monsters) {
		f = monsters[i].strategy;
		f(monsters[i]);
		
		// Are they touching?
		if (
			hero.x <= (monsters[i].x + 32)
			&& monsters[i].x <= (hero.x +  32)
			&& hero.y <= (monsters[i].y + 32)
			&& monsters[i].y <= (hero.y + 32)
		) {
			++monstersCaught;
			reset();
		}		
	}
};


// Draw everything
var render = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		for (var i in monsters) {
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}
};

// The main game loop
var main = function () {
	//var now = Date.now();
	//var delta = now - then;

	update();
	render();

	//then = now;
	requestAnimationFrame(main);
};

