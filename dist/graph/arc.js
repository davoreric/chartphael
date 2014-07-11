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

	//set public options and merge it with passed option object
	this.options = chartphael.helper.extend({}, chartphael.arc.defaults, options);

	//set internal data
	this.node = this.options.node;
	this.data = this.options.data;

	this.paperSize = {
		'x': this.node.offsetWidth,
		'y': this.node.offsetHeight
	};

	this.radius = (this.paperSize.x - 2*this.options.stroke)/2;
	this.center = this.radius + this.options.stroke;
	
	//set SVG paper workarea
	this.paper = Raphael(this.node,this.paperSize.x,this.paperSize.y);

	//adding custom arc attribute
	this.paper.customArc();

	//start
	this.init();

};

chartphael.helper.extend(chartphael.arc.prototype, {

	init: function(){

		if(this.data.value>100) this.data.value = 100;

		//call method for creating arc graph
		this.setChart(this.data.value);

	},

	setChart: function(end){

		this.chart = this.paper.path().attr({
		    'stroke': this.options.colorChart,
		    'stroke-width': this.options.stroke,
		    arc: [this.center, this.center, 0, 100, this.radius,false]
		});

		this.chart.animate({
		    arc: [this.center, this.center, end, 100, this.radius,false]
		}, 500, "easysin");

	},

	updateData: function(json){

		//replace current JSON
		this.data = json;

		if(this.data.value>100) this.data.value = 100;

		this.chart.animate({
		    arc: [this.center, this.center, this.data.value, 100, this.radius,false]
		}, 500, "easysin");

	}

});

//default values
chartphael.arc.defaults = {
	stroke: 5,
	colorChart: '#8fbb48'
};