const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Remove the erroneous </div> that closes selected-date-info too early
html = html.replace('</div><div style="border-top: 1px solid var(--border-light); padding-top: 16px;">', '<div style="border-top: 1px solid var(--border-light); padding-top: 16px;">');

// Add the </div> back at the end of the time-matrix container block
html = html.replace('<!-- JSでマトリクスを描画 -->\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>', '<!-- JSでマトリクスを描画 -->\n                    </div>\n                  </div>\n                </div>\n                </div>\n              </div>\n            </div>');

html = html.replace(/v=20260612/g, 'v=20260613');
fs.writeFileSync('index.html', html);

let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace('aspect-ratio: 1.6;', 'aspect-ratio: 1.15;');
fs.writeFileSync('styles.css', css);

fs.copyFileSync('index.html', 'index-MRのノートブックコンピュータ.html');
console.log('Fixed calendar size and selected date info div');
