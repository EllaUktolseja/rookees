(() => {
  "use strict";

  const form = document.querySelector("#review-form");
  if (!form) return;

  const config = window.ROOKEES_CONFIG || {};
  const endpoint = String(config.googleAppsScriptUrl || "").trim();

  const nameInput = document.querySelector("#review-name");
  const messageInput = document.querySelector("#review-message");
  const ratingInput = document.querySelector("#review-rating");
  const consentInput = document.querySelector("#review-consent");
  const ratingPicker = document.querySelector("#rating-picker");
  const ratingStars = [...document.querySelectorAll(".rating-star")];
  const ratingHint = document.querySelector("#rating-hint");
  const characterCount = document.querySelector("#character-count");
  const statusMessage = document.querySelector("#review-status");
  const submitButton = form.querySelector('[type="submit"]');
  const honeypot = document.querySelector("#review-website");

  const ratingLabels = {
    1: "We're sorry to hear that.",
    2: "Thanks for being honest.",
    3: "Thanks for your feedback!",
    4: "So glad you enjoyed it!",
    5: "Yay! We're glad you loved it!",
  };

  let selectedRating = 0;

  function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "feedback-form__status";
    if (type) statusMessage.classList.add(`is-${type}`);
  }

  function selectRating(rating) {
    selectedRating = rating;
    ratingInput.value = String(rating);

    ratingStars.forEach((star) => {
      const value = Number(star.dataset.rating);
      star.classList.toggle("is-active", value <= rating);
      star.setAttribute("aria-checked", String(value === rating));
      star.tabIndex = value === rating ? 0 : -1;
    });

    ratingHint.textContent = `${rating} out of 5 — ${ratingLabels[rating]}`;
    setStatus();
  }

  ratingStars.forEach((star, index) => {
    star.tabIndex = index === 0 ? 0 : -1;
    star.addEventListener("click", () => selectRating(Number(star.dataset.rating)));

    star.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        nextIndex = (index + 1) % ratingStars.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        nextIndex = (index - 1 + ratingStars.length) % ratingStars.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = ratingStars.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      ratingStars[nextIndex].focus();
      selectRating(Number(ratingStars[nextIndex].dataset.rating));
    });
  });

  messageInput.addEventListener("input", () => {
    characterCount.textContent = `${messageInput.value.length} / 1000`;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || name.length > 60 || !message || message.length > 1000) {
      setStatus("Please check your name and feedback, then try again.", "error");
      return;
    }

    if (!Number.isInteger(selectedRating) || selectedRating < 1 || selectedRating > 5) {
      setStatus("Please select a star rating first.", "error");
      ratingPicker.focus();
      return;
    }

    if (!consentInput.checked) {
      setStatus("Please confirm that Rookees may store this feedback for internal review.", "error");
      consentInput.focus();
      return;
    }

    if (honeypot && honeypot.value.trim()) {
      setStatus("Thanks! Your feedback has been received.", "success");
      form.reset();
      return;
    }

    if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\//i.test(endpoint)) {
      setStatus("The feedback form is not connected yet. Please try again later.", "error");
      return;
    }

    const payload = new URLSearchParams({
      name,
      rating: String(selectedRating),
      message,
      submittedAt: new Date().toISOString(),
      source: window.location.href,
      website: honeypot ? honeypot.value : "",
    });

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = "Sending…";

    try {
      // Apps Script is cross-origin. A URL-encoded no-cors POST avoids preflight;
      // the browser intentionally does not expose the response body/status.
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });

      form.reset();
      selectedRating = 0;
      ratingInput.value = "";
      ratingStars.forEach((star, index) => {
        star.classList.remove("is-active");
        star.setAttribute("aria-checked", "false");
        star.tabIndex = index === 0 ? 0 : -1;
      });
      ratingHint.textContent = "Tap a star to rate your experience.";
      characterCount.textContent = "0 / 1000";
      setStatus(
        "Thanks for sharing your feedback! The submission was sent. Because of browser security restrictions, we cannot confirm the spreadsheet write from this page.",
        "success",
      );
    } catch (error) {
      console.error("Review submission failed.", error);
      setStatus("We couldn't send your feedback. Please check your connection and try again.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      submitButton.textContent = originalButtonText;
    }
  });
})();
