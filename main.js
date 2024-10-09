const htmlCode = document.getElementById("htmlCode");
const cssCode = document.getElementById("cssCode");
const jsCode = document.getElementById("jsCode");
const phpCode = document.getElementById("phpCode");
const output = document.getElementById("output");
const iframe = document.getElementById("preview");

// Get the buttons
const runButton = document.getElementById("runButton");
const clearButton = document.getElementById("clearButton");
const downloadButton = document.getElementById("downloadButton");

// Add event listeners to the buttons
runButton.addEventListener("click", runCode);
clearButton.addEventListener("click", clearCode);
downloadButton.addEventListener("click", downloadCode);

// Function to run the code
function runCode() {
  const html = htmlCode.value;
  const css = cssCode.value;
  const js = jsCode.value;
  const php = phpCode.value; // احصل على كود PHP

  // تحقق من أن الكود PHP ليس فارغًا
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
        // إعداد iframe لعرض النتيجة
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
    // إذا لم يكن هناك كود PHP، عرض الـ HTML و CSS و JS فقط
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

// Function to clear the code
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

// Function to download the code
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
