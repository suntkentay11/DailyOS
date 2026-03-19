
function setDateDisplay() {
  const dayEl = document.getElementById("currentDay");
  const dateEl = document.getElementById("currentDate");

  if (!dayEl || !dateEl) return;

  const now = new Date();

  // Day name (Thursday, Friday, ...)
  const dayName = now.toLocaleDateString(undefined, { weekday: "long" });

  // Full date (March 19, 2026)
  const fullDate = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  dayEl.textContent = dayName;
  dateEl.textContent = fullDate;
}

document.addEventListener("DOMContentLoaded", setDateDisplay);