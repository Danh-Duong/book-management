(function ($) {
    "use strict";




    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, { offset: '80%' });





    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
        nav: false
    });


    // Worldwide Sales Chart
    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["cat1", "cat2", "cat3", "cat4", "cat5"],
            datasets: [{
                label: "book",
                data: [15, 30, 55, 65, 60, 80, 95],
                backgroundColor: "rgba(0, 156, 255, .7)"
            }
            ]
        },
        options: {
            responsive: true
        }
    });

    // Doughnut Chart
    var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: ["cat1", "cat2", "cat3", "cat4", "cat5"],
            datasets: [{
                backgroundColor: [
                    "rgba(250, 183, 82)",
                    "rgba(132, 177, 217, 1)",
                    "rgba(242, 179, 185)",
                    "rgba(250, 202, 166)",
                    "rgba(250, 126, 82)"
                ],

                data: [55, 49, 44, 24, 15]
            }]
        },
        options: {
            responsive: true
        }
    });

















})(jQuery);

