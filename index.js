
// Add onclick event function to change iframe based on button 'url' attribute.
function SetupButton(buttonID, frame) {
    let button = document.getElementById(buttonID);
    if (button) {
        let url = button.getAttribute("url");

        if (url == null) {
            button.style.backgroundColor = "orange";
            button.textContent = "Work in progress (" + button.textContent + ")";
        } else {
            button.onclick = function () {
                // Get the attribute back in case where its changed
                frame.src = button.getAttribute("url");
            };
        }
    }
}

window.addEventListener("load", function(){
    let frame = document.getElementById("content-view");
    if (frame) {
        SetupButton("self", frame);
        SetupButton("programming", frame);
        SetupButton("rust", frame);
        SetupButton("studies", frame);
        SetupButton("experience", frame);
        SetupButton("pretty_engine", frame);
        SetupButton("seasonal_hope", frame);
        SetupButton("bellum", frame);
        SetupButton("gamebook", frame);
    }
});
