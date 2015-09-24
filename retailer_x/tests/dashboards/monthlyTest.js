/**
 * Created by ShabeerSheffa on 27/03/2015.
 */
define(['mocha', 'chai', 'monthlySalesView', 'monthlySalesModel'], function (mocha, chai, MonthlySalesView, MonthlySalesModel) {

    var expect = chai.expect;
    var sales = new MonthlySalesView({model: MonthlySalesModel});
    var model = new MonthlySalesModel();

    describe("Monthly Sales Chart", function () {

        describe("View", function () {
            it("Provides the 'MonthlySalesView' object", function () {
                expect(sales).to.be.an("object");
            });

            it("Required elements", function () {
                expect(sales['defaults']).to.include.keys("model", "svg", "width", "height");
            });

            it("'ModelView' svg", function () {
                expect(sales['defaults']['svg']).to.contain('#monthlySaleTab')
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
                expect(model['attributes']).to.include.keys("monthlySalesData");
            });

        });

    });
});


