define(['jquery', 'underscore', 'backbone', 'priceChangeModel', 'priceChangeBaseView'], function ($, _, Backbone, PriceChangeModel, PriceChangeBaseView) {

    var PriceChangeView = PriceChangeBaseView.extend({
        defaults: _.defaults({
            svg: "#price_change_chart",
            model: new PriceChangeModel(),
        }, PriceChangeBaseView.prototype.defaults),
    });

    return PriceChangeView;
});

