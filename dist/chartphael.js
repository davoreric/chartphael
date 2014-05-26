/************************************************
*********** Chartphael graph plugin *************
*************************************************
based on Raphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

(function(){

	function chartphael(options) {

	    if ( !(document.getElementById(options.id) == null || chartphael[options.type] == null) ) {

			return new chartphael[options.type](options);

	    }

	};

	chartphael.draw = {

		'grid': function(bound){

			var x_custom_length = Math.ceil((this.size.x - (this.options.padding.left + this.options.padding.right))/this.options.fixedStepX);
			var path;

			for (i=0;i<x_custom_length;i++){
				var currInc = this.options.fixedStepX*i;
				path += 'M'+ (bound.br.x-currInc) +' '+ bound.br.y +'L'+ (bound.tr.x-currInc) +' '+ bound.tr.y;
			}

			return path;

		},

		'line': function(){

			

		}

	};

	chartphael.helper = {
		
		'getBound': function(size,padding){

			var bound = {
				'tl': {
					'x': padding.left,
					'y': padding.top
				},
				'tr': {
					'x': size.x-padding.right,
					'y': padding.top
				},
				'br': {
					'x': size.x-padding.right,
					'y': size.y-padding.bottom
				},
				'bl': {
					'x': padding.left,
					'y': size.y-padding.bottom
				}
			}

			return bound;

		},

		'getDataRange': function(range,type){

			var dataRange = new Array();
			for(i=0;i<range.length;i++){
				dataRange.push(range[i].y)
			}

			var min = Math.min.apply(Math, dataRange);
			var max = Math.max.apply(Math, dataRange);

			var newRange = max - min;

			return newRange;

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