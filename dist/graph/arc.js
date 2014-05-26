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

	this.node = document.getElementById(options.id);
	this.width = this.node.offsetWidth;
	this.stroke = 6;
	this.radius = (this.width - 2*this.stroke)/2;
	this.center = this.radius + this.stroke;
	this.colorBkg = '#ccc';
	this.colorChart = '#8fbb48';

	this.paper = Raphael(options.id,this.width,this.width);

	this.setArcAttr();
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
	    arc: [this.center, this.center, 0, 100, this.radius]
	});

	chart.animate({
	    arc: [this.center, this.center, end, 100, this.radius]
	}, 1500, "bounce");

};

chartphael.arc.prototype.setArcAttr = function(){

	this.paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
	    var alpha = 360 / total * value,
	        a = (90 - alpha) * Math.PI / 180,
	        x = xloc + R * Math.cos(a),
	        y = yloc - R * Math.sin(a),
	        path;
	    if (total == value) {
	        path = [
	            ["M", xloc, yloc - R],
	            ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
	        ];
	    } else {
	        path = [
	            ["M", xloc, yloc - R],
	            ["A", R, R, 0, +(alpha > 180), 1, x, y]
	        ];
	    }
	    return {
	        path: path
	    };
	};

};