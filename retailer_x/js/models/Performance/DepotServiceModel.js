define(['underscore', 'backbone', 'dashboardConfig', 'performanceModel'], function (_, Backbone, DashboardConfig, PerformanceModel) {

    var DepotServiceModel = PerformanceModel.extend({

        defaults: {
            depotServiceData: 'depotServiceData',
        },

        url: DashboardConfig.url,

        initialize: function () {
            // Bind my new functions
            _.bindAll(this, 'depotServiceData');

            // Inherit PerformanceModel and Override PerformanceModel
            PerformanceModel.prototype.initialize.apply(this);
        },

        // Get all the JSON data from the url
        parse: function (data) {
            // Sort the latest period data
            data = DashboardConfig.sort.byDate(data.LatestPeriod);
            this.depotServiceData(data)
        },

        depotServiceData: function (data) {
            var that = this;
            var depotLevel = this.getDataCategory(data);

            // Iterate data
            data.forEach(function (e, x) {
                date = e['Date'];

                // Iterate availability
                depotLevel.forEach(function (a, y) {
                    e['Category'].forEach(function (c, z) {
                        if (a['key'] === c['Key']) {
                            a['values'].push({
                                "x": DashboardConfig.date.convert(date),
                                "y": that.calculateDepotLevel(c['CasesSatisfied'], c['CasesShorted'])
                            });
                        }
                    });
                });
            });

            // Iterate data
            data.forEach(function (e, x) {
                date = e['Date'];

                depotLevel.forEach(function (a, y) {
                    if (a['key'] === 'ALL') {
                        var casesSatisfied = 0, casesShorted = 0;
                        e['Category'].forEach(function (c, z) {
                            casesSatisfied += c['CasesSatisfied'];
                            casesShorted += c['CasesShorted'];
                        });
                        a['values'].push({
                            "x": DashboardConfig.date.convert(date),
                            "y": that.calculateDepotLevel(casesSatisfied, casesShorted)
                        });
                    }
                });
            });

            // Set the depotServiceData in the DataModel
            this.set({
                depotServiceData: depotLevel
            });
        },
    })

    return DepotServiceModel;
});
