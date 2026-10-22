function renderNavbar() {
  const header = document.querySelector("#site-header");
  if (!header) return;
  const activePage = document.body.dataset.page || "home";
  const links = [
    { id: "home", href: "./index.html", label: "Beranda" },
    { id: "about", href: "./about.html", label: "Kisah & Konsep" },
    { id: "products", href: "./products.html", label: "Keunggulan & Kualitas" },
    { id: "reviews", href: "./reviews.html", label: "Ulasan & Feedback" },
  ];
  const navLinks = links.map((link) => `<a class="site-nav__link" href="${link.href}" ${activePage === link.id ? 'aria-current="page"' : ""}>${link.label}</a>`).join("");
  header.innerHTML = `
    <nav class="site-nav" aria-label="Navigasi utama">
      <div class="site-nav__inner">
        <a class="site-nav__brand" href="./index.html" aria-label="ROOKEES — beranda">
          <img class="site-nav__logo" src="./assets/images/rookees-logo-removebg.png" alt="ROOKEES Artisanal">
        </a>
        <div class="site-nav__links" id="nav-links">${navLinks}</div>
        <div class="site-nav__actions">
          <a class="button button--primary site-nav__cta" href="./reviews.html">Beri Ulasan</a>
          <a class="button button--primary site-nav__cta" href="https://wa.me/628127665337?text=Halo%20ROOKEES%2C%20saya%20ingin%20pre-order." target="_blank" rel="noopener noreferrer">Pesan Pre-Order</a>
          <button class="site-nav__toggle" type="button" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="nav-links"><span aria-hidden="true">☰</span></button>
        </div>
      </div>
    </nav>`;
  const toggle = header.querySelector(".site-nav__toggle");
  const nav = header.querySelector("#nav-links");
  toggle?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
    toggle.querySelector("span").textContent = isOpen ? "×" : "☰";
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Buka menu navigasi");
    const icon = toggle?.querySelector("span");
    if (icon) icon.textContent = "☰";
  }));
}
function renderFooter() {
  const footer = document.querySelector("#site-footer");
  if (!footer) return;
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner section-shell">
      <div class="site-footer__brand-column">
        <a class="site-footer__brand" href="./index.html">ROOKEES.</a>
        <p class="site-footer__summary">Sinergi sensorial antara dark chocolate fudge brownies pekat dan golden buttery cookies, dipanggang dalam kaleng emas untuk pengalaman rasa hangat, unik, dan mudah dibagikan.</p>
        <span class="pill-label">Batch terbatas setiap pekan</span>
      </div>
      <div><p class="site-footer__column-title">Eksplorasi kurasi</p><div class="site-footer__links"><a href="./about.html">Kisah &amp; konsep</a><a href="./products.html">Keunggulan &amp; mutu</a><a href="./reviews.html">Kuesioner &amp; suara</a></div></div>
      <div><p class="site-footer__column-title">Pemesanan &amp; akademik</p><p class="site-footer__contact">Inisiatif wirausaha kuliner gourmet mahasiswa BINUS University Bekasi — Entrepreneurship Kelompok 6.<br><strong>Bekasi &amp; Jadetabek Dispatch</strong><br>Pemesanan H-1 · Freshly baked to order<br><a href="https://wa.me/628127665337" target="_blank" rel="noopener noreferrer">WhatsApp Hotline: +62 812-7665-337</a></p></div>
      <p class="site-footer__copy">© <span data-current-year></span> ROOKEES Artisanal Bakery · Proyek Kewirausahaan Kelompok 6 · BINUS University Bekasi <span style="float:right">Jakarta · Bekasi · Modern Gourmet</span></p>
    </div>`;
  const year = footer.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
}