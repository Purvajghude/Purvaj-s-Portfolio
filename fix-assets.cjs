const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');
app = app.replace(/"\/(assets\/[^"]*)"/g, '"https://ariharan.web.app/$1"');
fs.writeFileSync('src/App.jsx', app);

let css = fs.readFileSync('src/App.css', 'utf8');
css = css.replace(/url\(['"]?\/(assets\/[^'"]*)['"]?\)/g, 'url("https://ariharan.web.app/$1")');
fs.writeFileSync('src/App.css', css);
