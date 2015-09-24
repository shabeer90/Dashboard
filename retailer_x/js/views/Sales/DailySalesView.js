define(['jquery', 'underscore', 'backbone', 'dashboardConfig', 'atheonHorizontalChartBase', 'dailySalesModel'], function ($, _, Backbone, DashboardConfig, AtheonHorizontalChartBase, DailySalesModel) {

    var SalesView = AtheonHorizontalChartBase.extend({
        defaults: _.defaults({
            svg: "#dailySales",
            // Call the SupplierServiceModel instance
            model: new DailySalesModel(),
            // Tell the model the JSON data section
            responsiveHeight: 40,

        }, AtheonHorizontalChartBase.prototype.defaults),

        // Override default tick format on the xAxis
        tickFormatRender: function (chart) {
            chart.yAxis.tickFormat(function (d) {
                var format = d3.format(",d");
                return '£ ' + format(d)
            });
        },

        // My custom otooltip
        customTooltip: function (key, x, y, e, graph) {
            return '<h5>' + x + '</h5>' + '<p>' + y + '</p>'
        },

        // Overrider AtheonHorizontalChartBase
        fetchChartData: function (that) {
            that.options.model.fetch({
                success: function (response, status, jqxhr) {
                    // Will be used to compare the current selection
                    // that.options.prevCategorySelection = 'ALL';

                    // set the dailySummary Date
                    that.options.summaryDate = response.get('summaryDate');
                    $("#date").text(that.options.summaryDate);

                    that.render(response.get('salesData'));
                    that.percentageDailyValue(response.get('salesData'), that.options.categorySelection);

                    // set the dailySummary
                    that.options.dailySummary = response.get('dailySummary')

                    // set the weeklyTotal
                    that.options.weeklyTotal = response.get('weeklyHistoricData')
                    that.percentageWeeklyValue(that.options.weeklyTotal, that.options.categorySelection);

                    // Draw Daily Sales Value
                    that.drawDailyValue(response.get('salesTotal'));

                    // Draw Weekly Sales Value
                    that.drawWeeklyValue(response.get('weeklyTotal'));

                    // Set chart filter function()
                    that.chartFilterBars(that);

                },
                complete: function (jqxhr) {
                    var last_modified = new Date(jqxhr.getResponseHeader('Last-Modified'));
                    $('#last-modified').text(last_modified);
                    $("[id='alerts-dash']").show();
                },

                error: function (error) {
                    that.networkError();
                },
            });


        },

        chartFilterBars: function (that) {
            setTimeout(function () {
                d3.selectAll(that.options.svg + " .nv-bar").on('click', function (e) {
                    that.filterBars(e)
                });
            }, 400);
        },

        // Update Charts
        updateChart: function () {
            var categorySelection = this.options.categorySelection;
            var chart = this.options.chartObject;
            var updateChart = this.options.chartInstance;
            var prevCategorySelection = this.options.prevCategorySelection;
            var that = this;

            d3.select('#dailySales .nv-barsWrap .nv-groups .nv-group').selectAll('rect').each(function (d, i) {
                that.setBlueBars(this);

                if (d['x'] !== categorySelection) {
                    // Color the UNSELECTED bars in grey
                    d3.select(this).attr('style', 'fill:' + DashboardConfig.defaultGrey);
                }

                if (categorySelection === prevCategorySelection || categorySelection === 'ALL') {
                    // Color bars in blue
                    that.setBlueBars(this);

                    // Track dashboard activity, when the sales bar is clicked
                    // sainsburys/js/utils/DashboardTrackerView
                    trackActivity();
                }

            });

            updateChart.transition().duration(500).call(chart);

            this.updateValues();

            // Re-call the chartFilterBars function()
            this.chartFilterBars(this);
        },

        // Control category Filter TRUE/FALSE
        filterBars: function (e) {
            // Check if the current Bar selection === prevCategorySelection
            if (e['x'] === this.options.prevCategorySelection) {
                this.filterSelectionTrue('ALL');
            } else {
                this.filterSelectionTrue(e['x']);
            }
        },

        // Set Filter CHECKED:TRUE only for the selected category.
        filterSelectionTrue: function (e) {
            $("input[id='dashboardFilter'][value='" + e + "' ]").iCheck('check')

            // Set the prevCategorySelection
            this.options.prevCategorySelection = e;

            // Re-call the chartFilterBars function()
            this.chartFilterBars(this);
        },

        setBlueBars: function (e) {
            d3.select(e).attr('style', 'fill:' + DashboardConfig.defaultColor);
        },

        drawDailyValue: function (d) {
            var svg = '#dailySales', reason = 'No Sales Data Available';

            var value = ( typeof d === 'string') ? function () {
                d3.select(svg).select("text.nv-noData").remove();
                d3.select(svg).append("text").attr("x", "264.5").attr("y", "35").attr("dy", "-.7em").attr("class", "nvd3 nv-noData").style("text-anchor", "middle").text(reason);
                $(".salesbox-percent").hide()
                return d = "?"
            }() : function () {
                d3.select(svg).select("text.nv-noData").remove();
                $(".salesbox-percent").show()
                return DashboardConfig.currency.convert(d)
            }();

            $('[id=dailySalesTotal]').text(value);
            $('[id=dailySalesTotalSummary]').text(value.replace('£ ',''));
        },

        // Calculate values for current date and previous sales values 7 days ago.
        percentageDailyValue: function () {
            var data = this.options.chartData;
            var categorySelection = this.options.categorySelection;

            var current = 0, previous = 0, difference = 0;

            // Get the previous weeks sales value
            $.grep(data['prevWeekData'], function (e) {
                if (categorySelection === 'ALL') {
                    previous += e['SalesValue']
                }
                if (e['Key'] === categorySelection) {
                    previous += e['SalesValue']
                }
            });

            // Get the current sales value
            $.grep(data['values'], function (e) {
                if (categorySelection === 'ALL') {
                    current += e['y']
                }
                if (e['x'] === categorySelection) {
                    current += e['y']
                }
            });

            difference = DashboardConfig.percentage.calculate(current, previous);

            // If the difference returns "Infinity" hide the percentage value line
            if (difference[0] !== "Infinity") {
                var html = "<i class='fa fa-"+difference[2]+" ' ></i> " + difference[0] + " %";
                $('#sales_difference').html(html).removeAttr('class').attr('class', difference[1]);

                var parent_status = $("#sales_difference").parent().attr('style');
                if (parent_status === "display: none;") {
                    $("#sales_difference").parent().css('display', 'block')
                }
            } else {
                $("#sales_difference").parent().css('display', 'none')
            }
        },

        drawWeeklyValue: function (d) {
            d = DashboardConfig.currency.convert(d);
            $('#weeklySalesTotal').text(d);
        },

        percentageWeeklyValue: function () {
            var weeklyTotal = this.options.weeklyTotal;
            var categorySelection = this.options.categorySelection;

            // Get the RECENT week total.
            var recentWeekTotal = this.getRecentWeekTotal();

            var pastWeekTotal = 0, difference = 0;

            // Get the PAST week total of all Categories
            $.grep(weeklyTotal['pastWeek'], function (e) {
                e['Category'].forEach(function (c) {
                    if (categorySelection === 'ALL') {
                        pastWeekTotal += c['SalesValue'];
                    }
                    if (c['Key'] === categorySelection) {
                        pastWeekTotal += c['SalesValue'];
                    }
                });
            });

            // Calculate the percentage difference, apply on the HTML
            difference = DashboardConfig.percentage.calculate(recentWeekTotal, pastWeekTotal);
            var html = "<i class='fa fa-"+difference[2]+" ' ></i> " + difference[0] + " %";

            // Draw the value on the chart
            $('#week_difference').html(html).removeAttr('class').attr('class', difference[1]);
        },

        // Update
        updateValues: function () {
            var currentSales = 0;
            var data = this.options.chartData, categorySelection = this.options.categorySelection;
            var dailySummary = this.options.dailySummary;

            // Identify the category selection
            if (categorySelection === 'ALL') {
                var latestSale = 0;
                var summaryValue = dailySummary['ALL'][0]['DailySalesTotal']

                // Check if the summaryValue is '?' or integer
                if (typeof summaryValue === 'string') {
                    currentSales = summaryValue;
                } else {
                    var dataFilter = data['values'];
                    dataFilter.forEach(function (e) {
                        latestSale += e['y'];
                    });
                    currentSales = latestSale;
                }
            } else {
                try {
                    var summaryValue = dailySummary[categorySelection][0]['DailySalesTotal'];

                    if (typeof summaryValue === 'string') {
                        currentSales = summaryValue;
                    } else {
                        var latestSale;

                        // Filter out the specific category arraydata
                        var dataFilter = $.grep(data['values'], function (e) {
                            return e['x'] === categorySelection;
                        });

                        if (dataFilter.length > 0) {
                            dataFilter.forEach(function (e) {
                                latestSale = e['y'];
                            });
                        } else {
                            // If the selected category does not have data
                            // assigning undefined will display an error message in the chart
                            latestSale = '?';
                        }
                        currentSales = summaryValue;
                    }

                } catch (ex) {
                    currentSales = "?";
                }
            }

            // Get the RECENT week total
            var weeklySales = this.getRecentWeekTotal();

            //Update the Daily sales and Percentage value based on the category selected
            this.drawDailyValue(currentSales);
            this.percentageDailyValue(categorySelection);
            //Update the Weekly sales and Percentage value based on the category selected
            this.drawWeeklyValue(weeklySales);
            this.percentageWeeklyValue(categorySelection);
        },

        // Get the RECENT week total
        getRecentWeekTotal: function () {
            var weeklyTotal = this.options.weeklyTotal;
            var categorySelection = this.options.categorySelection;
            var recentWeekTotal = 0;

            $.grep(weeklyTotal['recentWeek'], function (e) {
                e['Category'].forEach(function (c) {
                    if (categorySelection === 'ALL') {
                        recentWeekTotal += c['SalesValue'];
                    }
                    if (c['Key'] === categorySelection) {
                        recentWeekTotal += c['SalesValue'];
                    }
                });
            });

            return recentWeekTotal;
        }
    });

    return SalesView;
});

