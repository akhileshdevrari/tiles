window.addEventListener("load", initialize);

function initialize()
{
	start_game();
}

var ball, WIDTH, HEIGHT, speed=6, refresh_time=20, tile_delay, num_y = 5, num_x = 4;
var tiles = [];
//setting up dimensions for game area
HEIGHT = window.innerHeight;
if(window.innerHeight > window.innerWidth)
	WIDTH = window.innerWidth;
else
	WIDTH = HEIGHT*0.6;

tile_delay = parseInt((HEIGHT*2)/(speed*num_y), 10);

function start_game() {
	var x = WIDTH*(3/8);
	var y = HEIGHT*(9/10);
	ball = new ball_type(x, y);
	game_area.start();
}

var game_area = {
	canvas : document.createElement("canvas"),
	start : function(){
		this.canvas.width = WIDTH;
		this.canvas.height = HEIGHT;
		this.frame = 0; //frame number
		this.context = this.canvas.getContext("2d");
		//something like inserting canvas in body child list
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		update_game_area();
	},
	clear : function(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function(){
		console.log("stopped\n");
	}
}

function ball_type(x, y)
{
	this.x = x;
	this.y = y;
	radius = WIDTH*0.04;
	this.update = function(){
		ctx = game_area.context;
		//Drawing outer circle of ball
		ctx.fillStyle = "#cc00cc";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);	//centre
		ctx.arc(this.x,this.y, radius, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		//Drawing inner circle of ball
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);	//centre
		ctx.arc(this.x,this.y, radius*0.7, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
	}
	this.crash = function(tile_x, tile_y){
		var centre_x = tile_x + WIDTH/(num_x*2);
		var centre_y = tile_y + HEIGHT/(num_y*2);
		if(Math.abs(centre_x - this.x) >= radius + WIDTH/(2*num_x))
			return false;
		if(Math.abs(centre_y - this.y) >= radius + HEIGHT/(2*num_y))
			return false;
		return true;
	}
}

function tile_type(x)
{
	this.x = x;
	this.y = -HEIGHT/num_y;
	this.update = function(){
		ctx = game_area.context;
		ctx.fillStyle = "black";
		ctx.fillRect(this.x, this.y, WIDTH/num_x, HEIGHT/num_y);
	}
}

function update_game_area()
{
	game_area.clear();
	game_area.frame++;
	if(game_area.frame==1 || game_area.frame%tile_delay == 0){
		//change speed
		if(refresh_time > 1 && game_area.frame%(tile_delay*2) == 0)
		{
			refresh_time -= 1;
			console.log("refresh_time = "+refresh_time);
		}
		//create new tile
		var random = Math.floor(Math.random()*num_x);
		tiles.push(new tile_type((WIDTH*random)/num_x));
		//to check if two black tiles will be added
		random = Math.floor(Math.random()*num_x);
		if(random==0)
		{
			random = Math.floor(Math.random()*num_x);
			tiles.push(new tile_type((WIDTH*random)/num_x));
		}
	}
	for(var i=0; i<tiles.length; i++){
		tiles[i].y += speed;
		tiles[i].update();
	}
	//Check if arrow keys are pressed to move ball from keyboard
	document.onkeydown = function(e) {
		// y : 0.1, 0.3, 0.5, 0.7, 0.9
		//x : 1/8 3/8 5/8 7/8
		if(e.keyCode == '38' || e.keyCode == '87')	//up arrow
		{
			if(ball.y > (1/num_y)*HEIGHT)
				ball.y -= HEIGHT/num_y;
		}
		else if(e.keyCode == '40' || e.keyCode == '83')	//down arrow
		{
			if(ball.y < ((num_y-1)/num_y)*HEIGHT)
				ball.y += HEIGHT/num_y;
		}
		else if(e.keyCode == '37' || e.keyCode == '65')	//left arrow
		{
			if(ball.x > (1/num_x)*WIDTH)
				ball.x -= WIDTH/num_x;
		}
		else if(e.keyCode == '39' || e.keyCode == '68')	//right arrow
		{
			if(ball.x < ((num_x-1)/num_x)*WIDTH)
				ball.x += WIDTH/num_x;
		}
	}
	//Check if screen is swiped to move the ball
	document.addEventListener('swiped-up', function(e){
		if(ball.y > (1/num_y)*HEIGHT)
			ball.y -= HEIGHT/num_y;
	});
	document.addEventListener('swiped-down', function(e){
		if(ball.y < ((num_y-1)/num_y)*HEIGHT)
			ball.y += HEIGHT/num_y;	
	});
	document.addEventListener('swiped-left', function(e){
		if(ball.x > (1/num_x)*WIDTH)
			ball.x -= WIDTH/num_x;
	});
	document.addEventListener('swiped-right', function(e){
		if(ball.x < ((num_x-1)/num_x)*WIDTH)
			ball.x += WIDTH/num_x;
	});

	ball.update();
	for(var i=0; i<tiles.length; i++){
		if(ball.crash(tiles[i].x, tiles[i].y)){
			// console.log("i = "+i+' tx = '+tiles[i].x+"  ty = "+tiles[i].x);
			// console.log('ballx = '+ball.x+"  bally = "+ball.y);
			game_area.stop();
			return;
		}
	}
	setTimeout(update_game_area, refresh_time);
}