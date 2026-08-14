// Test script to mock DOM and localStorage, then run index.html JavaScript
const fs = require('fs');
const path = require('path');

// --- Mock localStorage ---
const storage = {};
const localStorageMock = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; },
    clear: () => { for (const k in storage) delete storage[k]; },
    key: (i) => Object.keys(storage)[i] || null,
    get length() { return Object.keys(storage).length; }
};
global.localStorage = localStorageMock;

// --- Minimal DOM Mock ---
const elements = new Map();
let nextId = 0;

function createElement(tag) {
    const id = `el_${nextId++}`;
    const el = {
        id,
        tagName: tag.toUpperCase(),
        className: '',
        classList: {
            _classes: [],
            add(c) { if (!this._classes.includes(c)) this._classes.push(c); },
            remove(c) { this._classes = this._classes.filter(x => x !== c); },
            toggle(c) { if (this._classes.includes(c)) this.remove(c); else this.add(c); },
            contains(c) { return this._classes.includes(c); }
        },
        style: {},
        dataset: {},
        value: '',
        textContent: '',
        innerHTML: '',
        children: [],
        childNodes: [],
        parentElement: null,
        src: '',
        href: '',
        offsetWidth: 0, offsetHeight: 0,
        _listeners: {},
        addEventListener(type, fn) { (this._listeners[type] = this._listeners[type] || []).push(fn); },
        removeEventListener(type, fn) { if (this._listeners[type]) this._listeners[type] = this._listeners[type].filter(f => f !== fn); },
        dispatchEvent(e) {
            (this._listeners[e.type] || []).forEach(fn => fn(e));
        },
        querySelector() { return null; },
        querySelectorAll() { return []; },
        getAttribute(k) { return this._attrs ? this._attrs[k] : null; },
        setAttribute(k, v) { this._attrs = this._attrs || {}; this._attrs[k] = v; },
        focus() {},
        blur() {},
        appendChild(child) { this.children.push(child); child.parentElement = this; return child; },
        removeChild(child) { this.children = this.children.filter(c => c !== child); },
        insertBefore(child, ref) { this.children.push(child); child.parentElement = this; return child; },
        closest() { return null; },
        getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 }; }
    };
    el.classList.add = el.classList.add.bind(el.classList);
    el.classList.remove = el.classList.remove.bind(el.classList);
    el.classList.toggle = el.classList.toggle.bind(el.classList);
    el.classList.contains = el.classList.contains.bind(el.classList);
    return el;
}

// Store top-level elements by id
const allElements = [];

global.document = {
    getElementById: (id) => allElements.find(e => e._id === id) || null,
    getElementsByTagName: (tag) => allElements.filter(e => e.tagName === tag.toUpperCase()),
    querySelector: (sel) => allElements.find(e => e.className && e.className.includes(sel.replace('.', ''))) || null,
    querySelectorAll: (sel) => allElements.filter(e => e.className && e.className.includes(sel.replace('.', ''))) || [],
    createElement,
    addEventListener(type, fn) { (global._docListeners = global._docListeners || {})[type] = (global._docListeners[type] || []).concat([fn]); },
    removeEventListener(type, fn) { if (global._docListeners && global._docListeners[type]) global._docListeners[type] = global._docListeners[type].filter(f => f !== fn); },
    _body: createElement('body'),
    get body() { return this._body; },
    dispatchEvent(e) {},
    readyState: 'complete',
    cookie: '',
    title: 'Test',
    head: createElement('head'),
    location: { href: 'file:///index.html' },
    _els: allElements
};
global.window = { document: global.document, addEventListener() {}, removeEventListener() {}, innerWidth: 1200, innerHeight: 800, scrollY: 0, scrollX: 0 };
global.navigator = { userAgent: 'node' };
global.performance = { now: () => Date.now(), mark() {}, measure() {} };
global.requestAnimationFrame = (fn) => setTimeout(fn, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.clearInterval = global.clearInterval;
global.setInterval = global.setInterval;

// Override getElementById to track elements
const origGetEl = global.document.getElementById;
global.document.getElementById = (id) => {
    if (!global._elsById) global._elsById = {};
    if (!global._elsById[id]) {
        const el = createElement('div');
        el._id = id;
        global._elsById[id] = el;
        allElements.push(el);
    }
    return global._elsById[id];
};

// --- Load and run the script ---
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const js = scriptMatch ? scriptMatch[1] : '';

console.log('Script length:', js.length);

try {
    // Run the script in a function context
    const fn = new Function('document', 'window', 'localStorage', 'navigator', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame', 'console', js);
    fn(global.document, global.window, localStorageMock, global.navigator, global.performance, global.requestAnimationFrame, global.cancelAnimationFrame, console);
    console.log('\n=== Script ran successfully! ===');
    
    // Check if login works
    const adminEl = global.document.getElementById('loginEmail');
    const passEl = global.document.getElementById('loginPassword');
    console.log('Login email field value:', adminEl ? adminEl.value : 'NOT FOUND');
    console.log('Login password field value:', passEl ? passEl.value : 'NOT FOUND');
    console.log('Storage contents:', JSON.stringify(storage));
    
    // Try to login
    // We need to access the login function - it's scoped inside the Function
    // Let's check if the loginScreen was hidden or shown
    
} catch (e) {
    console.log('\n=== ERROR during script execution ===');
    console.log('Error type:', e.constructor.name);
    console.log('Error message:', e.message);
    console.log('Stack trace:', e.stack);
}
