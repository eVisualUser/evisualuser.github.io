function showBackground() {
    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    const container = document.querySelector('.container');
    if (container != null) {
        let numberOfCircles = 10;
        let circles = [];
        for (let i = 0; i < numberOfCircles; i++) {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.style.width = `${getRandomNumber(50, 400)}px`;
            circle.style.height = circle.style.width ;
            circle.style.left = `${getRandomNumber(0, 100)}%`;
            circle.style.top = `${getRandomNumber(0, 100)}%`;
            circles.push(circle);
            container.appendChild(circle);
        }
    }
}

window.addEventListener("load", showBackground)