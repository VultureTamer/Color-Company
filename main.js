	var pixelNumber = 0;
	var pixelPerClick = 10;
	var pixelPerTick = 1;
	var pixelSize = 2;
	var enemySize = 2.5;
	var enter = false;
	var canoffset;
	
	
		//global stuff
	var ctx = document.getElementById('myCanvas').getContext('2d');
    var cW = ctx.canvas.width, cH = ctx.canvas.height;
	ctx.fillStyle = "#eaeaea";
	ctx.fillRect(0,0,cW,cH);
	var RGBAverage;

	//end global stuff
	
		//sprayObj
	function sprayObj(x,y,d,s,c,xgoal,ygoal) {
		this.X = x;
		this.Y = y;
		this.D = d;				//density
		this.S = s;				//spread
		this.C = c;				//color
		this.XGoal = xgoal;
		this.YGoal = ygoal;
		this.lost = 0;
		this.start = function(X,Y,C) {
			ctx.fillStyle = C;
			ctx.fillRect(X,Y,7,7);
		};
		this.checkColor = function() {
			var imageData = ctx.getImageData(this.X,this.Y,1,1);
			var r = imageData.data[0];
			var g = imageData.data[1];
			var b = imageData.data[2];
			var rgb = this.C;
			rgb = rgb.replace(/[^\d,]/g, '').split(',');						
			switch(this){																							//dit kan beter denkik!
			case player: if ((rgb[0] - 10 < r) && (rgb[1] + 10 > g) && (rgb[2] + 10 > b)) {return true} else {return false};
			case enemy1: if ((rgb[0] + 10 > r) && (rgb[1] - 10 < g) && (rgb[2] - 10 < b)) {return true} else {return false};
			case enemy2: if ((rgb[0] + 10 > r) && (rgb[1] + 10 > g) && (rgb[2] - 10 < b)) {return true} else {return false};
			case enemy3: if ((rgb[0] + 10 > r) && (rgb[1] - 10 < g) && (rgb[2] + 10 > b)) {return true} else {return false};
			};
		};
		this.sprayColor = function() {
			if( this.checkColor() ) {
				if (this == player) { 
					if (pixelNumber > Math.floor(pixelSize*pixelSize/2)) {
						player.S = Math.floor(Math.min(200,player.S + 0.002)*10000)/10000;				
						player.D = Math.floor(Math.min(player.S * 0.75,player.D + 0.001)*10000)/10000;
						document.getElementById('Spread').innerHTML = player.S;
						document.getElementById('Density').innerHTML = player.D;
						pixelNumber = pixelNumber - Math.floor(pixelSize*pixelSize/2);
						for (var i = Math.floor(this.D); i--; ) {
						var angle = Math.random()*Math.PI*2;
						var radius = Math.random()*this.S;
						ctx.globalAlpha = Math.random();
						ctx.fillStyle = this.C;
						ctx.fillRect(
						Math.floor(this.X + radius * Math.cos(angle)),
						Math.floor(this.Y + radius * Math.sin(angle)), 
						pixelSize, pixelSize);
						};
					};
				} else {
					for (var i = Math.floor(this.D); i--; ) {
					var angle = Math.random()*Math.PI*2;
					var radius = Math.random()*this.S;
					ctx.globalAlpha = Math.random();
					ctx.fillStyle = this.C;
					ctx.fillRect(
					Math.floor(this.X + radius * Math.cos(angle)),
					Math.floor(this.Y + radius * Math.sin(angle)), 
					enemySize, enemySize);
					};
				};

			};
		};
		this.move = function() {

			if(this.checkColor()) {
				if ( !enter ) {
					if (this.X> this.XGoal) {
						this.X = Math.min(595,this.X + Math.floor(Math.random()*3-1-0.02));
					} else {
						this.X = Math.max(5,this.X + Math.floor(Math.random()*3-1+0.02));					// temporary stuff
					};
					
					if (this.Y>this.YGoal) {
						this.Y = Math.min(395,this.Y + Math.floor(Math.random()*3-1-0.02));
					} else {
						this.Y = Math.max(5,this.Y + Math.floor(Math.random()*3-1+0.02));
					};
				} else {							// als ge zelf in het canvas zijt! valt hij u aan
					if (player.X - this.X >= 0) {
						this.X = Math.min(595,this.X + Math.floor(Math.random()*3-1+0.02));    //(-0,5 tot 2,5)		(-1 tot 2)
					} else {
						this.X = Math.max(5,this.X + Math.floor(Math.random()*3-1-0.02));    //(-1,5 tot 1,5)		(-2 tot 1)
					};
					if (player.Y - this.Y >= 0) {
						this.Y = Math.min(395,this.Y + Math.floor(Math.random()*3-1+0.02));    //(-0,5 tot 2,5)		(-1 tot 2)
					} else {
						this.Y = Math.max(5,this.Y + Math.floor(Math.random()*3-1-0.02));    //(-1,5 tot 1,5)		(-2 tot 1)
					};
				};	
				this.lost = 0;
			} else {												//als ge ni op u kleur zit, blijf zoeken tot ge te lang gezocht hebt (20)
				if (this.lost > 20) {
					this.S = 5;
					this.X = Math.floor(Math.random()*598 + 1);
					this.Y = Math.floor(Math.random()*398 + 1);
					this.lost = 0;
				} else {
					if (this.X> this.XGoal) {
						this.X = Math.min(595,this.X + Math.floor(Math.random()*7-3-0.02));
					} else {
						this.X = Math.max(5,this.X + Math.floor(Math.random()*7-3+0.02));					// temporary stuff
					};
					
					if (this.Y> this.YGoal) {
						this.Y = Math.min(395,this.Y + Math.floor(Math.random()*7-3-0.02));
					} else {
						this.Y = Math.max(5,this.Y + Math.floor(Math.random()*7-3+0.02));
					};
					this.lost = this.lost + 1;					
				};
				
			};

			
		};
	};
	
	// end sprayObj
	
	
		// setup
	var enemy1 = new sprayObj(333,333,50,5,'rgb(0,255,255)',50,150);						//(X,Y,Density,spread,color)
	var enemy2 = new sprayObj(590,390,50,5,'rgb(0,0,255)',350,250);							// temporary stuff
	var enemy3 = new sprayObj(490,60,50,5,'rgb(0,255,0)',150,50);
	var player = new sprayObj(30,30,10,20,'rgb(255,0,0)',30,30);
	enemy1.start(enemy1.X,enemy1.Y,enemy1.C);
	enemy2.start(enemy2.X,enemy2.Y,enemy2.C);
	enemy3.start(enemy3.X,enemy3.Y,enemy3.C);
	player.start(player.X,player.Y,player.C);
	// end setup
	
	


