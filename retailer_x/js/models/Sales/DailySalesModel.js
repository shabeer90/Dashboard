define(['underscore', 'backbone', 'd3', 'dashboardConfig', 'iCheck'], function (_, Backbone, d3, DashboardConfig, iCheck) {

    var DailySalesModel = Backbone.Model.extend({

        defaults: {
            date: '',
            categorySelection: 'ALL',
            dailySummary: 'dailySummary',
            salesData: 'salesData',
            weeklyHistoricData: 'weeklyHistoricData',
            salesTotal: 'salesTotalData',
            weeklyTotal: 'weeklyTotalData',
            summaryDate: '',
        },

        url: DashboardConfig.url,

        initialize: function () {
            // Bind my new functions
            _.bindAll(this, 'dailySalesData', 'createFilter');
        },

        // Get all the JSON data from the url
        parse: function (data) {
            // Sort the latest period data
            latestData = DashboardConfig.sort.latestData(data.LatestPeriod);

            dailySummary = data.DailySummary[0]['data'];

            // Daily summary contains the most data
            var summaryDate = data.DailySummary[0]['date'];
            // Set the Latest date on the Dashboard header

            this.set({
                summaryDate: summaryDate,
            });

            this.createFilter(latestData);
            this.dailySalesData(latestData, dailySummary)
        },

        // Add Categories to the filter
        createFilter: function (latest) {
            var categories = []

            // Get the list ofcategories from the latest data
            for (var x = 0; x < latest.length; x++) {
                for (var y = 0; y < latest[x].Category.length; y++) {
                    if (categories.indexOf(latest[x].Category[y].Key) < 0) {
                        categories.push(latest[x].Category[y].Key)
                    }
                }
            }

            // Add Categories to the filter
            for (var i = 0; i < categories.length; i++) {
                var value = categories[i] == null ? 'UNKNOWN' : categories[i];
                value = value.replace(/'/g, "&#39;");
                $(".filter .icheck").append("<div class='square-blue single-row'><div class='radio'><input tabindex='3' type='radio'  name='dashboard-filter' id='dashboardFilter' value='" + value + "' alt='" + value + "'><label>" + value + " </label></div></div>");

                if (i === (categories.length - 1)) {
                    this.radioButtonStyles()
                }
            }
        },

        // Enable the styles for radio input/dashboard filter
        radioButtonStyles: function () {
            $('.square-blue input').iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' // optional
            });
        },

        // Gather daily sales data
        dailySalesData: function (data, dailySummary) {
            var historicData = {
                "recentWeek": [],
                "pastWeek": []
            };
            var salesValue = {
                "prevWeekData": [],
                "values": []
            };
            var salesTotal = 0, weeklyTotal = 0, dailySummary;

            // Daily SUmmary Value
            var summaryValue = dailySummary['ALL'][0]['DailySalesTotal'];

            // Access the Lastest date data
            var latestData = data[data.length - 1];

            // Same day of the week VS previous week
            var prevWeekData = data[data.length - 8];

            // Handle error if there is not enough data
            // to compare "Same day of the week VS previous week"
            try {
                for (var i = 0; i < prevWeekData['Category'].length; i++) {
                    salesValue['prevWeekData'].push(prevWeekData['Category'][i]);
                }
            } catch (ex) {
                // console.log(ex.message)
            }

            // Check if the summaryValue is '?' or integer
            if (summaryValue === '?') {
                salesTotal = summaryValue;
            } else {
                // Put the latest days data into the array so it can be inserted into the sales chart.
                lastDate = data[data.length - 1]['Date'];

                for (var i = 0; i < latestData['Category'].length; i++) {
                    salesValue['values'].push({
                        "x": latestData['Category'][i]['Key'],
                        "y": latestData['Category'][i]['SalesValue']
                    });

                    salesTotal += latestData['Category'][i]['SalesValue'];
                }
            }

            /*
             * Calculate week vs week difference.
             * Extract full week data. Identify the first most recent sunday and traverese 7 days behind for the most recent full week.
             * And traverese another 7 days behind for the week on week	comparison data.
             * Variable day returns integers [0 : "Sunday"]	,[ 1 : "Monday"] ,[2 : "Tuesday"] ,[3 : "Wednesday"] ,[4 : "Thursday"]	,[5 : "Friday"] ,[6 : "Saturday"]
             */
            var state = false, count = 0, dayCounter = 0;
            for (var x = data.length - 1; x >= 0; x--) {
                day = new Date(data[x]['Date'].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3")).getDay();
                if (day === 6 || state) {
                    state = true;
                    if (count < 14) {
                        if (dayCounter < 7) {
                            historicData['recentWeek'].push(data[x]);
                            dayCounter++;
                        } else {
                            historicData['pastWeek'].push(data[x]);
                        }
                        count++;
                    }
                }
            }

            // weeklyTotal
            for (var x = 0; x < historicData['recentWeek'].length; x++) {
                for (var y = 0; y < historicData['recentWeek'][x]['Category'].length; y++) {
                    weeklyTotal += historicData['recentWeek'][x]['Category'][y]['SalesValue'];
                }
            }

            salesValue = DashboardConfig.sort.byDescValue(salesValue);

            // Set the dailySalesData in the DataModel
            this.set({
                dailySummary: dailySummary,
                salesData: salesValue,
                weeklyHistoricData: historicData,
                salesTotal: salesTotal,
                weeklyTotal: weeklyTotal,
            });
        },
    })

    return DailySalesModel;
});
