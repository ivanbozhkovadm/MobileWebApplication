(function(){
	menu();
	
	document.getElementById("menuButton").addEventListener("click",function(){
		var menu = document.getElementById("menu");
		var display = menu.style.display || "none";
		menu.style.display = display =="none"? "block" : "none";
	});
		

		// proverqva za screen width ili goleminata na prozoreca
	ChooseMenu();
		
	
	window.addEventListener("resize", function(e) {
		ChooseMenu();
	});
	
var accelerationX = document.getElementById("accelerationX");
var accelerationY = document.getElementById("accelerationY");
var accelerationZ = document.getElementById("accelerationZ");
var rotationAlpha = document.getElementById("rotationAlpha");
var rotationBeta = document.getElementById("rotationBeta");
var rotationGamma = document.getElementById("rotationGamma");


	getAccelerometerDetails(accelerationX,accelerationY,accelerationZ,rotationAlpha,rotationBeta,rotationGamma);
	//getPosition(navigator.geolocation.getCurrentPosition())
	//getPosition();
	oldTime = 1;
	v = 0;
	avarageCounter = 0;
	avarageSum = 0;
	avarageValue = 0;
	arr = [];
	odd = true;
	setInterval(getLocation,3000);	//2 coords between 1s
	pos = [0,0,0,0];
	//setInterval(setDistance,1000);
	
	
	speedDiagram = document.getElementById('speedDiagram');
	ctx = speedDiagram.getContext('2d');
	setInterval(renderMeter, 40);
	
	avarageDiagram = document.getElementById('avarageDiagram');
	avctx = avarageDiagram.getContext('2d');
	setInterval(renderAvarage, 40);
	
	setInterval(renderGraph, 40);
	
	
	initAccelerometer();
	
	calculateDynamic();
	var updateDynamicBufferTime = 1000*60;//minute
	setInterval(decreaseDynamicBuffer, updateDynamicBufferTime);
})();

function menu(){
	var menu = document.getElementById("menu").children;

	for (var i = 0; i < menu.length; i++) {
		menu[i].addEventListener("click",function () {
			var id = this.getAttribute("id");
			document.getElementsByClassName("visible")[0].className = "";
			document.getElementsByClassName("selected")[0].className = "";
			document.getElementById(id+"-content").className="visible";
			this.className = "selected";
			
			if(screen.width<=480 ){
				document.getElementById("menu").style.display = "none";
				
			}
			
		});
	}
	
}

function ChooseMenu(){
	if(window.innerWidth>480 && screen.width >480){
		document.getElementById("menuButton").style.display = "none";
		document.getElementById("menu").style.display = "block";
	}else{
		document.getElementById("menuButton").style.display = "block";
		document.getElementById("menu").style.display = "none";
	}
}

function writeToFile(input)
{
	var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "post.php", true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var data = " "+input;
    httpRequest.send("data="+data);
}
function setDistance(distanceTime)
{
	distanceTime = distanceTime || 1;
	var distance = distanceInMeters(pos[0],pos[1],pos[2],pos[3]);
	distance = distance/distanceTime;
	distance = distance*1;
	
	document.getElementById("speed").innerHTML = distance;
	
	console.log(distance);
	
	//simulation
	//v = Math.random(0,360)*100;
	v = distance;
	arr.push(v);
	writeToFile(distance);
	avarageSum+=v;
	avarageValue = avarageSum/avarageCounter;
	avarageValue = avarageValue.toFixed();
	avarageCounter++;
	
}

function getPosition(position) {
	
	if(odd == true)
	{
		pos[0] = position.coords.latitude;  
		pos[1] = position.coords.longitude;
		odd = false;
	}
	else{
		pos[2] = position.coords.latitude;  
		pos[3] = position.coords.longitude;
		odd = true;
	}
	if(pos[0]!=pos[2] || pos[1]!=pos[3])
	{
		currentTime =  getTimeInSeconds();
		//oldTime-time;
		if(oldTime != null)
		{
			var distanceTime = currentTime - oldTime;
			setDistance(distanceTime);
		}
		oldTime = currentTime;
	}else
	{
		setTimeout(setDistance,3000);
		
	}
 	showPosition(position);
}
function getLocation() {
	
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(getPosition);
    }
}

function showPosition(position) {
	//console.log(position.coords.latitude);
	var x = document.getElementById("x");
	var y = document.getElementById("y");
    x.innerHTML = "X: " + position.coords.latitude; 
    y.innerHTML = "Y: " + position.coords.longitude; 
}

function getAccelerometerDetails(accelerationX,accelerationY,accelerationZ,rotationAlpha,rotationBeta,rotationGamma)
{

	if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
		accelerationX.innerHTML = e.accelerationIncludingGravity.x.toFixed(2);
		accelerationY.innerHTML = e.accelerationIncludingGravity.y.toFixed(2);
		accelerationZ.innerHTML = e.accelerationIncludingGravity.z.toFixed(2);
		
			if ( e.rotationRate ) {
				rotationAlpha.innerHTML = e.rotationRate.alpha.toFixed(2);
				rotationBeta.innerHTML = e.rotationRate.beta.toFixed(2);
				rotationGamma.innerHTML = e.rotationRate.gamma.toFixed(2);
			}		
		}
	}
}
function distanceInMeters(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
}

function getTimeInSeconds(){
	return seconds = Date.parse(new Date)/1000
}

function degToRad(degree) {
  var factor = Math.PI/180;
  return degree*factor;
}

