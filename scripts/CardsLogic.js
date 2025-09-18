let focused_overview = null;

let hide_button;

/// To be ran only when all the cards are shown to screen
async function SetupCardsLogic() {
  document.body.addEventListener("click", async function (event) {
    if (event.target === document.body) {
      await hideOverview();
    }
  });

  hide_button = document.getElementById("hide-button");

  if (hide_button) {
    hide_button.addEventListener("click", hideOverview);
  }

  let hash = this.window.location.hash;
  hash = hash.slice(1);

  for (let card of this.document.getElementsByClassName("card")) {
    card.addEventListener("click", async function () {
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
  if (location.hash.length <= 0) {
    await hideOverview();
  } else if (
    focused_overview == null &&
    document.getElementById(location.hash.slice(1)).className === "overview"
  ) {
    showOverview(document.getElementById(location.hash.slice(1)));
  }
});

async function showOverview(overview) {
  if (focused_overview) {
    focused_overview.style.display = "none";
  }

  focused_overview = overview;
  focused_overview.style.display = "block";

  hide_button.style.display = "block";

  window.location.hash = overview.id;
}

async function hideOverview() {
  if (focused_overview) {
    focused_overview.style.animation = "show-overview";
    focused_overview.style.display = "none";

    hide_button.style.display = "none";

    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );

    focused_overview = null;
  }
}
