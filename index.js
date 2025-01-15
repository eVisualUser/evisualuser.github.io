
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

let canvas = null;

function MakeBackground() {
    if (canvas) {
        let count = parseInt(canvas.getAttribute("count"));
        let maxSize = parseFloat(canvas.getAttribute("max_size"));
        let minSize = parseFloat(canvas.getAttribute("min_size"));

        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        for (let i = 0; i < count ;i++) {
            var x = Math.random() * i * canvas.width / 15;
            var y = Math.random() * i * canvas.height / 15;
            var scale = Math.random() * (maxSize - minSize) + minSize;

            ctx.filter = "blur(20px)"
            ctx.fillStyle = "#cc99ff";
            ctx.fillRect(x, y, 100, 100);
        }
        ctx.closePath();
    }
}

window.addEventListener("load", function(){
    canvas = document.getElementById("background-canvas");
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
        MakeBackground();
    }
});
