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
      const fileUrl = "./assets/resume/Sylvain_Tosoni_Resume.pdf";
      const fileName = "Sylvain_Tosoni_Resume.pdf";
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.clarity("event", "download_resume");
    }
  },
  false,
);
