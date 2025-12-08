// language.js
import { translations } from "./translations.js";

function applyLanguage(lang) {
  // Hər çağıranda DOM-dan yenidən oxuyaq
  const elements = document.querySelectorAll("[data-key]");

  elements.forEach((el) => {
    const key = el.getAttribute("data-key");
    const value = translations[lang]?.[key];
    if (!value) return; // Bu key üçün tərcümə yoxdursa, keç

    // INPUT / TEXTAREA placeholder
    if (
      (el.tagName === "INPUT" || el.tagName === "TEXTAREA") &&
      el.hasAttribute("placeholder")
    ) {
      el.placeholder = value;
    }
    // <title data-key="...">
    else if (el.tagName === "TITLE") {
      document.title = value;
    }
    // Normal text content
    else {
      el.textContent = value;
    }
  });
}

// Dil seçimi elementi
const langSelect = document.getElementById("languageSelect");

// Saxlanmış dili götür
const savedLang = localStorage.getItem("language") || "az";
applyLanguage(savedLang);

// Dropdownda default seçili dil
if (langSelect) {
  langSelect.value = savedLang;

  langSelect.addEventListener("change", (e) => {
    const lang = e.target.value;
    localStorage.setItem("language", lang);
    applyLanguage(lang);
  });
}
