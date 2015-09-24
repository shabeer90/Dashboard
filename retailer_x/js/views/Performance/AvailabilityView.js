define(['jquery', 'underscore', 'backbone', 'performanceChartBase', 'availabilityModel'], function ($, _, Backbone, PerformanceChartBase, AvailabilityModel) {

    var AvailabilityView = PerformanceChartBase.extend({
        defaults: _.defaults({
            svg: "#productAvailabilityChart", // The element to draw the div on
            model: new AvailabilityModel(), // The model that loads data
            chartData: 'availabilityData', // The chart Data passed from the model
            performanceTarget: DashboardConfig.performanceTarget.availability, // Set the Performance Tartget
            // Minibox figures & date
            percentageH2: 'productAvailabilityPerc',
            percentageDate: 'product_availability_date',

        }, PerformanceChartBase.prototype.defaults),
    });

    return AvailabilityView;
});

