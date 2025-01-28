const durationFast = 0.3;
const durationBase = 0.5;
const durationSlow = 1;
const easeBase = "power2.inOut";

function timezoneDetect() {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    return;
  }

  const wrappers = document.querySelectorAll('[data-time="wrap"]');
  if (!wrappers.length) {
    return;
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: userTimeZone,
  });

  // Get timezone abbreviation
  const tzAbbr = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
    timeZone: userTimeZone,
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName").value;

  // Update standalone timezone label if it exists
  const zoneTitle = document.querySelector('[data-time="zone-title"]');
  if (zoneTitle) {
    zoneTitle.textContent = tzAbbr;
  }

  wrappers.forEach((wrapper) => {
    const start = wrapper.querySelector('[data-time="start"]');
    const end = wrapper.querySelector('[data-time="end"]');
    const zone = wrapper.querySelector('[data-time="time-zone"]');

    if (!start || !end || !zone) {
      return;
    }

    const startTime = start.textContent;
    const endTime = end.textContent;

    // Parse the times
    const [startHour, startMinute, startPeriod] = startTime
      .match(/(\d+):(\d+)\s+(am|pm)/i)
      .slice(1);
    const [endHour, endMinute, endPeriod] = endTime
      .match(/(\d+):(\d+)\s+(am|pm)/i)
      .slice(1);

    // Create date object with UTC time
    const startDate = new Date();
    const endDate = new Date();

    // Set to CST (UTC-6)
    startDate.setUTCHours(
      (startPeriod.toLowerCase() === "pm" && startHour !== "12"
        ? parseInt(startHour) + 12
        : startPeriod.toLowerCase() === "am" && startHour === "12"
        ? 0
        : parseInt(startHour)) + 6,
      parseInt(startMinute)
    );

    endDate.setUTCHours(
      (endPeriod.toLowerCase() === "pm" && endHour !== "12"
        ? parseInt(endHour) + 12
        : endPeriod.toLowerCase() === "am" && endHour === "12"
        ? 0
        : parseInt(endHour)) + 6,
      parseInt(endMinute)
    );

    // Format in user's timezone
    start.textContent = formatter.format(startDate).toLowerCase();
    end.textContent = formatter.format(endDate).toLowerCase();
    zone.textContent = tzAbbr;
  });
}

function loader() {
  const image = document.querySelector('[data-load="image"]');
  const fadeLeft = document.querySelectorAll('[data-load="fade-left"]');
  const fadeUp = document.querySelectorAll('[data-load="fade-up"]');

  let tl = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: "power4.out",
    },
  });

  tl.to(image, {
    opacity: 1,
    filter: "blur(0px)",
    duration: 2,
  }).to(
    fadeLeft,
    {
      opacity: 1,
      x: "0rem",
      stagger: 0.1,
    },
    "<0.2"
  );

  if (fadeUp) {
    tl.to(
      fadeUp,
      {
        y: "0rem",
        opacity: 1,
      },
      "<0.2"
    );
  }
}

function fadeUp() {
  const fades = document.querySelectorAll('[data-scroll="fade-up"]');

  if (!fades.length) {
    return;
  }

  fades.forEach((fade) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: fade,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: 1.2,
        ease: "power4.out",
      },
    });

    tl.to(fade, {
      y: "0rem",
      opacity: 1,
    });
  });
}

function blurIn() {
  const blurs = document.querySelectorAll('[data-scroll="blur-in"]');

  if (!blurs.length) {
    return;
  }

  blurs.forEach((blur) => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: blur,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: 2,
        ease: "power4.out",
      },
    });

    tl.to(blur, {
      scale: 1,
      filter: "blur(0px)",
    });
  });
}

function navScroll() {
  const nav = document.querySelector('[data-nav="nav"]');
  const hero = document.querySelector('[data-nav="hero"]');

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "bottom top",
      toggleActions: "play none none reverse",
    },
    defaults: {
      duration: 0.8,
      ease: easeBase,
    },
  });

  tl.to(nav, {
    y: "0%",
  });
}

function accordion() {
  const accordionLists = document.querySelectorAll(".faq_list");

  if (!accordionLists) {
    return;
  }

  accordionLists.forEach((list) => {
    const accordionItems = gsap.utils.toArray(".accordion_component");

    accordionItems.forEach((item) => {
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      gsap.set(content, { height: 0, display: "none" });
      item.classList.remove("is-open");
      gsap.set(icon, { rotate: 0 });
    });

    const firstItem = accordionItems[0];
    const firstContent = firstItem.querySelector(".accordion_content");
    const firstIcon = firstItem.querySelector(".accordion_icon");

    gsap.set(firstContent, { height: "auto", display: "block" });
    firstItem.classList.add("is-open");
    gsap.set(firstIcon, { rotation: 135 });

    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion_title-row");
      const content = item.querySelector(".accordion_content");
      const icon = item.querySelector(".accordion_icon");

      header.addEventListener("click", () => {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector(".accordion_content");
            const otherIcon = otherItem.querySelector(".accordion_icon");

            if (otherItem.classList.contains("is-open")) {
              gsap.to(otherContent, {
                height: 0,
                duration: durationBase,
                ease: easeBase,
                onComplete: () => {
                  otherItem.classList.remove("is-open");
                  gsap.set(otherContent, { display: "none" });
                },
              });

              gsap.to(otherIcon, {
                rotate: 0,
                duration: durationBase,
                ease: easeBase,
              });
            }
          }
        });

        if (!item.classList.contains("is-open")) {
          gsap.set(content, { display: "block" });
          gsap.to(content, {
            height: "auto",
            duration: durationBase,
            ease: easeBase,
            onComplete: () => item.classList.add("is-open"),
          });

          gsap.to(icon, {
            rotate: 135,
            duration: durationBase,
            ease: easeBase,
          });
        } else {
          gsap.to(content, {
            height: 0,
            duration: durationBase,
            ease: easeBase,
            onComplete: () => {
              item.classList.remove("is-open");
              gsap.set(content, { display: "none" });
            },
          });

          gsap.to(icon, {
            rotate: 0,
            duration: durationBase,
            ease: easeBase,
          });
        }
      });
    });
  });
}

function parallaxHero() {
  const wrapper = document.querySelector('[data-parallax="hero-wrap"]');

  if (!wrapper) {
    return;
  }

  const image = wrapper.querySelector('[data-parallax="hero-image"]');

  let parallaxScroll = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  parallaxScroll.fromTo(
    image,
    {
      yPercent: -10,
    },
    {
      yPercent: 10,
    }
  );
}

function parallax() {
  const wrappers = document.querySelectorAll('[data-parallax="wrap"]');

  if (!wrappers.length) {
    return;
  }

  wrappers.forEach((wrapper) => {
    const image = wrapper.querySelector('[data-parallax="image"]');

    let parallaxScroll = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: 2,
      },
    });

    parallaxScroll.fromTo(
      image,
      {
        yPercent: -10,
      },
      {
        yPercent: 10,
      }
    );
  });
}

timezoneDetect();
loader();
fadeUp();
blurIn();
navScroll();
accordion();
parallaxHero();
parallax();