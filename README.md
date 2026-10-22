# Rookees — Brownie-Cookie Dessert Website

Rookees is a lightweight, multi-page static website for a brownie-cookie dessert concept. It introduces the brand, explains the product idea, and provides a feedback form for internal product research.

## Pages

- `index.html` — homepage and product discovery.
- `about.html` — brand story and vision.
- `products.html` — product concept and development approach.
- `reviews.html` — private feedback form; submissions are intended for internal Google Sheets tracking and are not published on the site.

## Stack

- HTML5, CSS3, and vanilla JavaScript.
- Google Apps Script + Google Sheets for review collection (requires setup; see below).
- WhatsApp click-to-chat for orders.
- No Node.js backend or build step is required to serve the static pages.

## Run locally

Open the folder in VS Code and use Live Server, or serve the folder with any static HTTP server. Using a local server is preferable to opening files directly with `file://`.

## Configure WhatsApp

The order links are configured in `js/config.js`. The current shop number is set to `6285710304280`. Verify it belongs to the official Rookees order account before publishing.

## Connect feedback to Google Sheets

1. Create a Google Sheet for internal feedback collection.
2. Open **Extensions → Apps Script** and copy the contents of `google-apps-script/Code.gs` into the script editor.
3. In Apps Script **Project Settings → Script Properties**, add `SPREADSHEET_ID` with the spreadsheet ID from the Sheet URL.
4. Run `setupSheet()` once from the Apps Script editor and approve the requested access. This creates the `Reviews` tab and column headings.
5. Select **Deploy → New deployment → Web app**. Set **Execute as** to your account and **Who has access** to **Anyone**, then deploy. Only use a spreadsheet dedicated to this feedback form; the endpoint must be public for a static site to submit without user login.
6. Copy the deployed web app URL ending in `/exec` into `googleAppsScriptUrl` in `js/config.js`.
7. Submit a test review and confirm a new row appears in the Sheet before announcing the website.

The frontend sends a URL-encoded cross-origin request in `no-cors` mode, so browser JavaScript cannot read the Apps Script response. The page can report that the request was sent, but it cannot prove that the row was saved. Always verify with a test submission in the Sheet. The endpoint is public and can receive spam; the script includes basic validation and a honeypot but is not a substitute for robust abuse protection. Do not collect sensitive personal information.

## Deployment checklist

- Confirm `assets/` is committed as actual files (not just a Git submodule pointer) and every referenced image exists. The current repository tree records `assets` as a submodule commit, while `.gitmodules` is absent; this must be fixed before image delivery can be considered reliable.
- Configure and test the Google Apps Script endpoint.
- Verify the WhatsApp number and test each order link on mobile and desktop.
- Test all four pages, browser console, image loading, mobile navigation, and form validation.
- Deploy the repository root as a static site. No build command is needed; the output directory is the repository root.

## Repair the assets Git submodule before deployment

The main repository currently records `assets` as a Git submodule pointer without a `.gitmodules` file. If your local `assets` directory contains the real images and logo, convert it to ordinary tracked files from the project root in PowerShell:

```powershell
git status
Get-ChildItem .\assets -Recurse -File | Select-Object FullName, Length
```

First confirm that the output includes the expected image files. If the directory is empty or the images are missing, stop and restore the assets from your original local copy before continuing. If the files are present and you have pulled the latest `main`:

```powershell
git rm --cached -f assets
if (Test-Path .\assets\.git) { Remove-Item .\assets\.git -Recurse -Force }
git add assets
git status
git commit -m "fix: track website assets in main repository"
git push origin main
```

This removes Git metadata inside `assets` but keeps the image files; check `git status` carefully before committing. After pushing, verify the `assets/images` files appear as ordinary files in the GitHub repository tree. Do not run the conversion if the local images are not present.

## Current status

The static pages, shared navigation/footer, WhatsApp links, and Google Sheets submission code are present. Google Sheets collection will not work until the Apps Script web app is deployed and its `/exec` URL is added to `js/config.js`. The image submodule issue is also still a deployment blocker.
