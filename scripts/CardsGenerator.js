const indexFilePath = "content/index.json";

class Card {
  title;
  description;
  short_description;
  image;
  content;
  overview;
  content_type;
  html_header;
}

/// Load the card index from the specified file path.
async function LoadCardIndex(path = indexFilePath) {
  return await fetch(path).then((response) => response.json());
}

async function GenerateCards() {
  let cards = [];

  let cardIndex = await LoadCardIndex();

  cardIndex["cards"].forEach((card) => {
    let newCard = new Card();

    newCard.title = card["title"];
    newCard.description = card["description"];
    newCard.short_description = card["short_description"];
    newCard.image = card["image"];
    newCard.content = card["content"];
    newCard.overview = card["overview"];
    newCard.content_type = card["content-type"];

    if ("html_header" in card) {
      newCard.html_header = card["html_header"];
    } else {
      newCard.html_header = null;
    }

    cards.push(newCard);
  });

  // Avoid keeping in memory the card index
  cardIndex = null;

  for (let card of cards) {
    // Card
    let cardHTML = `
      <div class="card" overview="${card.overview}">
        <br/>
        <img src="${card.image}" alt="${card.title}">
        <h1>${card.title}</h1>
        <p>${card.short_description}</p>
      </div>
    `;

    document.getElementById("generated-cards").innerHTML += cardHTML;

    let overviewContent = "";

    await fetch(card.content).then(
      async (response) => (overviewContent = await response.text()),
    );

    let htmlHeader = "";

    if (card.html_header !== null) {
      await fetch(card.html_header).then(
        async (response) => (htmlHeader = await response.text()),
      );
    }

    // Support for Markdown and HTML content types
    if (card.content_type === "markdown") {
      let overviewHTML = `
        <div class="overview" id="${card.overview}">
          ${htmlHeader}
          <md-block>
            ${overviewContent}
          </md-block>
        </div>
      `;

      document.getElementById("generated-overviews").innerHTML += overviewHTML;
    } else if (card.content_type === "html") {
      let overviewHTML = `
        <div class="overview" id="${card.overview}">
          ${htmlHeader}
          ${overviewContent}
        </div>
      `;

      document.getElementById("generated-overviews").innerHTML += overviewHTML;
    } else {
      console.warn(
        `Unsupported content_type "${card.content_type}" for ${card.title}`,
      );
    }
  }
}
