/* This document is the main entry point for the website */

document.addEventListener("DOMContentLoaded", async function () {
  await GenerateCards();
  await SetupCardsLogic();

  document.getElementById("loading-icon").remove();
});

// Open Resume if trying to save the page
document.addEventListener(
  "keydown",
  function (e) {
    if (e.metaKey | e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();

      open(window.location.href +  "resume/resume.html", "_self");
    }
  },
  false,
);
