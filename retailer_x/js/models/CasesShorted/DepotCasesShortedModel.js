define(['underscore', 'backbone', 'd3', 'dashboardConfig'], function(_, Backbone, d3, DashboardConfig) {

	var DepotCasesShortedModel = Backbone.Model.extend({

		defaults : {
			supplierCasesShortedData : 'depotCasesShortedData',
			dailySummaryData : 'depotCasesShortedData',
		},

		url : DashboardConfig.url,

		initialize : function() {
			// Bind my new functions
			_.bindAll(this, 'depotCasesShortedData');

		},

		// Get all the JSON data from the url
		parse : function(data) {
			// Calculate/Create depotCasesShortedData for the chart
			this.depotCasesShortedData(data.DepotCasesShorted);

			// Set the tile value
			this.set({
				dailySummaryData : data.DailySummary[0]['data']
			});
		},

		depotCasesShortedData : function(d) {
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

			// Set the depotCasesShortedData in the DataModel
			this.set({
				depotCasesShortedData : cases
			});
		},
	})

	return DepotCasesShortedModel;
});
