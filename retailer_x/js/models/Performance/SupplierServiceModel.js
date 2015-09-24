define(['underscore', 'backbone', 'dashboardConfig', 'performanceModel'], function (_, Backbone, DashboardConfig, PerformanceModel) {

    var SupplierServiceModel = PerformanceModel.extend({

        defaults: {
            supplierServiceData: 'supplierServiceData',
        },

        url: DashboardConfig.url,

        initialize: function () {
            // Bind my new functions
            _.bindAll(this, 'supplierServiceData');

            // Inherit PerformanceModel and Override PerformanceModel
            PerformanceModel.prototype.initialize.apply(this);
        },

        // Get all the JSON data from the url
        parse: function (data) {
            // Sort the latest period data
            data = DashboardConfig.sort.byDate(data.LatestPeriod);
            this.supplierServiceData(data)
        },

        supplierServiceData: function (data) {
            var that = this;
            var serviceLevel = this.getDataCategory(data);

            // Iterate data
            data.forEach(function (e, x) {
                date = e['Date'];

                // Iterate Supplier Level
                serviceLevel.forEach(function (a, y) {
                    e['Category'].forEach(function (c, z) {
                        if (a['key'] === c['Key']) {
                            a['values'].push({
                                "x": DashboardConfig.date.convert(date),
                                "y": that.calculateServiceLevel(c['SuppCasesMatched'], c['SuppCasesCredited'])
                            });
                        }
                    });
                });
            });

            // Iterate data
            data.forEach(function (e, x) {
                date = e['Date'];

                serviceLevel.forEach(function (a, y) {
                    if (a['key'] === 'ALL') {
                        var suppCasesMatched = 0, suppCasesCredited = 0;
                        e['Category'].forEach(function (c, z) {
                            suppCasesMatched += c['SuppCasesMatched'];
                            suppCasesCredited += c['SuppCasesCredited'];
                        });
                        a['values'].push({
                            "x": DashboardConfig.date.convert(date),
                            "y": that.calculateServiceLevel(suppCasesMatched, suppCasesCredited)
                        });
                    }
                });
            });

            // Set the supplierServiceData in the DataModel
            this.set({
                supplierServiceData: serviceLevel
            });
        },
    })

    return SupplierServiceModel;
});
