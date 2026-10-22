document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderNavbar === "function") renderNavbar();
  if (typeof renderFooter === "function") renderFooter();
  if (typeof initHomePage === "function") initHomePage();
});