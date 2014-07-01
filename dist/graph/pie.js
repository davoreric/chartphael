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

	this.node = options.node;
	this.data = options.data.items;
	this.width = this.node.offsetWidth;
	this.height = this.node.offsetHeight;

	this.centerX = this.height/2;
	this.centerY = this.width/2;
	this.radius = this.centerX-40;

	this.paper = Raphael(this.node,this.width,this.height);

	this.setPie();

}

chartphael.pie.prototype.setPie = function(){

	var values = [],
		colors = [];

	for(i=0;i<this.data.length;i++){
		values.push(parseInt(this.data[i].percent));
    	colors.push(this.data[i].color);
	}
	
	//this.paper.pieChart(this.centerX, this.centerY, this.radius, values, colors, true);
		
};