define(['underscore', 'backbone', 'dashboardConfig', 'performanceModel'], function (_, Backbone, DashboardConfig, PerformanceModel) {

    var AvailabilityModel = PerformanceModel.extend({

        defaults: {
            availabilityServiceData: 'availabilityServiceData',
        },

        url: DashboardConfig.url,

        initialize: function () {
            // Bind my new functions
            _.bindAll(this, 'availabilityServiceData');

            // Inherit PerformanceModel and Override PerformanceModel
            PerformanceModel.prototype.initialize.apply(this);
        },

        // Get all the JSON data from the url
        parse: function (data) {
            // Sort the latest period data
            data = DashboardConfig.sort.byDate(data.LatestPeriod);
            this.availabilityServiceData(data)
        },

        availabilityServiceData: function (data) {
            var that = this;
            var availabilityLevel = this.getDataCategory(data);

            // Iterate data
            data.forEach(function (e, x) {
                date = e['Date'];

                // Iterate availability
                availabilityLevel.forEach(function (a, y) {
                    e['Category'].forEach(function (c, z) {
                        if (a['key'] === c['Key']) {
                            a['values'].push({
                                "x": DashboardConfig.date.convert(date),
                                "y": that.calculateAvailabilityLevel(c['StoresStocked'], c['StoresRanged'])
                            });
                        }
                    });
                });
            });

            // Iterate data
            data.forEach(function (e, x) {
                date = e['Date'];

                availabilityLevel.forEach(function (a, y) {
                    if (a['key'] === 'ALL') {
                        var storesStocked = 0, storesRanged = 0;
                        e['Category'].forEach(function (c, z) {
                            storesStocked += c['StoresStocked'];
                            storesRanged += c['StoresRanged'];
                        });
                        a['values'].push({
                            "x": DashboardConfig.date.convert(date),
                            "y": that.calculateAvailabilityLevel(storesStocked, storesRanged)
                        });
                    }
                });
            });

            // Set the availabilityServiceData in the DataModel
            this.set({
                availabilityServiceData: availabilityLevel
            });
        },
    })

    return AvailabilityModel;
});
