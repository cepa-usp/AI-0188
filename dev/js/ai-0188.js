/*(function() {
    if (!window.ai0188)
        window.ai0188 = function(element){

        };
}());*/
function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function AI0188(element, background){
	this.el = element;
	this.divEl = $("#" + element);
	this.width = this.divEl.width();
	this.height = this.divEl.height();
	this.bkg = background;
	this.raphael = null;
	this.pts = [];
	
	//this.divEl.css("background-color", "blue");

	this.wheelPercentage = 0.6;
	this.wheelSize = 300;
	this.svgSize = 500;
	this.theta = 0.6;
	this.vTrans = this.theta * this.wheelSize/2;
	this.ptR = 5;

	this.init(element);
}

AI0188.prototype.init = function(element){
	this.createBackground(this.bkg);
	this.createWheelDiv();
	this.createRaphael();
}

AI0188.prototype.createBackground = function(imgBkg){
	$('<div/>', {
	    id: 'backRollingImg'
	}).css({
		position: "absolute",
		width: "100%",
		height: "40%",
		bottom: "0px",
		background: "url(" + imgBkg + ")",
		'background-repeat': "repeat-x",
		'background-size': " auto 100%"
	}).pan({
		fps: 30, 
		speed: 4, 
		dir: 'right'
	}).appendTo('#'+this.el);

	setTimeout(this.adjustBackgroundImage.bind(this), 3000);
}

AI0188.prototype.adjustBackgroundImage = function(){
	//console.log(this);
	this.imgProperties = {};
	this.imgProperties.width = $._spritely.instances.backRollingImg.options.img_width;
	this.imgProperties.height = $._spritely.instances.backRollingImg.options.img_height;

	var divScale = $("#backRollingImg").height()/this.imgProperties.height;
	var newWidth = this.imgProperties.width * divScale;
	var newHeight = this.imgProperties.height * divScale;
	$._spritely.instances.backRollingImg.options.img_width = newWidth;
	$._spritely.instances.backRollingImg.options.img_height = newHeight;
}

AI0188.prototype.createWheelDiv = function(){
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * this.wheelPercentage;
	}
	var marginLeft = wWidth/2 - whSize/2;
	$('<div/>', {
	    id: 'wheelDiv'
	}).css({
		position: "absolute",
		width: whSize + "px",
		height: whSize + "px",
		bottom: "0%",
		"margin-left": marginLeft + "px"
		//"background-color": "green"
	}).appendTo('#'+this.el);

	$(window).resize(this.repositionWheel.bind(this));
}

AI0188.prototype.repositionWheel = function(){
	//console.log(this.wheelPercentage)
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var whSize;
	if(wWidth >= wHeight){
		whSize = wHeight * this.wheelPercentage;
	}else{
		whSize = wWidth * (this.wheelPercentage + 0.2);
	}
	var marginLeft = wWidth/2 - whSize/2;

	$("#wheelDiv").width(whSize);
	$("#wheelDiv").height(whSize);
	$("#wheelDiv").css("margin-left", marginLeft + "px");

	var divScale = $("#backRollingImg").height()/this.imgProperties.height;
	var newWidth = this.imgProperties.width * divScale;
	var newHeight = this.imgProperties.height * divScale;
	$._spritely.instances.backRollingImg.options.img_width = newWidth;
	$._spritely.instances.backRollingImg.options.img_height = newHeight;
}

AI0188.prototype.createRaphael = function(){
	this.raphael = Raphael("wheelDiv");
	this.raphael.setViewBox(0,0,this.svgSize,this.svgSize);
    this.raphael.setSize('100%', '100%');

    this.wheelImage = this.raphael.image("img/roda.png", (this.svgSize - this.wheelSize)/2, (this.svgSize - this.wheelSize)/2, this.wheelSize, this.wheelSize);
    //this.wheelCircle = this.raphael.circle(250, 250, 250);
	//this.wheelCircle.click(this.wheelClick);
	this.wheelImage.newParent = this;
	this.wheelImage.click(this.wheelClick);
	this.wheelAnimation = Raphael.animation({transform: "r-360"}, 8000).repeat(Infinity);
	this.wheelImage.animate(this.wheelAnimation);
	//$('#wheelDiv').rotate();
	requestAnimationFrame(this.updateT.bind(this));
}

