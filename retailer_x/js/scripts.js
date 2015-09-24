/**
 * Created by ShabeerSheffa on 23/04/2015.
 */

// Initialize the switch filter for the dashboard
$("div[class='panel-heading'], div[class='tab-pane'], .tabs-top").popover({
    placement: "right",
    trigger: "hover",
    selector: 'a[id=dashboard-info]',
});

// Dashboard filter are dynamically loaded, so a delay was required
// to load the styles to the dynamically loaded filter options
setTimeout(function () {
    // Track activity
    $('[id=dashboardFilter]').on('ifChecked', trackActivity);
}, 1500);

