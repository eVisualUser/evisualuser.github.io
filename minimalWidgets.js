function showMinimalUI() {
	document.body.innerHTML =
		"<a href=\"./index.html\" class=\"logo\"><img class=\"logo\" alt=\"logo\" src=\"./logo.png\"/></a>\n" +
		document.body.innerHTML;

	document.body.innerHTML +=
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "  <br/>\n" +
        "\n" +
        "  <div class=\"links\">\n" +
        "    <!-- LINKEDIN -->\n" +
        "    <a href=\"https://www.linkedin.com/in/sylvain-tosoni\"><img class=\"linkedin\" src=\"./assets/linkedin.png\" alt=\"linkedin logo\"/></a>\n" +
        "    <!-- GITHUB -->\n" +
        "    <a href=\"https://github.com/eVisualUser\"><img class=\"github\" src=\"./assets/github.png\" alt=\"github logo\"/></a>\n" +
        "  </div>";
}

window.addEventListener("load", showMinimalUI);
