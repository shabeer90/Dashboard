define(['jquery', 'underscore', 'backbone', 'atheonVerticalChartBase', 'nvd3', 'dashboardConfig', 'monthlySalesModel'], function ($, _, Backbone, AtheonVerticalChartBase, nvd3, DashboardConfig, MonthlySalesModel) {

    var MonthlySalesView = AtheonVerticalChartBase.extend({
        defaults: _.defaults({
            svg: "#monthlySaleTab",
            // Call the SupplierServiceModel instance
            model: new MonthlySalesModel(),
            // Tell the model the JSON data section
            responsiveHeight: 40,
            width: $("#monthlySaleTab").width(),

        }, AtheonVerticalChartBase.prototype.defaults),

        // Overrider AtheonHorizontalChartBase
        fetchChartData: function (that) {
            that.options.model.fetch({
                success: function (response, status, jqxhr) {
                    that.options.chartData = response.get('monthlySalesData');

                    // Send data to the chart
                    var data = JSON.parse(JSON.stringify(that.options.chartData));
                    data = that.getCategoryData(data)

                    // Send data to the chart
                    that.render(data);
                },
                error: function (error) {
                    that.networkError();
                },
            });
        },

        // Get the data for 'categorySelection'
        getCategoryData: function (data) {
            var indexList = [];

            for (var x = 0; x < data.length; x++) {
                if (data[x]['key'] !== this.options.categorySelection) {
                    indexList.push(x);
                }
            }
            for (var x = indexList.length - 1; x >= 0; x--) {
                data.splice([indexList[x]], 1)
            }
            return data;
        },

        // Update Charts
        updateChart: function () {
            // Get the categorySelection and the data
            var categorySelection = this.options.categorySelection;
            var data = JSON.parse(JSON.stringify(this.options.chartData));
            var chart = this.options.chartObject;
            var updateChart = this.options.chartInstance;

            // Get the data for the selected category
            var data = this.getCategoryData(data);

            updateChart.datum(data).transition().duration(500).call(chart);

            nv.utils.windowResize(function () {
                chart.update();
            });
        },

        // Override default tick format on the xAxis
        tickFormatRender: function (chart) {
            chart.yAxis.tickFormat(function (d) {
                var format = d3.format(",d");
                return '£ ' + format(d)
            });
        },
    });

    return MonthlySalesView;
});
