# Rookees — Brownie-Cookie Dessert Concept

Rookees is a multi-page brand website for a brownie-cookie dessert concept. It introduces the brand, explains the product idea and development approach, and gives visitors a place to share feedback.

## Website pages

- **Home** (`index.html`) — brand introduction, product highlights, and calls to action.
- **Our Story** (`about.html`) — the origin, idea, opportunity, and future direction of Rookees.
- **Product** (`products.html`) — product concept, intended qualities, development process, and packaging direction.
- **Reviews & Feedback** (`reviews.html`) — a customer feedback form with a 1–5 star rating and review wall.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Google Sheets integration planned for review collection via Google Apps Script
- WhatsApp deep links planned for direct ordering

The site is designed as a lightweight static frontend and does not require a Node.js backend to serve its pages.

## Run locally

Open `index.html` directly for a basic preview, or use a local static server / VS Code Live Server for a more reliable development experience.

## Deployment checklist

Before publishing, verify that all image assets are committed to the repository and served at their referenced paths, configure the official WhatsApp order number, deploy and configure the Google Apps Script endpoint for review submissions, then test every page and form on desktop and mobile.

## Project status

The public-facing pages and shared navigation/footer are implemented. Review submissions are not production-ready until the Google Sheets endpoint is configured. Do not treat browser `localStorage` as a shared review database.
