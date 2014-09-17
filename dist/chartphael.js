/************************************************
*********** Chartphael graph plugin *************
*************************************************
based on Raphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

(function(){

	function chartphael(options) {

	    if ( !(options.node == null || chartphael[options.type] == null) ) {

			return new chartphael[options.type](options);

	    }

	};

	chartphael.draw = {

		'grid': function(){

			var path;

			//setup x increment needed for grid and chart
			if( this.options.xAxis.step ) {
				
				this.xAxisAmount = Math.ceil(this.bound.size.y/this.options.xAxis.step);
				this.xIncrement = this.options.xAxis.step;

			} else {

				this.xAxisAmount = Math.ceil((this.data.grid.y.max - this.data.grid.y.min) / this.data.grid.y.interval) +1;
				this.xIncrement = this.bound.size.y/(this.xAxisAmount-1);
				this.gridIncrementX = this.xIncrement / this.data.grid.y.interval;
				
			}

			//setup y increment needed for grid and chart
			if( this.options.yAxis.step ) {
				
				this.yAxisAmount = Math.ceil(this.bound.size.x/this.options.yAxis.step);
				this.yIncrement = this.options.yAxis.step;

			} else {

				this.yAxisAmount = Math.ceil((this.data.grid.x.max - this.data.grid.x.min) / this.data.grid.x.interval) + 1;
				this.yIncrement = this.bound.size.x/(this.yAxisAmount-1);
				this.gridIncrementY = this.yIncrement / this.data.grid.x.interval;
				
			}

			//checking if grid has X axis
			path += chartphael.draw.gridX.call(this);

			//checking if grid has Y axis
			path += chartphael.draw.gridY.call(this);

			return path;

		},

		'gridY': function(){

			//var definition
			var	yPos,
				yAxisPath = '',
				yAxisLabel;

			//if axis has text, set first numeric value
			if (this.options.xAxis.text) {

				yAxisLabel = this.data.grid.x.min;
					
			}

			//setting direction (left is default)
			if ( this.options.yAxis.direction === 'right' ) {

				yPos = {
					inc: -1,
					bottomX: this.bound.br.x,
					bottomY: this.bound.br.y,
					topX: this.bound.tr.x,
					topY: this.bound.tr.y
				}

			} else {
				
				yPos = {
					inc: 1,
					bottomX: this.bound.bl.x,
					bottomY: this.bound.bl.y,
					topX: this.bound.tl.x,
					topY: this.bound.tl.y
				}

			}
		
			//setting path for Y axis

			for ( i=0; i<this.yAxisAmount; i++ ) {
				
				var currInc = this.yIncrement*i*yPos.inc;

				//this checks if Y grid has outer lines set to false and then does not draws first and last axis
				if ( !((i==0 || i==this.yAxisAmount-1) && !this.options.yAxis.outerLines) && this.options.yAxis.show ) {

					yAxisPath += 'M'+ (yPos.bottomX+currInc) +' '+ yPos.bottomY +'L'+ (yPos.topX+currInc) +' '+ yPos.topY;

				}

				if (this.options.xAxis.text) {

					if( !((i==0 || i==this.yAxisAmount-1) && this.options.type == 'bar') ){

						if(typeof this.data.grid.x.labels != 'undefined'){
							n = i;
							if(this.options.type == 'bar') n--;
							yAxisLabel = this.data.grid.x.labels[n];
						}

						this.paper.text(yPos.bottomX+currInc, yPos.bottomY+15, yAxisLabel).attr(this.options.grid.text.style);

					}

					yAxisLabel += this.data.grid.x.interval;
					
				}

			}

			return yAxisPath;

		},

		'gridX': function(){

			//var definition
			var xPos,
				xAxisPath = '',
				xAxisLabel;	

			//if axis has text, set first value
			if (this.options.yAxis.text) {
				xAxisLabel = this.data.grid.y.min;
			}

			//setting direction (bottom is default)
			if ( this.options.xAxis.direction === 'top' ) {

				xPos = {
					inc: 1,
					leftX: this.bound.tl.x,
					leftY: this.bound.tl.y,
					rightX: this.bound.tr.x,
					rightY: this.bound.tr.y
				}

			} else {
				
				xPos = {
					inc: -1,
					leftX: this.bound.bl.x,
					leftY: this.bound.bl.y,
					rightX: this.bound.br.x,
					rightY: this.bound.br.y
				}

			}
		
			//setting path for X axis
			for ( i=0; i<this.xAxisAmount; i++ ) {

				var currInc = this.xIncrement*i*xPos.inc;

				//this checks if X grid has outer lines set to false and then does not draws first and last axis
				if ( !((i==0 || i==this.xAxisAmount-1) && !this.options.xAxis.outerLines) && this.options.xAxis.show ) {

					xAxisPath += 'M'+ xPos.leftX +' '+ (xPos.leftY+currInc) +'L'+ xPos.rightX +' '+ (xPos.rightY+currInc);

				}

				if (this.options.yAxis.text) {

					this.paper.text(xPos.leftX-15, xPos.leftY+currInc, xAxisLabel).attr(this.options.grid.text.style);
					xAxisLabel += this.data.grid.y.interval;
					
				}

			}

			return xAxisPath;

		},

		'line': function(){

			var items = this.data.items,
				linePath = '',
				pathEl,
				dotsArray = [],
				dotsTextArray = [],
				dotTextBkg = [];

			if(this.dotsArray){
				dotsArray = this.dotsArray;
			}

			if(this.dotsTextArray){
				dotsTextArray = this.dotsTextArray;
			}

			if(this.dotTextBkg){
				dotTextBkg = this.dotTextBkg;
			}

			if(this.pathEl){
				pathEl = this.pathEl;
			}

			if (this.options.yAxis.step) {
				var dataRangeY = chartphael.helper.getDataRange.call(this,this.data,'y');
				var dataHeight = dataRangeY.range;
			}

			for(i=0;i<items.length;i++){

				if (this.options.yAxis.step) {

					var currInc = this.options.yAxis.step*i,
						pointPosX = this.bound.br.x-currInc,
						pointPosY = this.bound.br.y - ((items[i].y - dataRangeY.min)*(this.bound.size.y/dataHeight));

				} else {

					var pointPosX = this.bound.bl.x + items[i].x * this.gridIncrementY;

					if(this.data.grid.y.min < 0){

						var	pointPosY = this.bound.bl.y + this.data.grid.y.min * this.gridIncrementX - items[i].y * this.gridIncrementX;

					} else {

						var	pointPosY = this.bound.bl.y - items[i].y * this.gridIncrementX;

					}

				}

				if (i==0) {

					linePath += 'M'+ pointPosX +' '+ pointPosY;

				} else {

					linePath += 'L'+ pointPosX +' '+ pointPosY;

				}


				if (this.options.dots.show) {

					//this checks if X grid has outer lines set to false and then does not draws first and last dots
					if ( !((i==0 || i==items.length-1) && !this.options.xAxis.outerLines) ) {

						dotsArray.push(this.paper.circle(pointPosX, pointPosY, this.options.dots.radius).attr(this.options.dots.style));

						if (this.options.dots.text.show) {
							
							dotsTextArray[i] = this.paper.text(pointPosX, pointPosY+this.options.dots.radius*3, items[i].y).attr(this.options.dots.text.style);

							var rectWidth = dotsTextArray[i].getBBox().width,
								rectHeight = dotsTextArray[i].getBBox().height,
								rectPointPosX = pointPosX-rectWidth/2,
								rectPointPosY = (pointPosY+this.options.dots.radius*3)-rectHeight/2+2;

							dotTextBkg[i] = this.paper.rect(rectPointPosX, rectPointPosY, rectWidth, rectHeight).attr({
								'fill': this.options.dots.text.bkg,
								'stroke-width': 0
							}).toBack();

						}

					}

				}
				
			}

			if( this.options.line.shadow.show ){

				var pointPosXmin = this.bound.bl.x + items[0].x * this.gridIncrementY,
					pointPosXmax = this.bound.bl.x + items[items.length-1].x * this.gridIncrementY;

				this.paper.path(linePath+'L'+ pointPosXmax +' '+ this.bound.br.y +'L'+ pointPosXmin +' '+ this.bound.br.y).attr({
					fill: this.options.line.shadow.fill,
					'stroke-width': 0
				});

			}

			this.pathEl = this.paper.path(linePath).attr(this.options.line.style);

			//reorder elements
			
			this.pathEl.toFront();

			for(var n=0;n<dotTextBkg.length;n++){
				dotTextBkg[n].toFront();	
			}

			for(var n=0;n<dotsTextArray.length;n++){
				dotsTextArray[n].toFront();	
			}

			for(var n=0;n<dotsArray.length;n++){
				dotsArray[n].toFront();	
			}

		},

		'bar': function(){

			var items = this.data.items,
				barPath = [];

			for(i=0;i<items.length;i++){

				var pointPosX = this.bound.bl.x + items[i].x * this.gridIncrementY,
					pointPosY = this.bound.bl.y - items[i].y * this.gridIncrementX,
					currStyle = chartphael.helper.extend({}, this.options.bar.style);
				
				barPath[i] = 'M'+ pointPosX +' '+ pointPosY + 'L'+ pointPosX +' '+ this.bound.bl.y;

				if(items[i].color != undefined) {

					currStyle.fill = items[i].color;
					currStyle.stroke = items[i].color;

				}

				this.paper.path(barPath[i]).attr(currStyle).toBack();
				
			}
			
			return barPath;

		}

	};

	window.chartphael = chartphael;

})();

//helper methods for chartphael
chartphael.helper = {
		
	'getBound': function(paperSize,padding){

		var bound = {
			'tl': {
				'x': padding.left,
				'y': padding.top
			},
			'tr': {
				'x': paperSize.x-padding.right,
				'y': padding.top
			},
			'br': {
				'x': paperSize.x-padding.right,
				'y': paperSize.y-padding.bottom
			},
			'bl': {
				'x': padding.left,
				'y': paperSize.y-padding.bottom
			},
			'size': {
				'x': paperSize.x - (padding.left + padding.right),
				'y': paperSize.y - (padding.top + padding.bottom)
			}
		}

		return bound;

	},

	'setResponsive': function(data){

		data.node.setViewBox(0, 0, data.width, data.height );
		data.node.setSize('100%', '100%');

	},

	'getDataRange': function(data){

		var dataRange = new Array(),
			range = data.items;

		for (i=0;i<range.length;i++) {
			
			dataRange.push(range[i].y);

		}

		if(data.infoAxis) {

			for (i=0;i<data.infoAxis.length;i++) {
				
				dataRange.push(data.infoAxis[i].coord.y);

			}

		}

		var min = Math.min.apply(Math, dataRange),
			max = Math.max.apply(Math, dataRange);

		if ( this.options.boundRange ) {
			min = min - this.options.boundRange.y;
			max = max + this.options.boundRange.y;
		}

		return {
			"min": min,
			"max": max,
			"range": max - min
		};

	},

	'extend': function(obj) {

		var tempArray = Array.prototype.slice.call(arguments, 1);

		for (var i=0;i<tempArray.length;i++){
			var source = tempArray[i];
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		}

		return obj;

	},

	'fauxDeepExtend': function(obj, source) {

		for (var prop in source){

			if(typeof obj != 'object') break;

			if (prop in obj){
	        	chartphael.helper.fauxDeepExtend(obj[prop], source[prop]);
	        } else {
	        	obj[prop] = source[prop];
	        }

	    }
            
		return obj;

	}

};

/* Raphael extend for custom arc attribute */
Raphael.fn.customArc = function () {

	this.customAttributes.arc = function (xloc, yloc, value, total, R, fill) {

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

	    	if (fill) {

	    		path = [
		        	["M", xloc, yloc],
		        	["L", xloc, yloc - R],
		        	["A", R, R, 0, +(alpha > 180), 1, x, y],
		        	["L", xloc, yloc]
		        ];

	    	} else {

	    		path = [
		            ["M", xloc, yloc - R],
		            ["A", R, R, 0, +(alpha > 180), 1, x, y]
		        ];

	    	}
	        
	    }

	    return {
	        path: path
	    };

	};

};

/* Raphael extend for Pie graph */
Raphael.fn.pieChart = function (cx, cy, r, values, colors) {
    
    var paper = this,
    	chart = [],
    	newValues = [],
    	total = 100,
    	attrValue = {};

    for (var i = 0; i < values.length; i++) {
        if(i==0){
        	newValues[i] = values[i];
        } else {
        	newValues[i] = values[i] + newValues[i-1];
        	if(newValues[i]>total) newValues[i] = total;
        }
    }    

    newValues.reverse();
    colors.reverse();

    for (var i = 0; i < newValues.length; i++) {

    	chart[i] = paper.path().attr({
    		"fill": colors[i],
			"stroke": "#fefefe",
			"stroke-width": .75,
			arc: [cx, cy, 0, total, r, true]
    	});

    	chart[i].data({
    		total: total,
    		radius: r
    	});

        chart[i].animate({
			arc: [cx, cy, newValues[i], total, r, true]
		}, 500, "easysin");

    }

    return chart;

};