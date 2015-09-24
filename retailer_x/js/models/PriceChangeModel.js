define(['underscore', 'backbone', 'd3', 'dashboardConfig'], function(_, Backbone, d3, DashboardConfig) {

	var PriceChangeModel = Backbone.Model.extend({

		defaults : {
			priceChangeData : '',
			priceChangeSummary : '',
		},

		url : DashboardConfig.url,

		initialize : function() {
			// Bind my new functions
			_.bindAll(this, 'priceChangeSort');
		},

		// Get all the JSON data from the url
		parse : function(data) {
			this.set({
				priceChangeSummary : data.DailySummary[0]['data'],
			});
			this.priceChangeSort(data.PriceChange);
		},

		// Sort the latest period data
		priceChangeSort : function(data) {
			if (data.length > 0) {
				data.sort(function(a, b) {
					// Sort the price changes based on the SalesVolume
					return b['SalesVolume'] - a['SalesVolume'];
				})
			}

			this.set({
				priceChangeData : data,
			});
		},
	})

	return PriceChangeModel;
});
