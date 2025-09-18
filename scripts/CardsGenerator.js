const indexFilePath = "content/index.json";

class Card {
  title;
  description;
  short_description;
  image;
  content;
  overview;
  content_type;
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

    cards.push(newCard);
  });

  // Avoid keeping in memory the card index
  cardIndex = null;

  for (let card of cards) {
    // Card
    let cardHTML = `
      <div class="card" overview="${card.overview}">
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

    // Support Markdown and HTML content types
    if (card.content_type == "markdown") {
      let overviewHTML = `
        <div class="overview" id="${card.overview}">
          <md-block>
            ${overviewContent}
          </md-block>
        </div>
      `;

      document.getElementById("generated-overviews").innerHTML += overviewHTML;
    } else if (card.content_type == "html") {
      let overviewHTML = `
      <div class="overview" id="${card.overview}">
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
