/**
 * Created by ShabeerSheffa on 27/03/2015.
 */
define(['mocha', 'chai', 'depotCasesShortedView', 'depotCasesShortedModel'], function (mocha, chai, DepotCasesShortedView, DepotCasesShortedModel) {

    var expect = chai.expect;
    var sales = new DepotCasesShortedView({model: DepotCasesShortedModel});
    var model = new DepotCasesShortedModel();

    describe("DepotCasesShortedView Chart", function () {

        describe("View", function () {
            it("Provides the 'DepotCasesShortedView' object", function () {
                expect(sales).to.be.an("object");
            });

            it("Required elements", function () {
                expect(sales['defaults']).to.include.keys("model", "svg", "width", "height");
            });

            it("'DepotCasesShortedView' svg", function () {
                expect(sales['defaults']['svg']).to.contain('#dcs')
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
                expect(model['attributes']).to.include.keys("supplierCasesShortedData", "dailySummaryData");
            });
        });
        console.log(model['attributes'])
    });
});