function renderMeter() {
	var coef = 20;
	var circle = v*coef;
	
	ctx.strokeStyle = "#869600";
	ctx.lineWidth = 17;
	ctx.lineCap = "round";
	ctx.shadowBlur = 15;
	ctx.shadowColor = '#869600';
  // Background
  gradient = ctx.createRadialGradient(250,250,5,250,250,300);
  gradient.addColorStop(0,'#003340');
  gradient.addColorStop(0, '#003340');
  ctx.fillStyle = gradient;
  //ctx.fillStyle = '#333333';
  ctx.fillRect(0,0,500,500);
  
  // Hours
  ctx.beginPath();
  
  ctx.arc(250, 250, 200, degToRad(180), degToRad(circle+180));
  ctx.stroke();

  //text
  ctx.font = "500% Arial";
  var n = v.toFixed();
  ctx.fillText(n, 200, 250);
}
function renderAvarage()
{
	avctx.strokeStyle = "#869600";
	avctx.lineWidth = 17;
	avctx.lineCap = "round";
	avctx.shadowBlur = 15;
	avctx.shadowColor = '#869600';
	
	avctx.fillStyle="#003340";
	avctx.fillRect(0,0,500,500);
	avctx.font = "500% Arial";
	avctx.fillText("AVG: "+avarageValue, 50, 250);
}

function renderGraph()
{

	var drawSparkLine = function(data) {
	graphDiagram = document.getElementById('graph');
	graph = graphDiagram.getContext('2d');

	
	  gradient = graph.createRadialGradient(250,250,5,250,250,300);
  gradient.addColorStop(0,'#002b36');
  gradient.addColorStop(0, '#003340');
  graph.fillStyle = gradient;
  graph.fillRect(0,0,500,500);
	
	max = getMax(data),
      xstep = graphDiagram.width / data.length,
      x = xstep,
      xx = 5,
      y = calculateY(data, 0, graphDiagram.height, max);
  
  
  graph.fillRect(0, 0, graphDiagram.width, graphDiagram.height);
  graph.beginPath();
  graph.moveTo(xx, y);
  graph.strokeStyle = "#869600";
  graph.fillStyle = "#869600";
  graph.lineWidth = 2;
  
  graph.lineJoin = "round";
  graph.lineCap  = "round";
    graph.lineJoin = "round";
  graph.arc(xx, y, 3, 0, 2 * Math.PI);
  
  for(var i=1; i<data.length; i++) {
    y = calculateY(data, i, graphDiagram.height, max);
    
    graph.lineTo(x, y);
    //graph.arc(x, y, 3, 0, 2 * Math.PI, true);
    //graph.bezierCurveTo(x, y, x + 1, y + 1, x + .5, y + .5);
 
    graph.moveTo(x+.5, y+.5);
    
    x = x + xstep;
  }
  
  graph.stroke();
  

};


var calculateX = function(x, index) {
  for(var i=0; i<index; i++) {
    x += x;
  }
  
  return x;
}

var calculateY = function(data, index, height, max) {
  var valueRatio = data[index] / max * height - 10;
  
  return height - valueRatio;
};

var getMax = function(data) {
  
  return Math.max.apply(null, data);
}
function rnd(min, max){
    return min + ((max - min) * Math.random());
}
data = [ 12.31, 10.34, 10.26, 9, 8.21, 13.41, 14.43, 23.31, 13.41, 11.4, 28.34, 29.21 ];
for(var i = 0; i < 100; i++)
  data.push(rnd(0, 500));

drawSparkLine(arr);
}


//Accelerometer
function initAccelerometer()
{
	if (window.DeviceOrientationEvent) {
		
		window.addEventListener("deviceorientation", function(event) 
		{
			document.getElementById("xAccelerometer").style.webkitTransform = "scaleY("+(Math.round(event.beta))+")";  
			document.getElementById("yAccelerometer").style.webkitTransform = "scaleX("+(Math.round(event.gamma))+")";
			document.getElementById("angle").style.webkitTransform = "rotateZ("+(Math.round(event.alpha))+"deg)";  
			
		}, true);
	} else {
		alert("Sorry, your browser doesn't support Device Orientation");
	} 
}

//Dynamic settings
dynamicBuffer = 0;
function decreaseDynamicBuffer(){
	if(dynamicBuffer > 1000){
		document.getElementById("dynamicBar").innerHTML = "High";
		document.getElementById("dynamicBar").style.color = "#f44336";
		document.getElementById("dynamicBar").style.boxShadow="inset 0px 0px 20px 10px #f44336";
	}	
	else if(dynamicBuffer > 500 && dynamicBuffer < 1000){
		document.getElementById("dynamicBar").innerHTML = "Medium";
		document.getElementById("dynamicBar").style.color = "#ff5722";
		document.getElementById("dynamicBar").style.boxShadow="inset 0px 0px 20px 10px #ff5722";
	}
	else if(dynamicBuffer < 500 ){
		document.getElementById("dynamicBar").innerHTML = "Low";
		document.getElementById("dynamicBar").style.color = "#859500";
		document.getElementById("dynamicBar").style.boxShadow="inset 0px 0px 20px 10px #859500";
	}
		
	if(dynamicBuffer > 0)
		dynamicBuffer = 0;
}
function calculateDynamic()
{
	var x,y,z,alpha,beta,gamma;
	if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
			x = e.accelerationIncludingGravity.x;
			y =  e.accelerationIncludingGravity.y;
			z =  e.accelerationIncludingGravity.z;
		
			if((x>5) | (x<-5))
			{
				dynamicBuffer++;
			}						
		}	
	}
	if (window.DeviceOrientationEvent) {
		
		window.addEventListener("deviceorientation", function(event) 
		{
			alpha = Math.round(event.alpha);  
			document.getElementById("test").innerHTML = dynamicBuffer;
				if(alpha>45 && alpha < 315)
				{
					dynamicBuffer++;
				}		
		}, true);
	}
	
}