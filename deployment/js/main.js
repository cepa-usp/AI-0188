var velSlider;
var raioSlider;
var checkEscalar;
var checkVetorial;
var r = 60;
var vel = 0;
var current = 0;
var divVel;
var divRaio;
var divAngle;
var divArc;
var conteudo;
var circle, circleImage;
var angle = 0;
var arch = 0;
var mcRaio;
var mcArco;
var personagem;
var personw = 80/4;
var personh = 218/4;
var vetorVel;
var dash1, dash2;
var vetorAcel;

var rMin = 120;
var rMax = 200;
var rMinReal = 20;
var rMaxReal = 100;
var m = (rMaxReal - rMinReal)/(rMax - rMin);

function init(){
	//var conteudo = $("#conteudo");
	divVel = $("#vel");
	divRaio = $("#raio");
	divAngle = $("#angle");
	divArc = $("#arc");
	checkEscalar = $("#esc");
	checkVetorial = $("#vet");
	checkEscalar.attr('checked', true);
	checkVetorial.attr('checked', true);

	conteudo = Raphael("conteudo");
	//circleImage = conteudo.image("img/background.jpg", 300 - r, 240 - r, 2 * r, 2 * r).attr("opacity", "0.8");
	personagem = conteudo.image("img/person.png", 300 + r, 240, personw, personh);
	circle = conteudo.circle(300, 240, r);
	mcArco = conteudo.path("M0,0").attr("stroke-width", "3");
	mcRaio = conteudo.path("M0,0").attr({"fill": "#0000FF", 'fill-opacity': 0.5});
	vetorVel = conteudo.path("M0,0").attr({"stroke-width": "3", "stroke": "#00FF00", fill:"#00FF00"});
	vetorAcel = conteudo.path("M0,0").attr({"stroke-width": "3", "stroke": "#FF0000", fill:"#FF0000"});
	dash1 = conteudo.path("M0,0").attr({'stroke-dasharray': "--"});
	dash2 = conteudo.path("M0,0").attr({'stroke-dasharray': "--"});

	velSlider = new Dragdealer('velSlider', {slide:false, steps:81, snap:true, x:0.5, animationCallback: velMoving});
	raioSlider = new Dragdealer('raioSlider', {slide:false, steps:(rMaxReal - rMinReal + 1), snap:true, x:0.5, animationCallback: raioMoving});

	checkEscalar.on("click", escClick);
	checkVetorial.on("click", vetClick);

	
	//drawCircle();
	requestAnimationFrame(update);
}

function drawCircle(){
	var raio = getR();
	//circleImage.attr({x: 300 - raio, y: 240 - raio, width: 2 * raio, height: 2 * raio});
	circle.attr("r", raio);
	dash1.attr("path", "M300,240L" + (300 + raio) + ",240");
	dash2.attr("path", "M300,240L" + (300 + raio * Math.cos(angle * Math.PI/180)) + "," + (240 + raio * Math.sin(angle * Math.PI/180)));
	//circleImage.transform("r" + angle);
}

function updatePerson(){7
	var raio = getR();
	personagem.attr({
		x: 300 + (raio * Math.cos(angle * Math.PI/180)) - personw/2,
		y: 240 + (raio * Math.sin(angle * Math.PI/180)) - personh/2,
	})
}

function updateVetorVel(){
	if(checkVetorial.is(':checked')){
		if(Number(vel) == 0) vetorVel.hide();
		else vetorVel.show();
	}else{
		vetorVel.hide();
	}
	
	var raio = getR();
	var posX = 300 + (raio * Math.cos(angle * Math.PI/180));
	var posY = 240 + (raio * Math.sin(angle * Math.PI/180));
	vetorVel.attr("path", "M" + (posX) + "," + posY + "L" + (posX) + "," + (posY - getVel()) + "L" + (posX - 5) + "," + (posY - getVel()) + "L" + posX + "," + (posY - getVel() + (Number(vel) > 0 ? -8 : 8)) + "L" + (posX + 5) + "," + (posY - getVel()) + "L" + (posX) + "," + (posY - getVel()));
	vetorVel.transform(["R", angle, posX ,posY]);
}

