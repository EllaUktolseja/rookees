/**
 * ROOKEES — Homepage JavaScript
 * Handles homepage interactions.
 */

function initHomePage() {
  initHomeSlider();
  initScrollReveal();
  initSmoothScroll();
}

/**
 * Homepage slider
 *
 * Required HTML attributes:
 * [data-home-slider]
 * [data-home-slide]
 * [data-home-prev]
 * [data-home-next]
 * [data-home-dot]
 */
function initHomeSlider() {
  const slider = document.querySelector("[data-home-slider]");

  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll("[data-home-slide]"));

  const prevButton = slider.querySelector("[data-home-prev]");
  const nextButton = slider.querySelector("[data-home-next]");
  const dots = Array.from(slider.querySelectorAll("[data-home-dot]"));

  if (slides.length === 0) return;

  let currentIndex = 0;

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;

      slide.hidden = !isActive;
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === currentIndex;

      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", String(isActive));
    });
  }

  prevButton?.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  showSlide(0);
}

/**
 * Reveal elements when they enter the viewport.
 * Elements must have the [data-reveal] attribute.
 */
function initScrollReveal() {
  const elements = document.querySelectorAll("[data-reveal]");

  if (elements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    },
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

/**
 * Smooth scrolling for internal section links.
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      let target;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  });
}
