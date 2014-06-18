chartphael
==========

chart library for raphael.js, still in heavy ALPHA  


Init procedure:  

        var profileArc = new chartphael({
            id: 'profile_bar',
            type: 'arc'
        });

        var bmfChart = new chartphael({
            id: 'bmf_chart',
            type: 'bmf',
            data: bmfChartJSON,
            fixedStepY: 150,
            xAxis: false,
            directionY: 'right',
            padding: {
                'top': 125,
                'right': 100,
                'bottom': 100,
                'left': 0
            },
        });

        var pieChart = new chartphael({
            id: 'pie_chart',
            type: 'pie',
            data: pieChartJSON
        });

        var lineGraph = new chartphael({
            id: 'line_chart',
            type: 'line',
            data: lineChartJSON,
            dataXMax: 24,
            dataYMax: 175
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

        var bmfChartJSON = {
            "infoAxis": [
                { 
                    "coord": { "y": 1300 },
                    "color": "#515d34"
                },
                { 
                    "coord": { "y": 1000 },
                    "color": "#bfce3b"
                }
            ],
            "items": [
                { "y": 1700 },
                { "y": 1800 },
                { "y": 1200 },
                { "y": 1600 },
                { "y": 1300 },
                { "y": 1300 },
                { "y": 1600 },
                { "y": 1600 }
            ]
        };

        var lineChartJSON = {
            "grid": {
                "x": {
                    "interval": 2,
                    "min": 0,
                    "max": 31
                },
                "y": {
                    "interval": 25,
                    "min": 0,
                    "max": 175
                }
            },
            "items": [
                { "x": 0, "y": 30 },
                { "x": 4, "y": 50 },
                { "x": 6, "y": 65 },
                { "x": 8, "y": 80 },
                { "x": 10, "y": 95 },
                { "x": 13, "y": 95 },
                { "x": 18, "y": 100 },
                { "x": 20, "y": 85 },
                { "x": 22, "y": 75 },
                { "x": 24, "y": 95 }
            ]
        };
