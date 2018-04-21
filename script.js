window.addEventListener("load", initialize);

function initialize()
{
	start_game();
}

var ball, WIDTH, HEIGHT, speed=3, refresh_time=10, tile_delay;
var tiles = [];
//setting up dimensions for game area
HEIGHT = window.innerHeight;
if(window.innerHeight > window.innerWidth)
	WIDTH = window.innerWidth;
else
	WIDTH = HEIGHT*0.6;

tile_delay = parseInt((HEIGHT*2)/(speed*5), 10);

function start_game() {
	var x = WIDTH*0.5;
	var y = HEIGHT*0.9;
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
		clearInterval(this.interval);
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
		var centre_x = tile_x + WIDTH/6.0;
		var centre_y = tile_y + HEIGHT/10;
		if(Math.abs(centre_x - this.x) >= radius + WIDTH/6.0)
			return false;
		if(Math.abs(centre_y - this.y) >= radius + HEIGHT*0.1)
			return false;
		return true;
	}
}

function tile_type(x, v)
{
	this.x = x;
	this.y = -HEIGHT/5.0;
	this.update = function(){
		ctx = game_area.context;
		ctx.fillStyle = "black";
		ctx.fillRect(this.x, this.y, WIDTH/3.0, HEIGHT/5.0);
	}
}

function update_game_area()
{
	game_area.clear();
	game_area.frame++;
	if(game_area.frame==1 || game_area.frame%tile_delay == 0){
		//change speed
		if(refresh_time > 1 && game_area.frame%(tile_delay*2) == 0)
			refresh_time -= 1;
		//create new tile
		var random = Math.floor(Math.random()*3);
		tiles.push(new tile_type((WIDTH*random)/3.0, 50));
		random = Math.floor(Math.random()*3);
		if(random==0)
		{
			random = Math.floor(Math.random()*3);
			tiles.push(new tile_type((WIDTH*random)/3.0, 50));
		}
	}
	for(var i=0; i<tiles.length; i++){
		tiles[i].y += speed;
		tiles[i].update();
	}
	//Check if arrow keys are pressed to move ball from keyboard
	document.onkeydown = function(e) {
		// y : 0.1, 0.3, 0.5, 0.7, 0.9
		//x : 1/6  3/6   5/6
		if(e.keyCode == '38' || e.keyCode == '87')	//up arrow
		{
			if(ball.y > 0.2*HEIGHT)
				ball.y -= 0.2*HEIGHT;
		}
		else if(e.keyCode == '40' || e.keyCode == '83')	//down arrow
		{
			if(ball.y < 0.8*HEIGHT)
				ball.y += 0.2*HEIGHT;
		}
		else if(e.keyCode == '37' || e.keyCode == '65')	//left arrow
		{
			if(ball.x > (2.0/6.0)*WIDTH)
				ball.x -= WIDTH/3.0;;
		}
		else if(e.keyCode == '39' || e.keyCode == '68')	//right arrow
		{
			if(ball.x < (4.0/6.0)*WIDTH)
				ball.x += WIDTH/3;
		}
	}
	//Check if screen is swiped to move the ball
	document.addEventListener('swiped-up', function(e){
		if(ball.y > 0.2*HEIGHT)
				ball.y -= 0.2*HEIGHT;
	});
	document.addEventListener('swiped-down', function(e){
		if(ball.y < 0.8*HEIGHT)
				ball.y += 0.2*HEIGHT;	
	});
	document.addEventListener('swiped-left', function(e){
		if(ball.x > (2.0/6.0)*WIDTH)
				ball.x -= WIDTH/3.0;;
	});
	document.addEventListener('swiped-right', function(e){
		if(ball.x > (2.0/6.0)*WIDTH)
				ball.x -= WIDTH/3.0;;
	});
	ball.update();
	for(var i=0; i<tiles.length; i++){
		if(ball.crash(tiles[i].x, tiles[i].y)){
			game_area.stop();
			return;
		}
	}
	setTimeout(update_game_area, refresh_time);
}