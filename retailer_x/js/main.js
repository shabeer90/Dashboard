requirejs.config({
    //Set up paths to our libraries and plugins
    paths: {
        // jQuery
        //'jquery': '../libs/jquery/jquery.min', //jQuery v1.8.3

        // bootstrap
        //'bootstrap': '../libs/bs3/bs3.3.2',

        // Backbone JS & Co
        "underscore": '/static/js/libs/underscore/underscore-min',
        "backbone": '/static/js/libs/backbone/backbone-min',

        // D3 & NVD3
        "d3": '/static/dashboard/js/d3/d3.v3',
        "nvd3": '/static/dashboard/js/nvd3/nv.d3',
        "utils": '/static/dashboard/js/nvd3/utils',

        // DASHBOARD
        "dashboardConfig": 'models/DashboardConfig',

        // Base charts
        "atheonChartBase": 'views/AtheonChartBase',
        "atheonHorizontalChartBase": 'views/AtheonHorizontalChartBase',
        "atheonVerticalChartBase": 'views/AtheonVerticalChartBase',
        "performanceChartBase": 'views/Performance/PerformanceChartBase',
        "casesShortedBase": 'views/CasesShorted/CasesShortedBase',
        "priceChangeBaseView": 'views/PriceChange/PriceChangeBaseView',

        // Models
        "dailySalesModel": 'models/Sales/DailySalesModel',
        "monthlySalesModel": 'models/Sales/MonthlySalesModel',
        // Price Change
        "priceChangeModel": 'models/PriceChangeModel',
        // Performance Models
        "performanceModel": 'models/Performance/PerformanceModel',
        "supplierServiceModel": 'models/Performance/SupplierServiceModel',
        "depotServiceModel": 'models/Performance/DepotServiceModel',
        "availabilityModel": 'models/Performance/AvailabilityModel',
        // CasesShorted Models
        "supplierCasesShortedModel": 'models/CasesShorted/SupplierCasesShortedModel',
        "depotCasesShortedModel": 'models/CasesShorted/DepotCasesShortedModel',

        // Dashboard Chart
        "supplierServiceView": 'views/Performance/SupplierServiceView',
        "depotServiceView": 'views/Performance/DepotServiceView',
        "availabilityView": 'views/Performance/AvailabilityView',
        "supplierCasesShortedView": 'views/CasesShorted/SupplierView',
        "depotCasesShortedView": 'views/CasesShorted/DepotView',
        "salesView": 'views/Sales/DailySalesView',
        "monthlySalesView": 'views/Sales/MonthlySalesView',
        "priceChangeView": 'views/PriceChange/PriceChangeView',

        // Pages to load
        'application': 'libs/util/application',
        'npsfeedback': "libs/util/npsfeedback",
        'subscription': "libs/util/subscription",
        'landingpage': "libs/util/landingpage",
        'dashboard-landingtabs': "libs/util/dashboard-landingtabs",

        // Dashboard Utility
        "dashboardTrackerView": 'views/util/DashboardTrackerView',
        "dashboardWalkthroughView": 'views/util/DashboardWalkthroughView',
        "exploreView": 'views/util/ExploreView',

        // Utility
        'date': '../../../js/libs/util/date',
        'browser-detect': "../libs/util/browser-detect",
        'browser-detect-msg': "../libs/util/browser-detect-msg",
        'dataTables': "../../../js/libs/jquery/jquery.dataTables",
        'iCheck': "../../../js/libs/iCheck/jquery.icheck"
    },
    shim: {
        'nvd3': ['d3'],
        'dailySalesModel': ['iCheck']
    }
});

define('jquery', function () {
    return $; // Just return the jQuery loaded with `script`.
});

// Show modal when dashboard page loads
$('#loading-modal').modal('toggle');

// Load Dashboard elements
require(["backbone", "nvd3", "date", "dataTables", "salesView", "dailySalesModel", "monthlySalesView", "monthlySalesModel", "supplierServiceView", "supplierServiceModel", "depotServiceView", "depotServiceModel", "availabilityView", "availabilityModel", "supplierCasesShortedView", "supplierCasesShortedModel", "depotCasesShortedView", "depotCasesShortedModel", "priceChangeView", "priceChangeModel", "dashboardTrackerView", "dashboardWalkthroughView", "iCheck"], function (Backbone, nvd3, date, dataTables, SalesView, DailySalesModel, MonthlySalesView, MonthlySalesModel, SupplierServiceView, SupplierServiceModel, DepotServiceView, DepotServiceModel, AvailabilityView, AvailabilityModel, SupplierCasesShortedView, SupplierCasesShortedModel, DepotCasesShortedView, DepotCasesShortedModel, PriceChangeView, PriceChangeModel, DashboardTrackerView, DashboardWalkthroughView, iCheck) {

    sessionStorage.dashboard = false

    $(document).ready(function () {
        // Sales charts
        new SalesView({model: DailySalesModel});
        new MonthlySalesView({model: MonthlySalesModel});

        // Performance charts
        new SupplierServiceView({model: SupplierServiceModel});
        new DepotServiceView({model: DepotServiceModel});
        new AvailabilityView({model: AvailabilityModel});

        // Cases shorted charts
        new SupplierCasesShortedView({model: SupplierCasesShortedModel});
        new DepotCasesShortedView({model: DepotCasesShortedModel});

        // Price change
        new PriceChangeView({model: PriceChangeModel});

        // Disable the 2 seconds modal once the charts are loaded
        setTimeout(function () {
            $('#loading-modal').modal('hide');
            sessionStorage.setItem("dashboard", true);
        }, 2000);

    });

}, function (err) {
    console.log(err)
});
