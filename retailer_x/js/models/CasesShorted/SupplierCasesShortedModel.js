define(['underscore', 'backbone', 'd3', 'dashboardConfig'], function(_, Backbone, d3, DashboardConfig) {

	var SupplierCasesShortedModel = Backbone.Model.extend({

		defaults : {
			supplierCasesShortedData : 'supplierCasesShortedData',
			dailySummaryData : 'supplierCasesShortedData',
		},

		url : DashboardConfig.url,

		initialize : function() {
			// Bind my new functions
			_.bindAll(this, 'supplierCasesShortedData');
		},

		// Get all the JSON data from the url
		parse : function(data) {
			// Calculate/Create supplierCasesShortedData for the chart
			this.supplierCasesShortedData(data.SupplierCasesShorted);

			// Set the tile value
			this.set({
				dailySummaryData : data.DailySummary[0]['data']
			});
		},

		supplierCasesShortedData : function(d) {
			var cases = {
				"values" : []
			};

			for (var x = 0; x < d.length; x++) {
				if (d[x]['y'] != null) {
					if (d[x]['y'] > 0) {
						cases['values'].push(d[x]);
					}
				}
			}

			// Sort the data
			cases = DashboardConfig.sort.byDescValue(cases);

			// Set the supplierCasesShortedData in the DataModel
			this.set({
				supplierCasesShortedData : cases
			});
		},
	})

	return SupplierCasesShortedModel;
});
