define(['jquery', 'underscore', 'backbone', 'dashboardConfig'], function ($, _, Backbone, DashboardConfig) {

    var AtheonChartBase = Backbone.View.extend({
        defaults: {
            svg: '', // The element to draw the div on
            model: '', // The model that loads data
            chartData: '', // The chart Data passed from the model
            categorySelection: 'ALL', // Set the category selection set byt the filter [ALL by default]
            prevCategorySelection: 'ALL', // Used for filter selection
            chartObject: '', // Maintain an object of the chart created
            chartInstance: '', // Maintain an instance of the chartObject
            noDataMsg: 'No Data Available', // Set the noDataMsg default to 'No Data Available'
            summaryDate: '',

            width: DashboardConfig.defaultWidth,
            height: DashboardConfig.defaultHeight,
            color: DashboardConfig.defaultColor,
        },

        el: $("body"),
        //el : $("#alerts-dashboard"),

        // How to override initialize :
        // http://stackoverflow.com/questions/15987490/backbone-view-inheritance-call-parent-leads-to-recursion
        initialize: function () {
            // To be able to access default options
            this.options = _.extend({}, this.defaults, this.options);
            var that = this;

            // Set Error handling functions
            this.model.bind('error', this.networkError, this);

            // Pass the instance to fetch data for the chart
            this.fetchChartData(this);

            setTimeout(function () {
                $('.icheck input').on('ifChecked', function (event) {
                    that.updateFilterCategory(event);
                })
            }, 1500)

            // Re-size Charts
            $(".sidebar-toggle-box .fa-bars").on('click', function () {
                that.resizeChart(that)
            });
        },

        // Model/JSON load fail handler
        networkError: function (model, error) {
            $("[id='alerts-dash']").hide()
            $("[id='alerts-dash-msg']").show()
        },

        // Event handlers
        // How to override events :
        // http://stackoverflow.com/questions/9403675/backbone-view-inherit-and-extend-events-from-parent
        events: {
            //'click #dashboardFilter': 'updateFilterCategory',
        },

        updateFilterCategory: function (e) {
            // Set the categorySelection globally
            this.options.categorySelection = e.currentTarget.value;

            // Send the categorySelection to the updateChart functions
            this.updateChart();
        },

        // Update Charts
        updateChart: function () {
            // Override this function to perform your custom chart updates
        },

        // Re-size Charts
        resizeChart: function (that) {
            setTimeout(function () {
                if (that.options.chartObject !== '') {
                    that.options.chartObject.update();
                    try {
                        // Only available on PerformanceChartBase
                        that.reColorChart();
                    } catch (e) {
                    }

                    try {
                        // Only available on DailySalesView
                        that.chartFilterBars(that);
                    } catch (e) {
                    }
                }
            }, 500);
        },
    });

    return AtheonChartBase;
});
