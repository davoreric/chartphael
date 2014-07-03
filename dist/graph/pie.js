/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** Pie graph ***************************
************************************************/

chartphael.pie = function(options) {

	//set public options and merge it with passed option object
	this.options = chartphael.helper.extend({}, chartphael.pie.defaults, options);

	//set internal data
	this.node = this.options.node;
	this.data = this.options.data.items;

	this.paperSize = {
		'x': this.node.offsetWidth,
		'y': this.node.offsetHeight
	};

	this.centerX = this.paperSize.x/2;
	this.centerY = this.paperSize.y/2;
	this.radius = this.centerY-40;

	//set SVG paper workarea
	this.paper = Raphael(this.node,this.paperSize.x,this.paperSize.y);

	//adding custom arc attribute
	this.paper.customArc();

	//start
	this.init();

};

chartphael.helper.extend(chartphael.pie.prototype, {

	init: function(){

		//call method for creating pie graph
		this.setPie();

	},

	setPie: function(){

		var values = [],
		colors = [];

		for(i=0;i<this.data.length;i++){
			values.push(parseInt(this.data[i].percent));
	    	colors.push(this.data[i].color);
		}
		
		this.paper.pieChart(this.centerX, this.centerY, this.radius, values, colors, true);

	},

	updateJSON: function(json){

		//replace current JSON
		this.data = json;

		//clear paper
		this.paper.clear();

		//draw chart
		this.init();

	}

});

//default values
chartphael.pie.defaults = {};