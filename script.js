"use strict";
const FAVORITES_KEY = "northStarBakeryFavorites";
const bakeryItems = [
  { name: "Signature Loaf", category: "Breads" },
  { name: "Croissants", category: "Pastries" },
  { name: "Celebration Cake", category: "Cakes" }
];
const validationRules = { name: "Please enter your name (at least 2 characters).", email: "Enter a valid email address.", request: "Choose a request type.", pickup: "Choose a pickup date.", details: "Please describe what you need (at least 5 characters)." };
function loadFavorites() {
  try { const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); return Array.isArray(saved) ? saved.filter(x => bakeryItems.some(item => item.name === x)) : []; }
  catch { return []; }
}
function saveFavorites(favorites) { try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); } catch { /* Storage may be unavailable in private mode. */ } }
function renderFavorites(favorites) {
  const list = document.getElementById("favorite-list"); if (!list) return;
  list.replaceChildren();
  favorites.forEach(name => { const li = document.createElement("li"); const item = bakeryItems.find(x => x.name === name); li.textContent = `${name} (${item.category})`; list.append(li); });
  document.getElementById("favorite-status").textContent = favorites.length ? `${favorites.length} saved favorite${favorites.length === 1 ? "" : "s"}. Your choices are remembered on this browser.` : "No favorites saved yet.";
  document.querySelectorAll("[data-favorite]").forEach(button => { const saved = favorites.includes(button.dataset.favorite); button.setAttribute("aria-pressed", String(saved)); button.textContent = `${saved ? "Remove" : "Save"} ${button.dataset.favorite}`; });
}
function initFavorites() {
  if (!document.getElementById("favorite-list")) return;
  let favorites = loadFavorites(); renderFavorites(favorites);
  document.querySelectorAll("[data-favorite]").forEach(button => button.addEventListener("click", () => {
    const name = button.dataset.favorite; favorites = favorites.includes(name) ? favorites.filter(x => x !== name) : [...favorites, name]; saveFavorites(favorites); renderFavorites(favorites);
  }));
  document.getElementById("clear-favorites").addEventListener("click", () => { favorites = []; saveFavorites(favorites); renderFavorites(favorites); });
}
function validateField(field) {
  const value = field.value.trim(); let message = "";
  if (field.id === "name" && value.length < 2) message = validationRules.name;
  if (field.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = validationRules.email;
  if (field.id === "request" && !value) message = validationRules.request;
  if (field.id === "pickup" && !value) message = validationRules.pickup;
  if (field.id === "details" && value.length < 5) message = validationRules.details;
  document.getElementById(field.id + "-error").textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message))); return !message;
}
function initForm() {
  const form = document.getElementById("inquiry-form"); if (!form) return;
  const fields = ["name", "email", "request", "pickup", "details"].map(id => document.getElementById(id));
  fields.forEach(field => field.addEventListener("input", () => { if (field.hasAttribute("aria-invalid")) validateField(field); }));
  form.addEventListener("submit", event => { event.preventDefault(); const results = fields.map(validateField);
    if (results.includes(false)) { document.getElementById("form-status").textContent = "Please fix the highlighted fields before continuing."; fields[results.indexOf(false)].focus(); return; }
    document.getElementById("form-status").textContent = "Your details look good. This is a class demo, so no request was sent to the bakery.";
  });
}
document.addEventListener("DOMContentLoaded", () => { initFavorites(); initForm(); });
