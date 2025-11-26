let current_localization = "en";

let localization_path = "./localization.json"

let localization_json = undefined;

let localization_button = [];

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

    let loadingIcon = document.getElementById("loading-icon");
    document.body.appendChild(loadingIcon);

    let walker = document.createTreeWalker(
        document.getElementById("resume"),
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode(node) {
                if (node === loadingIcon) {
                    return NodeFilter.FILTER_REJECT;
                }

                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node = walker.currentNode;
    while (node) {
        node.style.visibility = 'hidden';
        node.visibility = 'hidden';

        node = walker.nextNode();
    }

    await new Promise(resolve => setTimeout(resolve, 5000));

    await apply_localization(current_localization);

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
            window.print()
        });
    }

    node = walker.currentNode;
    while (node) {
        node.style.visibility = 'visible';
        node.visibility = 'visible';

        node = walker.previousNode();
    }

    loadingIcon.remove();
});

async function apply_localization(newLocalization) {
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
                    console.error("Localization " + current_localization + " not found in: " + name);
                }
            } else {
                console.error("Localization name not found: " + name);
            }
        }
    });
}