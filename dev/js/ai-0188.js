/*(function() {
    if (!window.ai0188)
        window.ai0188 = function(element){

        };
}());*/

function AI0188(element, background){
	this.el = element;
	this.divEl = $("#" + element);
	this.width = this.divEl.width();
	this.height = this.divEl.height();
	this.bkg = background;
	
	this.divEl.css("background-color", "blue")

	this.init(element);
}

AI0188.prototype.init = function(element){
	this.createBackground(this.bkg)
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