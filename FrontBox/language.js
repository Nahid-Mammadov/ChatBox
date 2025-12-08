import { translations } from "./translations.js";

const langSelect = document.getElementById("languageSelect");
const elements = document.querySelectorAll("[data-key]");

const savedLang = localStorage.getItem("language") || "az";
setLanguage(savedLang);
if (langSelect) langSelect.value = savedLang;

if (langSelect) {
  langSelect.addEventListener("change", (e) => {
    const lang = e.target.value;
    localStorage.setItem("language", lang);
    setLanguage(lang);
  });
}

function setLanguage(lang) {
  elements.forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang][key]) {
      if (el.placeholder !== undefined && el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });
}
