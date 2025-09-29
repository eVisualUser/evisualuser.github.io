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
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      e.keyCode == 83
    ) {
      e.preventDefault();
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8, " +
          encodeURIComponent("Sylvain_Tosoni_Resume.pdf"),
      );
      element.setAttribute(
        "download",
        "./content/resume/Sylvain_Tosoni_Resume.pdf",
      );
      document.body.appendChild(element);
      element.click();

      document.body.removeChild(element);

      window.clarity("event", "download_resume");
    }
  },
  false,
);
