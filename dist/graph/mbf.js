/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** BMF graph ***************************
************************************************/

chartphael.bmf = function(options) {

	//set public options and merge it with passed option object
	this.options = chartphael.helper.extend({}, chartphael.bmf.defaults, options);

	//set internal data
	this.node = this.options.node;
	this.data = this.options.data;

	if(this.options.dimensions){

		this.paperSize = {
			'x': this.options.dimensions.width,
			'y': this.options.dimensions.height
		};

	} else {

		this.paperSize = {
			'x': this.node.offsetWidth,
			'y': this.node.offsetHeight
		};

	}

	//get boundary coordinates for grid and graph
	this.bound = chartphael.helper.getBound.call(this,this.paperSize,this.options.padding);

	//set SVG paper workarea
	this.paper = Raphael(this.node,this.paperSize.x,this.paperSize.y);

	//call method for creating grid
	this.setGrid();

	//call method for creating line graph
	this.setGraph();

	//call method for creating custom dot
	this.setCustomCircle();

	//call method for creating additional Y axis
	this.setInfoAxis();

};

chartphael.helper.extend(chartphael.bmf.prototype, {

	setGrid: function(){

		//call global grid create function and apply styles
		this.grid = this.paper.path(
			chartphael.draw.grid.call(this)
		).attr(this.options.gridStyle);

	},

	setGraph: function(){

		var setup = {
			"dots": true,
			"dotsText": true
		};

		this.paper.path(
			chartphael.draw.line.call(this,setup)
		).attr(this.options.lineStyle).toBack();
		
		

	},

	setCustomCircle: function(){

		var pointPosX = this.bound.br.x,
			rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
			dataHeight = rangeData.range,
			pointPosY = this.bound.br.y - ((this.data.items[0].y - rangeData.min)*(this.bound.size.y/dataHeight));

		this.paper.circle(pointPosX, pointPosY, 32).attr({
			'fill': 'red',
			'stroke-width': 4,
			'stroke': '#fff'
		});

	},

	setInfoAxis: function(){

		var infoAxis = this.data.infoAxis,
			rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
			dataHeight = rangeData.range;

		for (i=0;i<infoAxis.length;i++) {

			var tempY = this.bound.br.y - ((infoAxis[i].coord.y - rangeData.min)*(this.bound.size.y/dataHeight))

			this.paper.path('M'+this.bound.bl.x+' '+tempY+'L'+this.paperSize.x+' '+tempY).attr({
				'stroke': infoAxis[i].color,
				'stroke-width': 1
			}).toBack();

		}

		this.grid.toBack();

	}

});

//default values
chartphael.bmf.defaults = {
	fixedStepX: false,
	fixedStepY: false,
	xAxis: true,
	yAxis: true,
	directionY: 'left',
	directionX: 'bottom',
	dimensions: false,
	bound: {
		'x': 0,
		'y': 100
	},
	padding: {
		'top': 50,
        'right': 50,
        'bottom': 50,
        'left': 50
	},
	gridStyle: {
		'stroke': '#84aa20',
		'stroke-width': 1
	},
	lineStyle: {
		'stroke': '#fff',
		'stroke-width': 4
	},
	circleRadius: 8,
	circleStyle: {
		'fill': '#819926',
		'stroke-width': 3,
		'stroke': '#fff'
	},
	circleTextStyle: {
		'fill': '#fff',
		'font-size':'15px'
	}
};