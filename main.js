

function initCanvas(){
    //global stuff
	var ctx = document.getElementById('myCanvas').getContext('2d');
    var cW = ctx.canvas.width, cH = ctx.canvas.height;
	ctx.fillStyle = "#eaeaea";
	ctx.fillRect(0,0,cW,cH);
	var RGBAverage;
	//end global stuff
	
	
	
	//sprayObj
	function sprayObj(x,y,d,s,c) {
		this.X = x;
		this.Y = y;
		this.D = d;
		this.S = s;
		this.C = c;
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
				for (var i = Math.floor(this.D); i--; ) {
					var angle = Math.random()*Math.PI*2;
					var radius = Math.random()*this.S;
					ctx.globalAlpha = Math.random();
					ctx.fillStyle = this.C;
					ctx.fillRect(
					Math.floor(this.X + radius * Math.cos(angle)),
					Math.floor(this.Y + radius * Math.sin(angle)), 
					2, 2);
				};
			};
		};
		this.move = function() {
			if(this.checkColor()) {
				if (this.X> 50) {
					this.X = Math.min(595,this.X + Math.floor(Math.random()*3-1-0.02));
				} else {
					this.X = Math.max(5,this.X + Math.floor(Math.random()*3-1+0.02));					// temporary stuff
				};
				
				if (this.Y>50) {
					this.Y = Math.min(395,this.Y + Math.floor(Math.random()*3-1-0.02));
				} else {
					this.Y = Math.max(5,this.Y + Math.floor(Math.random()*3-1+0.02));
				};
				this.lost = 0;
			} else {
				if (this.lost > 10) {
					this.S = 5;
					this.X = Math.floor(Math.random()*598 + 1);
					this.Y = Math.floor(Math.random()*398 + 1);
					this.lost = 0;
				} else {
					if (this.X> 50) {
						this.X = Math.min(595,this.X + Math.floor(Math.random()*3-1-0.02));
					} else {
						this.X = Math.max(5,this.X + Math.floor(Math.random()*3-1+0.02));					// temporary stuff
					};
					
					if (this.Y>50) {
						this.Y = Math.min(395,this.Y + Math.floor(Math.random()*3-1-0.02));
					} else {
						this.Y = Math.max(5,this.Y + Math.floor(Math.random()*3-1+0.02));
					};
					this.lost = this.lost + 1;					
				};
				
			};
		};
	};
	
	// end sprayObj
	
	// setup
	var enemy1 = new sprayObj(333,333,50,5,'rgb(0,255,255)');
	var enemy2 = new sprayObj(590,390,50,5,'rgb(0,0,255)');							// temporary stuff
	var enemy3 = new sprayObj(490,60,50,5,'rgb(0,255,0)');
	var player = new sprayObj(30,30,50,5,'rgb(255,0,0)');
	enemy1.start(enemy1.X,enemy1.Y,enemy1.C);
	enemy2.start(enemy2.X,enemy2.Y,enemy2.C);
	enemy3.start(enemy3.X,enemy3.Y,enemy3.C);
	player.start(player.X,player.Y,player.C);
	// end setup
	
	
	//click logic
	ctx.canvas.addEventListener('mouseenter', function(event) {
		var drawInterval = setInterval(draw, 20);	
		player.X = event.layerX;																								
		player.Y = event.layerY;															//does not work in IE
		
		ctx.canvas.addEventListener('mousemove', function(event) {
			player.X = event.layerX;																								
			player.Y = event.layerY;
			
		});
	
		
		function draw() {
			player.sprayColor();
			player.S = Math.min(200,player.S + 0.02);				// temporary stuff      checkColor moet nog uit sprayColor komen want nu groeit het permanent
			player.D = player.S * 0.4;
		};
		
		ctx.canvas.addEventListener('mouseleave', function(event) {
			clearInterval(drawInterval);
		});
	});
	//end clicklogic
	
	
	//gameloop
	
	function animate(){
        ctx.save();
		enemy1.sprayColor();
		enemy2.sprayColor();
		enemy3.sprayColor();
		enemy1.move();
		enemy2.move();
		enemy3.move();
		enemy1.S = enemy1.S + 0.01;
		enemy2.S = enemy2.S + 0.01;		// temporary stuff
		enemy3.S = enemy3.S + 0.01;
		RGBAverage = getAverageRGB(ctx);
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
	
	

	