function updateVetorAcel(){
	if(checkVetorial.is(':checked')){
		if(Number(vel) == 0) vetorAcel.hide();
		else vetorAcel.show();
	}else{
		vetorAcel.hide();
	}
	var raio = getR();
	var acel = getAceleration();
	var posX = 300 + (raio * Math.cos(angle * Math.PI/180));
	var posY = 240 + (raio * Math.sin(angle * Math.PI/180));
	vetorAcel.attr("path", "M" + posX + "," + posY + "L" + (posX - acel) + "," + posY + "L" + (posX - acel) + "," + (posY - 5) + "L" + (posX - acel - 8) + "," + posY + "L" + (posX - acel) + "," + (posY + 5) + "L" + (posX - acel) + "," + posY);
	vetorAcel.transform(["R", angle, posX ,posY]);
}

function getR(){
	return (r - rMinReal)/m + rMin;
}

function escClick(e){
	if(checkEscalar.is(':checked')){
		mcArco.show();
		mcRaio.show();
		dash1.show();
		dash2.show();
	}else{
		mcArco.hide();
		mcRaio.hide();
		dash1.hide();
		dash2.hide();
	}
}

function vetClick(e){
	if(checkVetorial.is(':checked')){
		//personagem.show();
	}else{
		//personagem.hid(e);
	}
}


function velMoving(x, y){
	var newVel = -40 + 80 * x;

	vel = newVel;
	divVel.html("Velocidade: " + newVel + " m/s");
	//update(2000);
}

function raioMoving(x, y){
	var newRaio = ((x * (rMaxReal - rMinReal)) + rMinReal).toFixed(0);

	r = newRaio;
	divRaio.html("Raio: " + newRaio + " m");
	//update();
}

function getVel(){
	return vel/r * 50;
}

function getTheta(t){
	return getVel() * t;
}

function getArch(theta){
	return r * theta * Math.PI/360;
}

function getAceleration(){
	return Math.pow(vel, 2)/r;
}

function update(timestamp){
	//Tempo passado desdo a últim chamada
	var dt = (timestamp - current)/1000;
	current = timestamp;
	//Angulo 
	var deltaAngle = getTheta(dt);
	angle -= deltaAngle;
	angle = angle%360;
	if(angle > 0) angle -= 360;
	divAngle.html("Ângulo: " + (angle * -1).toFixed(1) + "º" + " (" + (angle * Math.PI/180 * -1).toFixed(2) + " rad)");

	arch = getArch(angle * -1);
	divArc.html("Arco: " + arch.toFixed(1) + " m");


	updatePerson();
	updateVetorVel();
	updateVetorAcel();
	drawCircle();
	if(angle < 0){
		var paths = getPaths();
		mcRaio.attr("path", paths.raio);
		mcArco.attr("path", paths.arco)
	}


	//if(timestamp < 2000)
		requestAnimationFrame(update);
}

function getPaths(){
	var caminhos = {};
	var cte = Math.PI/180;
	var cx = 300;
	var cy = 240;
	//var nAngle = angle * -1;
	var rAngle = 60;
	var rTotal = getR();
	var ptFinal = {x:rAngle * Math.cos(angle * cte), y:rAngle * Math.sin(angle * cte)};
	var raioPath = "M" + (ptFinal.x + cx) + "," + (ptFinal.y + cy) + "L" + cx + "," + cy + "L" + (cx + rAngle) + "," + cy;
	//var raioPath = "M" + (cx + rAngle) + "," + cy;
	var arcoPath = "M" + (cx + rTotal) + "," + cy;
	//console.log(angle);
	for (var i = 0; i >= angle; i-=1) {
		var ang = i;

		var rx = rAngle * Math.cos(ang * cte);
		var ry = rAngle * Math.sin(ang * cte);
		raioPath += "L" + (rx + cx) + "," + (ry + cy);

		var rtx = rTotal * Math.cos(ang * cte);
		var rty = rTotal * Math.sin(ang * cte);
		arcoPath += "L" + (rtx + cx) + "," + (rty + cy);
	};

	raioPath += "L" + (ptFinal.x + cx) + "," + (ptFinal.y + cy);

	caminhos.raio = raioPath;
	caminhos.arco = arcoPath;

	return caminhos;
}

function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
