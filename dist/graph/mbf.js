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

	this.paperSize = {
		'x': this.node.offsetWidth,
		'y': this.node.offsetHeight
	};

	//get boundary coordinates for grid and graph
	this.bound = chartphael.helper.getBound.call(this,this.paperSize,this.options.padding);

	//set SVG paper workarea
	this.paper = Raphael(this.node,this.paperSize.x,this.paperSize.y);

	//adding custom arc attribute
	this.paper.customArc();

	//start
	this.init();

};

chartphael.helper.extend(chartphael.bmf.prototype, {

	init: function(){

		//call method for creating grid
		this.setGrid();

		//call method for creating line graph
		this.setGraph();

		//call method for creating custom dot
		this.setCustomCircle();

		//call method for creating additional Y axis
		this.setInfoAxis();

	},

	setGrid: function(){

		//call global grid create function and apply styles
		this.grid = this.paper.path(
			chartphael.draw.grid.call(this)
		).attr(this.options.grid.style);

	},

	setGraph: function(){

		chartphael.draw.line.call(this);

	},

	setCustomCircle: function(){

		var pointPosX = this.bound.br.x,
			rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
			dataHeight = rangeData.range,
			pointPosY = this.bound.br.y - ((this.data.items[0].y - rangeData.min)*(this.bound.size.y/dataHeight));

		//background
		this.paper.circle(pointPosX, pointPosY, 70).attr({
			'fill': '#fff',
			'stroke-width': 0
		});

		//central status circle
		var centralData = this.data.customCircle.progress.outerStep,
			values = [],
			colors = [];

		this.paper.circle(pointPosX, pointPosY, 50).attr({
			'fill': '#f3f3f0',
			'stroke-width': 0
		});

		if(centralData){

			for(i=0;i<centralData.length;i++){
				values.push(parseInt(centralData[i].percent));
		    	colors.push(centralData[i].color);
			}

			this.paper.pieChart(pointPosX, pointPosY, 50, values, colors);

			this.paper.circle(pointPosX, pointPosY, 39).attr({
				'fill': '#fff',
				'stroke-width': 0
			});

		}

		//text
		this.paper.text(pointPosX, pointPosY, this.data.items[0].y).attr({
			'fill': '#8eb727',
			'font-size':'19px',
			'stroke': '#8eb727',
			'stroke-width': 0,
			'font-family': this.options.globalFont
		});

		//inner status circle
		var innerCircle = this.paper.path().attr({
		    'stroke': '#8eb727',
		    'stroke-width': 8,
		    arc: [pointPosX, pointPosY, 0, 100, 28, false]
		});

		innerCircle.animate({
			arc: [pointPosX, pointPosY, this.data.customCircle.progress.innerStep, 100, 28, false]
		}, 500, "easysin");

		//outer status circle
		var outerCircle = this.paper.circle(pointPosX, pointPosY, 60).attr({
			'fill': 'transparent',
			'stroke': this.data.customCircle.statusColor,
			'stroke-width': '7',
			'stroke-dasharray': '.'
		});

		outerCircle.node.setAttribute('stroke-dasharray','7,1.95');
		

	},

	setInfoAxis: function(){

		var infoAxis = this.data.infoAxis,
			rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
			dataHeight = rangeData.range;

		for (i=0;i<infoAxis.length;i++) {

			var tempY = this.bound.br.y - ((infoAxis[i].coord.y - rangeData.min)*(this.bound.size.y/dataHeight))

			var line = this.paper.path('M'+this.bound.bl.x+' '+tempY+'L'+this.paperSize.x+' '+tempY).attr({
				'stroke': infoAxis[i].color,
				'stroke-width': 1
			}).toBack();

			var lineText = this.paper.text(this.bound.bl.x + 20, tempY, infoAxis[i].coord.y).attr({
				'fill': infoAxis[i].color,
				'font-size':'12px',
				'text-anchor': 'start',
				'stroke-width': 0,
				'stroke': infoAxis[i].color,
				'font-family': this.options.globalFont
			});

			var rectWidth = lineText.getBBox().width + 4,
				rectHeight = lineText.getBBox().height + 2,
				rectPointPosX = (this.bound.bl.x + 20) - 2,
				rectPointPosY = tempY-rectHeight/2;

			var lineTextBkg = this.paper.rect(rectPointPosX, rectPointPosY, rectWidth, rectHeight).attr({
				'fill': this.options.dots.text.bkg,
				'stroke-width': 0
			});
			
			lineTextBkg.toBack();
			line.toBack();

		}

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
chartphael.bmf.defaults = {

	xAxis: {
		show: false,
		text: false,
		step: 150,
		outerLines: true,
		direction: 'bottom'
	},	

	yAxis: {
		show: true,
		text: false,
		step: 150,
		outerLines: true,
		direction: 'right'
	},

	grid: {
		style: {
			stroke: '#84aa20',
			strokeWidth: 1
		}
	},

	boundRange: {
		'x': 0,
		'y': 100
	},

	line: {
		shadow: {
			show: true
		},
		style: {
			'stroke': '#fff',
			'stroke-width': 4
		}
	},

	dots: {
		show: true,
		radius: 8,
		style: {
			'fill': '#819926',
			'stroke-width': 4,
			'stroke': '#fff'
		},
		text: {
			show: true,
			bkg: '#99c031',
			style: {
				'fill': '#fff',
				'font-size':'16px',
				'stroke-width': 0,
				'stroke': '#fff',
				'font-family': '"Open Sans Condensed",Arial,sans-serif'
			}
		}
	},

	globalFont: '"Open Sans Condensed",Arial,sans-serif',

	padding: {
		'top': 125,
        'right': 100,
        'bottom': 100,
        'left': 0
	}

};