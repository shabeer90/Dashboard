define(['jquery', 'underscore', 'backbone', 'dashboardConfig', 'performanceChartBase', 'supplierServiceModel'], function ($, _, Backbone, DashboardConfig, PerformanceChartBase, SupplierServiceModel) {

    var SupplierServiceView = PerformanceChartBase.extend({
        defaults: _.defaults({
            svg: "#supplierServiceChart", // The element to draw the div on
            model: new SupplierServiceModel(), // The model that loads data
            chartData: 'supplierServiceData', // The chart Data passed from the model
            performanceTarget: DashboardConfig.performanceTarget.supplier, // Set the Performance Tartget
            // Minibox figures & date
            percentageH2: 'supplierServicePerc',
            percentageDate: 'supplier_service_date',

        }, PerformanceChartBase.prototype.defaults),
    });

    return SupplierServiceView;
});

