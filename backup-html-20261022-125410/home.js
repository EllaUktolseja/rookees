function initHomePage() {
  const heroImage = document.querySelector(".hero__image");

  if (heroImage) {
    heroImage.addEventListener(
      "error",
      () => {
        heroImage.alt = "Rookees product photo is currently unavailable";
      },
      { once: true },
    );
  }
}
