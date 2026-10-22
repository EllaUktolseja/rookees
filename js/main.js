document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderNavbar === "function") renderNavbar();
  if (typeof renderFooter === "function") renderFooter();
  if (typeof initHomePage === "function") initHomePage();
});

/*
 * The repository currently contains assets as a Git gitlink, so images may be
 * absent in static hosting checkouts. Prefer local assets, then fall back to
 * the corresponding image references used by the supplied Stitch prototype.
 */
window.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  if (image.dataset.fallbackApplied === "true") return;

  const localPath = image.getAttribute("src") || "";
  if (!localPath.includes("./assets/images/")) return;

  image.dataset.fallbackApplied = "true";

  if (localPath.includes("rookees-logo")) {
    image.hidden = true;
    const brand = document.createElement("span");
    brand.className = "site-nav__fallback-brand";
    brand.textContent = "ROOKEES";
    image.insertAdjacentElement("afterend", brand);
    return;
  }

  const fallbackImages = {
    "rookees-product.jpeg": "https://lh3.googleusercontent.com/aida-public/AB6AXuA6wF3LtJ-Bnuac8OrDqAUs2JAxuYaWnyeQOyjbYY8Natp1ytifnPiKIl5psWnjaFaahyexye-ElrRbc4SXHbdKNNs4wOm-or18ptx7XRyyqh6QjGeDXcq3-aMfDlkZtw9Fwx2ayWRMDHcxzWJOYu3lJUcsOLRJ5iPbIlUISEMKDDGz99c7VJy1KQ0Pe8cjvzTfbe-F6k1WnU8uihKNe0A7zbKUqvkEAu0HNZrBk9Kc7sEExJGfgnJLa4ZGvqB9_IEcPQ",
    "rookees-product-closeup.jpeg": "https://lh3.googleusercontent.com/aida-public/AB6AXuBBH7bTa5a6lc5GDNt9ZxjiEaL7mwFLazXW3rmseXdyaePwvRGg9g87ytnculR3PPXKf9SGqamgt_jK-L8Q0gtcawtUmv-pCqjZF_MPJ3p_joe2rnnnq6WDi-4nIVxkIMtXWNzeE4Kdrbslk4GPcJjvtBWHrMYrLoESuJynf1ZoyHS0ZL49Dnktep-pUb0ucGIM3nRXa9A6w39zBIS4Yc0w9CCxBKq-WM7PvaxTexFCb7a7NqMULNSi"
  };
  const fileName = localPath.split("/").pop();
  if (fallbackImages[fileName]) image.src = fallbackImages[fileName];
}, true);