function initCanvas(){
    

	
	

	

	
	
	//click logic
	ctx.canvas.addEventListener('mouseenter', function(event) {
		
		enter = true;
		var drawInterval = setInterval(draw, 20);
			console.log("mouseenter");

			player.X = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
			player.Y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
			
		ctx.canvas.addEventListener('mousemove', function(event) {
			player.X = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
			player.Y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
		
			/* player.X = event.layerX;																								
			player.Y = event.layerY; */
			
		});
	
		
		function draw() {
			player.sprayColor();
		};
		
		ctx.canvas.addEventListener('mouseleave', function(event) {
			enter = false;
			clearInterval(drawInterval);
		});
	});
	//end clicklogic
	
	
	//gameloop
	
	function animate(){
        ctx.save();
		canoffset = $(ctx.canvas).offset();
		enemy1.sprayColor();
		enemy2.sprayColor();
		enemy3.sprayColor();
		enemy1.move();
		enemy2.move();
		enemy3.move();
		enemy1.S = enemy1.S + 0.01;
		enemy2.S = enemy2.S + 0.01;		// temporary stuff
		enemy3.S = enemy3.S + 0.01;
		enemySize = enemySize + 0.00025;
		RGBAverage = getAverageRGB(ctx);
		if (RGBAverage.g < 1 && RGBAverage.b < 1) {
			ctx.font="100px Georgia";
			ctx.fillStyle="#eaeaea";
			ctx.fillText("YOU WON",50,200);
		};
		if (RGBAverage.r < 30) {
			var imageData = ctx.getImageData(30,30,1,1);
			var r = imageData.data[0];
			if (r<5) {
				ctx.font="100px Georgia";
				ctx.fillStyle="#eaeaea";
				ctx.fillText("YOU LOST",50,200);
			} else if (RGBAverage.r < 10) {
				ctx.font="100px Georgia";
				ctx.fillStyle="#eaeaea";
				ctx.fillText("YOU LOST",50,200);
			};
		}
		document.getElementById('bodycolor').style.backgroundColor = 'rgb('+RGBAverage.r+','+RGBAverage.g+','+RGBAverage.b+')';
        ctx.restore();
    };
    var animateInterval = setInterval(animate, 10);

	
	//endgameloop


	
	//fancy stuff!
	
	function getAverageRGB(ctx) {
    
		var blockSize = 5, // only visit every 5 pixels

			data,
			i = -4,
			length,
			rgb = {r:0,g:0,b:0},
			count = 0;
			


		
		try {
			data = ctx.getImageData(0, 0, cW, cH);
		} catch(e) {
			/* security error, img on diff domain */alert('x');
			return defaultRGB;
		}
		
		length = data.data.length;
		
		while ( (i += blockSize * 4) < length ) {
			++count;
			rgb.r += data.data[i];
			rgb.g += data.data[i+1];
			rgb.b += data.data[i+2];
		}
		
		// ~~ used to floor values
		rgb.r = ~~(rgb.r/count);
		rgb.g = ~~(rgb.g/count);
		rgb.b = ~~(rgb.b/count);
				
		return rgb;
    
	};
	
	// end fancy stuff
	
}; // end initCanvas
	
	
	
	
	var pixelInterval = setInterval(getPixelTick, 100);
	
	function getPixelTick() {
		pixelNumber = pixelNumber + pixelPerTick;
		document.getElementById('pixelsnumber').innerHTML = pixelNumber;
	};

	function getPixelClick(pixelPerClick) {
		pixelNumber = pixelNumber + pixelPerClick;
		document.getElementById('pixelsnumber').innerHTML = pixelNumber;
		document.getElementById("focus").focus();
	};
	
	function upgradePixelTick() {
		if (pixelNumber > 1000 && pixelPerTick < 0.5*pixelPerClick) {
			pixelPerTick = pixelPerTick + 1;
			document.getElementById('pixelpertick').innerHTML = pixelPerTick;
			pixelNumber = pixelNumber - 1000;
			document.getElementById('pixelsnumber').innerHTML = pixelNumber;
		};
	};
	
	function upgradePixelClick() {
		if (pixelNumber > 200 && pixelPerClick < player.S) {
			pixelPerClick = pixelPerClick + 2;
			document.getElementById('pixelperclick').innerHTML = pixelPerClick;
			pixelNumber = pixelNumber - 200;
			document.getElementById('pixelsnumber').innerHTML = pixelNumber;
		};
	};
	
	function increaseSpread() {
		if (pixelNumber > 100 && player.S < 200) {
			player.S = Math.floor((player.S + 2)*10000)/10000;
			document.getElementById('Spread').innerHTML = player.S;
			pixelNumber = pixelNumber - 100;
			document.getElementById('pixelsnumber').innerHTML = pixelNumber;
		};
	};
	
	function increaseDensity() {
		if (pixelNumber > 80 && player.D < 0.75*player.S) {
			player.D = Math.floor((player.D + 2)*10000)/10000;
			document.getElementById('Density').innerHTML = player.D;
			pixelNumber = pixelNumber - 80;
			document.getElementById('pixelsnumber').innerHTML = pixelNumber;
		};
	};
	
	function increasePixelSize() {
		if (pixelNumber > 5000 && pixelSize < 0.1*pixelPerClick) {
			pixelSize = pixelSize + 1;
			pixelNumber = pixelNumber - 5000;
			document.getElementById('pixelSize').innerHTML = pixelSize;
			document.getElementById('pixelsnumber').innerHTML = pixelNumber;
		};
	};
	
	
	
	
	
//wait till page ready
window.addEventListener('load', function(event) {
    initCanvas();
});




//ideas

	// percentage balk
	// color average display   DONE
	
	// only make the pixel if it's not closer than 'spread/4', would that end it?
	// make it no clicker but clickholder   DONE

	
	//  if standstill increase spread BUT if move decrease radius !!!!!!!
	
	// AI:  random move BUT if not on own color move towards closest pixel on map :-)
	// OR:  move towards closest pixel wrong color unless you are  on wrong color
	
	// buyables :   static autoclicker (sliders to change spread and density?
	//   			own ai robot
	//				upgrades for mousedown (spread, density/spread)
	//				
	
	

	

