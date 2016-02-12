/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** Clock graph *************************
************************************************/

chartphael.clock = function(options) {

    //set public options and merge it with passed option object
    this.options = chartphael.helper.fauxDeepExtend(options, chartphael.clock.defaults);

    //set internal data
    this.node = this.options.node;
    this.data = this.options.data;
    this.trackerArray = [];

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

chartphael.helper.extend(chartphael.clock.prototype, {

    init: function(){


        this.setTracker();      

    },

    setTracker: function(){

        var pointPosX = this.paperSize.x/2,
            pointPosY = this.paperSize.y/2;

        //background
        this.trackerArray[0] = this.paper.circle(pointPosX, pointPosY, 65).attr({
            'fill': '#fff',
            'stroke-width': 0
        });

        //central status circle
        var centralData = this.data.progress.outerStep,
            values = [],
            colors = [];

        this.trackerArray[1] = this.paper.circle(pointPosX, pointPosY, 65).attr({
            'fill': '#f3f3f0',
            'stroke-width': 0
        });

        if(centralData){

            for(i=0;i<centralData.length;i++){
                values.push(parseInt(centralData[i].percent));
                colors.push(centralData[i].color);
            }

            this.trackerArray[2] = this.paper.pieChart(pointPosX, pointPosY, 65, values, colors);

            this.trackerArray[3] = this.paper.circle(pointPosX, pointPosY, 55).attr({
                'fill': '#fff',
                'stroke-width': 0
            });

        }

        //text
        this.trackerArray[4] = this.paper.text(pointPosX, pointPosY - 10, this.data.content.value).attr({
            'fill': this.data.progress.innerStep.color,
            'font-size':'24px',
            'stroke': this.data.progress.innerStep.color,
            'stroke-width': 0,
            'font-family': this.options.style['font-family']
        });

        this.trackerArray[5] = this.paper.text(pointPosX, pointPosY + 10, this.data.content.unit).attr({
            'fill': this.data.progress.innerStep.color,
            'font-size':'15px',
            'stroke': this.data.progress.innerStep.color,
            'stroke-width': 0,
            'font-family': this.options.style['font-family']
        });

        //inner status circle
        this.trackerArray[6] = this.paper.path().attr({
            'stroke': this.data.progress.innerStep.color,
            'stroke-width': 10,
            arc: [pointPosX, pointPosY, 0, 100, 45, false]
        });

        this.trackerArray[6].animate({
            arc: [pointPosX, pointPosY, this.data.progress.innerStep.percent, 100, 45, false]
        }, 500, "easysin");

    },

    updateData: function(json){

        var items = json.items,
            pointPosY = this.paperSize.y/2,
            pointPosX = this.paperSize.x/2;

        //central status
        var values = json.progress.outerStep,
            newValues = [],
            newColors = [],
            total = 100;

        for (var m = 0; m < values.length; m++) {
            if(m==0){
                newValues[m] = values[m].percent;
            } else {
                newValues[m] = values[m].percent + newValues[m-1];
                if(newValues[m]>total) newValues[m] = total;
            }
            newColors[m] = values[m].color;
        }

        newColors.reverse();
        newValues.reverse();

        for(n=0;n<this.trackerArray[2].length;n++){

            this.trackerArray[2][n].animate({
                arc: [pointPosX, pointPosY, newValues[n], total, 65, true],
                fill: newColors[n]
            }, 500, "easysin");

        }

        //text
        this.trackerArray[4].attr({text:json.content.value});
        this.trackerArray[5].attr({text:json.content.unit});

        //inner status
        this.trackerArray[6].animate({
            arc: [pointPosX, pointPosY, json.progress.innerStep.percent, 100, 45, false],
            stroke: json.progress.innerStep.color
        }, 500, "easysin");

        return this;

    },

    updateDataTracker: function(json,pointPosY,pointPosX){

        

    }

});

//default values
chartphael.clock.defaults = {

    style: {
        'font-family': '"Open Sans Condensed",Arial,sans-serif'
    },
    padding: {
        'top': 125,
        'right': 90,
        'bottom': 100,
        'left': 0
    }

};