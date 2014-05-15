var app = app || {};
app.chart = app.chart || {};

app.chart.profile = {

	init: function(id){

		this.width = document.getElementById(id).offsetWidth;
		this.stroke = 6;
		this.radius = (this.width - 2*this.stroke)/2;
		this.center = this.radius + this.stroke;

		this.colorBkg = '#ccc';
		this.colorChart = '#8fbb48';

		this.paper = Raphael(id,this.width,this.width);

		this.setArcAttr();
		this.setBkg();
		this.setChart(document.getElementById(id).getAttribute('data-value'));

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

	init: function(id){

		this.el = document.getElementById(id);
		this.width = this.el.offsetWidth;
		this.height = this.el.offsetHeight;

		this.centerX = this.height/2;
		this.centerY = this.width/2;
		this.radius = this.centerX-40;

		this.colorBkg = '#ccc';
		this.colorChart = '#8fbb48';

		this.paper = Raphael(id,this.width,this.height);

		this.setBkg();

	},

	setBkg: function(){

		var bkg = this.paper.circle(this.centerY, this.centerX, this.radius)
							.attr({fill: this.colorBkg, 'stroke-width': 0});

	}

};


app.chart.profile.init('profile_bar');
app.chart.pie.init('pie_chart');