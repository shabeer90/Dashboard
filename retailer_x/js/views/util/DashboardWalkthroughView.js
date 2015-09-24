
Walkthrough = {};
Walkthrough.run = (function () {
    function constructor() {
        var data = {
            response_type: 'walkthrough'
        };

        $.ajax({
            type: "POST",
            data: data,
            url: "/portal/dashboard/sainsburys/ajax/"
        });
    }

    return {
        set: function () {
            return constructor();
        }
    }

})();

// Instance the tour
var tour = new Tour({
    steps: [
        {
            element: "#dashboard-sainsburys",
            title: "Menu",
            content: "This indicates which page you are currently viewing.",
            placement: "right"
        },
        {
            element: "#dashboard-build-date",
            title: "What day is this data for?",
            content: "This heading shows you which day the data in the tiles relates to",
            placement: "bottom"
        },
        {
            element: ".dash-summary",
            title: "Daily KPI tiles",
            content: "These are your headlines for the day",
            placement: "bottom"
        },
        {
            element: ".dashboard-performance-history",
            title: "Short-term performance history",
            content: "Displays supplier & depot performance over the last 28 days as well as product availability levels",
            placement: "left"
        },
        {
            element: ".custom-popover",
            title: "Filter Options",
            content: "Want to see your data by category? Click here to reveal your filter options.",
            placement: "left"
        },
        {
            element: "#user-dropdown-menu",
            title: "Further options",
            content: "Click here to access pages where you can unsubscribe to the email alerts, change your password and much more",
            placement: "bottom"
        },
        {
            element: "#basket-page",
            title: "Basket Page",
            content: "Visit this page to confirm your payment details, choose upgrades, and more.",
            placement: "bottom"
        },
    ],
    backdrop: true,
    backdropContainer: 'body',
    template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-primary' data-role='prev'>« Prev</button> <button class='btn btn-primary' data-role='next'>Next »</button></div><button class='btn btn-primary col-md-12' data-role='end'>End tour</button></nav></div>",
});


function startWalkthrough() {
    $('#walkthough-modal').modal('hide');
    // Initialize the tour
    tour.init();
    console.log(tour);
    tour.restart();

    Walkthrough.run.set();
}



