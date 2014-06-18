/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** Line graph **************************
************************************************/

chartphael.line = function(options) {

	this.node = options.node;
	this.data = options.data;
	this.width = this.node.offsetWidth;
	this.height = this.node.offsetHeight;

	this.dataWidthMax = options.dataXMax,
	this.dataHeightMax = options.dataYMax,

	this.padding = 40;

	this.bottom_left = [this.padding,this.height-this.padding];
	this.bottom_right = [this.width-this.padding,this.height-this.padding];
	this.top_left = [this.padding,this.padding];
	this.top_right = [this.width-this.padding,this.padding];
	
	this.gridWidth = this.width - (this.padding*2);
	this.gridHeight = this.height - (this.padding*2);

	this.x_axis_value = this.data.axis.x;
	this.y_axis_value = this.data.axis.y;
	this.incrementX = this.gridWidth/(this.x_axis_value.length-1);
	this.incrementY = this.gridHeight/(this.y_axis_value.length-1);

	this.paper = Raphael(options.id,this.width,this.height);
	this.setGrid();
	this.setGraph();

}

chartphael.line.prototype.setGrid = function(){

	var path = null;
	var textAttr = {fill: '#666','font-size':'10px'};

	for (i=0;i<this.y_axis_value.length;i++){
		var currInc = this.incrementY*i;
		if(i!=0&&i!=this.y_axis_value.length-1){
			path += 'M'+ this.bottom_left[0] +' '+ (this.bottom_left[1]-currInc) +'L'+ this.bottom_right[0] +' '+ (this.bottom_right[1]-currInc);
		}
		this.paper.text(this.bottom_left[0]-this.padding/2, this.bottom_left[1]-currInc, this.y_axis_value[i]).attr(textAttr);
	}

	for (i=0;i<this.x_axis_value.length;i++){
		var currInc = this.incrementX*i;
		if(i!=0&&i!=this.x_axis_value.length-1){
			path += 'M'+ (this.bottom_left[0]+currInc) +' '+ this.bottom_left[1] +'L'+ (this.top_left[0]+currInc) +' '+ this.top_left[1];	
		}
		this.paper.text(this.bottom_left[0]+currInc, this.bottom_left[1]+this.padding/2, this.x_axis_value[i]).attr(textAttr);
	}

	this.grid = this.paper.path(path).attr({stroke: '#d8decf', 'stroke-width': 1});

};

chartphael.line.prototype.setGraph = function(){

	var items = this.data.items,
		circleAttr = {fill: '#829c27', 'stroke-width': 2, stroke: '#fff'},
		path = null;

	for(i=0;i<items.length;i++){
		var pointPosX = this.bottom_left[0] + (items[i].x*(this.gridWidth/this.dataWidthMax)),
			pointPosY = this.bottom_left[1] - (items[i].y*(this.gridHeight/this.dataHeightMax));
		this.paper.circle(pointPosX, pointPosY, 6).attr(circleAttr);
		if(i==0){
			path += 'M'+ pointPosX +' '+ pointPosY;
		} else {
			path += 'L'+ pointPosX +' '+ pointPosY;
		}
	}

	this.paper.path(path).attr({stroke: '#829c27', 'stroke-width': 4}).toBack();
	this.paper.path(path+'L'+ this.bottom_right[0] +' '+ this.bottom_right[1] +'L'+ this.bottom_left[0] +' '+ this.bottom_left[1]).attr({fill: 'rgba(130,156,39,20)', 'stroke-width': 0}).toBack();
	this.grid.toBack();

};