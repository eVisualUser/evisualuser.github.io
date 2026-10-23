let focused_overview = null;

let hide_button;

let try_panel;
let try_toggle;
let try_close;
let try_backdrop;

let currentBgImage = null;
let currentBgLayer = 1;

function setPageBackground(imageUrl) {
  if (!imageUrl || imageUrl === currentBgImage) return;
  currentBgImage = imageUrl;

  const layer1 = document.querySelector(".bg-layer-1");
  const layer2 = document.querySelector(".bg-layer-2");
  if (!layer1 || !layer2) return;

  const nextLayer = currentBgLayer === 1 ? layer2 : layer1;
  const currentLayerEl = currentBgLayer === 1 ? layer1 : layer2;

  nextLayer.style.backgroundImage = `url("${imageUrl}")`;
  nextLayer.classList.add("active");
  currentLayerEl.classList.remove("active");

  currentBgLayer = currentBgLayer === 1 ? 2 : 1;
}

function initBackground() {
  const allCards = Array.from(document.querySelectorAll(".card"));
  if (allCards.length === 0) return;

  const hash = window.location.hash.slice(1);
  let matchedCard = null;

  if (hash) {
    matchedCard = allCards.find(
      (c) => c.getAttribute("overview") === hash || c.id === hash,
    );
  }

  if (matchedCard) {
    const bg = matchedCard.getAttribute("data-image");
    if (bg) {
      setPageBackground(bg);
    }
  } else {
    const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
    const bg = randomCard?.getAttribute("data-image");
    if (bg) {
      setPageBackground(bg);
    }
  }
}

function openTryPanel() {
  if (try_panel) {
    try_panel.classList.add("open");
  }
  if (try_backdrop) {
    try_backdrop.classList.add("active");
  }
  if (try_toggle) {
    try_toggle.classList.add("panel-open");
  }
  document.body.classList.add("try-panel-is-open");
}

function closeTryPanel() {
  if (try_panel) {
    try_panel.classList.remove("open");
  }
  if (try_backdrop) {
    try_backdrop.classList.remove("active");
  }
  if (try_toggle) {
    try_toggle.classList.remove("panel-open");
  }
  document.body.classList.remove("try-panel-is-open");
}

function toggleTryPanel() {
  if (try_panel && try_panel.classList.contains("open")) {
    closeTryPanel();
  } else {
    openTryPanel();
  }
}

/// To be ran only when all the cards are shown to screen
async function SetupCardsLogic() {
  initBackground();

  try_panel = document.getElementById("try-side-panel");
  try_toggle = document.getElementById("try-panel-toggle");
  try_close = document.getElementById("try-panel-close");
  try_backdrop = document.getElementById("try-panel-backdrop");

  if (try_toggle) {
    try_toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleTryPanel();
    });
  }

  if (try_close) {
    try_close.addEventListener("click", closeTryPanel);
  }

  if (try_backdrop) {
    try_backdrop.addEventListener("click", closeTryPanel);
  }

  // Handle overview triggers inside the try panel and related project badges
  document.addEventListener("click", async function (event) {
    const overviewBtn = event.target.closest(
      ".try-btn-secondary[data-overview], .badge-related[data-overview]",
    );
    if (overviewBtn) {
      event.preventDefault();
      event.stopPropagation();
      const overviewId = overviewBtn.getAttribute("data-overview");
      const overview = document.getElementById(overviewId);
      if (overview) {
        closeTryPanel();
        await showOverview(overview);
      }
    }
  });

  document.addEventListener("md-render", function (event) {
    if (window.Prism && event.target) {
      Prism.highlightAllUnder(event.target);
    }
  });

  document.body.addEventListener("click", async function (event) {
    if (
      event.target === document.body ||
      event.target.id === "content-section" ||
      event.target.id === "generated-overviews"
    ) {
      await hideOverview();
    }
  });

  document.addEventListener("keydown", async function (event) {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      if (try_panel && try_panel.classList.contains("open")) {
        closeTryPanel();
      } else {
        await hideOverview();
      }
    }
  });

  hide_button = document.getElementById("hide-button");

  if (hide_button) {
    hide_button.addEventListener("click", hideOverview);
  }

  let hash = this.window.location.hash;
  hash = hash.slice(1);

  for (let card of this.document.getElementsByClassName("card")) {
    card.addEventListener("click", async function (event) {
      if (
        event &&
        event.target &&
        (event.target.closest(".badge-related") ||
          event.target.closest(".card-related"))
      ) {
        return;
      }
      let bg = card.getAttribute("data-image");
      if (bg) {
        setPageBackground(bg);
      }

      let overview = document.getElementById(card.getAttribute("overview"));
      if (overview) {
        await showOverview(overview);
        hide_button.style.display = "block";
      } else {
        console.error(
          "Failed to find overview for card: ",
          card.getAttribute("overview"),
        );
      }
    });

    // Open the card if it has the same overview as the hash
    if (card.getAttribute("overview") === hash) {
      await card.click();
    }
  }
}

window.addEventListener("hashchange", async () => {
  let hash = location.hash.slice(1);
  if (hash.length <= 0) {
    await hideOverview();
  } else {
    let overview = document.getElementById(hash);
    if (overview && overview.classList.contains("overview")) {
      await showOverview(overview);
    }
  }
});

async function showOverview(overview) {
  if (focused_overview) {
    focused_overview.style.display = "none";
  }

  let bg =
    overview.getAttribute("data-image") ||
    document
      .querySelector(`.card[overview="${overview.id}"]`)
      ?.getAttribute("data-image");
  if (bg) {
    setPageBackground(bg);
  }

  focused_overview = overview;
  focused_overview.style.display = "block";
  overview.scrollTop = 0;

  if (window.Prism) {
    Prism.highlightAllUnder(overview);
  }

  if (hide_button) {
    hide_button.style.display = "block";
  }

  window.location.hash = overview.id;

  if (typeof window.clarity === "function") {
    window.clarity("event", "show_overview_" + overview.id);
  }
}

async function hideOverview() {
  if (focused_overview) {
    focused_overview.style.animation = "show-overview";
    focused_overview.style.display = "none";

    if (hide_button) {
      hide_button.style.display = "none";
    }

    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );

    focused_overview = null;

    if (typeof window.clarity === "function") {
      await window.clarity("event", "hide_overview");
    }
  }
}
