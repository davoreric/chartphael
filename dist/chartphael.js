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
                p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, "stroke-width": 0}),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({fill: '#000', stroke: "none", opacity: 0, "font-size": 20});
            p.mouseover(function () {
                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
                txt.stop().animate({opacity: 1}, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({transform: ""}, ms, "elastic");
                txt.stop().animate({opacity: 0}, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};



var app = app || {};
app.chart = app.chart || {};

app.chart.profile = {

	init: function(id){

		this.el = document.getElementById(id)
		this.width = this.el.offsetWidth;
		this.stroke = 6;
		this.radius = (this.width - 2*this.stroke)/2;
		this.center = this.radius + this.stroke;

		this.colorBkg = '#ccc';
		this.colorChart = '#8fbb48';

		this.paper = Raphael(id,this.width,this.width);

		this.setArcAttr();
		this.setBkg();
		this.setChart(this.el.getAttribute('data-value'));

	},

	setBkg: function(){

		var bkg = this.paper.circle(this.center, this.center, this.radius)
							.attr({stroke: this.colorBkg, 'stroke-width': this.stroke});

	},

	setChart: function(end){

		var chart = this.paper.path().attr({
		    'stroke': this.colorChart,
		    'stroke-width': this.stroke,
		    arc: [this.center, this.center, 0, 100, this.radius]
		});

		chart.animate({
		    arc: [this.center, this.center, end, 100, this.radius]
		}, 1500, "bounce");

	},

	setArcAttr: function(){

		this.paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
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
		        path = [
		            ["M", xloc, yloc - R],
		            ["A", R, R, 0, +(alpha > 180), 1, x, y]
		        ];
		    }
		    return {
		        path: path
		    };
		};

	}

};

app.chart.pie = {

	init: function(id,data){

		this.el = document.getElementById(id);
		this.data = data.items;
		this.width = this.el.offsetWidth;
		this.height = this.el.offsetHeight;

		this.centerX = this.height/2;
		this.centerY = this.width/2;
		this.radius = this.centerX-40;

		this.paper = Raphael(id,this.width,this.height);

		this.setBkg();
		this.setPie();

	},

	setBkg: function(){

		var bkg = this.paper.circle(this.centerY, this.centerX, this.radius)
							.attr({fill: this.colorBkg, 'stroke-width': 0});

	},

	setPie: function(){

		var values = [],
			labels = [],
			colors = [];

		for(i=0;i<this.data.length;i++){
			values.push(parseInt(this.data[i].percent));
        	labels.push(this.data[i].label);
        	colors.push(this.data[i].color);
		}
		
		this.paper.pieChart(this.centerY, this.centerX, this.radius, values, labels, colors);
			
	}

};