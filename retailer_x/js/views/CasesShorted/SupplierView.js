define(['jquery', 'underscore', 'backbone', 'casesShortedBase', 'supplierCasesShortedModel'], function ($, _, Backbone, CasesShortedBase, SupplierCasesShortedModel) {

    var SupplierCasesShortedView = CasesShortedBase.extend({
        defaults: _.defaults({
            svg: "#scd", // The element to draw the div on
            model: new SupplierCasesShortedModel(), // Call the SupplierServiceModel instance
            chartData: 'supplierCasesShortedData', // Tell the model the JSON data section
            shortedCases: 'supplierShortedUnits',
            shortedSku: 'supplierShortedFigure',
            customNoDataMsg: 'No Supplier Shorted',

        }, CasesShortedBase.prototype.defaults),
    });

    return SupplierCasesShortedView;
});

