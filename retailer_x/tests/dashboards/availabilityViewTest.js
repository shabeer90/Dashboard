/**
 * Created by ShabeerSheffa on 27/03/2015.
 */
define(['mocha', 'chai', 'availabilityView', 'availabilityModel'], function (mocha, chai, AvailabilityView, AvailabilityModel) {

    var expect = chai.expect;
    var sales = new AvailabilityView({model: AvailabilityModel});
    var model = new AvailabilityModel();

    describe("In-store Availability Chart", function () {

        describe("View", function () {
            it("Provides the 'PriceChangeView' object", function () {
                expect(sales).to.be.an("object");
            });

            it("Required elements", function () {
                expect(sales['defaults']).to.include.keys("model", "svg", "width", "height");
            });

            it("'SalesView' svg", function () {
                expect(sales['defaults']['svg']).to.contain('#productAvailabilityChart')
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
                expect(model['attributes']).to.include.keys("availabilityServiceData");
            });
        });
    });
});


