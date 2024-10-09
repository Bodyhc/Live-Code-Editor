const htmlCode = document.getElementById("htmlCode");
const cssCode = document.getElementById("cssCode");
const jsCode = document.getElementById("jsCode");
const phpCode = document.getElementById("phpCode");
const output = document.getElementById("output");
const iframe = document.getElementById("preview");
const runButton = document.getElementById("runButton");
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");

// event listeners to the buttons
runButton.addEventListener("click", runCode);
clearButton.addEventListener("click", clearCode);
downloadButton.addEventListener("click", downloadCode);

// To Run Code
function runCode() {
  const html = htmlCode.value;
  const css = cssCode.value;
  const js = jsCode.value;
  const php = phpCode.value;

  if (php.trim() !== "") {
    fetch("/execute.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `phpCode=${encodeURIComponent(php)}`,
    })
      .then((response) => response.text())
      .then((data) => {
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(`
            <html>
                <head>
                    <style>
                        ${css}
                    </style>
                </head>
                <body>
                    ${html}
                    <pre>${data}</pre> <!-- عرض الناتج من كود PHP -->
                    <script>
                        ${js}
                    </script>
                </body>
            </html>
            `);
        iframe.contentWindow.document.close();
      })
      .catch((error) => console.error("Error executing PHP:", error));
  } else {
    // لو مفيش كود php
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(`
            <html>
                <head>
                    <style>
                        ${css}
                    </style>
                </head>
                <body>
                    ${html}
                    <script>
                        ${js}
                    </script>
                </body>
            </html>
        `);
    iframe.contentWindow.document.close();
  }
}

// clear input
function clearCode() {
  htmlCode.value = "";
  cssCode.value = "";
  jsCode.value = "";
  phpCode.value = "";
  output.innerHTML = "";
  iframe.contentWindow.document.open();
  iframe.contentWindow.document.write("");
  iframe.contentWindow.document.close();
}

// Download Code
function downloadCode() {
  const zip = new JSZip();
  const htmlFile = zip.file("index.html", htmlCode.value);
  const cssFile = zip.file("style.css", cssCode.value);
  const jsFile = zip.file("script.js", jsCode.value);

  zip.generateAsync({ type: "blob" }).then(function (content) {
    const url = window.URL.createObjectURL(content);
    downloadButton.href = url;
    downloadButton.download = "code.zip";
  });
}
