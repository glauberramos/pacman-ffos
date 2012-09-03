var dumbStrategy = function(monster) {
	var result;

	if(monster.direction == 0) {
		monster.direction = Math.floor((Math.random()*4)+1);
	}

	if(monster.direction == 1) {
		result = collision(monster, {x: monster.x, y: monster.y - 1});
	}

	if(monster.direction == 2) {
		result = collision(monster, {x: monster.x + 1, y: monster.y});
	}

	if(monster.direction == 3) {
		result = collision(monster, {x: monster.x, y: monster.y  + 1});
	}

	if(monster.direction == 4) {
		result = collision(monster, {x: monster.x - 1, y: monster.y});
	}

	if (result.x == monster.x && result.y == monster.y) {
		monster.direction = Math.floor((Math.random()*4)+1);
		monster.x + 2;
		monster.y + 2;
	} else {
		monster.x = result.x;
		monster.y = result.y;
	}
};

var vectorStrategy = function(monster) {
	var result;

	if (! monster.invert_y ) {
		up   = -1;
		down =  1;
	} else {
		up   =  1;
		down = -1;		
	}
	
	if ( hero.y > monster.y ) {
		result   = collision(monster, {x: monster.x, y: monster.y + down});
		monster.invert_x = false;
	} else if ( hero.y < monster.y ) {
		result = collision(monster, {x: monster.x, y: monster.y + up});
		monster.invert_x = false;
	} else {
		result = { x:monster.x, y:monster.y };
	}
	
	if (! monster.invert_x ) {
		left  = -1;
		right =  1;
	} else {
		left  =  1;
		right = -1;	
	}	
	
	if ( hero.x > monster.x ) {
		result   = collision(monster, {x: monster.x + right, y: result.y});
		monster.invert_y = false;
	} else if ( hero.y < monster.y ) {
		result   = collision(monster, {x: monster.x + left, y: result.y});
		monster.invert_y = false;
	}

	if ( result.y != monster.y ) {
		monster.y = result.y;
	} else if ( result.x != monster.x ) {
		monster.x = result.x;
	} else { 
		// Temos um impasse. Tentamos ir em direção ao Pac, mas nao saimos do
		// lugar... Então vamos inverter um dos eixos, até que o outro eixo
		// consiga se alterar.
		eixo = Math.random();
		if ( eixo < 0.5 ) {
			// Vamos inverter o eixo vertical
			monster.invert_y = ! monster.invert_y;
		} else {
			// Vamos inverter o eixo horizontal
			monster.invert_x = ! monster.invert_x;
		}
	}
};

var levelsStrategies = [
	[ vectorStrategy, vectorStrategy, vectorStrategy, vectorStrategy ]
];