/**
 * Created by ShabeerSheffa on 27/03/2015.
 */
define(['mocha', 'chai', 'depotServiceView', 'depotServiceModel'], function (mocha, chai, DepotServiceView, DepotServiceModel) {

    var expect = chai.expect;
    var sales = new DepotServiceView({model: DepotServiceModel});
    var model = new DepotServiceModel();

    describe("DepotServiceView Chart", function () {

        describe("View", function () {
            it("Provides the 'DepotServiceView' object", function () {
                expect(sales).to.be.an("object");
            });

            it("Required elements", function () {
                expect(sales['defaults']).to.include.keys("model", "svg", "width", "height");
            });

            it("'DepotService' svg", function () {
                expect(sales['defaults']['svg']).to.contain('#depotServiceChart')
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
                expect(model['attributes']).to.include.keys("depotServiceData");
            });
        });
    });
});


