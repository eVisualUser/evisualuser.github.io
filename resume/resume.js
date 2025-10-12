// Trigger printing instead of saving the web page
document.addEventListener(
  "keydown",
  function (e) {
    if (e.metaKey | e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();

      window.print();
    }
  },
  false,
);
