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
		labels = [],
		colors = [];

	for(i=0;i<this.data.length;i++){
		values.push(parseInt(this.data[i].percent));
    	labels.push(this.data[i].label);
    	colors.push(this.data[i].color);
	}
	
	this.paper.pieChart(this.centerY, this.centerX, this.radius, values, labels, colors);
		
};

/* Raphael extend for Pie graph */
Raphael.fn.pieChart = function (cx, cy, r, values, labels, colors) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();


    function sector(cx, cy, r, startAngle, endAngle, params) {
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }

    var angle = 0,
        total = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = colors[j],
                ms = 500,
                delta = 30,
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, "stroke-width": 0});

            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "bounce");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "bounce");
            });

            p.scale(0, 0, cx, cy);
            p.animate({ transform: 's1 1 ' + cx + ' ' + cy }, ms, "bounce");

            angle += angleplus;
            chart.push(p);

        };

    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }

    for (i = 0; i < ii; i++) {
        process(i);
    }

    return chart;

};