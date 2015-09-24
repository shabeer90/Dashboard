define(['jquery', 'underscore', 'backbone', 'atheonChartBase', 'dataTables'], function ($, _, Backbone, AtheonChartBase, dataTables) {

    var PriceChangeBaseView = AtheonChartBase.extend({

        defaults: _.defaults({
            priceChangeData: '',
            priceChangeSummary: '',
        }, AtheonChartBase.prototype.defaults),

        fetchChartData: function (that) {
            that.options.model.fetch({
                success: function (response, xhr) {
                    that.options.priceChangeSummary = response.get('priceChangeSummary')
                    that.options.chartData = response.get('priceChangeData')
                    //that.setTableRow();
                    that.drawDataTable();
                },
                error: function (error) {
                    that.networkError();
                },
            });
        },

        setTableRow: function () {
            var that = this;
            var categorySelection = this.options.categorySelection;

            if (categorySelection === 'ALL') {
                that.priceTable.fnFilter('');
            } else {
                that.priceTable.fnFilter(categorySelection);
            }

            this.drawTileValue();
        },

        drawDataTable: function () {
            var that = this;
            var data = JSON.parse(JSON.stringify(this.options.chartData));
            var dataSet = that.cleanDataforTable(data);

            // THe summary tile value
            this.drawTileValue();

            // Apply data for DataTables
            this.priceTable = $('#price-change-tbl').dataTable({
                "aaData": dataSet,
                "columns": [
                    {"title": "Category"},
                    {"title": "SKUname"},
                    {"title": "Item"},
                    {"title": "Previous Price"},
                    {"title": "New Price"},
                    {"title": "% Change"}
                ]
            });
        },

        cleanDataforTable: function (dataFilter) {
            var arrow_down = 'class="fa fa-caret-down negative_figure"', arrow_up = 'class="fa fa-caret-up positive_figure"';
            var dataSet = []

            if (dataFilter.length > 0) {
                dataFilter.map(function (data) {
                    var arrow = data['PercentDiff'] < 0 ? arrow_down : arrow_up;
                    var skuname = data['SKUName'].replace("'", "&#39;");
                    dataSet.push([data['category'], skuname, data['x'], data['yday'], data['today'], '<i ' + arrow + '></i> ' + data['PercentDiff']])
                });
            }
            return dataSet;
        },

        drawTileValue: function () {
            try {
                var summaryValue = this.options.priceChangeSummary[this.options.categorySelection][0]['ItemPriceChanged'];
            } catch (ex) {
                var summaryValue = "?";
            }

            if (summaryValue === "?") {
                this.drawNoPriceChangeRow('No Sales Data');
            } else {
                if (summaryValue === 0) {
                    this.drawNoPriceChangeRow('No Price Changes');
                }
                summaryValue = summaryValue > 1 ? summaryValue + ' SKUs' : summaryValue + ' SKU';
            }
            $('[id=priceChangeFigure]').text(summaryValue);
        },

        // Update Charts
        updateChart: function () {
            this.setTableRow();
        },

        drawNoPriceChangeRow: function (reason) {
            $(this.options.svg + ' tbody ').append("<tr><td colspan='4'> " + reason + " </td></tr>");
        }
    });

    return PriceChangeBaseView;
});
