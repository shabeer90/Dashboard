/**
 * Created by ShabeerSheffa on 26/03/2015.
 */
require.config({
    //baseUrl: '/backbone-tests/',
    paths: {
        // Core files
        'jquery': '../../../../../static/js/libs/jquery/jquery',
        'underscore': '../../../../../static/js/libs/underscore/underscore-min',
        'backbone': '../../../../../static/js/libs/backbone/backbone-min',
        'mocha': 'js/mocha',
        'chai': 'js/chai',
        'chai-jquery': 'js/chai-jquery',
        'sinon': 'js/sinon',

        // D3 & NVD3
        "d3": '../../js/d3/d3.v3',
        "nvd3": '../../js/nvd3/nv.d3',

        // DASHBOARD
        "dashboardConfig": '../js/models/DashboardConfig',

        // Base charts
        "atheonChartBase": '../js/views/AtheonChartBase',
        "atheonHorizontalChartBase": '../js/views/AtheonHorizontalChartBase',
        "atheonVerticalChartBase": '../js/views/AtheonVerticalChartBase',
        "performanceChartBase": '../js/views/Performance/PerformanceChartBase',
        "casesShortedBase": '../js/views/CasesShorted/CasesShortedBase',
        "priceChangeBaseView": '../js/views/PriceChange/PriceChangeBaseView',

        // Models
        "dailySalesModel": '../js/models/Sales/DailySalesModel',
        "monthlySalesModel": '../js/models/Sales/MonthlySalesModel',
        // Price Change
        "priceChangeModel": '../js/models/PriceChangeModel',
        // Performance Models
        "performanceModel": '../js/models/Performance/PerformanceModel',
        "supplierServiceModel": '../js/models/Performance/SupplierServiceModel',
        "depotServiceModel": '../js/models/Performance/DepotServiceModel',
        "availabilityModel": '../js/models/Performance/AvailabilityModel',
        // CasesShorted Models
        "supplierCasesShortedModel": '../js/models/CasesShorted/SupplierCasesShortedModel',
        "depotCasesShortedModel": '../js/models/CasesShorted/DepotCasesShortedModel',

        // Dashboard Chart
        "supplierServiceView": '../js/views/Performance/SupplierServiceView',
        "depotServiceView": '../js/views/Performance/DepotServiceView',
        "availabilityView": '../js/views/Performance/AvailabilityView',
        "supplierCasesShortedView": '../js/views/CasesShorted/SupplierView',
        "depotCasesShortedView": '../js/views/CasesShorted/DepotView',
        "salesView": '../js/views/Sales/DailySalesView',
        "monthlySalesView": '../js/views/Sales/MonthlySalesView',
        "priceChangeView": '../js/views/PriceChange/PriceChangeView',


        // TESTS
        "salesTest": "dashboards/salesTest",
        "monthlyTest": "dashboards/monthlyTest",
        "priceChangeTest": "dashboards/priceChangeTest",
        "availabilityViewTest": "dashboards/availabilityViewTest",
        "depotServiceViewTest": "dashboards/depotServiceViewTest",
        "supplierServiceViewTest": "dashboards/supplierServiceViewTest",
        "supplierCasesViewTest": "dashboards/supplierCasesViewTest",
        "depotCasesViewTest": "dashboards/depotCasesViewTest",

        // Utility
        //'date': '../js/libs/util/date',
        'dataTables': "../../../../../static/js/libs/jquery/jquery.dataTables",
    },
    shim: {
        'chai-jquery': ['jquery', 'chai'],
        'nvd3': ['d3'],
        'mocha': {
            init: function () {
                this.mocha.setup('bdd');
                return this.mocha;
            }
        }
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});

require(["backbone", "mocha", "chai", "sinon", "nvd3", "salesTest", "monthlyTest", "priceChangeTest", "availabilityViewTest", "depotServiceViewTest", "supplierServiceViewTest", "supplierCasesViewTest", "depotCasesViewTest"],
    function (Backbone, mocha, chai, sinon, nvd3, salesTest, monthlyTest, priceChangeTest, availabilityViewTest, depotServiceViewTest, supplierServiceViewTest, supplierCasesViewTest, depotCasesViewTest) {

        /*globals mocha */
        mocha.setup('bdd');
        mocha.run();

    }, function (err) {
        console.log(err)
    });