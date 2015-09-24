define(['jquery', 'underscore', 'backbone', 'atheonChartBase', 'nvd3', 'dashboardConfig'], function($, _, Backbone, AtheonChartBase, nvd3, DashboardConfig) {

	var AtheonVerticalChartBase = AtheonChartBase.extend({

		// Override defaults values
		defaults : _.defaults({
			width : DashboardConfig.defaultWidth + 25,
			height : DashboardConfig.defaultHeight - 100,

		}, AtheonChartBase.prototype.defaults),

		render : function(data) {
			var that = this;
			var width = this.options.width, height = this.options.height, color = this.options.color;

			nv.addGraph(function() {
				that.options.chartObject = nv.models.multiBarChart()
					//.width(width)
					.height(height).margin({
					top : 30,
					right : 20,
					bottom : 30,
					left : 70
				}).tooltipContent(function(key, y, e, graph) {
					return '<h5>' + key + '</h5>' + '<p>' + e + ' on ' + y + '</p>'
				}).showLegend(false).color([color]).showControls(false).reduceXTicks(false);

				that.options.chartObject.xAxis.tickFormat(function(d) {
					return d3.time.format('%d/%m')(new Date(d));
				});
				
				// Set the chart xAxis tickValues
				that.options.chartObject.xAxis.tickValues(function(d) {
					return that.getTickValues(d);
				});
				
				// Override to change Axis
				that.tickFormatRender(that.options.chartObject);

				that.options.chartInstance = d3.select(that.options.svg + ' svg').datum(data);

				that.options.chartInstance.transition()
					//.attr('width', width)
					.attr('height', height).call(that.options.chartObject);

				nv.utils.windowResize(that.options.chartObject.update);

				return that.options.chartObject;
			});
		},
		
		// Get the tick values for the chart
		getTickValues : function(data) {
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
		
		// Format the point on the xAxis
		tickFormatRender : function(chart) {
			chart.yAxis.tickFormat(d3.format(',.1d'));
		},
	});

	return AtheonVerticalChartBase;
});
