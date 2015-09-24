define(['underscore', 'backbone'], function (_, Backbone) {

    var PerformanceModel = Backbone.Model.extend({

        initialize: function () {
            // Bind my new functions
            _.bindAll(this, 'getDataCategory', 'calculateDepotLevel', 'calculateServiceLevel', 'calculateAvailabilityLevel');
        },

        getDataCategory: function (data) {
            // ALL is a default vategory
            var category = ['ALL'];
            var performanceLevel = [{
                "values": [],
                "key": 'ALL',
            }];

            // Iterate data
            data.forEach(function (e, x) {
                // Iterate the category in data
                e['Category'].forEach(function (c, y) {
                    // Returns -1 if the category not foundata.
                    if (category.indexOf(c['Key']) < 0) {
                        performanceLevel.push({
                            "values": [],
                            "key": c['Key'],
                        })
                    }
                    category.push(c['Key']);
                });
            });

            return performanceLevel;
        },

        calculateDepotLevel: function (casesSatisfied, casesShorted) {
            var value = ((casesSatisfied / (casesSatisfied + casesShorted) ) * 100).toFixed(1);
            return !isNaN(value) ? value : null;
        },

        calculateServiceLevel: function (SuppCasesMatched, SuppCasesCredited) {
            var value = ((SuppCasesMatched / (SuppCasesMatched + SuppCasesCredited) ) * 100).toFixed(1);
            return !isNaN(value) ? value : null;
        },

        calculateAvailabilityLevel: function (storeStocked, storeRanged) {
            var value = ((storeStocked / storeRanged) * 100).toFixed(1);
            return !isNaN(value) ? value : null;
        },
    })

    return PerformanceModel;
});
