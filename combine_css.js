const fs = require('fs');
const path = require('path');

const dirPath = "d:/Atelaier/Prathiba Senthil";
const cssDir = path.join(dirPath, 'css');

// 1. Combine and minify CSS
const fontsCss = fs.readFileSync(path.join(cssDir, 'fonts.css'), 'utf8');
const styleCss = fs.readFileSync(path.join(cssDir, 'style.css'), 'utf8');

let combinedCss = fontsCss + '\n' + styleCss;
// Basic minification: remove comments and extra whitespace
let minifiedCss = combinedCss
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around syntax
    .replace(/;}/g, '}'); // Remove trailing semicolons

fs.writeFileSync(path.join(cssDir, 'style.min.css'), minifiedCss, 'utf8');
console.log("Created style.min.css");

// 2. Update HTML files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                findHtmlFiles(filePath, fileList);
            }
        } else if (filePath.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findHtmlFiles(dirPath);

htmlFiles.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    // Remove preload block
    content = content.replace(/[\t ]*<!-- Preload critical assets for PageSpeed -->[\s\S]*?<!-- End Preload -->\n?/g, '');
    
    // Replace fonts.css and style.css with style.min.css
    content = content.replace(/[\t ]*<link rel="stylesheet" href="\/css\/fonts\.css">\n?/g, '');
    content = content.replace(/<link rel="stylesheet" href="\/css\/style\.css">/g, '<link rel="stylesheet" href="/css/style.min.css">');
    
    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        console.log("Updated links in " + path.basename(f));
    }
});
