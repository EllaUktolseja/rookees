(() => {
  "use strict";

  const STORAGE_KEY = "rookees-local-reviews";

  const form = document.querySelector("#review-form");
  const nameInput = document.querySelector("#review-name");
  const messageInput = document.querySelector("#review-message");
  const ratingInput = document.querySelector("#review-rating");
  const consentInput = document.querySelector("#review-consent");

  const ratingPicker = document.querySelector("#rating-picker");
  const ratingStars = [...document.querySelectorAll(".rating-star")];
  const ratingHint = document.querySelector("#rating-hint");

  const characterCount = document.querySelector("#character-count");
  const statusMessage = document.querySelector("#review-status");

  const reviewsList = document.querySelector("#reviews-list");
  const emptyState = document.querySelector("#reviews-empty");

  if (!form) return;

  const ratingLabels = {
    1: "We're sorry to hear that.",
    2: "Thanks for being honest.",
    3: "Thanks for your feedback!",
    4: "So glad you enjoyed it!",
    5: "Yay! We're glad you loved it!",
  };

  let selectedRating = 0;
  let reviews = loadReviews();

  function loadReviews() {
    try {
      const savedReviews = localStorage.getItem(STORAGE_KEY);

      if (!savedReviews) return [];

      const parsedReviews = JSON.parse(savedReviews);

      if (!Array.isArray(parsedReviews)) return [];

      return parsedReviews.filter((review) => {
        return (
          typeof review.name === "string" &&
          typeof review.message === "string" &&
          Number.isInteger(review.rating) &&
          review.rating >= 1 &&
          review.rating <= 5 &&
          typeof review.date === "string"
        );
      });
    } catch (error) {
      console.warn("Could not load local reviews.", error);
      return [];
    }
  }

  function saveReviews() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      return true;
    } catch (error) {
      console.error("Could not save local reviews.", error);
      return false;
    }
  }

  function setStatus(message, type = "") {
    statusMessage.textContent = message;
    statusMessage.className = "feedback-form__status";

    if (type) {
      statusMessage.classList.add(`is-${type}`);
    }
  }

  function selectRating(rating) {
    selectedRating = rating;
    ratingInput.value = String(rating);

    ratingStars.forEach((star) => {
      const starRating = Number(star.dataset.rating);
      const isActive = starRating <= rating;
      const isSelected = starRating === rating;

      star.classList.toggle("is-active", isActive);
      star.setAttribute("aria-checked", String(isSelected));
    });

    ratingHint.textContent = `${rating} out of 5 — ${ratingLabels[rating]}`;
    setStatus();
  }

  ratingStars.forEach((star, index) => {
    star.addEventListener("click", () => {
      selectRating(Number(star.dataset.rating));
    });

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

  function createReviewCard(review) {
    const article = document.createElement("article");
    article.className = "review-card";

    const stars = document.createElement("div");
    stars.className = "review-card__stars";
    stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
    stars.textContent =
      "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const message = document.createElement("p");
    message.className = "review-card__message";
    message.textContent = review.message;

    const author = document.createElement("p");
    author.className = "review-card__author";
    author.textContent = review.name;

    const date = document.createElement("time");
    date.className = "review-card__date";
    date.dateTime = review.date;

    const parsedDate = new Date(`${review.date}T00:00:00`);

    date.textContent = Number.isNaN(parsedDate.getTime())
      ? review.date
      : new Intl.DateTimeFormat("en", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(parsedDate);

    article.append(stars, message, author, date);

    return article;
  }

  function renderReviews() {
    reviewsList.replaceChildren();

    emptyState.hidden = reviews.length > 0;

    reviews.forEach((review) => {
      reviewsList.appendChild(createReviewCard(review));
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      setStatus("Please fill in your name and feedback.", "error");
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      setStatus("Please select a star rating first.", "error");
      ratingPicker.focus();
      return;
    }

    if (!consentInput.checked) {
      setStatus("Please confirm the feedback display consent.", "error");
      consentInput.focus();
      return;
    }

    const review = {
      id:
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      rating: selectedRating,
      message,
      date: new Date().toISOString().slice(0, 10),
    };

    const previousReviews = reviews;
    reviews = [review, ...reviews];

    if (!saveReviews()) {
      reviews = previousReviews;

      setStatus(
        "Your review could not be saved in this browser. Please check your browser storage settings and try again.",
        "error",
      );
      return;
    }

    renderReviews();
    form.reset();

    selectedRating = 0;
    ratingInput.value = "";

    ratingStars.forEach((star) => {
      star.classList.remove("is-active");
      star.setAttribute("aria-checked", "false");
    });

    ratingHint.textContent = "Tap a star to rate your experience.";
    characterCount.textContent = "0 / 1000";

    setStatus(
      "Thank you for sharing your thoughts! Your review is saved in this browser only.",
      "success",
    );

    document
      .querySelector("#reviews-wall-title")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderReviews();
})();
