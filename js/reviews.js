document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#feedback-form");
  const success = document.querySelector("#form-success");
  if (!form || !success) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = form.elements.name.value.trim();
    success.textContent = `Terima kasih, ${name || "teman ROOKEES"}! Feedback demo kamu sudah tervalidasi di browser. Belum ada data yang dikirim atau disimpan karena website ini masih frontend-only.`;
    success.classList.add("is-visible");
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});