chartphael
==========

chart library for raphael.js, still in heavy ALPHA  


Init procedure:  

        var profileArc = new chartphael({
            node: document.getElementById('profile_bar'),
            type: 'arc',
            track: true,
            data: { value: 45 }
        });

        var bmfChart = new chartphael({
            node: document.getElementById('bmf_chart'),
            type: 'bmf',
            data: bmfChartJSON
        });

        var bmfChartMobile = new chartphael({
            node: document.getElementById('bmf_chart_mobile'),
            type: 'bmf',
            trackerOnly: true,
            data: bmfChartJSON
        });

        var pieChart = new chartphael({
            node: document.getElementById('pie_chart'),
            type: 'pie',
            data: pieChartJSON
        });

        var doughnutChart = new chartphael({
            node: document.getElementById('doughnut_chart'),
            type: 'pie',
            doughnut: true,
            data: pieChartJSON
        });

        var lineGraph = new chartphael({
            node: document.getElementById('line_chart'),
            type: 'line',
            data: lineChartJSON
        });

        var barGraph = new chartphael({
            node: document.getElementById('bar_chart'),
            type: 'bar',
            data: barChartJSON
        });



JSON formats:  

		var pieChartJSON = {
            "items": [
                { "percent": "20", "color": "#717917" },
                { "percent": "20", "color": "#a6beaa" },
                { "percent": "30", "color": "#bf8c53" },
                { "percent": "10", "color": "#e4c95e" },
                { "percent": "10", "color": "#f1eb66" }
            ]
        };

        var bmfChartJSON = {
            "infoAxis": [
                { 
                    "coord": { "y": 1300 },
                    "label": "SET POINT",
                    "color": "#515d34"
                },
                { 
                    "coord": { "y": 1000 },
                    "label": "MIN. CALORIES",
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
            ],
            "tracker": {
                "statusColor": "#df4c44",
                "progress": {
                    "innerStep": 100,
                    "outerStep": [
                        { "percent": 25, "color": "#e6d62c" },
                        { "percent": 125, "color": "#df4c44" }
                    ]
                }
            }
        };

        var lineChartJSON = {
            "grid": {
                "x": {
                    "interval": 2,
                    "min": 0,
                    "max": 26
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
                { "x": 23, "y": 75 },
                { "x": 26, "y": 95 }
            ]
        };

        var barChartJSON = {
            "grid": {
                "x": {
                    "interval": 1,
                    "min": 0,
                    "max": 8,
                    "labels": ["20.08","21.08","22.08","23.08","24.08","25.08","26.08"]
                },
                "y": {
                    "interval": 25,
                    "min": 0,
                    "max": 175
                }
            },
            "items": [
                { "x": 1, "y": 30, color: "red" },
                { "x": 2, "y": 50 },
                { "x": 3, "y": 65 },
                { "x": 4, "y": 80 },
                { "x": 5, "y": 95, color: "red" },
                { "x": 6, "y": 95, color: "red" },
                { "x": 7, "y": 100 }
            ]
        };