AI0188.prototype.wheelClick = function(evt){
	var ai = this.newParent;
	//console.log(evt)
	var div = $("#wheelDiv");
	var posx = Number(((evt.x - div.offset().left) * ai.svgSize/div.width()).toFixed(0));
	var posy = Number(((evt.y - div.offset().top) * ai.svgSize/div.height()).toFixed(0));
	var ray = distance(ai.svgSize/2, ai.svgSize/2, posx, posy);
	var minDist = 5;
	if(ray <= ai.wheelSize/2 + 2) {
		if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no centro da roda:
			ai.addPoint(ai.svgSize/2, ai.svgSize/2, ray);

		}else if(distance(posx, posy, ai.svgSize/2 + ai.wheelSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no ponto 1 (0 graus)
			ai.addPoint(ai.svgSize/2 + ai.wheelSize/2, ai.svgSize/2, ray);

		}else if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2 - ai.wheelSize/2) < minDist){
			//Posiciona o ponto no ponto 2 (90 graus)
			ai.addPoint(ai.svgSize/2, ai.svgSize/2 - ai.wheelSize/2, ray);

		}else if(distance(posx, posy, ai.svgSize/2 - ai.wheelSize/2, ai.svgSize/2) < minDist){
			//Posiciona o ponto no ponto 3 (180 graus)
			ai.addPoint(ai.svgSize/2 - ai.wheelSize/2, ai.svgSize/2, ray);
			
		}else if(distance(posx, posy, ai.svgSize/2, ai.svgSize/2 + ai.wheelSize/2) < minDist){
			//Posiciona o ponto no ponto 4 (270 graus)
			ai.addPoint(ai.svgSize/2, ai.svgSize/2 + ai.wheelSize/2, ray);
		}else{
			//Posiciona o ponto onde foi clicado.
			ai.addPoint(posx, posy, ray);
		}
	}
}

AI0188.prototype.addPoint = function(ptx, pty, ray){
	//console.log(ptx, pty);
	var last = {};
	//Angulo do ponto em relação à origem.
	last.angle = Math.atan2(pty - this.svgSize/2, ptx - this.svgSize/2);
	last.ray = ray;
	//last.inicial = {x:ptx, y:pty};
	//Set com os objetos que rotacionarao junto com o ponto
	last.set = this.raphael.set();
	
	//Vetor translação
	last.trans = this.raphael.path("M" + ptx + "," + pty + "L" + (ptx - this.vTrans) + "," + pty + drawArrow(ptx, pty, 0)).attr({"stroke-width": "3", "stroke": "#000000", fill:"#000000"});
	
	//Vetor rotação
	last.d = this.theta * ray;
	var rotx = ray * Math.cos(last.angle) + last.d * Math.sin(last.angle) + this.svgSize/2;
	var roty = ray * Math.sin(last.angle) - last.d * Math.cos(last.angle) + this.svgSize/2;
	last.rot = this.raphael.path("M" + ptx + "," + pty + "L" + rotx + "," + roty).attr({"stroke-width": "3", "stroke": "#0000FF", fill:"#0000FF"});
	
	//Vetor resultante
	var resultx = (ptx - this.vTrans - ptx) + (rotx - ptx) + ptx;
	var resulty = (pty - pty) + (roty - pty) + pty;
	last.result = this.raphael.path("M" + ptx + "," + pty + "L" + resultx + "," + resulty + drawArrow(resultx, resulty, 0)).attr({"stroke-width": "3", "stroke": "#00FF00", fill:"#00FF00"});
	
	//O ponto
	last.pt = this.raphael.circle(ptx, pty, this.ptR).attr("fill", "#F00");
	last.set.push(last.pt);
	//last.set.push(last.rot);

	var lastAnimation = Raphael.animation({transform: "r-360 " + (this.svgSize/2) + "," + (this.svgSize/2)}, 8000/*, "linear", function(){last.set.attr({"transform": ""}), console.log(last.set)}*/).repeat(Infinity);
	//var vAnimation
	last.set.animate(lastAnimation);
	
	this.pts.push(last);
}

AI0188.prototype.updateT = function(){
	for (var i = 0; i < this.pts.length; i++) {
		var pt = this.pts[i];
		var bbox = pt.pt.getBBox();
		var ptx = bbox.x + this.ptR;
		var pty = bbox.y + this.ptR;
		pt.angle = Math.atan2(pty - this.svgSize/2, ptx - this.svgSize/2);

		//Vetor translação:
		pt.trans.attr("path", "M" + ptx + "," + pty + "L" + (ptx - this.vTrans) + "," + (pty) + drawArrow(bbox.x - this.vTrans + this.ptR, bbox.y + this.ptR, 0));

		//Vetor rotação:
		var rotx = pt.ray * Math.cos(pt.angle) + pt.d * Math.sin(pt.angle) + this.svgSize/2;
		var roty = pt.ray * Math.sin(pt.angle) - pt.d * Math.cos(pt.angle) + this.svgSize/2;
		pt.rot.attr("path", "M" + ptx + "," + pty + "L" + rotx + "," + roty);

		//Vetor resultante
		var resultx = (ptx - this.vTrans - ptx) + (rotx - ptx) + ptx;
		var resulty = (pty - pty) + (roty - pty) + pty;
		pt.result.attr("path", "M" + ptx + "," + pty + "L" + resultx + "," + resulty + drawArrow(resultx, resulty, 0));
	};

	requestAnimationFrame(this.updateT.bind(this));
}

function drawArrow(ptx, pty, angle){
	return "Z";
	//return "L" + (ptx - (15 * Math.cos(angle))) + "," + (pty + (5 * Math.sin(angle))) + "L" + (ptx - (15 * Math.cos(angle))) + "," + (pty - (5 * Math.sin(angle))) + "L" + ptx + "," + pty + "Z";
}
