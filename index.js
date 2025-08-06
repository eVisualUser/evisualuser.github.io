let focused_overview = null;

let hide_button;

window.addEventListener("DOMContentLoaded", async function () {
    document.body.addEventListener("click", function (event) {
        if (event.target === document.body) {
            hideOverview();
        }
    });

    hide_button = document.getElementById("hide-button")

    if (hide_button) {
       hide_button.addEventListener("click", hideOverview);
    }

    for (let card of this.document.getElementsByClassName("card")) {
        card.addEventListener("click", async function () {
            let overview_id = card.getAttribute("overview");
            let overview = document.getElementById(overview_id);
            if (overview) {
                showOverview(overview);
                hide_button.style.display = "block";
            }
        });
    }

    let hash = this.window.location.hash;
    hash = hash.slice(1);

    let overview = this.document.getElementById(hash);

    if (overview) {
        if (overview.className == "overview") {
            showOverview(overview);
        }
    }
});

function showOverview(overview) {
    if (focused_overview) {
        focused_overview.style.display = "none";
    }

    focused_overview = overview;
    focused_overview.style.display = "block";

    hide_button.style.display = "block";

    window.location.hash = overview.id;
}

function hideOverview() {
    if (focused_overview) {
        focused_overview.style.animation = 'show-overview';
        focused_overview.style.display = "none";

        hide_button.style.display = "none";

        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
}
