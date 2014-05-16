var app = app || {};
app.chart = app.chart || {};



app.chart.arc = {

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

app.chart.line = {

	init: function(id,data){

		this.el = document.getElementById(id);
		this.data = data;
		this.width = this.el.offsetWidth;
		this.height = this.el.offsetHeight;

		this.padding = 40;

		this.bottom_left = [this.padding,this.height-this.padding];
		this.bottom_right = [this.width-this.padding,this.height-this.padding];
		this.top_left = [this.padding,this.padding];
		this.top_right = [this.width-this.padding,this.padding];

		this.paper = Raphael(id,this.width,this.height);

		this.x_axis_value = this.data.axis.x;
		this.y_axis_value = this.data.axis.y;

		this.setGrid();
		this.setPoints();

	},

	setGrid: function(){

		var path = null;
		var incrementX = (this.bottom_right[0] - this.bottom_left[0])/(this.x_axis_value.length-1);
		var incrementY = (this.bottom_left[1] - this.top_left[1])/(this.y_axis_value.length-1);
		var textAttr = {fill: '#666','font-size':'10px'};

		for (i=0;i<this.y_axis_value.length;i++){
			var currInc = incrementY*i;
			if(i!=0&&i!=this.y_axis_value.length-1){
				path += 'M'+ this.bottom_left[0] +' '+ (this.bottom_left[1]-currInc) +'L'+ this.bottom_right[0] +' '+ (this.bottom_right[1]-currInc);
			}
			this.paper.text(this.bottom_left[0]-this.padding/2, this.bottom_left[1]-currInc, this.y_axis_value[i]).attr(textAttr);
		}

		for (i=0;i<this.x_axis_value.length;i++){
			var currInc = incrementX*i;
			if(i!=0&&i!=this.x_axis_value.length-1){
				path += 'M'+ (this.bottom_left[0]+currInc) +' '+ this.bottom_left[1] +'L'+ (this.top_left[0]+currInc) +' '+ this.top_left[1];	
			}
			this.paper.text(this.bottom_left[0]+currInc, this.bottom_left[1]+this.padding/2, this.x_axis_value[i]).attr(textAttr);
		}

		this.paper.path(path).attr({stroke: '#d8decf', 'stroke-width': 1});

	},

	setPoints: function(){

	}

};