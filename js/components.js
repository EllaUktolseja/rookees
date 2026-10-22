function renderNavbar() {
  const header = document.querySelector("#site-header");

  if (!header || header.children.length > 0) return;

  header.innerHTML = `
    <nav class="site-nav" aria-label="Main navigation">
      <div class="site-nav__inner">

        <!-- Left: Brand -->
        <a class="site-nav__brand" href="./index.html" aria-label="ROOKEES home">
        <img
            class="site-nav__logo"
            src="./assets/images/rookees-logo.svg"
            alt="ROOKEES"
        />
        </a>

        <!-- Center: Navigation links -->
        <div
          class="site-nav__links"
          id="rookees-navigation"
          data-site-nav
        >
          <a class="site-nav__link" data-nav-link href="./index.html">
            Home
          </a>

          <a class="site-nav__link" data-nav-link href="./about.html">
            Our Story
          </a>

          <a class="site-nav__link" data-nav-link href="./products.html">
            Product
          </a>

          <a class="site-nav__link" data-nav-link href="./reviews.html">
            Reviews
          </a>
        </div>

        <!-- Right: Action buttons -->
        <div class="site-nav__actions">
          <a
            class="site-nav__button site-nav__button--order"
            href="./products.html"
          >
            Order <span aria-hidden="true">↗</span>
          </a>
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="site-nav__toggle"
          type="button"
          data-menu-toggle
          aria-label="Toggle navigation menu"
          aria-controls="rookees-navigation"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </nav>
  `;
}

function renderFooter() {
  const footer = document.querySelector("#site-footer");

  if (!footer || footer.children.length > 0) return;

  footer.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__main">
      <img
            class="site-nav__logo"
            src="./assets/images/rookees-logo.svg"
            alt="ROOKEES"
            href="./index.html"
        />

        <p class="site-footer__description">
          Two classics, one indulgence. A little twist of sweetness
          made to bring more joy to your everyday moments.
        </p>
      </div>

      <div>
        <h2 class="site-footer__heading">Explore</h2>
        <nav class="site-footer__links" aria-label="Footer navigation">
          <a href="./index.html">Home</a>
          <a href="./about.html">Our Story</a>
          <a href="./products.html">Our Product</a>
          <a href="./reviews.html">Reviews</a>
        </nav>
      </div>

      <div>
        <h2 class="site-footer__heading">Get in Touch</h2>
        <div class="site-footer__contact">
          <a href="./reviews.html">Share Your Thoughts ↗</a>
          <a href="./products.html">Discover Our Product ↗</a>
        </div>
      </div>
    </div>

    <div class="site-footer__bottom">
      <p>
        © ${new Date().getFullYear()} ROOKEES. All rights reserved.
      </p>
    </div>
  `;
}

function initSharedComponents() {
  initMobileNavigation();
  initActiveNavigation();
  initBackToTop();
}

function initMobileNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-site-nav]");

  if (!toggle || !navigation) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!toggle.contains(event.target) && !navigation.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });
}

function initActiveNavigation() {
  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const linkPage = href.split("/").pop().split("?")[0].toLowerCase();
    const isActive = linkPage === currentPage;

    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initBackToTop() {
  document.querySelectorAll("[data-back-to-top]").forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  });
}
