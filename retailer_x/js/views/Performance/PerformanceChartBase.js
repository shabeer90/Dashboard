define(['jquery', 'underscore', 'backbone', 'atheonChartBase', 'nvd3', 'dashboardConfig'], function ($, _, Backbone, AtheonChartBase, nvd3, DashboardConfig) {

    var PerformanceChartBase = AtheonChartBase.extend({

        // Override defaults values
        defaults: _.defaults({
            width: DashboardConfig.performanceWidth,
            height: DashboardConfig.performanceHeight,
            performanceTarget: '',
            percentageH2: '',
            percentageDate: '',
            yMin: DashboardConfig.yMin,
            yMax: DashboardConfig.yMax,
            yMinBuffer: DashboardConfig.yMinBuffer,

        }, AtheonChartBase.prototype.defaults),

        // Override initialize
        initialize: function () {
            var that = this;

            // Draw the performance target values
            $('#SupplierServiceValue').text(DashboardConfig.performanceTarget.supplier);
            $('#DepotServiceValue').text(DashboardConfig.performanceTarget.depot);
            $('#ProductAvailabilityValue').text(DashboardConfig.performanceTarget.availability);

            // Inherit AtheonChartBase and Override AtheonChartBase
            AtheonChartBase.prototype.initialize.apply(this);


            // Bootstratp switch zoom-in/zoom-out
            $('input[id="zoom-switch"]').on('switch-change', function (e, data) {
                state = data.value;
                zoom =  state ? that.zoomIn() : that.zoomOut();
            });
        },

        events: function () {
            return _.extend({}, AtheonChartBase.prototype.events, {
                //'click #zoomIn': 'zoomIn',
            });
        },

        fetchChartData: function (that) {
            that.options.model.fetch({
                success: function (response, xhr) {
                    switch (that.options.chartData) {
                        case 'supplierServiceData':
                            that.render(response.get('supplierServiceData'));
                            break;
                        case 'depotServiceData':
                            that.render(response.get('depotServiceData'));
                            break;
                        case 'availabilityData':
                            that.render(response.get('availabilityServiceData'));
                            break;
                    }
                },
                error: function (error) {
                    that.networkError();
                },
            });
        },

        render: function (data) {
            // Save the chart data
            this.options.chartData = JSON.parse(JSON.stringify(data));

            // Get the data for 'categorySelection'. By default its 'ALL'
            var data = this.getCategoryData(data);

            var that = this;
            var width = this.options.width, height = this.options.height, color = this.options.color, yMax = this.options.yMax, yMinBuffer = this.options.yMinBuffer;

            nv.addGraph(function () {
                that.options.chartObject = nv.models.multiBarChart().height(height).margin({
                    top: 10,
                    right: 10,
                    bottom: 25,
                    left: 35
                }).tooltipContent(function (key, y, e, graph) {
                    return '<h5>' + key + '</h5>' + '<p>' + e + '% on ' + y + '</p>'
                }).showLegend(false).color([color]).showControls(false).reduceXTicks(false);

                that.options.chartObject.xAxis.tickFormat(function (d) {
                    return d3.time.format('%d/%m')(new Date(d));
                });

                // Set the chart xAxis tickValues
                that.options.chartObject.xAxis.tickValues(function (d) {
                    return that.getTickValues(d);
                });

                // Find the minimum value for the yAxis
                var yMin = that.getYMin(data);

                // TODO : forceY large number must be starting and end date extracted from data
                if ((yMin - yMinBuffer) > 0) {
                    that.options.chartObject.forceY([yMin - yMinBuffer, yMax]);
                }

                that.options.chartInstance = d3.select(that.options.svg + ' svg').datum(data);

                // that.options.chartInstance.transition().attr('height', height).duration(500).call(chart);
                that.options.chartInstance.transition().attr('height', height).call(that.options.chartObject);

                that.reColorChart();
                nv.utils.windowResize(function () {
                    that.options.chartObject.update();
                    that.reColorChart();
                });

                // Send data to draw up the Perfomrnce Level for the most recent day
                that.setPercentageValue(data);

                return that.options.chartObject;
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

            // Maintain a copy of the categorised data used for the charts
            // Used for zoom functions
            this.options.filteredChartData = data;

            return data;
        },

        // Get the ticke values for the chart
        getTickValues: function (data) {
            var dateSets = [];
            // Find the last date, and keep travesing -7 days, until x > 0.
            for (var x = data[0]['values'].length - 1; x > 0; x) {
                dateSets.push(data[0]['values'][x]['x']);
                x -= 7;
            }
            // Finally append the d[zeroth] value to dateSets
            dateSets.push(data[0]['values'][0]['x']);
            return dateSets;
        },

        // Calculate the minimum value for Y axis each time the graph loads/updated
        getYMin: function (d) {
            var yMin = this.options.yMin;

            for (var x = 0; x < d[0]['values'].length; x++) {
                if (d[0]['values'][x]['y'] != null) {
                    if (yMin > Number(d[0]['values'][x]['y'])) {
                        yMin = Number(d[0]['values'][x]['y']);
                    }
                }
            }
            return yMin;
        },

        // Colors the bars in red if they do not meet the required target levels.
        reColorChart: function () {
            var performanceTarget = this.options.performanceTarget;
            d3.selectAll(this.options.svg + ' .nv-barsWrap .nv-groups .nv-group').each(function (d, i) {
                if (d3.select(this).selectAll('rect')[0].length > 0) {
                    d3.select(this).selectAll('rect').each(function (a, z) {
                        if (a['y'] != null && Number(a['y']) < performanceTarget) {
                            d3.select(this).attr('style', 'fill:' + DashboardConfig.defaultRed)
                        }
                    });
                }
            });
        },

        // Draw up the Perfomrnce Level for the most recent day in the minibox
        setPercentageValue: function (d) {
            var performanceTarget = this.options.performanceTarget;
            var percentageH2 = this.options.percentageH2;
            var percentageDate = this.options.percentageDate;

            var value, deliveryDate;

            // Iterate to get the most recent delivery date
            for (var i = d[0]['values'].length - 1; i >= 0; i--) {
                if (d[0]['values'][i]['y'] != null) {
                    value = d[0]['values'][i]['y'];
                    deliveryDate = d3.time.format('%d/%m/%Y')(new Date(d[0]['values'][i]['x']));

                    // Break the For loop when the most recent delivery date is found
                    i = -1;
                }
            }
            ;

            var percentageValue = (value === undefined ) ? 'N/A' : value + '%';
            $('[id=' + percentageH2 + ']').text(percentageValue);

            // Get the dailySummary Date after its bieng set
            setTimeout(function () {
                var build_date = $('.header span').text();
                if (build_date != deliveryDate) {
                    $('#' + percentageDate).text(deliveryDate).css("font-weight", "bold");
                } else {
                    $('#' + percentageDate).text(deliveryDate)
                }
            }, 500);

            // Remove the percentage class if negative or positive
            if ($('[id=' + percentageH2 + ']').length > 0) {
                var cls = $('[id=' + percentageH2 + ']').removeClass()[0].attributes[1].nodeValue;
                $('[id=' + percentageH2 + ']').removeClass(cls);
            }

            // Add the percentage class when the data is filtered
            if (value < performanceTarget) {
                $('[id=' + percentageH2 + ']').addClass('negative_figure');
            } else {
                $('[id=' + percentageH2 + ']').addClass('neutral_figure');
            }
        },

        // Update Charts
        updateChart: function () {
            // Get the categorySelection and the data
            var categorySelection = this.options.categorySelection;
            var data = JSON.parse(JSON.stringify(this.options.chartData));
            var chart = this.options.chartObject;
            var updateChart = this.options.chartInstance;
            var yMax = this.options.yMax, yMinBuffer = this.options.yMinBuffer;

            // Get the data for the selected category
            var data = this.getCategoryData(data);

            var that = this;

            var yMin = this.getYMin(data);

            if ((yMin - yMinBuffer) > 0) {
                chart.forceY([yMin - yMinBuffer, yMax]);
            }

            updateChart.datum(data).transition().duration(500).call(chart);

            this.reColorChart();
            nv.utils.windowResize(function () {
                chart.update();
                that.reColorChart();
            });

            this.setPercentageValue(data);

        },

        updateValues: function () {

        },

        zoomIn: function () {
            var chart = this.options.chartObject;
            yMin = this.getYMin(this.options.filteredChartData);

            chart.forceY([yMin - this.options.yMinBuffer, this.options.yMax]);
            d3.select(this.options.svg + ' svg').datum(this.options.filteredChartData).transition().duration(500).call(chart);
            this.reColorChart();
        },

        zoomOut: function () {
            var chart = this.options.chartObject;
            chart.forceY([0, this.options.yMax]);
            d3.select(this.options.svg + ' svg').datum(this.options.filteredChartData).transition().duration(500).call(chart);
            this.reColorChart();
        }
    });

    return PerformanceChartBase;
});

