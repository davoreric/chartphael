/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** Arc graph ***************************
************************************************/

chartphael.arc = function(options) {

	this.node = options.node;
	this.width = this.node.offsetWidth;
	this.stroke = 6;
	this.radius = (this.width - 2*this.stroke)/2;
	this.center = this.radius + this.stroke;
	this.colorBkg = '#ccc';
	this.colorChart = '#8fbb48';

	this.paper = Raphael(this.node,this.width,this.width);

	//adding custom arc attribute
	this.paper.customArc();

	this.setBkg();
	this.setChart(this.node.getAttribute('data-value'));

}

chartphael.arc.prototype.setBkg = function(){

	var bkg = this.paper.circle(this.center, this.center, this.radius).attr({stroke: this.colorBkg, 'stroke-width': this.stroke});

};

chartphael.arc.prototype.setChart = function(end){

	var chart = this.paper.path().attr({
	    'stroke': this.colorChart,
	    'stroke-width': this.stroke,
	    arc: [this.center, this.center, 0, 100, this.radius,false]
	});

	chart.animate({
	    arc: [this.center, this.center, end, 100, this.radius,false]
	}, 1500, "bounce");

};