function renderNavbar() {
  const header = document.querySelector("#site-header");
  if (!header || header.children.length > 0) return;

  header.innerHTML = `
    <nav class="site-nav" aria-label="Main navigation">
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="./index.html" aria-label="ROOKEES home">
          <img class="site-nav__logo" src="./assets/images/rookees-logo.svg" alt="ROOKEES" />
        </a>
        <div class="site-nav__links" id="rookees-navigation" data-site-nav>
          <a class="site-nav__link" data-nav-link href="./index.html">Home</a>
          <a class="site-nav__link" data-nav-link href="./about.html">Our Story</a>
          <a class="site-nav__link" data-nav-link href="./reviews.html">Reviews</a>
        </div>
        <div class="site-nav__actions">
          <a class="site-nav__cta" href="./reviews.html">Leave a review <span aria-hidden="true">↗</span></a>
        </div>
        <button class="site-nav__toggle" type="button" data-menu-toggle aria-label="Toggle navigation menu" aria-controls="rookees-navigation" aria-expanded="false">
          <span></span><span></span><span></span>
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
        <a class="site-footer__logo-link" href="./index.html" aria-label="ROOKEES home">
          <img class="site-nav__logo site-footer__logo" src="./assets/images/rookees-logo.svg" alt="ROOKEES" />
        </a>
        <p class="site-footer__description">A brownie-cookie treat made for little moments of sweetness, shared with the people who matter.</p>
      </div>
      <div>
        <h2 class="site-footer__heading">Explore</h2>
        <nav class="site-footer__links" aria-label="Footer navigation">
          <a href="./index.html">Home</a>
          <a href="./about.html">Our Story</a>
          <a href="./reviews.html">Reviews</a>
        </nav>
      </div>
      <div>
        <h2 class="site-footer__heading">Your voice matters</h2>
        <div class="site-footer__contact">
          <a href="./reviews.html">Share your experience ↗</a>
        </div>
      </div>
    </div>
    <div class="site-footer__bottom">
      <p>© ${new Date().getFullYear()} ROOKEES. All rights reserved.</p>
    </div>
  `;
}

function initSharedComponents() {
  initMobileNavigation();
  initActiveNavigation();
  initBackToTop();
  initOrderLinks();
}

function initOrderLinks() {
  const whatsappNumber = window.ROOKEES_WHATSAPP_NUMBER || "";
  const message = "Hi Rookees! I'd like to ask about placing an order.";
  document.querySelectorAll("[data-order-link]").forEach((link) => {
    if (!whatsappNumber) {
      link.href = "./about.html";
      return;
    }
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
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

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!toggle.contains(event.target) && !navigation.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeMenu();
  });
}

function initActiveNavigation() {
  const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPage = href.split("/").pop().split("?")[0].toLowerCase();
    const isActive = linkPage === currentPage;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function initBackToTop() {
  document.querySelectorAll("[data-back-to-top]").forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  });
}
