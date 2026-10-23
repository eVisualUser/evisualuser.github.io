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
  status;
  try;
  related;
}

function getRelatedBadgesHTML(related, context = "card") {
  if (!related) return "";
  const items = Array.isArray(related) ? related : [related];
  if (items.length === 0) return "";

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  let badgesHtml = items
    .map((rel) => {
      const title = rel.title || rel.name || "Project";
      const overview = rel.overview || "";
      const relation =
        rel.relation ||
        rel.relationship ||
        rel.label ||
        `Co-developed with ${title}`;
      const icon = rel.icon || "🔗";

      return `
        <button type="button" class="badge-related" data-overview="${escapeHtml(
          overview,
        )}" title="Go to ${escapeHtml(title)} (${escapeHtml(relation)})">
          <span class="badge-related-icon">${escapeHtml(icon)}</span>
          <span class="badge-related-text">${escapeHtml(relation)}</span>
          <span class="badge-related-arrow">↗</span>
        </button>
      `;
    })
    .join("");

  if (context === "overview") {
    return `
      <div class="overview-related-section">
        <div class="overview-related-title">⚡ Related Projects & Ecosystem</div>
        <div class="overview-related-badges">
          ${badgesHtml}
        </div>
      </div>
    `;
  }

  return `
    <div class="card-related">
      ${badgesHtml}
    </div>
  `;
}

function getStatusBadgeHTML(status) {
  if (!status) return "";
  const raw = String(status).trim();
  const normalized = raw.toLowerCase();

  if (
    [
      "wip",
      "work in progress",
      "work-in-progress",
      "work_in_progress",
      "in progress",
      "in-progress",
      "in_progress",
      "ongoing",
    ].includes(normalized)
  ) {
    return `<span class="badge badge-wip"><span class="badge-dot"></span>Work in Progress</span>`;
  }

  if (
    [
      "done",
      "completed",
      "complete",
      "finished",
      "released",
    ].includes(normalized)
  ) {
    return `<span class="badge badge-done"><span class="badge-dot"></span>Done</span>`;
  }

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return `<span class="badge badge-custom"><span class="badge-dot"></span>${escapeHtml(raw)}</span>`;
}

function GenerateTryPanel(cards) {
  const tryContainer = document.getElementById("try-panel-list");
  const tryBadgeCount = document.getElementById("try-badge-count");
  if (!tryContainer) return;

  let tryItems = [];

  cards.forEach((card) => {
    if (!card.try) return;
    const items = Array.isArray(card.try) ? card.try : [card.try];
    items.forEach((item) => {
      tryItems.push({
        title: item.title || card.title,
        tag: item.tag || (item.type === "steam" ? "Steam" : "Playable"),
        type: item.type || "playable",
        url: item.url,
        buttonText:
          item.button_text ||
          (item.type === "steam" ? "Steam Page" : "Play / Download"),
        description: item.description || card.short_description,
        image: item.image || card.image,
        overview: card.overview,
        status: card.status,
      });
    });
  });

  if (tryBadgeCount) {
    tryBadgeCount.textContent = tryItems.length;
  }

  let html = "";
  tryItems.forEach((item) => {
    const isSteam =
      item.type === "steam" ||
      (item.url && item.url.includes("steampowered.com"));
    const tagClass = isSteam ? "try-tag-steam" : "try-tag-play";
    const statusBadge = getStatusBadgeHTML(item.status);
    const icon = isSteam ? "🎮" : "🕹️";

    html += `
      <div class="try-card">
        <div class="try-card-banner">
          <img src="${item.image}" alt="${item.title}" class="try-card-img" />
          <div class="try-card-tags">
            <span class="try-tag ${tagClass}">${icon} ${item.tag}</span>
            ${statusBadge}
          </div>
        </div>
        <div class="try-card-content">
          <h3 class="try-card-title">${item.title}</h3>
          <p class="try-card-desc">${item.description}</p>
          <div class="try-card-actions">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="try-btn try-btn-primary">
              <span>${item.buttonText}</span>
              <span class="try-btn-arrow">↗</span>
            </a>
            ${
              item.overview
                ? `<button type="button" class="try-btn try-btn-secondary" data-overview="${item.overview}">
                    <span>📖 Overview</span>
                   </button>`
                : ""
            }
          </div>
        </div>
      </div>
    `;
  });

  tryContainer.innerHTML = html;
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
    newCard.status = card["status"] || card["badge"] || card["state"] || null;
    newCard.try = card["try"] || null;
    newCard.related = card["related"] || null;

    if ("html_header" in card) {
      newCard.html_header = card["html_header"];
    } else {
      newCard.html_header = null;
    }

    cards.push(newCard);
  });

  // Generate the Try & Play side panel items
  GenerateTryPanel(cards);

  // Avoid keeping in memory the card index
  cardIndex = null;

  for (let card of cards) {
    let badgeHTML = getStatusBadgeHTML(card.status);
    let relatedCardHTML = getRelatedBadgesHTML(card.related, "card");
    let relatedOverviewHTML = getRelatedBadgesHTML(card.related, "overview");

    // Card
    let cardHTML = `
      <div class="card" overview="${card.overview}" data-image="${card.image}">
        ${badgeHTML}
        <img src="${card.image}" alt="${card.title}">
        <h1>${card.title}</h1>
        <p>${card.short_description}</p>
        ${relatedCardHTML}
      </div>
    `;

    document.getElementById("generated-cards").innerHTML += cardHTML;

    let htmlHeader = "";

    if (card.html_header !== null) {
      await fetch(card.html_header).then(
        async (response) => (htmlHeader = await response.text()),
      );
    }

    let overviewBadge = badgeHTML
      ? `<div class="overview-badge-container">${badgeHTML}</div>`
      : "";

    // Support for Markdown and HTML content types
    if (card.content_type === "markdown") {
      let overviewHTML = `
        <div class="overview" id="${card.overview}" data-image="${card.image}">
          ${overviewBadge}
          ${htmlHeader}
          <md-block src="${card.content}"></md-block>
          ${relatedOverviewHTML}
        </div>
      `;

      document.getElementById("generated-overviews").innerHTML += overviewHTML;
    } else if (card.content_type === "html") {
      let overviewContent = "";

      await fetch(card.content).then(
        async (response) => (overviewContent = await response.text()),
      );

      let overviewHTML = `
        <div class="overview" id="${card.overview}" data-image="${card.image}">
          ${overviewBadge}
          ${htmlHeader}
          ${overviewContent}
          ${relatedOverviewHTML}
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
