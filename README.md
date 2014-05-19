chartphael
==========

chart library for raphael.js, still in heavy ALPHA  


Init procedure:  

        var profileArc = new chartphael({
            id: 'profile_bar',
            type: 'arc'
        });

        var pieChart = new chartphael({
            id: 'pie_chart',
            type: 'pie',
            data: pieChartJSON
        });

        var lineGraph = new chartphael({
            id: 'line_chart',
            type: 'line',
            data: lineChartJSON
        });



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
                { "x": 4, "y": 50 },
                { "x": 7, "y": 65 },
                { "x": 12, "y": 80 },
                { "x": 15, "y": 95 },
                { "x": 18, "y": 110 },
                { "x": 20, "y": 85 },
                { "x": 22, "y": 75 },
                { "x": 24, "y": 95 }
            ]
        };
