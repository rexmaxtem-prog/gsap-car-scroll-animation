
document.addEventListener("DOMContentLoaded", function () {

    if (typeof gsap === "undefined" ||
        typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector("#hero");
    const swiperElement = document.querySelector("#heroSlide1");

    if (!hero || !swiperElement) return;

    const slides = Array.from(
        swiperElement.querySelectorAll(".swiper-slide")
    ).filter(slide =>
        !slide.classList.contains("swiper-slide-duplicate")
    );

    if (!slides.length) return;

    const cars = slides.map(slide =>
        slide.querySelector(".hero-car")
    );

    if (cars.some(car => !car)) return;

    const nextButton = hero.querySelector(".car-next");
    const prevButton = hero.querySelector(".car-prev");

    let swiper = null;
    let timeline = null;
    let navigationTween = null;
    let isNavigating = false;

    const SLIDE_DISTANCE = 2000;
    const FADE_DURATION = 1000;

    function getSwiper() {
        return swiperElement.swiper || null;
    }

    function disableSwiperNavigation() {
        swiper = getSwiper();

        if (!swiper) return;

        if (swiper.autoplay) {
            swiper.autoplay.stop();
        }

        swiper.allowTouchMove = false;

        if (swiper.params) {
            swiper.params.autoplay = false;
        }
    }

    function setSlide(index) {
        swiper = getSwiper();

        if (!swiper) return;

        index = Math.max(
            0,
            Math.min(slides.length - 1, index)
        );

        if (swiper.activeIndex !== index) {
            swiper.slideTo(index, FADE_DURATION, false);
        }
    }

    function getCurrentSlide() {
        if (!timeline) return 0;

        const progress = timeline.progress();

        return Math.min(
            slides.length - 1,
            Math.floor(progress * slides.length)
        );
    }

    function updateButtons() {
        const currentIndex = getCurrentSlide();

        if (prevButton) {
            prevButton.disabled =
                isNavigating || currentIndex === 0;
        }

        if (nextButton) {
            nextButton.disabled =
                isNavigating ||
                currentIndex === slides.length - 1;
        }
    }

    disableSwiperNavigation();

    // Initialize cars.
    cars.forEach((car, index) => {

        gsap.set(car, {
            xPercent: 0
        });

        if (index !== 0) {
            gsap.set(car, {
                x: () => window.innerWidth
            });
        }

        gsap.set(
            car.querySelectorAll(".wheel"),
            { rotation: 0 }
        );
    });

    setSlide(0);

    // Main scroll-controlled animation.
    timeline = gsap.timeline({
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () =>
                "+=" + (slides.length * SLIDE_DISTANCE),
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
                if (timeline) {
                    syncSlides();
                }
            }
        }
    });

    cars.forEach((car, index) => {

        const wheels = car.querySelectorAll(".wheel");
        const segmentStart = index;

        // Move car from right to left.
        timeline.fromTo(
            car,
            {
                x: () =>
                    window.innerWidth / 2 +
                    car.offsetWidth
            },
            {
                x: () =>
                    -window.innerWidth / 2 -
                    car.offsetWidth,
                ease: "none",
                duration: 1
            },
            segmentStart
        );

        // Rotate wheels according to scroll.
        timeline.fromTo(
            wheels,
            {
                rotation: 0
            },
            {
                rotation: -1800,
                ease: "none",
                duration: 1
            },
            segmentStart
        );
    });

    function syncSlides() {
        if (!timeline) return;

        const index = getCurrentSlide();

        setSlide(index);
        updateButtons();
    }

    timeline.eventCallback("onUpdate", syncSlides);

    // Move the actual scroll position.
    function navigateToSlide(targetIndex) {

        if (isNavigating || !timeline) return;

        if (
            targetIndex < 0 ||
            targetIndex >= slides.length
        ) return;

        const trigger = timeline.scrollTrigger;

        if (!trigger) return;

        isNavigating = true;
        updateButtons();

        if (navigationTween) {
            navigationTween.kill();
        }

        // Stop at the middle of the target slide.
        const targetProgress =
            (targetIndex + 0.5) / slides.length;

        const targetScroll =
            trigger.start +
            (trigger.end - trigger.start) *
            targetProgress;

        const scrollProxy = {
            position: window.scrollY
        };

        navigationTween = gsap.to(scrollProxy, {
            position: targetScroll,
            duration: 2.5,
            ease: "power2.inOut",

            onUpdate: function () {
                window.scrollTo(
                    0,
                    scrollProxy.position
                );
            },

            onComplete: function () {
                isNavigating = false;
                navigationTween = null;
                syncSlides();
            },

            onInterrupt: function () {
                isNavigating = false;
                navigationTween = null;
                updateButtons();
            }
        });
    }

    // Next slide button.
    if (nextButton) {
        nextButton.addEventListener("click", function (e) {
            e.preventDefault();

            navigateToSlide(
                getCurrentSlide() + 1
            );
        });
    }

    // Previous slide button.
    if (prevButton) {
        prevButton.addEventListener("click", function (e) {
            e.preventDefault();

            navigateToSlide(
                getCurrentSlide() - 1
            );
        });
    }

    // Cancel button navigation when user scrolls manually.
    function cancelNavigation() {

        if (!isNavigating || !navigationTween) return;

        navigationTween.kill();
        navigationTween = null;

        isNavigating = false;
        updateButtons();
    }

    window.addEventListener(
        "wheel",
        cancelNavigation,
        { passive: true }
    );

    window.addEventListener(
        "touchstart",
        cancelNavigation,
        { passive: true }
    );

    window.addEventListener(
        "keydown",
        function (e) {
            if ([
                "ArrowUp",
                "ArrowDown",
                "PageUp",
                "PageDown",
                "Home",
                "End",
                " "
            ].includes(e.key)) {
                cancelNavigation();
            }
        }
    );

    // Recalculate positions on resize.
    window.addEventListener("resize", function () {
        ScrollTrigger.refresh();
    });

    // Ensure Swiper is ready.
    window.addEventListener("load", function () {
        disableSwiperNavigation();
        syncSlides();
        ScrollTrigger.refresh();
    });

    updateButtons();

});
