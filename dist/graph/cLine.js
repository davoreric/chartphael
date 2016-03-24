/************************************************
****** Chartphael graph plugin component ********
*************************************************
based on Raphael.js
component requieres chartphael.js
developed by Davor Eric
https://github.com/davoreric/chartphael
************************************************/

/************************************************
*********** Custom line graph *******************
************************************************/

chartphael.cLine = function(options) {

    //set public options and merge it with passed option object
    this.options = chartphael.helper.fauxDeepExtend(options, chartphael.cLine.defaults);

    //set internal data
    this.node = this.options.node;
    this.data = this.options.data;
    this.dotsArray = [];
    this.pathEl = true;

    this.paperSize = {
        'x': this.node.offsetWidth,
        'y': this.node.offsetHeight
    };

    //get boundary coordinates for grid and graph
    this.bound = chartphael.helper.getBound.call(this,this.paperSize,this.options.padding);

    //set SVG paper workarea
    this.paper = Raphael(this.node,this.paperSize.x,this.paperSize.y);

    //start
    this.init();

};

chartphael.helper.extend(chartphael.cLine.prototype, {

    init: function(){

        //call method for creating grid
        this.setGrid();

        //call method for creating additional Y axis
        this.setCustomLabels();

        //call method for creating line graph
        this.setGraph();

        //call method for creating additional Y axis
        this.setInfoAxis();

    },

    setGrid: function(){

        //call global grid create function and apply styles
        this.grid = this.paper.path(
            chartphael.draw.grid.call(this)
        ).attr(this.options.grid.style);

    },

    setGraph: function(){

        chartphael.draw.line.call(this);

    },

    setCustomLabels: function() {

        var xLines = this.data.grid.x.labels,
            leftPos = this.bound.tl.x,
            yAxisAmount = Math.ceil((this.data.grid.x.max - this.data.grid.x.min) / this.data.grid.x.interval) + 1,
            yIncrement = this.bound.size.x/(this.yAxisAmount-1),
            interval = this.yIncrement / this.data.grid.x.interval;

        this.xLinesText1 = [];
        this.xLinesText2 = [];

        for (i=0;i<xLines.length;i++) {

            this.xLinesText1[i] = this.paper.text(leftPos, this.bound.bl.y + 15, xLines[i].name).attr({
                'fill': '#fff',
                'font-size':'12px',
                'text-anchor': 'center',
                'stroke-width': 0,
                'stroke': '#fff',
                'font-family': this.options.dots.text.style['font-family']
            });

            this.xLinesText1[i] = this.paper.text(leftPos, this.bound.bl.y + 33, xLines[i].date).attr({
                'fill': '#fff',
                'font-size':'14px',
                'text-anchor': 'center',
                'stroke-width': 0,
                'stroke': '#fff',
                'font-family': this.options.dots.text.style['font-family']
            });

            leftPos = leftPos + interval;

        }

    },

    setInfoAxis: function(){

        var infoAxis = this.data.infoAxis,
            rangeData = chartphael.helper.getDataRange.call(this,this.data,'y'),
            dataHeight = rangeData.range;

        this.infoAxis = [];
        this.infoAxisText = [];
        this.infoAxisBkg = [];

        for (i=0;i<infoAxis.length;i++) {

            var tempY = this.bound.br.y - ((infoAxis[i].coord.y - rangeData.min)*(this.bound.size.y/dataHeight));

            this.infoAxis[i] = this.paper.path('M0 '+tempY+'L'+this.paperSize.x+' '+tempY).attr({
                'stroke': infoAxis[i].color,
                'stroke-width': 1
            }).toBack();

            this.infoAxisText[i] = this.paper.text(20, tempY, infoAxis[i].label).attr({
                'fill': infoAxis[i].color,
                'font-size':'12px',
                'text-anchor': 'start',
                'stroke-width': 0,
                'stroke': infoAxis[i].color,
                'font-family': this.options.dots.text.style['font-family']
            });

            var rectWidth = this.infoAxisText[i].getBBox().width + 4,
                rectHeight = this.infoAxisText[i].getBBox().height + 2,
                rectPointPosX = 18,
                rectPointPosY = tempY-rectHeight/2;

            this.infoAxisBkg[i] = this.paper.rect(rectPointPosX, rectPointPosY, rectWidth, rectHeight).attr({
                'fill': this.options.dots.text.bkg,
                'stroke-width': 0
            });
            
            this.infoAxisBkg[i].toBack();
            this.infoAxis[i].toBack();

        }

        this.grid.toBack();

    },

    updateData: function(json){

        //replace current JSON
        this.data = json;

        //clear paper
        this.paper.clear();

        //draw chart
        this.init();

    }

});

//default values
chartphael.cLine.defaults = {

    xAxis: {
        show: false,
        text: false,
        step: false,
        outerLines: true,
        direction: 'bottom'
    },  

    yAxis: {
        show: true,
        text: false,
        step: false,
        outerLines: true,
        direction: 'left'
    },

    grid: {
        style: {
            stroke: '#84aa20',
            strokeWidth: 1
        }
    },

    line: {
        shadow: {
            show: false
        },
        style: {
            'stroke': '#fff',
            'stroke-width': 4
        }
    },

    dots: {
        show: true,
        radius: 8,
        style: {
            'fill': '#819926',
            'stroke-width': 4,
            'stroke': '#fff'
        },
        text: {
            show: true,
            bkg: '#99c031',
            style: {
                'fill': '#fff',
                'font-size':'16px',
                'stroke-width': 0,
                'stroke': '#fff',
                'font-family': '"Open Sans Condensed",Arial,sans-serif'
            }
        }
    },

    padding: {
        'top': 40,
        'right': 100,
        'bottom': 80,
        'left': 100
    }

};