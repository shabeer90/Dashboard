define(['jquery', 'underscore', 'backbone', 'atheonChartBase', 'nvd3', 'dashboardConfig'], function ($, _, Backbone, AtheonChartBase, nvd3, DashboardConfig) {

    var AtheonHorizontalChartBase = AtheonChartBase.extend({

        // Override defaults values
        defaults: _.defaults({
            shortedCases: '',
            shortedSku: '',
            defHeight: 110,
            responsiveHeight: 20,

        }, AtheonChartBase.prototype.defaults),

        render: function (data) {
            // Save the chart data
            this.options.chartData = JSON.parse(JSON.stringify(data));

            var that = this;
            var width = this.options.width, height = this.options.height, color = this.options.color;
            var height = this.options.defHeight + (data['values'].length * this.options.responsiveHeight ) - this.options.responsiveHeight;

            var marginLeft = this.calculateMarginLeft(data);

            nv.addGraph(function () {
                that.options.chartObject = nv.models.multiBarHorizontalChart().x(function (d) {
                    return d.x
                }).y(function (d) {
                    return d.y
                }).height(height).margin({
                    top: 10,
                    right: 25,
                    bottom: 50,
                    left: marginLeft < 60 ? 60 : marginLeft
                }).tooltip(function (key, x, y, e, graph) {
                    return that.customTooltip(key, x, y, e, graph);
                }).tooltips(true).showControls(false).showLegend(false).color([color]).noData(that.options.noDataMsg);

                that.tickFormatRender(that.options.chartObject);

                that.options.chartInstance = d3.select(that.options.svg).datum([that.options.chartData]);
                that.options.chartInstance.transition().attr('height', height).duration(500).call(that.options.chartObject);

                //d3.selectAll(".nv-bar").on('click', function (e) {
                //    that.filterBars(e)
                //});

                nv.utils.windowResize(that.options.chartObject.update);

                return that.options.chartObject;
            });
        },

        // Calculate the margin left based on the lenght of the label
        calculateMarginLeft: function (data) {
            var marginLeft = 0, labelMaxLength = 0;
            for (var x = 0; x < data['values'].length; x++) {
                if (data['values'][x]['x'].length > labelMaxLength)
                    labelMaxLength = data['values'][x]['x'].length;
            }

            return labelMaxLength * 7;
        },

        // Format the point on the xAxis
        tickFormatRender: function (chart) {
            chart.yAxis.tickFormat(d3.format(',.1d'));
        },

    });

    return AtheonHorizontalChartBase;
});


