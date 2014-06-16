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
	
	this.divEl.css("background-color", "blue");

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
		speed: 5, 
		dir: 'left'
	}).appendTo('#'+this.el);
}

AI0188.prototype.createWheelDiv = function(){
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var wheelSize;
	var wheelPercentage = 0.4;
	if(wWidth >= wHeight){
		wheelSize = wHeight * wheelPercentage;
	}else{
		wheelSize = wWidth * wheelPercentage;
	}
	var marginLeft = wWidth/2 - wheelSize/2;
	$('<div/>', {
	    id: 'wheelDiv'
	}).css({
		position: "absolute",
		width: wheelSize + "px",
		height: wheelSize + "px",
		bottom: "6%",
		"margin-left": marginLeft + "px"
		//"background-color": "green"
	}).appendTo('#'+this.el);

	$(window).resize(this.repositionWheel);
}

AI0188.prototype.repositionWheel = function(){
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	var wheelSize;
	var wheelPercentage = 0.4;
	if(wWidth >= wHeight){
		wheelSize = wHeight * wheelPercentage;
	}else{
		wheelSize = wWidth * wheelPercentage;
	}
	var marginLeft = wWidth/2 - wheelSize/2;

	$("#wheelDiv").width(wheelSize);
	$("#wheelDiv").height(wheelSize);
	$("#wheelDiv").css("margin-left", marginLeft + "px");
}

AI0188.prototype.createRaphael = function(){
	this.raphael = Raphael("wheelDiv");
	this.raphael.setViewBox(0,0,500,500);
    this.raphael.setSize('100%', '100%');

    this.wheelImage = this.raphael.image("img/roda.png", 0, 0, 500, 500);
    //this.wheelCircle = this.raphael.circle(250, 250, 250);
	//this.wheelCircle.click(this.wheelClick);
	this.wheelImage.newParent = this;
	this.wheelImage.click(this.wheelClick);
	this.wheelAnimation = Raphael.animation({transform: "r360"}, 5000).repeat(Infinity);
	this.wheelImage.animate(this.wheelAnimation);
	//$('#wheelDiv').rotate();
	requestAnimationFrame(this.updateT.bind(this));
}

AI0188.prototype.wheelClick = function(evt){
	var ai = this.newParent;
	//console.log(evt)
	var div = $("#wheelDiv");
	var posx = (evt.x - div.offset().left) * 500/div.width();
	var posy = (evt.y - div.offset().top) * 500/div.height();
	if(distance(250, 250, posx, posy) <= 245) ai.addPoint(posx, posy);
}

AI0188.prototype.addPoint = function(ptx, pty){
	console.log(ptx, pty);
	var last = this.raphael.circle(ptx, pty, 10).attr("fill", "#F00");
	var lastAnimation = Raphael.animation({transform: "r360 250,250"}, 5000).repeat(Infinity);
	last.animate(lastAnimation);
	this.pts.push(last);
}

AI0188.prototype.updateT = function(){
	//console.log(this);
	for (var i = 0; i < this.pts.length; i++) {
		Things[i]
	};

	requestAnimationFrame(this.updateT.bind(this));
}
