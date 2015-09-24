/**
 * Created by ShabeerSheffa on 27/03/2015.
 */
define(['mocha', 'chai', 'supplierCasesShortedView', 'supplierCasesShortedModel'], function (mocha, chai, SupplierCasesShortedView, SupplierCasesShortedModel) {

    var expect = chai.expect;
    var sales = new SupplierCasesShortedView({model: SupplierCasesShortedModel});
    var model = new SupplierCasesShortedModel();

    describe("SupplierCasesShortedView Chart", function () {

        describe("View", function () {
            it("Provides the 'SupplierCasesShortedView' object", function () {
                expect(sales).to.be.an("object");
            });

            it("Required elements", function () {
                expect(sales['defaults']).to.include.keys("model", "svg", "width", "height");
            });

            it("'SupplierCasesShortedView' svg", function () {
                expect(sales['defaults']['svg']).to.contain('#scd')
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
    });
});


