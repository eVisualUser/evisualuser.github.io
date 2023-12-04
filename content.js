
async function readFile(fileUrl) {
    const response = await fetch(fileUrl);
    const text = await response.text();
    return text;
}

function loadContentBlocks() {
  readFile("content/content.csv").then(content => {
    let fileList = content.split('\n');
    for (const index in fileList) {
      if (fileList[index].trim() !== "") {
        readFile(fileList[index]).then(pageContent => {
          let div = document.createElement("div");
          div.className = "content";
          div.innerHTML = pageContent;
          document.getElementById("content").appendChild(div);
        });
      }
    }
  });
}

function loadPage() {
  loadContentBlocks();
}

window.addEventListener("load", loadPage);
