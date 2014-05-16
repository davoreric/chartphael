chartphael
==========

chart library for raphael.js, still in heavy ALPHA  



Init procedure:  

app.chart.arc.init('profile_bar');  

app.chart.pie.init('pie_chart', pieChartJSON);  

app.chart.line.init('line_chart', lineChartJSON);  


JSON formats:  

		var pieChartJSON = {
            "items": [
                { "label": "Europe", "percent": "20", "color": "#717917" },
                { "label": "America", "percent": "20", "color": "#a6beaa" },
                { "label": "Africa", "percent": "30", "color": "#bf8c53" },
                { "label": "Asia", "percent": "10", "color": "#e4c95e" },
                { "label": "Australia", "percent": "20", "color": "#f1eb66" },
            ]
        };

        var lineChartJSON = {
            "axis": {
                "x": [0,2,4,6,8,10,12,14,16,18,20,22,24],
                "y": [0,25,50,75,100,125,150,175]
            },
            "items": [
                { "x": 10, "y": 10 },
                { "x": 20, "y": 30 },
                { "x": 30, "y": 40 },
                { "x": 40, "y": 20 },
                { "x": 50, "y": 50 },
                { "x": 60, "y": 40 },
                { "x": 70, "y": 20 },
                { "x": 80, "y": 25 }
            ]
        };
