/* Public frontend settings for Rookees.
 * Set googleAppsScriptUrl after deploying the Apps Script web app.
 * Never put private credentials or API keys in this file.
 */
window.ROOKEES_CONFIG = Object.freeze({
  whatsappNumber: "6285710304280",
  googleAppsScriptUrl:
    "https://script.google.com/macros/s/AKfycby0o6KBG_sWfqNFoYLUwoc7rvOT0QWFTAgDVxH0QkjXfYi5VdIahwit2WdQ3ijEef_z/exec",
});

window.ROOKEES_WHATSAPP_NUMBER = window.ROOKEES_CONFIG.whatsappNumber;
