/**
 * Created by ShabeerSheffa on 27/03/2015.
 */
define(['mocha', 'chai', 'priceChangeView', 'priceChangeModel'], function (mocha, chai, PriceChangeView, PriceChangeModel) {

    var expect = chai.expect;
    var sales = new PriceChangeView({model: PriceChangeModel});
    var model = new PriceChangeModel();

    describe("Price Change Table", function () {

        describe("View", function () {
            it("Provides the 'PriceChangeView' object", function () {
                expect(sales).to.be.an("object");
            });

            it("Required elements", function () {
                expect(sales['defaults']).to.include.keys("model", "svg", "width", "height");
            });

            it("'PriceChange' div", function () {
                expect(sales['defaults']['svg']).to.contain('#price_change_chart')
            });
        });

        describe("Model", function () {
            it("Provides the 'Model' object for the view", function () {
                expect(model).to.be.an("object");
            });

            it("Has required url", function () {
                expect(model['url']).to.be.a("string")
            });

            it("Has required chart attributes", function () {
                expect(model['attributes']).to.include.keys("priceChangeData", "priceChangeSummary");
            });
        });

    });
});


