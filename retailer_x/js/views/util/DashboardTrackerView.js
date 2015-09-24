// When the Dashboard right hand side menu is toggled
$(".toggle-right-box div.fa-bars").on("click", trackActivity);

// When the Dashboard performance chart is zoomed in/out
$(".switch-animate span").on("click", trackActivity);

// Other dashboard trackers in:
// 1) sainsburys/js/views/sales/DailySalesView - udateChart()
// 2) sainsburys/js/scripts

function trackActivity() {
    var data = {
        response_type: 'activity'
    };

    $.ajax({
        type: "POST",
        data: data,
        url: "/portal/dashboard/sainsburys/ajax/"
    });
}