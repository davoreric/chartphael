/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** Bar graph **************************
************************************************/

chartphael.bar = function(options) {

	//set public options and merge it with passed option object
	this.options = chartphael.helper.extend({}, chartphael.bar.defaults, options);

	//set internal data
	this.node = this.options.node;
	this.data = this.options.data;

	this.paperSize = {
		'x': this.node.offsetWidth,
		'y': this.node.offsetHeight
	};
	
	//get boundary coordinates for grid and graph
	this.bound = chartphael.helper.getBound.call(this,this.paperSize,this.options.padding);

	//set SVG paper workarea
	this.paper = Raphael(this.node,this.paperSize.x,this.paperSize.y);

	//set responsive chart
	if(this.options.responsive){
		chartphael.helper.setResponsive({
			node: this.paper,
			width: this.paperSize.x,
			height: this.paperSize.y
		});
	}

	//start
	this.init();

};

chartphael.helper.extend(chartphael.bar.prototype, {

	init: function(){

		//call method for creating grid
		this.setGrid();

		//call method for creating bar graph
		this.setGraph();

	},

	setGrid: function(){

		//call global grid create function and apply styles
		this.grid = this.paper.path(
			chartphael.draw.grid.call(this)
		).attr(this.options.grid.style);

	},

	setGraph: function(){

		chartphael.draw.bar.call(this);

		this.grid.toBack();

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
chartphael.bar.defaults = {

	responsive: false,

	//setup X axis
	xAxis: {
		show: true,
		text: true,
		step: false,
		outerLines: true,
		direction: 'bottom'
	},
	
	//setup Y axis
	yAxis: {
		show: false,
		text: true,
		step: false,
		outerLines: true,
		direction: 'left'
	},

	//setup grid
	grid: {
		style: {
			'stroke': '#edefea',
			'stroke-width': 1
		},
		text: {
			show: true,
			style: {
				'fill': '#a1a1a1',
				'font-size':'11px'
			}
		}
	},

	//setup chart bar
	bar: {
		style: {
			'stroke': '#8cb428',
			'stroke-width': 20,
			'fill': '#8cb428'
		}
	},

	//setup chart dots
	dots: {
		show: false,
		text: {
			show: false
		}
	},

	//setup outer chart padding
	padding: {
		'top': 40,
        'right': 40,
        'bottom': 40,
        'left': 40
	}

};