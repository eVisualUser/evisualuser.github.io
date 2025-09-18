/* This document is the main entry point for the website */

document.addEventListener("DOMContentLoaded", async function () {
  await GenerateCards();
  await SetupCardsLogic();

  document.getElementById("loading-icon").remove();
});
