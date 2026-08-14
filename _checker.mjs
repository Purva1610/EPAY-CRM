import fs from 'fs';
import vm from 'vm';
const html = fs.readFileSync('new crm/index.html', 'utf8');
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let m, i = 0;
const results = [];
while ((m = re.exec(html))) {
  i++;
  const code = m[1];
  if (code.trim().length === 0) { results.push('Block ' + i + ': empty, skipped'); continue; }
  try {
    new vm.Script(code, { filename: 'block' + i + '.js' });
    results.push('Block ' + i + ': OK');
  } catch (e) {
    results.push('Block ' + i + ': SYNTAX ERROR -> ' + e.message);
  }
}
fs.writeFileSync('new crm/check_results.txt', results.join('\n'));
console.log('done');
