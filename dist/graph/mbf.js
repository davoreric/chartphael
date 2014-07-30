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
	this.dotsArray = [];
	this.dotsTextArray = [];
	this.dotTextBkg = [];
	this.trackerArray = [];
	this.pathEl = true;

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

		if(!this.options.trackerOnly){

			//call method for creating grid
			this.setGrid();

			//call method for creating line graph
			this.setGraph();

			//call method for creating additional Y axis
			this.setInfoAxis();

		}

		//call method for creating custom dot
		this.setTracker();		

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

	setTracker: function(){

		var rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
			dataHeight = rangeData.range;

		if(this.options.trackerOnly){

			var pointPosX = this.paperSize.x/2,
				pointPosY = this.paperSize.y/2;

		} else {

			var pointPosX = this.bound.br.x,
				pointPosY = this.bound.br.y - ((this.data.items[0].y - rangeData.min)*(this.bound.size.y/dataHeight));

		}

		//background
		this.trackerArray[0] = this.paper.circle(pointPosX, pointPosY, 70).attr({
			'fill': '#fff',
			'stroke-width': 0
		});

		//central status circle
		var centralData = this.data.tracker.progress.outerStep,
			values = [],
			colors = [];

		this.trackerArray[1] = this.paper.circle(pointPosX, pointPosY, 50).attr({
			'fill': '#f3f3f0',
			'stroke-width': 0
		});

		if(centralData){

			for(i=0;i<centralData.length;i++){
				values.push(parseInt(centralData[i].percent));
		    	colors.push(centralData[i].color);
			}

			this.trackerArray[2] = this.paper.pieChart(pointPosX, pointPosY, 50, values, colors);

			this.trackerArray[3] = this.paper.circle(pointPosX, pointPosY, 39).attr({
				'fill': '#fff',
				'stroke-width': 0
			});

		}

		//text
		this.trackerArray[4] = this.paper.text(pointPosX, pointPosY, this.data.items[0].y).attr({
			'fill': '#8eb727',
			'font-size':'19px',
			'stroke': '#8eb727',
			'stroke-width': 0,
			'font-family': this.options.dots.text.style['font-family']
		});

		//inner status circle
		this.trackerArray[5] = this.paper.path().attr({
		    'stroke': '#8eb727',
		    'stroke-width': 8,
		    arc: [pointPosX, pointPosY, 0, 100, 28, false]
		});

		this.trackerArray[5].animate({
			arc: [pointPosX, pointPosY, this.data.tracker.progress.innerStep, 100, 28, false]
		}, 500, "easysin");

		//outer status circle
		this.trackerArray[6] = this.paper.circle(pointPosX, pointPosY, 60).attr({
			'fill': 'transparent',
			'stroke': this.data.tracker.statusColor,
			'stroke-width': '7',
			'stroke-dasharray': '.'
		});

		this.trackerArray[6].node.setAttribute('stroke-dasharray','7,1.95');
		

	},

	setInfoAxis: function(){

		var infoAxis = this.data.infoAxis,
			rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
			dataHeight = rangeData.range;

		this.infoAxis = [];
		this.infoAxisText = [];
		this.infoAxisBkg = [];

		for (i=0;i<infoAxis.length;i++) {

			var tempY = this.bound.br.y - ((infoAxis[i].coord.y - rangeData.min)*(this.bound.size.y/dataHeight));

			this.infoAxis[i] = this.paper.path('M'+this.bound.bl.x+' '+tempY+'L'+this.paperSize.x+' '+tempY).attr({
				'stroke': infoAxis[i].color,
				'stroke-width': 1
			}).toBack();

			this.infoAxisText[i] = this.paper.text(this.bound.bl.x + 20, tempY, infoAxis[i].label).attr({
				'fill': infoAxis[i].color,
				'font-size':'12px',
				'text-anchor': 'start',
				'stroke-width': 0,
				'stroke': infoAxis[i].color,
				'font-family': this.options.dots.text.style['font-family']
			});

			var rectWidth = this.infoAxisText[i].getBBox().width + 4,
				rectHeight = this.infoAxisText[i].getBBox().height + 2,
				rectPointPosX = (this.bound.bl.x + 20) - 2,
				rectPointPosY = tempY-rectHeight/2;

			this.infoAxisBkg[i] = this.paper.rect(rectPointPosX, rectPointPosY, rectWidth, rectHeight).attr({
				'fill': this.options.dots.text.bkg,
				'stroke-width': 0
			});
			
			this.infoAxisBkg[i].toBack();
			this.infoAxis[i].toBack();

		}

		this.grid.toBack();

	},

	updateData: function(json){

		/* this is just a test update method, needs refactoring */

		if(this.options.trackerOnly){

			this.updateDataTracker(json,pointPosY,pointPosX);

		} else {

			var items = json.items,
				data = chartphael.helper.getDataRange.call(this,json,'y'),
				dataHeight = data.range,
				linePath = '';

			for(i=0;i<items.length;i++){

				var currInc = this.options.yAxis.step*i,
					pointPosX = this.bound.br.x-currInc,
					pointPosY = this.bound.br.y - ((items[i].y - data.min)*(this.bound.size.y/dataHeight));
					
				//animate dots
				this.dotsArray[i].animate({cy:pointPosY}, 500, "easysin");

				//animate dots text
				this.dotsTextArray[i].animate({y:pointPosY+this.options.dots.radius*3}, 500, "easysin");
				this.dotsTextArray[i].attr({text:items[i].y})

				//animate dots text background
				var rectWidth = this.dotsTextArray[i].getBBox().width,
					rectHeight = this.dotsTextArray[i].getBBox().height,
					rectPointPosX = pointPosX-rectWidth/2,
					rectPointPosY = (pointPosY+this.options.dots.radius*3)-rectHeight/2+2;

				this.dotTextBkg[i].animate({x:rectPointPosX,y:rectPointPosY,width:rectWidth,height:rectHeight}, 500, "easysin");

				//animate custom circle
				if(i==0){

					this.updateDataTracker(json,pointPosY,pointPosX);

				}

				//calculate path
				if (i==0) {

					linePath += 'M'+ pointPosX +' '+ pointPosY;

				} else {

					linePath += 'L'+ pointPosX +' '+ pointPosY;

				}

			}

			//animate path
			this.pathEl.animate({path: linePath}, 500, "easysin");

			//animate info Axis
			var infoAxis = json.infoAxis;

			for (i=0;i<infoAxis.length;i++) {

				var tempY = this.bound.br.y - ((infoAxis[i].coord.y - data.min)*(this.bound.size.y/dataHeight))

				this.infoAxis[i].animate({path: 'M'+this.bound.bl.x+' '+tempY+'L'+this.paperSize.x+' '+tempY}, 500, "easysin");
				this.infoAxisText[i].animate({y:tempY}, 500, "easysin");
				this.infoAxisText[i].attr({text:infoAxis[i].coord.y})

				var infoRectWidth = this.infoAxisText[i].getBBox().width + 4,
					infoRectHeight = this.infoAxisText[i].getBBox().height + 2,
					infoRectPointPosX = (this.bound.bl.x + 20) - 2,
					infoRectPointPosY = tempY-rectHeight/2;

				this.infoAxisBkg[i].animate({x:infoRectPointPosX,y:infoRectPointPosY,width:infoRectWidth,height:infoRectHeight}, 500, "easysin");

			}

		}

		return this;

	},

	updateDataTracker: function(json,pointPosY,pointPosX){

		var items = json.items,
			currInc = this.options.yAxis.step*0;

		if(this.options.trackerOnly){
			
			var pointPosY = this.paperSize.y/2;
				pointPosX = this.paperSize.x/2;

		}

		//background
		this.trackerArray[0].animate({cy:pointPosY}, 500, "easysin");

		//central status
		var values = json.tracker.progress.outerStep,
			newValues = [],
			total = 100;

		for (var m = 0; m < values.length; m++) {
			if(m==0){
				newValues[m] = values[m].percent;
			} else {
				newValues[m] = values[m].percent + newValues[m-1];
				if(newValues[m]>total) newValues[m] = total;
			}
		}

		newValues.reverse();

		this.trackerArray[1].animate({cy:pointPosY}, 500, "easysin");

		for(n=0;n<this.trackerArray[2].length;n++){

			this.trackerArray[2][n].animate({
				arc: [pointPosX, pointPosY, newValues[n], total, 50, true]
			}, 500, "easysin");

		}

		this.trackerArray[3].animate({cy:pointPosY}, 500, "easysin");

		//text
		this.trackerArray[4].animate({y:pointPosY}, 500, "easysin");
		this.trackerArray[4].attr({text:items[0].y})

		//inner status
		this.trackerArray[5].animate({
			arc: [pointPosX, pointPosY, json.tracker.progress.innerStep, 100, 28, false]
		}, 500, "easysin");

		//outer status
		this.trackerArray[6].animate({cy:pointPosY, stroke: json.tracker.statusColor}, 500, "easysin");

	}

});

//default values
chartphael.bmf.defaults = {

	trackerOnly: false,

	xAxis: {
		show: false,
		text: false,
		step: 160,
		outerLines: true,
		direction: 'bottom'
	},	

	yAxis: {
		show: true,
		text: false,
		step: 160,
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
			show: false
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

	padding: {
		'top': 125,
        'right': 90,
        'bottom': 100,
        'left': 0
	}

};