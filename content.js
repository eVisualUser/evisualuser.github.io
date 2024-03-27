import "./purify.min.js";

// Simple function using FetchAPI to read a file
async function readFile(fileUrl) {
	const response = await fetch(fileUrl);
	const text = await response.text();
	return text;
}

// Simple validation to avoid wrong path
function isValidPath(path) {
	path = String(path);

	path = path.trim();

	let bannedKeys = ["http", "?", "..", "www", "\0", "http", "//", "\\"];

	for (const banKey of bannedKeys) {
		if (path.includes(banKey)) {
			return false;
		}
	}

	return true;
}

// Load blocks from files and insert them into the div with the id "content"
async function loadContentBlocks() {
	readFile("content/content.csv").then(content => {
		let fileList = content.split('\n');
		let contentElement = document.getElementById("content");
		if (contentElement != null) {
			let purify = DOMPurify();
			for (const index in fileList) {
				if (fileList[index].trim() !== "" && isValidPath(fileList[index])) {
					readFile(fileList[index]).then(pageContent => {
						let div = document.createElement("div");
						div.className = "content";
						div.innerHTML = purify.sanitize(pageContent);
						if (contentElement.children.length > index) {
							contentElement.insertBefore(div, contentElement.children[index]);
						} else {
							contentElement.appendChild(div);
						}
					});
				}
			}
		}
	});
}

window.addEventListener("load", loadContentBlocks);
