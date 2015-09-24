define(['jquery', 'underscore', 'backbone', 'dashboardConfig', 'casesShortedBase', 'depotCasesShortedModel'], function ($, _, Backbone, DashboardConfig, CasesShortedBase, DepotCasesShortedModel) {

    var DepotCasesShortedView = CasesShortedBase.extend({
        defaults: _.defaults({
            svg: "#dcs",
            // Call the SupplierServiceModel instance
            model: new DepotCasesShortedModel(),
            // Tell the model the JSON data sextion
            chartData: 'depotCasesShortedData',
            //
            shortedCases: 'depotsShortedUnits',
            shortedSku: 'depotsShortedFigure',
            customNoDataMsg: 'No Depot Shorted',

        }, CasesShortedBase.prototype.defaults),
    });

    return DepotCasesShortedView;
});

