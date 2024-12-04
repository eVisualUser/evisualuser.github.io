
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

class Circle {
    x = 0;
    y = 0;
    radius = 0;
}

let circles = [];
let canvas = null;

function CreateCircles() {
    if (canvas) {
        let count = parseInt(canvas.getAttribute("count"));
        let maxSize = parseFloat(canvas.getAttribute("max_size"));
        let minSize = parseFloat(canvas.getAttribute("min_size"));

        for (let i = 0; i < count ;i++) {

            let newCircle = new Circle();
            newCircle.x = Math.random() / i / 3 * canvas.width;
            newCircle.y = Math.random() / i / 3 * canvas.height;
            newCircle.radius = Math.random() * (maxSize - minSize) + minSize;
            circles.push(newCircle);
        }

        requestAnimationFrame(DrawCircles)
    }
}

function DrawCircles() {
    let ctx = canvas.getContext("2d");

    ctx.beginPath();

    for (let circle in circles) {
        circles[circle].x += Math.random() * canvas.width;
        circles[circle].y += Math.random() * canvas.height;

        ctx.filter = 'blur(4px)';
        ctx.arc(circles[circle].x, circles[circle].y, circles[circle].radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#6d14a1";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#6d14a1";
        ctx.stroke();
    }

    ctx.closePath()

    requestAnimationFrame(DrawCircles)
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
        CreateCircles();
    }
});
