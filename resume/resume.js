let current_localization = "en";

let localization_path = "./localization.json"

// Trigger printing instead of saving the web page
document.addEventListener(
  "keydown",
  async function (e) {
    if (e.metaKey | e.ctrlKey && e.key === "s") {
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

document.addEventListener("DOMContentLoaded", async () => {
    await apply_localization(current_localization);

    let buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        if (button.hasAttribute("setlang")) {
            button.addEventListener("click", async () => {
                await apply_localization(button.getAttribute("setlang"));
            });
        }
    });
});

async function apply_localization(newLocalization) {
    console.log("Set localization to: " + newLocalization);

    current_localization = newLocalization;

    let json = await readJson(localization_path);

    let localized_nodes = document.querySelectorAll("local");
    localized_nodes.forEach((node) => {
        let name = node.getAttribute("name");

        if (name !== undefined && name !== null && name !== "") {
            if (json[name]) {
                if (json[name][current_localization]) {
                    node.innerHTML = json[name][current_localization];
                } else {
                    console.error("Localization " + current_localization + " not found in: " + name);
                }
            } else {
                console.error("Localization name not found: " + name);
            }
        }
    });
}