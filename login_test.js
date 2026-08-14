// Simulate clicking the Sign In button in headless Edge via CDP and capture results.
const { spawn } = require('child_process');
const http = require('http');

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9333;
const url = 'file:///C:/Users/Yashraj Sathe/OneDrive/Desktop/new%20crm/index.html';

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const child = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=./edge_profile_test',
    url
  ], { stdio: 'ignore' });

  let targets;
  for (let i = 0; i < 60; i++) {
    try { targets = await getJson('/json'); break; } catch (e) { await new Promise((r) => setTimeout(r, 250)); }
  }
  if (!targets) { console.log('FAILED: no debugger targets'); child.kill(); return; }
  const page = targets.find((t) => t.type === 'page');
  if (!page) { console.log('FAILED: no page target'); child.kill(); return; }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let msgId = 0;
  const pending = new Map();
  const events = [];

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else if (msg.method) { events.push(msg); }
  };
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  const send = (method, params = {}) =>
    new Promise((resolve) => { const i = ++msgId; pending.set(i, resolve); ws.send(JSON.stringify({ id: i, method, params })); });

  async function evalJS(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.result && res.result.exceptionDetails) {
      return { error: (res.result.exceptionDetails.exception && res.result.exceptionDetails.exception.description) || res.result.exceptionDetails.text };
    }
    return { value: res.result.result.value };
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await new Promise((r) => setTimeout(r, 4000));

  console.log('typeof login:', (await evalJS('typeof login')).value);

  // Simulate the exact form submit that the button triggers.
  const dispatch = await evalJS(`(function(){
    var form = document.getElementById('loginForm');
    if(!form) return 'no form';
    form.dispatchEvent(new Event('submit', { cancelable:true }));
    return 'dispatched';
  })()`);
  console.log('dispatch submit:', JSON.stringify(dispatch));

  await new Promise((r) => setTimeout(r, 1500));

  const after = await evalJS(`({
    loginScreenHidden: document.getElementById('loginScreen').classList.contains('hidden'),
    currentUser: currentUser ? currentUser.name + ' / ' + currentUser.role : null,
    pageTitle: (document.getElementById('pageTitle')||{}).textContent || null,
    contentHead: (document.getElementById('pageContent').innerHTML || '').slice(0,150),
    errorText: document.getElementById('loginError').textContent
  })`);
  console.log('AFTER LOGIN CLICK:', JSON.stringify(after, null, 2));

  console.log('--- captured console/runtime events ---');
  events.forEach((ev) => {
    if (ev.method === 'Runtime.exceptionThrown') {
      const ex = ev.params.exceptionDetails;
      console.log('EXCEPTION:', ex.text, ex.exception ? ex.exception.description : '', 'line', ex.lineNumber);
    }
    if (ev.method === 'Runtime.consoleAPICalled') {
      console.log('CONSOLE:', ev.params.type, ev.params.args.map((a) => a.value || a.description).join(' '));
    }
  });

  ws.close();
  child.kill();
}

main().catch((e) => { console.error(e); process.exit(1); });

