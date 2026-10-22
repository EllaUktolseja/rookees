document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();

  initSharedComponents();

  if (typeof initHomePage === "function") {
    initHomePage();
  }
});
