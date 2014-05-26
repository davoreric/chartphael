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
	this.node = document.getElementById(this.options.id);
	this.data = this.options.data;

	this.size = {
		'x': this.node.offsetWidth,
		'y': this.node.offsetHeight
	};

	//get boundary coordinates for grid and graph
	this.bound = chartphael.helper.getBound.call(this,this.size,this.options.padding);

	//set SVG paper workarea
	this.paper = Raphael(this.options.id,this.size.x,this.size.y);

	//call method for creating grid
	this.setGrid();

	//call method for creating line graph
	this.setGraph();	

};

chartphael.helper.extend(chartphael.bmf.prototype, {

	setGrid: function(){

		//call global grid create function and apply styles
		this.grid = this.paper.path(
		chartphael.draw.grid.call(this, this.bound)
		).attr(this.options.gridStyle);

	},

	setGraph: function(){

		var items = this.data.items,
			dataHeight = chartphael.helper.getDataRange.call(this,this.data.items,'y'),
			path = null;

		for(i=0;i<items.length;i++){
			var currInc = this.options.fixedStepX*i,
				pointPosX = this.bound.br.x-currInc,
				pointPosY = this.bound.bl.y - (items[i].y*((this.size.y - (this.options.padding.top + this.options.padding.bottom))/dataHeight));
			this.paper.circle(pointPosX, pointPosY, 6).attr(this.options.circleStyle);
			if(i==0){
				path += 'M'+ pointPosX +' '+ pointPosY;
			} else {
				path += 'L'+ pointPosX +' '+ pointPosY;
			}
		}

		this.paper.path(path).attr(this.options.lineStyle).toBack();
		this.grid.toBack();

	}

});

//default values
chartphael.bmf.defaults = {
	fixedStepX: 150,
	padding: {
		'top': 125,
		'right': 100,
		'bottom': 100,
		'left': 0
	},
	gridStyle: {
		'stroke': '#d8decf',
		'stroke-width': 1
	},
	lineStyle: {
		'stroke': '#829c27',
		'stroke-width': 4
	},
	circleStyle:  {
		'fill': '#829c27',
		'stroke-width': 2,
		'stroke': '#fff'
	}
};