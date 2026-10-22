function renderNavbar() {
  const header = document.querySelector("#site-header");

  if (!header) return;

  header.innerHTML = `
    <nav class="site-nav" aria-label="Main navigation">
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="./index.html" aria-label="Rookees home">
          <img
            class="site-nav__logo"
            src="./assets/images/rookees-logo-removebg.png"
            alt="Rookees"
          />
        </a>

        <div class="site-nav__links" id="nav-links">
          <a class="site-nav__link" href="./index.html" aria-current="page">Home</a>
          <a class="site-nav__link" href="./about.html">Our Story</a>
          <a class="site-nav__link" href="./products.html">The Product</a>
          <a class="site-nav__link" href="./reviews.html">Reviews</a>
        </div>

        <div class="site-nav__actions">
          <a class="button button--primary site-nav__cta" href="./products.html">
            Explore Rookees <span aria-hidden="true">↗</span>
          </a>

          <button
            class="site-nav__toggle"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="nav-links"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
    </nav>
  `;

  const toggle = header.querySelector(".site-nav__toggle");
  const links = header.querySelector("#nav-links");

  toggle?.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
    toggle.querySelector("span").textContent = isOpen ? "×" : "☰";
  });

  links?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Open navigation menu");

      const icon = toggle?.querySelector("span");
      if (icon) icon.textContent = "☰";
    });
  });
}

function renderFooter() {
  const footer = document.querySelector("#site-footer");

  if (!footer) return;

  footer.className = "site-footer";

  footer.innerHTML = `
    <div class="site-footer__inner section-shell">
      <a class="site-footer__brand" href="./index.html">Rookees.</a>

      <p class="site-footer__copy">
        © <span data-current-year></span> Rookees. Made with care.
      </p>

      <div class="site-footer__links">
        <a href="./about.html">Our Story</a>
        <a href="./products.html">Products</a>
        <a href="./reviews.html">Reviews</a>
      </div>
    </div>
  `;

  const year = footer.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
}
