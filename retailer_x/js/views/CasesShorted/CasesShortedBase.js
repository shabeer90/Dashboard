define(['jquery', 'underscore', 'backbone', 'dashboardConfig', 'atheonHorizontalChartBase'], function ($, _, Backbone, DashboardConfig, AtheonHorizontalChartBase) {

    var CasesShortedBase = AtheonHorizontalChartBase.extend({
        // Overrider AtheonHorizontalChartBase
        fetchChartData: function (that) {
            that.options.model.fetch({
                success: function (response, xhr) {
                    switch (that.options.chartData) {
                        case 'supplierCasesShortedData':
                            // set the dailySummary
                            that.options.dailySummary = response.get('dailySummaryData')
                            that.options.categoryShorted = 'SuppCasesShorted';
                            that.casesShortedTileValue(response.get('supplierCasesShortedData'));
                            that.render(response.get('supplierCasesShortedData'));
                            break;
                        case 'depotCasesShortedData':
                            // set the dailySummary
                            that.options.dailySummary = response.get('dailySummaryData');
                            that.options.categoryShorted = 'DepotCasesShorted';
                            that.casesShortedTileValue(response.get('depotCasesShortedData'));
                            that.render(response.get('depotCasesShortedData'));
                            break;
                    }
                },
                error: function (error) {
                    that.networkError();
                },
            });
        },

        // My custom otooltip
        customTooltip: function (key, x, y, e, graph) {
            return '<h5>' + e.point.SKUName + '</h5>' + '<p>' + y + ' case(s)</p>'
        },

        // Update Charts
        updateChart: function () {
            // Get the categorySelection and the data
            var categorySelection = this.options.categorySelection;
            var data = JSON.parse(JSON.stringify(this.options.chartData));
            var chart = this.options.chartObject;
            var updateChart = this.options.chartInstance;

            var indexList = [];

            // If the Category is all, data will be passed as it is to data for the chart to get updated
            if (categorySelection !== 'ALL') {
                for (var x = 0; x < data['values'].length; x++) {
                    if (categorySelection !== data['values'][x]['category']) {
                        var index = data['values'].indexOf(data['values'][x]);
                        // Get the index of the elements from data matching the selected category
                        if (index > -1) {
                            indexList.push(index);
                        }
                    }
                }
            }

            // Travese through the indexList in descending order
            // and remove the non-matched elements from data
            for (var x = indexList.length - 1; x >= 0; x--) {
                data['values'].splice([indexList[x]], 1)
            }

            if (data['values'].length < 1) {
                data['values'].push();
            }

            var height = this.options.defHeight + (data['values'].length * this.options.responsiveHeight ) - this.options.responsiveHeight;

            // Update the tile data values
            this.casesShortedTileValue(data);

            // noDataMsg
            chart.height(height).noData(this.options.noDataMsg);
            updateChart.datum([data]).attr('height', height).transition().duration(500).call(chart);

            nv.utils.windowResize(updateChart.update);
        },

        // Draw the values on the tile
        casesShortedTileValue: function (data) {
            var categorySelection = this.options.categorySelection;
            var shorted = this.options.categoryShorted;
            var casesElement = this.options.shortedSku + '_tile';

            // If a category does not exist, assign "?"
            try {
                var summary = this.options.dailySummary[categorySelection][0][shorted];
            } catch (ex) {
                var summary = "?";
            }

            // Draw the values on the chart header
            var casesShorted = this.getItemsShorted(data);

            // Set the value on the tile
            var trimmedValue = this.trimCasesShortedValue(casesShorted);
            if (summary === "?" || summary === 0) {
                $('[id=' + casesElement + ']').text(summary);
            } else {
                $('[id=' + casesElement + ']').text(trimmedValue);
            }

            casesShorted = casesShorted > 1 ? casesShorted + ' cases' : casesShorted + ' case';

            var sku = summary > 1 ? summary + ' SKUs' : summary + ' SKU';

            // Make chart always visible on function load
            d3.select(this.options.svg).selectAll('g').style('display', 'block');

            var that = this;
            // IF "?" update the casesShorted and sku value
            if (typeof summary === "string") {
                this.drawNoChartMsg(that.options.customNoDataMsg);
                itemShorted = sku = summary;
            } else {
                // Return itemShorted based on its value
                itemShorted = (summary === 0) ? function () {
                    that.drawNoChartMsg('No Cases shorted');
                    return 0;
                }() : function () {
                    return casesShorted;
                }();
            }

            if (summary === "?" || summary === 0) {
                $('[id=' + this.options.shortedCases + ']').text(summary);
            } else {
                $('[id=' + this.options.shortedCases + ']').text(casesShorted);
            }

            $('[id=' + this.options.shortedSku + ']').text(sku);
        },

        // Calculate the items shorted value
        getItemsShorted: function (d) {
            var casesTotal = 0;
            for (var x = 0; x < d['values'].length; x++) {
                casesTotal += d['values'][x]['y'];
            }
            return isNaN(casesTotal) ? 0 : casesTotal;
        },

        trimCasesShortedValue: function (cases) {
            if (cases >= 1000) {
                // cases = Math.floor(cases / 1000) + 'K';
                cases = (cases / 1000).toFixed(1) + 'K';
            }
            return cases;
        },

        // Hide chart when no data is available
        hideChart: function () {
            d3.select(this.options.svg).select('g.nvd3').style('display', 'none');
        },

        // Draw No Data available message on the particular charts
        drawNoChartMsg: function (reason) {
            this.hideChart();
            var svg = this.options.svg;
            setTimeout(function () {
                noData = d3.select(svg).selectAll('.nv-noData')[0].length;

                d3.select(svg).select('g.nvd3').style('display', 'none');
                if (noData < 2) {
                    d3.select(svg).select("text.nv-noData").remove();
                    d3.select(svg).append("text").attr("x", "264.5").attr("y", "25").attr("dy", "-.7em").attr("class", "nvd3 nv-noData").style("text-anchor", "middle").text(reason);
                    setTimeout(function () {
                        d3.select(svg).select('g.nvd3').style('display', 'none');
                    }, 150);
                }
            }, 400);
        },
    });

    return CasesShortedBase;
});

