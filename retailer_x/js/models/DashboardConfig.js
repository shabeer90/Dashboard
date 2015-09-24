define(['jquery'], function ($) {

    var client = window.location.host.split('.')[0];

    // Create an object litereal
    DashboardConfig = {
        url: "/static/clients/" + client + "/" + client + ".json?nocache=" + (new Date()).getTime(),
        // url : "/static/clients/" + client + "/cottbeverages.json?nocache=" + (new Date()).getTime(),
        performanceWidth: 360,
        performanceHeight: 145,
        defaultWidth: 450,
        defaultHeight: 350,
        yMin: 100,
        yMax: 100,
        yMinBuffer: 2,
        defaultColor: "#265DAB",
        defaultGrey: "#C1C1C1",
        defaultRed: "#CB2027",
        performanceTarget: {
            supplier: 97,
            depot: 96,
            availability: 98.8,
        },
    }

    DashboardConfig.sort = (function () {
        function DateSort(data) {
            // Sort the data with oldest date first
            data.sort(function (a, b) {
                date_a = a['Date'].split('/');
                date_b = b['Date'].split('/');

                new_date_a = Date.parse(date_a[2] + "/" + date_a[1] + "/" + date_a[0]).getTime() / 1000;
                new_date_b = Date.parse(date_b[2] + "/" + date_b[1] + "/" + date_b[0]).getTime() / 1000;

                return new_date_a - new_date_b;
            });
            return data;
        }

        function DescValue(data) {
            var new_data = data, sorted_data = data.values;
            sorted_data.sort(function (a, b) {
                return b.y - a.y;
            });
            new_data.values = sorted_data
            return new_data
        }

        function sortLatestData(data) {
            data.sort(function (a, b) {
                date_a = a['Date'].split('/');
                date_b = b['Date'].split('/');

                new_date_a = Date.parse(date_a[2] + "/" + date_a[1] + "/" + date_a[0]).getTime() / 1000;
                new_date_b = Date.parse(date_b[2] + "/" + date_b[1] + "/" + date_b[0]).getTime() / 1000;

                return new_date_a - new_date_b;
            });

            return data;
        }

        return {
            byDate: function (data) {
                return DateSort(data);
            },
            byDescValue: function (data) {
                return DescValue(data);
            },
            latestData: function (data) {
                return sortLatestData(data);
            }
        }
    })();

    /*
     * Convert the dates sent from the server into a unix timestamp.
     * Supplier Service, Depot Service & Product Availability charts X axis takes in an integer,
     * the date sent from the server is string, so we convert it to integer here
     */
    DashboardConfig.date = (function () {
        function constructor(d) {
            var myDate = d.split("/");
            var newDate = myDate[1] + "/" + myDate[0] + "/" + myDate[2];

            return new Date(newDate).getTime();
        }

        return {
            convert: function (d) {
                return constructor(d)
            }
        }
    })();

    /*
     * Calculate the percentage differences and return [difference, css value, and caret symbol]
     */
    DashboardConfig.percentage = (function () {
        function constructor(current, previous) {
            var percentagechange = 0, data = [];

            if (current - previous == 0) {
                percentagechange = 0;
                data.push(percentagechange.toFixed(2), "neutral_figure");
            } else if (current - previous > 0) {
                percentagechange = ((current - previous) / current) * 100;
                data.push(percentagechange.toFixed(2), "positive_figure", "caret-up");
            } else if (current - previous < 0) {
                percentagechange = ((previous - current) / current) * 100;
                data.push(percentagechange.toFixed(2), "negative_figure", "caret-down");
            }
            return data;
        }

        return {
            calculate: function (current, previous) {
                return constructor(current, previous)
            }
        }
    })();

    /*
     * Convert values to Currency
     */
    DashboardConfig.currency = (function () {
        var sign, cents, i, value;

        function constructor(num) {
            // If num is null, assign null to 0
            num = (num === null ) ? 0 : num;

            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num)) {
                num = "0";
            }
            sign = (num == ( num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10) {
                cents = '0' + cents;
            }

            for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            }
            value = (((sign) ? '' : '-') + String.fromCharCode(163) + ' ' + num);
            return value;
        }

        return {
            convert: function (v) {
                return constructor(v);
            },
        }
    })();

    return DashboardConfig;
});
