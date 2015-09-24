define(['underscore', 'backbone', 'd3', 'dashboardConfig'], function(_, Backbone, d3, DashboardConfig) {

	var MonthlySalesModel = Backbone.Model.extend({

		defaults : {
			monthlySalesData : 'monthlySalesData'
		},

		url : DashboardConfig.url,

		initialize : function() {
			// Bind my new functions
			_.bindAll(this, 'monthlySalesData');
		},

		// Get all the JSON data from the url
		parse : function(data) {
			// Sort the latest period data
			latestData = DashboardConfig.sort.latestData(data.LatestPeriod);

			this.monthlySalesData(latestData);
		},

		// Gather daily sales data
		monthlySalesData : function(data) {
			var that = this;

			// TODO: Move into Base class with Performance model
			// ALL is a default vategory
			var category = ['ALL'];
			var monthlyData = [{
				"values" : [],
				"key" : 'ALL',
			}];
			// TODO: Move into Base class with Performance model
			// Iterate data
			data.forEach(function(e, x) {
				// Iterate the category in data
				e['Category'].forEach(function(c, y) {
					// Returns -1 if the category not foundata.
					if (category.indexOf(c['Key']) < 0) {
						monthlyData.push({
							"values" : [],
							"key" : c['Key'],
						})
					}
					category.push(c['Key']);
				});
			});

			//
			//
			// Iterate data to get Category Sales Value
			data.forEach(function(e, x) {
				date = e['Date'];

				// Iterate availability
				monthlyData.forEach(function(a, y) {
					e['Category'].forEach(function(c, z) {
						if (a['key'] === c['Key']) {
							a['values'].push({
								"x" : DashboardConfig.date.convert(date),
								"y" : c['SalesValue']
							});
						}
					});
				});
			});

			// Iterate data
			data.forEach(function(e, x) {
				date = e['Date'];

				monthlyData.forEach(function(a, y) {
					if (a['key'] === 'ALL') {
						var salesValue = 0;
						e['Category'].forEach(function(c, z) {
							salesValue += c['SalesValue'];
						});
						a['values'].push({
							"x" : DashboardConfig.date.convert(date),
							"y" : salesValue
						});
					}
				});
			});

			// Set the availabilityServiceData in the DataModel
			this.set({
				monthlySalesData : monthlyData
			});
		},
	})

	return MonthlySalesModel;
});
