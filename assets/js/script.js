'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function() {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function(elements, eventType, callback) {
    for (let i = 0, len = elements.length; i < len; i++) {
        elements[i].addEventListener(eventType, callback);
    }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function() {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function() {
    const isScrollBottom = lastScrollPos < window.scrollY;
    if (isScrollBottom) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function() {
    if (window.scrollY >= 50) {
        header.classList.add("active");
        backTopBtn.classList.add("active");
        hideHeader();
    } else {
        header.classList.remove("active");
        backTopBtn.classList.remove("active");
    }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function() {
    lastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function() {
    if (currentSlidePos >= heroSliderItems.length - 1) {
        currentSlidePos = 0;
    } else {
        currentSlidePos++;
    }

    updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function() {
    if (currentSlidePos <= 0) {
        currentSlidePos = heroSliderItems.length - 1;
    } else {
        currentSlidePos--;
    }

    updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function() {
    autoSlideInterval = setInterval(function() {
        slideNext();
    }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function() {
    clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function(event) {

    x = (event.clientX / window.innerWidth * 10) - 5;
    y = (event.clientY / window.innerHeight * 10) - 5;

    // reverse the number eg. 20 -> -20, -5 -> 5
    x = x - (x * 2);
    y = y - (y * 2);

    for (let i = 0, len = parallaxItems.length; i < len; i++) {
        x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
        y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
        parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
    }

});



// Handle form submission 
$(document).ready(function() {
    $("#reservationForm").submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Serialize form data
        var formData = $(this).serialize();

        // Send an AJAX request to the server
        $.ajax({
            type: "POST",
            url: "/submit_form",
            data: formData,
            success: function(response) {

                if (response["status"] === "success") {
                    // Update the "Book a Table" button text and color
                    $("#bookTableButton").text("you booked a table");


                    // Display the "Book a Table" button
                    $("#bookTableButton").show();
                };
                if (response["status"] === "emptyField") {

                    $("#bookTableButton").text("Please fill out all required fields. ");
                    $("#bookTableButton").css("backgroundColor", "rgb(100, 27, 27)")
                    $("#bookTableButton").css("color", "var(--smoky-black-2)")
                        // Enable the button
                    $("#bookTableButton").prop("disabled", false);




                    $("#bookTableButton").show();

                };

            },

            error: function() {
                // Update the "Book a Table" button text and color for error
                $("#bookTableButton").text("Error submitting reservation!");
                $("#bookTableButton").css("background-color", "red");
            }
        });
    });

    $("#emailSubscriptionForm").submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Serialize form data
        var formData = $(this).serialize();

        // Send an AJAX request to the server
        $.ajax({
            type: "POST",
            url: "/submit_formEmail",
            data: formData,
            success: function(response) {
                // Handle server response
                if (response.status === "success") {
                    // Display success message
                    $("#feedbackMessage").text("Subscribed Successfully!").css("color", "green");
                    $(".btn.btn-secondary").css("display", "none");
                    // Display the "Book a Table" button
                    $("#feedbackMessage").show();
                } else if (response.status === "emptyField") {
                    // Display empty field message
                    $("#feedbackMessage").text("Please fill out the email field.").css("color", "red");
                } else {
                    // Display generic error message
                    $("#feedbackMessage").text("Error submitting subscription.").css("color", "red");
                }
            },
            error: function() {
                // Display generic error message for AJAX failure
                $("#feedbackMessage").text("Error submitting subscription.").css("color", "red");
            }
        });
    });

});