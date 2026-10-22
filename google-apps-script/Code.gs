/**
 * Rookees feedback collector for Google Apps Script.
 *
 * Setup:
 * 1. Create a Google Sheet and copy its spreadsheet ID from the URL.
 * 2. In Apps Script, set Script Property SPREADSHEET_ID to that ID.
 * 3. Run setupSheet() once and approve the requested permissions.
 * 4. Deploy as a Web app, execute as yourself, access: Anyone.
 * 5. Copy the /exec URL into js/config.js -> googleAppsScriptUrl.
 *
 * This endpoint is public because the static website has no server-side secret.
 * Keep an eye on spam and quota usage. Do not store sensitive personal data here.
 */

const SHEET_NAME = "Reviews";
const HEADERS = ["Submitted At", "Name", "Rating", "Feedback", "Source"];

function setupSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) {
    throw new Error("Set the SPREADSHEET_ID script property before running setupSheet().");
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, HEADERS.length);
  }
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};

    // Quietly discard submissions that fill the hidden honeypot field.
    if (String(params.website || "").trim()) {
      return jsonResponse({ ok: true });
    }

    const name = cleanText(params.name, 60);
    const message = cleanText(params.message, 1000);
    const rating = Number(params.rating);
    const source = cleanText(params.source, 500);
    const submittedAt = new Date(params.submittedAt || "");
    const safeSubmittedAt = Number.isNaN(submittedAt.getTime()) ? new Date() : submittedAt;

    if (!name || !message || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return jsonResponse({ ok: false, error: "Invalid submission." });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
      if (!spreadsheetId) throw new Error("SPREADSHEET_ID script property is missing.");

      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
      }

      sheet.appendRow([
        safeSubmittedAt,
        safeCell(name),
        rating,
        safeCell(message),
        safeCell(source),
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "Unable to save feedback." });
  }
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

// Prevent spreadsheet formula injection from user-submitted text.
function safeCell(value) {
  const text = String(value || "");
  return /^[=+@-]/.test(text) ? "'" + text : text;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
