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

			//checking if grid has Y axis
			if (this.options.yAxis) {

				path = chartphael.draw.gridY.call(this);

			}

			//checking if grid has X axis
			if (this.options.xAxis) {

				path = path + chartphael.draw.gridX.call(this);

			}

			return path;

		},

		'gridY': function(){

			//var definition
			var yAxisAmount,
				yIncrement,
				yPos,
				yAxisPath,
				yAxisLabel;

			//test for fixed or dynamic steps, and setting steps amount
			if( this.options.fixedStepY ) {
				
				yAxisAmount = Math.ceil(this.bound.size.x/this.options.fixedStepY);
				yIncrement = this.options.fixedStepY;

			} else {

				yAxisLabel = this.data.grid.x.min;
				yAxisAmount = Math.ceil((this.data.grid.x.max - this.data.grid.x.min) / this.data.grid.x.interval) + 1;
				yIncrement = this.bound.size.x/(yAxisAmount-1);

				this.gridIncrementY = yIncrement / this.data.grid.x.interval;
				
			}

			//setting direction (left is default)
			if ( this.options.directionY === 'right' ) {

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
			for ( i=0; i<yAxisAmount; i++ ) {
				
				var currInc = yIncrement*i*yPos.inc;
				yAxisPath += 'M'+ (yPos.bottomX+currInc) +' '+ yPos.bottomY +'L'+ (yPos.topX+currInc) +' '+ yPos.topY;

				if (this.options.yAxisText) {

					this.paper.text(yPos.bottomX+currInc, yPos.bottomY+15, yAxisLabel).attr(this.options.gridTextStyle);
					yAxisLabel += this.data.grid.x.min + this.data.grid.x.interval;
					
				}

			}

			return yAxisPath;

		},

		'gridX': function(){

			//var definition
			var xAxisAmount,
				xIncrement,
				xPos,
				xAxisPath,
				xAxisLabel;

			//test for fixed or dynamic steps, and setting steps amount
			if( this.options.fixedStepX ) {
				
				xAxisAmount = Math.ceil(this.bound.size.y/this.options.fixedStepX);
				xIncrement = this.options.fixedStepX;

			} else {

				xAxisLabel = this.data.grid.y.min;
				xAxisAmount = Math.ceil((this.data.grid.y.max - this.data.grid.y.min) / this.data.grid.y.interval) +1;
				xIncrement = this.bound.size.y/(xAxisAmount-1);

				this.gridIncrementX = xIncrement / this.data.grid.y.interval;
				
			}

			//setting direction (bottom is default)
			if ( this.options.directionX === 'top' ) {

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
			for ( i=0; i<xAxisAmount; i++ ) {
				
				var currInc = xIncrement*i*xPos.inc;
				xAxisPath += 'M'+ xPos.leftX +' '+ (xPos.leftY+currInc) +'L'+ xPos.rightX +' '+ (xPos.rightY+currInc);

				if (this.options.xAxisText) {

					this.paper.text(xPos.leftX-15, xPos.leftY+currInc, xAxisLabel).attr(this.options.gridTextStyle);
					xAxisLabel += this.data.grid.y.min + this.data.grid.y.interval;
					
				}

			}

			return xAxisPath;

		},

		'line': function(){

			var items = this.data.items,
				dotTextBkg = [],
				linePath = '';

			if (this.options.fixedStepY) {

				var data = chartphael.helper.getDataRange.call(this,this.data,'y'),
					dataHeight = data.range;

			}

			for(i=0;i<items.length;i++){

				if (this.options.fixedStepY) {

					var currInc = this.options.fixedStepY*i,
						pointPosX = this.bound.br.x-currInc,
						pointPosY = this.bound.br.y - ((items[i].y - data.min)*(this.bound.size.y/dataHeight));

				} else {

					var pointPosX = this.bound.bl.x + items[i].x * this.gridIncrementY,
						pointPosY = this.bound.bl.y - items[i].y * this.gridIncrementX;

				}


				if (this.options.dots) {

					this.paper.circle(pointPosX, pointPosY, this.options.circleRadius).attr(this.options.circleStyle);	

					if (this.options.dotsText) {
						
						var dotText = this.paper.text(pointPosX, pointPosY+this.options.circleRadius*3, items[i].y).attr(this.options.circleTextStyle);

						if(this.options.circleTextBkg) {

							var rectWidth = dotText.getBBox().width + 2,
								rectHeight = dotText.getBBox().height + 2,
								rectPointPosX = pointPosX-rectWidth/2,
								rectPointPosY = (pointPosY+this.options.circleRadius*3)-rectHeight/2;

							dotTextBkg[i] = this.paper.rect(rectPointPosX, rectPointPosY, rectWidth, rectHeight).attr({
								'fill': this.options.circleTextBkg.fill,
								'stroke-width': 0
							}).toBack();

						}

					}

				}				
				
				if (i==0) {

					linePath += 'M'+ pointPosX +' '+ pointPosY;

				} else {

					linePath += 'L'+ pointPosX +' '+ pointPosY;

				}
				
			}

			if( this.options.dropLineShadow	){

				var pointPosXmin = this.bound.bl.x + items[0].x * this.gridIncrementY,
					pointPosXmax = this.bound.bl.x + items[items.length-1].x * this.gridIncrementY;

				this.paper.path(linePath+'L'+ pointPosXmax +' '+ this.bound.br.y +'L'+ pointPosXmin +' '+ this.bound.br.y).attr({
					fill: 'rgba(130,156,39,20)', 'stroke-width': 0
				}).toBack();

			}

			this.paper.path(linePath).attr(this.options.lineStyle).toBack();

			for(n=0;n<dotTextBkg.length;n++){
				dotTextBkg[n].toBack();	
			}
			
			return linePath;

		}

	};

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

			if ( this.options.bound ) {
				min = min - this.options.bound.y;
				max = max + this.options.bound.y;
			}

			return {
				"min": min,
				"max": max,
				"range": max - min
			};

		},

		'extend': function(obj) {

			var tempArray = Array.prototype.slice.call(arguments, 1);

			for (i=0;i<tempArray.length;i++){
				var source = tempArray[i];
				if (source) {
					for (var prop in source) {
						obj[prop] = source[prop];
					}
				}
			}

			return obj;

		}

	};

	window.chartphael = chartphael;

})();

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
    	total = 0,
    	attrValue = {};

    for (var i = 0; i < values.length; i++) {
        if(i==0){
        	newValues[i] = values[i];
        } else {
        	newValues[i] = values[i] + newValues[i-1];
        }
        total += values[i];
    }    

    newValues.reverse();
    colors.reverse();

    for (var i = 0; i < newValues.length; i++) {

    	chart[i] = paper.path().attr({
    		"fill": colors[i],
			"stroke": "#fefefe",
			"stroke-width": .3,
			arc: [cx, cy, 0, total, r, true]
    	});

        chart[i].animate({
			arc: [cx, cy, newValues[i], total, r, true]
		}, 500, "easysin");

    }

    return chart;

};