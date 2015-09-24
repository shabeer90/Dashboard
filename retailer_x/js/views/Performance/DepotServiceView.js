define(['jquery', 'underscore', 'backbone', 'dashboardConfig', 'performanceChartBase', 'depotServiceModel'], function ($, _, Backbone, DashboardConfig, PerformanceChartBase, DepotServiceModel) {

    var DepotServiceView = PerformanceChartBase.extend({
        defaults: _.defaults({
            svg: "#depotServiceChart", // The element to draw the div on
            model: new DepotServiceModel(), // The model that loads data
            chartData: 'depotServiceData', // The chart Data passed from the model
            performanceTarget: DashboardConfig.performanceTarget.depot, // Set the Performance Tartget
            // Minibox figures & date
            percentageH2: 'depotServicePerc',
            percentageDate: 'depot_service_date',

        }, PerformanceChartBase.prototype.defaults),
    });

    return DepotServiceView;
});

