const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const missing = [];
for (const match of html.matchAll(/(?:src|href)=["']((?:assets|wp-content)\/[^"']+)["']/g)) {
  const relative = match[1].split(/[?#]/)[0];
  if (!fs.existsSync(path.join(root, relative))) missing.push(relative);
}
for (const file of ['homepage-fixes.css', 'homepage-feedback.css', 'homepage-theme.css']) {
  const cssPath = path.join(root, 'assets/css', file);
  const css = fs.readFileSync(cssPath, 'utf8');
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) {
    const value = match[1].split(/[?#]/)[0];
    if (/^(?:data:|https?:|\/|#)/i.test(value)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(cssPath), value))) missing.push(`${file}: ${value}`);
  }
}
assert.deepEqual(missing, [], 'All referenced local homepage assets must exist');
for (const destination of ['/about-us/', '/s-h-e/', '/group-analysts-for-palestine/', '/events-3/', '/blog/', '/resources/', '/contact/']) {
  assert(html.includes(`https://alloneworld.org${destination}`), `Navigation destination retained: ${destination}`);
}
assert(html.includes('https://wa.me/447531474111'), 'WhatsApp uses the supplied number');
assert.equal((html.match(/class="aow-blog-slide"/g) || []).length, 6, 'The article slider has six cards');
console.log('PASS: Local assets, navigation destinations, WhatsApp number, and article slider verified.');
