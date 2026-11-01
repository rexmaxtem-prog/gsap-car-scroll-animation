// Main JavaScript file for website interactivity
// This script handles various UI components including navigation, sliders, animations, and form submissions
// Dependencies: jQuery, Swiper, WOW, Magnific Popup, Isotope, CounterUp, GSAP, SplitText, Lenis

(function ($) {
    "use strict";

    // =========================================================================
    // Smooth Scrolling Functionality
    // =========================================================================
    // Handles smooth scrolling for anchor links with a specified selector
    // Used for one-page navigation and scroll-down links
    function enableSmoothScroll(selector) {
        // Check if elements with the given selector exist
        if ($(selector).length > 0) {
            // Iterate through each anchor tag within the selector
            $(selector).find("a").each(function () {
                // Bind click event to each anchor
                $(this).on("click", function (event) {
                    // Get the href attribute
                    const href = this.getAttribute("href");
                    // Check if href exists, is not empty, and starts with '#'
                    if (href && href !== "#" && href.startsWith("#")) {
                        // Get the target element from the href attribute
                        const target = $(href);
                        // Verify target exists before proceeding
                        if (target.length) {
                            event.preventDefault();
                            // Animate scrolling to the target's top position with a 10px offset
                            $("html, body").stop().animate({
                                scrollTop: target.offset().top - 10
                            }, 1000); // 1000ms animation duration
                        }
                    }
                });
            });
        }
    }

    // =========================================================================
    // Animation Application
    // =========================================================================
    // Applies CSS animations and delays to elements with data-ani and data-ani-delay attributes
    function applyAnimations() {
        // Add animation classes to elements with data-ani attribute
        $("[data-ani]").each(function () {
            const animationClass = $(this).data("ani");
            $(this).addClass(animationClass);
        });

        // Apply animation delays to elements with data-ani-delay attribute
        $("[data-ani-delay]").each(function () {
            const delay = $(this).data("ani-delay");
            $(this).css("animation-delay", delay);
        });
    }

    // =========================================================================
    // Mobile Menu Plugin
    // =========================================================================
    // Custom jQuery plugin for mobile menu functionality
    $.fn.thMobileMenu = function (options) {
        // Default settings for the mobile menu
        const settings = $.extend({
            menuToggleBtn: ".th-menu-toggle", // Button to toggle menu
            bodyToggleClass: "th-body-visible", // Class for body when menu is open
            subMenuClass: "th-submenu", // Class for submenus
            subMenuParent: "menu-item-has-children", // Class for parent menu items
            thSubMenuParent: "th-item-has-children", // Additional class for parent items
            subMenuParentToggle: "th-active", // Class for toggled parent
            meanExpandClass: "th-mean-expand", // Class for expand icon
            subMenuToggleClass: "th-open", // Class for open submenu
            toggleSpeed: 400 // Animation speed for submenu toggle
        }, options);

        return this.each(function () {
            const $menu = $(this);

            // Toggle menu visibility and reset submenus
            function toggleMenu() {
                $menu.toggleClass(settings.bodyToggleClass);
                const subMenus = `.${settings.subMenuClass}`;
                $(subMenus).each(function () {
                    if ($(this).hasClass(settings.subMenuToggleClass)) {
                        $(this).removeClass(settings.subMenuToggleClass)
                            .css("display", "none")
                            .parent().removeClass(settings.subMenuParentToggle);
                    }
                });
            }

            // Setup submenu structure
            $menu.find(`.${settings.subMenuParent}`).each(function () {
                const $submenu = $(this).find("ul");
                $submenu.addClass(settings.subMenuClass)
                    .css("display", "none");
                $(this).addClass(settings.subMenuParent)
                    .addClass(settings.thSubMenuParent)
                    .children("a").append(settings.appendElement || "");
            });

            // Handle submenu toggle on click
            const parentLinks = `.${settings.thSubMenuParent} > a`;
            $(parentLinks).each(function () {
                $(this).on("click", function (event) {
                    event.preventDefault();
                    const $parent = $(this).parent();
                    const $submenu = $parent.children("ul");
                    if ($submenu.length) {
                        $parent.toggleClass(settings.subMenuParentToggle);
                        $submenu.slideToggle(settings.toggleSpeed)
                            .toggleClass(settings.subMenuToggleClass);
                    }
                });
            });

            // Handle menu toggle button click
            $(settings.menuToggleBtn).each(function () {
                $(this).on("click", toggleMenu);
            });

            // Prevent menu from closing when clicking inside
            $menu.on("click", function (event) {
                event.stopPropagation();
                toggleMenu();
            });

            // Prevent submenu propagation
            $menu.find("div").on("click", function (event) {
                event.stopPropagation();
            });
        });
    };

    // =========================================================================
    // Window Load Handler
    // =========================================================================
    // Handle page load events (preloader and WOW animations)
    $(window).on("load", function () {
        // Fade out preloader
        $(".preloader").fadeOut();
        // Initialize WOW animations
        new WOW().init();
    });

    // =========================================================================
    // Preloader Close Button
    // =========================================================================
    // Allow manual closing of preloader
    $(document).on("click", ".preloaderCls", function (event) {
        event.preventDefault();
        $(".preloader").css("display", "none");
    });

    // =========================================================================
    // Nice Select Initialization
    // =========================================================================
    // Initialize niceSelect plugin for select elements
    if ($(".nice-select").length) {
        $(".nice-select").niceSelect();
    }

    // =========================================================================
    // Sticky Header and Category Menu
    // =========================================================================
    // Handle sticky header and category menu on scroll
    $(window).scroll(function () {
        const scrollPosition = $(this).scrollTop();
        const $stickyWrapper = $(".sticky-wrapper");
        const $categoryMenu = $(".category-menu");

        if (scrollPosition > 500) {
            $stickyWrapper.addClass("sticky");
            $categoryMenu.addClass("close-category");
        } else {
            $stickyWrapper.removeClass("sticky");
            $categoryMenu.removeClass("close-category");
        }
    });

    // =========================================================================
    // Category Menu Toggle
    // =========================================================================
    // Toggle category menu visibility
    $(".menu-expand").each(function () {
        $(this).on("click", function (event) {
            event.preventDefault();
            $(".category-menu").toggleClass("open-category");
        });
    });

    // =========================================================================
    // Scroll to Top Button
    // =========================================================================
    // Initialize scroll-to-top button with progress animation
    $(document).ready(function () {
        if ($(".scroll-top").length > 0) {
            const $scrollTop = $(".scroll-top")[0];
            const $path = $(".scroll-top path")[0];
            const pathLength = $path.getTotalLength();

            // Initialize SVG path for scroll progress
            $path.style.transition = $path.style.WebkitTransition = "none";
            $path.style.strokeDasharray = `${pathLength} ${pathLength}`;
            $path.style.strokeDashoffset = pathLength;
            $path.getBoundingClientRect();
            $path.style.transition = $path.style.WebkitTransition = "stroke-dashoffset 10ms linear";

            // Update scroll progress indicator
            function updateScrollProgress() {
                const scrollTop = $(window).scrollTop();
                const docHeight = $(document).height() - $(window).height();
                const offset = pathLength - (scrollTop * pathLength / docHeight);
                $path.style.strokeDashoffset = offset;
            }

            updateScrollProgress();
            $(window).on("scroll", updateScrollProgress);

            // Show/hide scroll-to-top button based on scroll position
            $(window).on("scroll", function () {
                $(this).scrollTop() > 50 ? $($scrollTop).addClass("show") : $($scrollTop).removeClass("show");
            });

            // Scroll to top on click
            $($scrollTop).on("click", function (event) {
                event.preventDefault();
                $("html, body").animate({ scrollTop: 0 }, 750);
                return false;
            });
        }
    });

    // =========================================================================
    // Background Styling
    // =========================================================================
    // Apply background images from data attributes
    $("[data-bg-src]").each(function () {
        const src = $(this).attr("data-bg-src");
        $(this).css("background-image", `url(${src})`)
            .removeAttr("data-bg-src")
            .addClass("background-image");
    });

    // Apply background colors from data attributes
    $("[data-bg-color]").each(function () {
        const color = $(this).attr("data-bg-color");
        $(this).css("background-color", color)
            .removeAttr("data-bg-color");
    });

    // Apply border colors from data attributes
    $("[data-border]").each(function () {
        const borderColor = $(this).data("border");
        $(this).css("--th-border-color", borderColor);
    });

    // Apply mask images from data attributes
    $("[data-mask-src]").each(function () {
        const src = $(this).attr("data-mask-src");
        $(this).css({
            "mask-image": `url(${src})`,
            "-webkit-mask-image": `url(${src})`
        }).addClass("bg-mask")
            .removeAttr("data-mask-src");
    });

    // =========================================================================
    // Slider Initialization
    // =========================================================================
    // Initialize Swiper sliders with custom options
    $(".th-slider").each(function () {
        const $slider = $(this);
        const options = $slider.data("slider-options") || {};
        const $prev = $slider.find(".slider-prev");
        const $next = $slider.find(".slider-next");
        const $pagiNumber = $slider.find(".slider-pagination.pagi-number");
        const $pagination = $slider.siblings(".slider-controller").find(".slider-pagination").length
            ? $slider.siblings(".slider-controller").find(".slider-pagination").get(0)
            : $slider.find(".slider-pagination").get(0);

        const defaultOptions = {
            slidesPerView: 1,
            spaceBetween: options.spaceBetween || 24,
            loop: options.loop !== false,
            speed: options.speed || 1000,
            autoplay: options.autoplay || {
                delay: 6000,
                disableOnInteraction: false
            },
            navigation: {
                nextEl: $next.get(0),
                prevEl: $prev.get(0)
            },
            pagination: {
                el: $pagination,
                type: options.paginationType || "bullets",
                clickable: true,
                renderBullet: function (index, className) {
                    const number = index + 1;
                    const formattedNumber = number < 10 ? `0${number}` : number;
                    return $pagiNumber.length
                        ? `<span class="${className} number">${formattedNumber}</span>`
                        : `<span class="${className}" aria-label="Go to Slide ${formattedNumber}"></span>`;
                },
                formatFractionCurrent: function (number) {
                    return number < 10 ? `0${number}` : number;
                },
                formatFractionTotal: function (number) {
                    return number < 10 ? `0${number}` : number;
                }
            },
            on: {
                slideChange: function () {
                    setTimeout(() => {
                        this.params.mousewheel.releaseOnEdges = false;
                    }, 500);
                },
                reachEnd: function () {
                    setTimeout(() => {
                        this.params.mousewheel.releaseOnEdges = true;
                    }, 750);
                }
            }
        };

        const swiperOptions = $.extend({}, defaultOptions, JSON.parse($slider.attr("data-slider-options") || "{}"));
        const swiper = new Swiper($slider.get(0), swiperOptions);

        // Add arrow wrap class to slider container
        if ($(".slider-area").length) {
            $(".slider-area").closest(".container").parent().addClass("arrow-wrap");
        }

        // Handle category slider animations
        if ($slider.hasClass("categorySlider")) {
            const transformSettings = {
                translate: 0.1,
                rotate: 0.008
            };

            function animateCategorySlider() {
                requestAnimationFrame(animateCategorySlider);
                document.querySelectorAll(".single").forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const centerX = window.innerWidth * 0.5 - (rect.x + rect.width * 0.5);
                    let translateY = Math.abs(centerX) * transformSettings.translate - rect.width * transformSettings.translate;
                    translateY = translateY < 0 ? 0 : translateY;
                    const transformOrigin = centerX < 0 ? "left top" : "right top";
                    el.style.transform = `translate(0, ${translateY}px) rotate(${-centerX * transformSettings.rotate}deg)`;
                    el.style.transformOrigin = transformOrigin;
                });
            }

            animateCategorySlider();
        }
    });

    // =========================================================================
    // Hero Sliders Initialization
    // =========================================================================
    // Initialize hero thumbs slider
    const heroThumbs = new Swiper(".heroThumbs", {
        spaceBetween: 10,
        slidesPerView: 1,
        loop: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        navigation: {
            nextEl: ".slider-next",
            prevEl: ".slider-prev"
        }
    });

    // Initialize hero slider 2
    new Swiper(".hero-slider-2", {
        spaceBetween: 10,
        thumbs: { swiper: heroThumbs },
        effect: "fade",
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        loop: true,
        watchSlidesProgress: true
    });

    // Initialize hero slider 3
    const hero3Thumbs = new Swiper(".hero3Thumbs", {
        spaceBetween: 10,
        slidesPerView: 1,
        freeMode: true,
        watchSlidesProgress: true
    });

    new Swiper(".hero-slider-3", {
        thumbs: { swiper: hero3Thumbs },
        loop: true,
        effect: "fade",
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
            formatFractionCurrent: function (number) { return `0${number}`.slice(-2); }
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });

    // Initialize hero slider 6
    const hero6Thumbs = new Swiper(".hero6Thumbs", {
        spaceBetween: 3,
        slidesPerView: 1,
        freeMode: true,
        watchSlidesProgress: true
    });

    new Swiper(".hero-slider-6", {
        thumbs: { swiper: hero6Thumbs },
        loop: true,
        effect: "fade",
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
            formatFractionCurrent: function (number) { return `0${number}`.slice(-2); }
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });

    // Initialize hero slider 9
    const hero9Thumbs = new Swiper(".hero9Thumbs", {
        spaceBetween: 10,
        slidesPerView: 1,
        freeMode: true,
        watchSlidesProgress: true
    });

    new Swiper(".hero-slider-9", {
        thumbs: { swiper: hero9Thumbs },
        loop: true,
        effect: "fade",
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination",
            type: "fraction",
            formatFractionCurrent: function (number) { return `0${number}`.slice(-2); }
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        }
    });

    // Initialize hero slider 10
    const hero10Thumbs = new Swiper(".hero10Thumbs", {
        spaceBetween: 10,
        slidesPerView: 3,
        freeMode: true,
        watchSlidesProgress: true
    });

    new Swiper(".hero-slider-10", {
        spaceBetween: 10,
        thumbs: { swiper: hero10Thumbs },
        effect: "fade",
        pagination: {
            el: ".swiper-pagination",
            type: "fraction"
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        loop: true,
        watchSlidesProgress: true
    });

    // =========================================================================
    // Slider Interactions
    // =========================================================================
    // Pause/resume sliders on mouse hover
    document.addEventListener("mouseenter", function (event) {
        const target = event.target;
        if (target && target.matches && target.matches(".swiper-container")) {
            target.swiper.autoplay.stop();
            target.classList.add("swiper-paused");
            const activeBullet = target.querySelector(".swiper-pagination-bullet-active");
            if (activeBullet) {
                activeBullet.style.animationPlayState = "paused";
            }
        }
    }, true);

    document.addEventListener("mouseleave", function (event) {
        const target = event.target;
        if (target && target.matches && target.matches(".swiper-container")) {
            target.swiper.autoplay.start();
            target垂classList.remove("swiper-paused");
            const activeBullet = target.querySelector(".swiper-pagination-bullet-active");
            if (activeBullet) {
                activeBullet.classList.remove("swiper-pagination-bullet-active");
                setTimeout(() => {
                    activeBullet.classList.add("swiper-pagination-bullet-active");
                }, 10);
            }
        }
    }, true);

    // Handle manual slider navigation
    $(document).on("click", "[data-slider-prev], [data-slider-next]", function () {
        const targetSelector = $(this).data("slider-prev") || $(this).data("slider-next");
        const $target = $(targetSelector);
        if ($target.length) {
            const swiper = $target[0].swiper;
            if (swiper) {
                $(this).data("slider-prev") ? swiper.slidePrev() : swiper.slideNext();
            }
        }
    });

    // =========================================================================
    // Service and Accordion Interactions
    // =========================================================================
    // Handle service list and accordion interactions
    $(document).ready(function () {
        // Toggle active class for service list items
        $(document).on("click", ".service-list-wrap", function () {
            $(this).addClass("active").siblings().removeClass("active");
        });

        // Initialize accordion
        $(".accordion-item-wrapp li:first-child").addClass("active");
        $(".according-img-tab").hide();
        $(".according-img-tab:first").show();

        // Handle accordion hover
        $(document).on("mouseenter", ".accordion-item-wrapp .accordion-item-content", function () {
            $(".accordion-item-wrapp .accordion-item-content").removeClass("active");
            $(".according-img-tab").hide();
            const target = $(this).find(".accordion-tab-item").attr("data-bs-target");
            $(target).fadeIn();
            return false;
        });

        // Handle hover effects for service items
        $(document).on("mouseover", ".hover-item", function () {
            $(".hover-item").removeClass("item-active");
            $(this).addClass("item-active");
            const index = $(this).index(".hover-item");
            $(".service-card-thumb").removeClass("active").eq(index).addClass("active");
        });

        // Handle hover effects for process items
        $(document).on("mouseover", ".hover-item2", function () {
            $(".hover-item2").removeClass("item-active2");
            $(this).addClass("item-active2");
            const index = $(this).index(".hover-item2");
            $(".process-box-img").removeClass("active-img").eq(index).addClass("active-img");
        });
    });

    // =========================================================================
    // Slider Thumbs Plugin
    // =========================================================================
    // Custom plugin for slider thumbnails
    $.fn.activateSliderThumbs = function (options) {
        const settings = $.extend({
            sliderTab: false,
            tabButton: ".tab-btn"
        }, options);

        return this.each(function () {
            const $container = $(this);
            const $buttons = $container.find(settings.tabButton);
            const $indicator = $('<span class="indicator"></span>').appendTo($container);
            const sliderId = $container.data("slider-tab");
            const swiper = $(sliderId)[0].swiper;

            // Handle tab button clicks
            $(document).on("click", settings.tabButton, function (event) {
                event.preventDefault();
                const $button = $(this);
                $button.addClass("active").siblings().removeClass("active");
                updateIndicator($button);
                $button.prevAll(settings.tabButton).addClass("list-active");
                $button.nextAll(settings.tabButton).removeClass("list-active");
                if (settings.sliderTab) {
                    swiper.slideTo($button.index());
                }
            });

            // Sync tabs with slider
            if (settings.sliderTab) {
                swiper.on("slideChange", function () {
                    const index = this.realIndex;
                    const $button = $buttons.eq(index);
                    $button.addClass("active").siblings().removeClass("active");
                    updateIndicator($button);
                    $button.prevAll(settings.tabButton).addClass("list-active");
                    $button.nextAll(settings.tabButton).removeClass("list-active");
                });

                const activeIndex = swiper.activeIndex;
                const $activeButton = $buttons.eq(activeIndex);
                $activeButton.addClass("active").siblings().removeClass("active");
                updateIndicator($activeButton);
                $activeButton.prevAll(settings.tabButton).addClass("list-active");
                $activeButton.nextAll(settings.tabButton).removeClass("list-active");
            }

            // Update indicator position
            function updateIndicator($button) {
                const pos = $button.position();
                const marginTop = parseInt($button.css("margin-top")) || 0;
                const marginLeft = parseInt($button.css("margin-left")) || 0;
                $indicator.css({
                    "--height-set": `${$button.outerHeight()}px`,
                    "--width-set": `${$button.outerWidth()}px`,
                    "--pos-y": `${pos.top + marginTop}px`,
                    "--pos-x": `${pos.left + marginLeft}px`
                });
            }
        });
    };

    // Initialize slider thumbs for various components
    $(".product-thumb, .team-thumb, .testi-thumb, .testi-thumb2").activateSliderThumbs({
        sliderTab: true,
        tabButton: ".tab-btn"
    });

    // =========================================================================
    // Isotope Grid Initialization
    // =========================================================================
    // Initialize isotope for grid layouts
    $(".grid").isotope({
        itemSelector: ".grid-item",
        percentPosition: true,
        masonry: { columnWidth: ".grid-item" }
    });

    // Handle case menu filtering
    $(".case-menu").on("click", "button", function () {
        const filter = $(this).attr("data-filter");
        $(".grid").isotope({ filter });
    });

    // Handle portfolio menu active state
    $(".portfolio-menu button").on("click", function (event) {
        event.preventDefault();
        $(this).addClass("active").siblings().removeClass("active");
    });

    // Initialize isotope for filter-active elements
    $(".filter-active").imagesLoaded(function () {
        const $grid = $(".filter-active");
        if ($grid.length) {
            const isotope = $grid.isotope({
                itemSelector: ".filter-item",
                filter: "*",
                masonry: { columnWidth: 1 }
            });

            $(".filter-menu-active").on("click", "button", function (event) {
                event.preventDefault();
                const filter = $(this).attr("data-filter");
                isotope.isotope({ filter });
                $(this).addClass("active").siblings().removeClass("active");
            });
        }
    });

    // Initialize isotope for masonry layouts
    $(".masonary-active, .woocommerce-Reviews .comment-list").imagesLoaded(function () {
        const $grid = $(".masonary-active, .woocommerce-Reviews .comment-list");
        if ($grid.length) {
            $grid.isotope({
                itemSelector: ".filter-item, .woocommerce-Reviews .comment-list li",
                filter: "*",
                masonry: { columnWidth: 1 }
            });

            $('[data-bs-toggle="tab"]').on("shown.bs.tab", function () {
                $grid.isotope({ filter: "*" });
            });
        }
    });

    // =========================================================================
    // Form Handling
    // =========================================================================
    // Handle AJAX contact form submission
    const $contactForm = $(".ajax-contact");
    const invalidClass = "is-invalid";
    const requiredFields = '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]';
    const $emailField = '[name="email"]';
    const $formMessages = $(".form-messages");

    function submitContactForm() {
        const formData = $contactForm.serialize();
        let isValid = true;

        // Validate form fields
        function validateFields() {
            $(requiredFields).each(function () {
                const $field = $(this);
                $field.val() ? $field.removeClass(invalidClass) : $field.addClass(invalidClass);
                isValid = $field.val() ? isValid : false;
            });

            const email = $($emailField).val();
            if (email && email.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
                $($emailField).removeClass(invalidClass);
            } else {
                $($emailField).addClass(invalidClass);
                isValid = false;
            }
            return isValid;
        }

        if (validateFields()) {
            $.ajax({
                url: $contactForm.attr("action"),
                data: formData,
                type: "POST"
            }).done(function (response) {
                $formMessages.removeClass("error").addClass("success").text(response);
                $contactForm.find('input:not([type="submit"]), textarea').val("");
            }).fail(function (error) {
                $formMessages.removeClass("success").addClass("error")
                    .text(error.responseText || "Oops! An error occurred and your message could not be sent.");
            });
        }
    }

    $contactForm.on("submit", function (event) {
        event.preventDefault();
        submitContactForm();
    });

    // =========================================================================
    // Popup and Side Menu Toggles
    // =========================================================================
    // Generic toggle function for popups and side menus
    function togglePopup(selector, toggler, closer, activeClass) {
        $(toggler).on("click", function (event) {
            event.preventDefault();
            $(selector).addClass(activeClass);
        });

        $(document).on("click", function (event) {
            if (!$(event.target).closest(selector).length && !$(event.target).closest(toggler).length) {
                $(selector).removeClass(activeClass);
            }
        });

        $(selector + " > div").on("click", function (event) {
            event.stopPropagation();
            $(selector).addClass(activeClass);
        });

        $(closer).on("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(selector).removeClass(activeClass);
        });
    }

    togglePopup(".popup-search-box", ".searchBoxToggler", ".searchClose", "show");
    togglePopup(".sidemenu-wrapper", ".sideMenuToggler", ".sideMenuCls", "show");
    togglePopup(".shopping-cart", ".sideMenuToggler2", ".sideMenuCls", "show");

    // =========================================================================
    // Pricing Toggle
    // =========================================================================
    // Handle pricing plan toggle
    $(document).ready(function () {
        const $monthlyTab = $("#filt-monthly");
        const $yearlyTab = $("#filt-yearly");
        const $switcher = $("#switcher");
        const $monthlyContent = $("#monthly");
        const $yearlyContent = $("#yearly");

        if ($(".pricing-tabs").length) {
            $monthlyTab.on("click", function () {
                $switcher.prop("checked", false);
                $monthlyTab.addClass("toggler--is-active");
                $yearlyTab.removeClass("toggler--is-active");
                $monthlyContent.removeClass("hide");
                $yearlyContent.addClass("hide");
            });

            $yearlyTab.on("click", function () {
                $switcher.prop("checked", true);
                $yearlyTab.addClass("toggler--is-active");
                $monthlyTab.removeClass("toggler--is-active");
                $monthlyContent.addClass("hide");
                $yearlyContent.removeClass("hide");
            });

            $switcher.on("click", function () {
                $yearlyTab.toggleClass("toggler--is-active");
                $monthlyTab.toggleClass("toggler--is-active");
                $monthlyContent.toggleClass("hide");
                $yearlyContent.toggleClass("hide");
            });
        }
    });

    // =========================================================================
    // Magnific Popup
    // =========================================================================
    // Initialize magnific popup for images
    $(".popup-image").magnificPopup({
        type: "image",
        mainClass: "mfp-zoom-in",
        removalDelay: 260,
        gallery: { enabled: true }
    });

    // Initialize magnific popup for videos
    $(".popup-video").magnificPopup({ type: "iframe" });

    // Initialize magnific popup for inline content
    $(".popup-content").magnificPopup({ type: "inline", midClick: true });

    // =========================================================================
    // WOW Animations
    // =========================================================================
    // Initialize WOW.js for scroll animations
    new WOW({
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: true,
        live: true
    });

    // =========================================================================
    // Section Positioning
    // =========================================================================
    // Position sections based on data attributes
    $.fn.sectionPosition = function (posAttr, targetAttr) {
        $(this).each(function () {
            const $element = $(this);
            const halfHeight = Math.floor($element.height() / 2);
            const position = $element.attr(posAttr);
            const target = $element.attr(targetAttr);
            const paddingTop = parseInt($(target).css("padding-top")) || 0;
            const paddingBottom = parseInt($(target).css("padding-bottom")) || 0;

            if (position === "top-half") {
                $(target).css("padding-bottom", paddingBottom + halfHeight + "px");
                $element.css("margin-top", `-${halfHeight}px`);
            } else if (position === "bottom-half") {
                $(target).css("padding-top", paddingTop + halfHeight + "px");
                $element.css("margin-bottom", `-${halfHeight}px`);
            }
        });
    };

    // =========================================================================
    // Progress Circles
    // =========================================================================
    // Animate progress circles on scroll
    function animateProgressCircles() {
        $(".feature-circle .progressbar").each(function () {
            const $circle = $(this);
            const color = $circle.attr("data-path-color");
            const top = $circle.offset().top;
            const scrollTop = $(window).scrollTop();
            const percent = $circle.find(".circle").attr("data-percent");
            const isAnimated = $circle.data("animate");

            if (top < scrollTop + $(window).height() - 30 && !isAnimated) {
                $circle.data("animate", true);
                $circle.find(".circle").circleProgress({
                    startAngle: -Math.PI / 2,
                    value: percent / 100,
                    size: 100,
                    thickness: 8,
                    emptyFill: "#E4E4E4",
                    lineCap: "round",
                    fill: { color }
                }).on("circle-animation-progress", function (event, progress, stepValue) {
                    $(this).find(".circle-num").text((100 * stepValue).toFixed(0) + "%");
                });
            }
        });

        $(".about-circle .progressbar").each(function () {
            const $circle = $(this);
            const top = $circle.offset().top;
            const scrollTop = $(window).scrollTop();
            const percent = $circle.find(".circle").attr("data-percent");
            const isAnimated = $circle.data("animate");

            if (top < scrollTop + $(window).height() - 30 && !isAnimated) {
                $circle.data("animate", true);
                $circle.find(".circle").circleProgress({
                    startAngle: -Math.PI / 2,
                    value: percent / 100,
                    size: 160,
                    thickness: 6,
                    emptyFill: "#ffffff33",
                    lineCap: "round",
                    fill: { gradient: ["#0B59DB", "#0B59DB"] }
                }).on("circle-animation-progress", function (event, progress, stepValue) {
                    $(this).find(".circle-num").text((100 * stepValue).toFixed(0) + "%");
                });
            }
        });

        $(".about-circle2 .progressbar").each(function () {
            const $circle = $(this);
            const color = $circle.attr("data-path-color");
            const top = $circle.offset().top;
            const scrollTop = $(window).scrollTop();
            const percent = $circle.find(".circle").attr("data-percent");
            const isAnimated = $circle.data("animate");

            if (top < scrollTop + $(window).height() - 30 && !isAnimated) {
                $circle.data("animate", true);
                $circle.find(".circle").circleProgress({
                    startAngle: -Math.PI / 2,
                    value: percent / 100,
                    size: 100,
                    thickness: 7,
                    emptyFill: "#ffffff33",
                    lineCap: "round",
                    fill: { color }
                }).on("circle-animation-progress", function (event, progress, stepValue) {
                    $(this).find(".circle-num").text((100 * stepValue).toFixed(0) + "%");
                });
            }
        });
    }

    // Apply section positioning after images load
    $("[data-sec-pos]").imagesLoaded(function () {
        $("[data-sec-pos]").sectionPosition("data-sec-pos", "data-pos-for");
    });

    // Trigger progress circle animations on scroll
    $(window).scroll(animateProgressCircles);

    // =========================================================================
    // Counter Animations
    // =========================================================================
    // Initialize counter animations
    $(".counter-number").counterUp({
        delay: 10,
        time: 1000
    });

    // =========================================================================
    // Shape Mockup Positioning
    // =========================================================================
    // Position shape mockups based on data attributes
    $.fn.shapeMockup = function () {
        $(this).each(function () {
            const $element = $(this);
            const css = {
                top: $element.data("top"),
                right: $element.data("left"),
                bottom: $element.data("bottom"),
                left: $element.data("right")
            };
            $element.css(css)
                .removeAttr("data-top data-right data-bottom data-left")
                .parent().addClass("shape-mockup-wrap");
        });
    };

    $(".shape-mockup").shapeMockup();

    // =========================================================================
    // Progress Bars
    // =========================================================================
    // Animate progress bars on scroll
    $(".progress-bar").waypoint({
        handler: function () {
            $(".progress-bar").css({
                animation: "animate-positive 1.8s",
                opacity: "1"
            });
        },
        offset: "75%"
    });

    // =========================================================================
    // Countdown Timer
    // =========================================================================
    // Initialize countdown timers
    $.fn.countdown = function () {
        $(this).each(function () {
            const $counter = $(this);
            const endDate = new Date($counter.data("offer-date")).getTime();

            function updateCounter(selector) {
                return $counter.find(selector);
            }

            const interval = setInterval(function () {
                const now = new Date().getTime();
                const distance = endDate - now;
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                updateCounter(".day").html(days < 10 ? `0${days}` : days);
                updateCounter(".hour").html(hours < 10 ? `0${hours}` : hours);
                updateCounter(".minute").html(minutes < 10 ? `0${minutes}` : minutes);
                updateCounter(".seconds").html(seconds < 10 ? `0${seconds}` : seconds);

                if (distance < 0) {
                    clearInterval(interval);
                    $counter.addClass("expired");
                    $counter.find(".message").css("display", "block");
                }
            }, 1000);
        });
    };

    $(".counter-list").countdown();

    // =========================================================================
    // Color Switcher
    // =========================================================================
    // Handle theme color switching
    $(".color-switch-btns button").each(function () {
        const $button = $(this);
        const color = $button.data("color");
        $button.css("--theme-color", color);
        $button.on("click", function () {
            $(":root").css("--theme-color", color);
        });
    });

    $(document).on("click", ".switchIcon", function () {
        $(".color-scheme-wrap").toggleClass("active");
    });

    // =========================================================================
    // WooCommerce Interactions
    // =========================================================================
    // Handle shipping address toggle
    $(document).on("change", "#ship-to-different-address-checkbox", function () {
        const $shippingAddress = $("#ship-to-different-address").next(".shipping_address");
        $(this).is(":checked") ? $shippingAddress.slideDown() : $shippingAddress.slideUp();
    });

    // Handle login form toggle
    $(document).on("click", ".woocommerce-form-login-toggle a", function (event) {
        event.preventDefault();
        $(".woocommerce-form-login").slideToggle();
    });

    // Handle coupon form toggle
    $(document).on("click", ".woocommerce-form-coupon-toggle a", function (event) {
        event.preventDefault();
        $(".woocommerce-form-coupon").slideToggle();
    });

    // Handle shipping calculator toggle
    $(document).on("click", ".shipping-calculator-button", function (event) {
        event.preventDefault();
        $(this).next(".shipping-calculator-form").slideToggle();
    });

    // Handle payment method toggle
    $(document).on("change", '.wc_payment_methods input[type="radio"]', function () {
        $(".payment_box").slideUp();
        $(this).siblings(".payment_box").slideDown();
    });

    // Handle rating selection
    $(document).on("click", ".rating-select .stars a", function (event) {
        event.preventDefault();
        $(this).siblings().removeClass("active");
        $(this).parent().parent().addClass("selected");
        $(this).addClass("active");
    });

    // Handle quantity input
    $(document).on("click", ".quantity-plus", function (event) {
        event.preventDefault();
        const $input = $(this).siblings(".qty-input");
        const value = parseInt($input.val(), 10);
        if (!isNaN(value)) {
            $input.val(value + 1);
        }
    });

    $(document).on("click", ".quantity-minus", function (event) {
        event.preventDefault();
        const $input = $(this).siblings(".qty-input");
        const value = parseInt($input.val(), 10);
        if (!isNaN(value) && value > 1) {
            $input.val(value - 1);
        }
    });

    // =========================================================================
    // Load More Functionality
    // =========================================================================
    // Handle load more for FAQs
    $(document).ready(function () {
        $(".faq-area").slice(0, 4).show();
        $(document).on("click", "#loadMore", function (event) {
            event.preventDefault();
            $(".loadcontent:hidden").slice(0, 3).slideDown();
            if ($(".loadcontent:hidden").length === 0) {
                $("#loadMore").text("No Content").addClass("noContent").prop("disabled", true);
            }
        });
    });

    // =========================================================================
    // Price Slider
    // =========================================================================
    // Initialize price range slider
    $(".price_slider").slider({
        range: true,
        min: 0,
        max: 100,
        values: [0, 30],
        slide: function (event, ui) {
            $(".from").text(`$${ui.values[0]}`);
            $(".to").text(`$${ui.values[1]}`);
        }
    });

    $(".from").text(`$${$(".price_slider").slider("values", 0)}`);
    $(".to").text(`$${$(".price_slider").slider("values", 1)}`);

    // =========================================================================
    // SVG Inlining
    // =========================================================================
    // Inline SVG images
    $.fn.inlineSvg = function () {
        return this.each(function () {
            const $img = $(this);
            const src = $img.attr("src");
            const cache = {};

            if (!cache[src]) {
                cache[src] = $.Deferred();
                $.get(src, data => {
                    cache[src].resolve($(data).find("svg"));
                });
            }

            cache[src].then(svg => {
                const $svg = $(svg).clone();
                if ($img.attr("id")) $svg.attr("id", $img.attr("id"));
                if ($img.attr("class")) $svg.attr("class", $img.attr("class"));
                if ($img.attr("style")) $svg.attr("style", $img.attr("style"));
                if ($img.attr("width")) {
                    $svg.attr("width", $img.attr("width"));
                    if (!$img.attr("height")) $svg.removeAttr("height");
                }
                if ($img.attr("height")) {
                    $svg.attr("height", $img.attr("height"));
                    if (!$img.attr("width")) $svg.removeAttr("width");
                }
                $svg.insertAfter($img);
                $img.trigger("svgInlined", $svg[0]);
                $img.remove();
            });
        });
    };

    $(".svg-img").inlineSvg();

    // =========================================================================
    // GSAP Animations
    // =========================================================================
    // Initialize reveal animations
    if ($(".reveal").length) {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll(".reveal").forEach(elem => {
            const img = elem.querySelector("img");
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: elem,
                    toggleActions: "play none none none"
                }
            });
            tl.set(elem, { autoAlpha: 1 })
                .from(elem, 1, { xPercent: -100, ease: Power2.out })
                .from(img, 1, { xPercent: 100, scale: 1, delay: -1, ease: Power2.out });
        });
    }

    // Initialize text animations (style 1)
    // if ($(".text-anime-style-1").length) {
    //     const stagger = 0.05;
    //     const delay = 0.5;
    //     document.querySelectorAll(".text-anime-style-1").forEach(elem => {
    //         const split = new SplitText(elem, { type: "chars, words" });
    //         gsap.from(split.words, {
    //             duration: 1,
    //             delay: delay,
    //             x: 20,
    //             autoAlpha: 0,
    //             stagger: stagger,
    //             scrollTrigger: {
    //                 trigger: elem,
    //                 start: "top 85%"
    //             }
    //         });
    //     });
    // }

    // Initialize text animations (style 2)
    // if ($(".text-anime-style-2").length) {
    //     const stagger = 0.03;
    //     const xOffset = 20;
    //     const delay = 0.1;
    //     const ease = "power2.out";
    //     document.querySelectorAll(".text-anime-style-2").forEach(elem => {
    //         const split = new SplitText(elem, { type: "chars, words" });
    //         gsap.from(split.chars, {
    //             duration: 2,
    //             delay: delay,
    //             x: xOffset,
    //             autoAlpha: 0,
    //             stagger: stagger,
    //             ease: ease,
    //             scrollTrigger: {
    //                 trigger: elem,
    //                 start: "top 85%"
    //             }
    //         });
    //     });
    // }

    // Initialize text animations (style 3)
    // if ($(".text-anime-style-3").length) {
    //     document.querySelectorAll(".text-anime-style-3").forEach(elem => {
    //         if (elem.animation) {
    //             elem.animation.progress(1).kill();
    //             elem.split.revert();
    //         }
    //         elem.split = new SplitText(elem, { type: "lines,words,chars", linesClass: "split-line" });
    //         gsap.set(elem, { perspective: 400 });
    //         gsap.set(elem.split.chars, { opacity: 0, x: 50 });
    //         elem.animation = gsap.to(elem.split.chars, {
    //             scrollTrigger: {
    //                 trigger: elem,
    //                 start: "top 90%"
    //             },
    //             x: 0,
    //             y: 0,
    //             rotateX: 0,
    //             opacity: 1,
    //             duration: 1,
    //             ease: Back.easeOut,
    //             stagger: 0.02
    //         });
    //     });
    // }

    // Initialize th-anim animations
    if ($(".th-anim").length) {
        gsap.registerPlugin(ScrollTrigger);
        document.querySelectorAll(".th-anim").forEach(elem => {
            const img = elem.querySelector("img");
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: elem,
                    toggleActions: "play none none none"
                }
            });
            tl.set(elem, { autoAlpha: 1 })
                .from(elem, 1.5, { xPercent: -100, ease: Power2.out })
                .from(img, 1.5, { xPercent: 100, scale: 1.3, delay: -1.5, ease: Power2.out });
        });
    }

    // Initialize scroll text animations
    document.querySelectorAll(".scroll-text-ani").forEach(elem => {
        gsap.to(elem, {
            backgroundImage: "linear-gradient(to left, #0B1422 100%, #D5D7DA 100%)",
            ease: "none",
            scrollTrigger: {
                trigger: elem,
                start: "top bottom",
                end: "top center",
                scrub: true
            }
        });
    });

    document.querySelectorAll(".scroll-text-ani2").forEach(elem => {
        gsap.to(elem, {
            backgroundImage: "linear-gradient(to left, #ffffff 100%, #a8a8a8ff 100%)",
            ease: "none",
            scrollTrigger: {
                trigger: elem,
                start: "top bottom",
                end: "top center",
                scrub: true
            }
        });
    });


    // Initialize card animation chain
    if (window.matchMedia("(min-width: 991px)").matches) {
        document.querySelectorAll(".card-animation-chain").forEach((elem, index) => {
            // در RTL جهت ها برعکس می‌شود
            const rotate = index % 2 === 0 ? 15 : -15; // چرخش برعکس
            const xOffset = index % 2 === 0 ? 100 : -100; // جابجایی افقی برعکس
            gsap.to(elem, {
                ease: "none",
                rotate: rotate,
                x: xOffset,
                y: -100,
                opacity: 0,
                duration: 5.5,
                scrollTrigger: {
                    trigger: elem,
                    start: "bottom bottom",
                    end: "bottom+=300",
                    scrub: true
                }
            });
        });
    }


    // Initialize image hover animations
    document.querySelectorAll(".img-hover-anim").forEach(elem => {
        const $magnifier = elem.querySelector(".magnifier");
        const $magnifierImg = elem.querySelector(".magnifier-img");

        function updateMagnifierSize() {
            const width = elem.offsetWidth;
            const height = elem.offsetHeight;
            $magnifierImg.style.width = `${width}px`;
            $magnifierImg.style.height = `${height}px`;
        }

        updateMagnifierSize();
        new ResizeObserver(updateMagnifierSize).observe(elem);

        elem.addEventListener("mousemove", event => {
            const rect = elem.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const translateX = 600 * (x / elem.offsetWidth - 0.5);
            const translateY = 600 * (y / elem.offsetHeight - 0.5);
            const imgX = 200 / 1.68 - x;
            const imgY = 200 / 3 - y;

            gsap.to($magnifier, {
                duration: 0.5,
                x: translateX,
                y: translateY,
                opacity: 1,
                scale: 1,
                ease: "power4.out"
            });

            gsap.to($magnifierImg, {
                duration: 0.5,
                x: imgX,
                y: imgY,
                scale: 1,
                ease: "power4.out"
            });
        });

        elem.addEventListener("mouseleave", () => {
            gsap.to($magnifier, {
                duration: 0.8,
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
                ease: "power4.out"
            });

            gsap.to($magnifierImg, {
                duration: 0.5,
                x: 0,
                y: 0,
                scale: 1,
                ease: "power4.out"
            });
        });
    });

    // Initialize footer CTA animation
    if (window.matchMedia("(min-width: 991px)").matches) {
        document.querySelectorAll(".footer-cta-wrap").forEach(elem => {
            gsap.fromTo(elem, {
                x: 500
            }, {
                x: 0,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "bottom bottom",
                    end: "center bottom",
                    scrub: 2.5
                }
            });
        });
    }

    // =========================================================================
    // Slider Drag Cursor
    // =========================================================================
    // Initialize custom cursor for sliders
    const $dragCursor = $(".slider-drag-cursor");
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    const setX = gsap.quickSetter($dragCursor, "x", "px");
    const setY = gsap.quickSetter($dragCursor, "y", "px");

    window.addEventListener("pointermove", event => {
        pos.x = event.x;
        pos.y = event.y;
    });

    gsap.set($dragCursor, { xPercent: -50, yPercent: -50 });
    gsap.ticker.add(() => {
        const dt = 1 - Math.pow(0, gsap.ticker.deltaRatio());
        mouse.x += (pos.x - mouse.x) * dt;
        mouse.y += (pos.y - mouse.y) * dt;
        setX(mouse.x);
        setY(mouse.y);
    });

    $(document).on("mouseenter", ".slider-drag-wrap", function () {
        $dragCursor.addClass("active");
    }).on("mouseleave", ".slider-drag-wrap", function () {
        $dragCursor.removeClass("active");
    });

    $(document).on("mouseenter", ".slider-drag-wrap a, .slider-drag-wrap .slider-pagination", function () {
        $dragCursor.removeClass("active");
    }).on("mouseleave", ".slider-drag-wrap a, .slider-drag-wrap .slider-pagination", function () {
        $dragCursor.addClass("active");
    });

    // =========================================================================
    // Lettering Plugin
    // =========================================================================
    // Custom plugin for text splitting
    $.fn.lettering = function (method) {
        const methods = {
            words: function () {
                return this.each(function () {
                    const $el = $(this);
                    const words = $el.text().trim().split(/\s+/);
                    let html = "";
                    words.forEach((word, i) => {
                        html += `<span class="char${i + 1}">${word}</span> `;
                    });
                    $el.empty().append(html).css({
                        direction: "rtl",
                        display: "inline-block",
                        textAlign: "right"
                    });
                });
            },
            letters: function () {
                return this.each(function () {
                    const $el = $(this);
                    const text = $el.text().split("");
                    let html = "";
                    text.forEach((char, i) => {
                        html += `<span class="char${i + 1}">${char}</span>`;
                    });
                    $el.empty().append(html).css({
                        direction: "rtl",
                        display: "inline-block",
                        textAlign: "right"
                    });
                });
            },
            lines: function () {
                return this.each(function () {
                    const $el = $(this);
                    const separator = "eefec303079ad17405c889e092e105b0";
                    const text = $el.children("br").replaceWith(separator).end().text().split(separator);
                    let html = "";
                    text.forEach((line, i) => {
                        html += `<span class="char${i + 1}">${line}</span>`;
                    });
                    $el.empty().append(html).css({
                        direction: "rtl",
                        display: "inline-block",
                        textAlign: "right"
                    });
                });
            }
        };

        return method && methods[method]
            ? methods[method].apply(this, [].slice.call(arguments, 1))
            : methods.words.apply(this, [].slice.call(arguments, 0));
    };

    // استفاده
    $(".discount-anime").lettering();



    // =========================================================================
    // Smooth Scrolling with Lenis
    // =========================================================================
    // Initialize Lenis for smooth scrolling
    let lenis;
    function initSmoothScroll() {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            if (window.innerWidth > 991) {
                if (!lenis) {
                    lenis = new Lenis({ lerp: 0.07 });
                    lenis.on("scroll", ScrollTrigger.update);
                    gsap.ticker.add(time => lenis.raf(time * 1000));
                    document.querySelectorAll(".allow-natural-scroll").forEach(elem => {
                        elem.addEventListener("wheel", e => e.stopPropagation(), { passive: true });
                        elem.addEventListener("touchmove", e => e.stopPropagation(), { passive: true });
                    });
                }
                lenis.start();
            } else if (lenis) {
                lenis.stop();
                lenis = null;
            }
        }
    }

    initSmoothScroll();
    window.addEventListener("resize", initSmoothScroll);

    // =========================================================================
    // Security Measures
    // =========================================================================
    // Disable context menu and certain keyboard shortcuts
    // window.addEventListener("contextmenu", function(event) {
    //     event.preventDefault();
    // }, false);

    // document.onkeydown = function(event) {
    //     return event.keyCode !== 123 && 
    //            !(event.ctrlKey && event.shiftKey && event.keyCode === "I".charCodeAt(0)) &&
    //            !(event.ctrlKey && event.shiftKey && event.keyCode === "C".charCodeAt(0)) &&
    //            !(event.ctrlKey && event.shiftKey && event.keyCode === "J".charCodeAt(0)) &&
    //            !(event.ctrlKey && event.keyCode === "U".charCodeAt(0));
    // };

    // =========================================================================
    // Initialize Components
    // =========================================================================
    // Initialize all components
    enableSmoothScroll(".onepage-nav");
    enableSmoothScroll(".scroll-down");
    applyAnimations();
    $(".th-menu-wrapper").thMobileMenu();
})(jQuery);