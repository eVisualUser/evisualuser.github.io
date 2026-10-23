let current_localization;

let localization_path = "./localization.json";

let localization_json = undefined;

let localization_button = [];

// Trigger printing instead of saving the web page
document.addEventListener(
  "keydown",
  async function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      window.print();
    }
  },
  false,
);

// Load text from localization
async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return await response.json();
}

function update_active_button(lang) {
  document.querySelectorAll("button[setlang]").forEach((button) => {
    if (button.getAttribute("setlang") === lang) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

window.addEventListener("hashchange", async () => {
  if (
    window.location.hash !== null &&
    window.location.hash !== undefined &&
    window.location.hash !== ""
  ) {
    await apply_localization(window.location.hash.substring(1));
  } else {
    await apply_localization("en");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const resumeEl = document.getElementById("resume");
  if (resumeEl) {
    resumeEl.style.opacity = "0";
    resumeEl.style.transition = "opacity 0.2s ease-in";
  }

  let buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (button.hasAttribute("setlang")) {
      localization_button.push(button);
      button.addEventListener("click", async () => {
        await apply_localization(button.getAttribute("setlang"));
      });
    }
  });

  let print_button = document.getElementById("print");
  if (print_button) {
    print_button.addEventListener("click", () => {
      window.print();
    });
  }

  if (
    window.location.hash !== null &&
    window.location.hash !== undefined &&
    window.location.hash !== ""
  ) {
    await apply_localization(window.location.hash.substring(1));
  } else {
    await apply_localization("en");
  }

  if (resumeEl) {
    resumeEl.style.opacity = "1";
  }
});

async function apply_localization(newLocalization) {
  if (newLocalization === current_localization) {
    update_active_button(newLocalization);
    return;
  }

  window.location.hash = newLocalization;
  update_active_button(newLocalization);

  let transition = document.createElement("div");
  transition.classList.add("transition");

  document.body.appendChild(transition);

  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log("Set localization to: " + newLocalization);

  current_localization = newLocalization;

  if (localization_json === undefined) {
    localization_json = await readJson(localization_path);
  }

  let localized_nodes = document.querySelectorAll("local");
  localized_nodes.forEach((node) => {
    let name = node.getAttribute("name");

    if (name !== undefined && name !== null && name !== "") {
      if (localization_json[name]) {
        if (localization_json[name][current_localization]) {
          node.innerHTML = localization_json[name][current_localization];
        } else {
          console.error(
            "Localization " + current_localization + " not found in: " + name,
          );
        }
      } else {
        console.error("Localization name not found: " + name);
      }
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 300));

  transition.remove();
}