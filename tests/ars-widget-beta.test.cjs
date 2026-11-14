const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const valid = {
  enabled: true,
  widgetToken: `ars_w_${'a'.repeat(43)}`,
  privacyNoticeUrl: 'https://salopianmotorsport.co.uk/beta-privacy'
};

class EventTarget {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, listener) {
    const list = this.listeners.get(type) || [];
    list.push(listener);
    this.listeners.set(type, list);
  }
  removeEventListener(type, listener) {
    this.listeners.set(type, (this.listeners.get(type) || []).filter(value => value !== listener));
  }
  emit(type, event = {}) {
    for (const listener of [...(this.listeners.get(type) || [])]) listener(event);
  }
}

class Element extends EventTarget {
  constructor(tag, document) {
    super();
    this.tagName = tag.toUpperCase();
    this.ownerDocument = document;
    this.children = [];
    this.attributes = {};
    this.textContent = '';
    this.hidden = false;
    this.disabled = false;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    if (child.tagName === 'SCRIPT') this.ownerDocument.scriptLoads.push(child);
    return child;
  }
  insertBefore(child, reference) {
    const index = this.children.indexOf(reference);
    assert.notEqual(index, -1);
    child.parentNode = this;
    this.children.splice(index, 0, child);
  }
  focus() { this.ownerDocument.activeElement = this; }
}

function descendants(node) {
  return [node, ...node.children.flatMap(descendants)];
}

function environment(origin = 'https://salopianmotorsport.co.uk') {
  let networkCalls = 0;
  const document = {
    scriptLoads: [],
    elementsCreated: 0,
    createElement(tag) { this.elementsCreated += 1; return new Element(tag, this); },
    createTextNode(text) { const node = new Element('#text', this); node.textContent = text; return node; },
    querySelector(selector) { return selector === '.site-footer' ? this.footer : null; },
    querySelectorAll() { return []; },
    getElementById(id) { return descendants(this.body).find(node => node.id === id) || null; }
  };
  document.body = new Element('body', document);
  document.footer = new Element('footer', document);
  document.body.appendChild(document.footer);
  const window = new EventTarget();
  window.location = { origin };
  const context = vm.createContext({
    document, window, URL, console,
    fetch() { networkCalls += 1; throw new Error('Network must not be used by this loader'); }
  });
  vm.runInContext(source, context, { filename: 'script.js' });
  return {
    document, window,
    install(config) { context.installArsWidgetBeta(config); },
    get networkCalls() { return networkCalls; },
    get section() { return document.getElementById('ars-widget-beta'); },
    get panel() { return document.getElementById('ars-beta-panel'); },
    get script() { return document.getElementById('ars-widget-beta-script'); },
    text(text) { return descendants(document.body).find(node => node.textContent === text); },
    get status() { return descendants(document.body).find(node => node.getAttribute('role') === 'status'); }
  };
}

test('shipped disabled configuration makes no beta DOM, script or network request', () => {
  const env = environment();
  assert.equal(env.document.elementsCreated, 0);
  assert.equal(env.section, null);
  assert.equal(env.document.scriptLoads.length, 0);
  assert.equal(env.networkCalls, 0);
});

test('missing or malformed configuration fails closed before creating UI', () => {
  for (const config of [
    undefined, {}, { ...valid, enabled: 'true' },
    { ...valid, widgetToken: '' }, { ...valid, widgetToken: 'staff-secret' },
    { ...valid, widgetToken: `${valid.widgetToken}\n` },
    { ...valid, privacyNoticeUrl: '' },
    { ...valid, privacyNoticeUrl: 'https://example.com/privacy' },
    { ...valid, privacyNoticeUrl: 'http://salopianmotorsport.co.uk/privacy' },
    { ...valid, privacyNoticeUrl: 'https://salopianmotorsport.co.uk/' },
    { ...valid, privacyNoticeUrl: 'https://salopianmotorsport.co.uk/privacy?customer=1' },
    { ...valid, privacyNoticeUrl: 'https://user@salopianmotorsport.co.uk/privacy' }
  ]) {
    const env = environment();
    env.install(config);
    assert.equal(env.section, null);
    assert.equal(env.document.scriptLoads.length, 0);
    assert.equal(env.networkCalls, 0);
  }
});

test('only the exact HTTPS customer website origins can show the beta', () => {
  for (const origin of [
    'http://salopianmotorsport.co.uk', 'https://salopianmotorsport.co.uk:8443',
    'https://preview.salopianmotorsport.co.uk', 'https://salopianmotorsport.co.uk.example.com',
    'https://ajbyrne91.github.io', 'https://snazzy-biscuit-42ece7.netlify.app', 'http://localhost:8000'
  ]) {
    const env = environment(origin);
    env.install(valid);
    assert.equal(env.section, null, origin);
  }
  const www = environment('https://www.salopianmotorsport.co.uk');
  www.install(valid);
  assert.ok(www.section);
});

test('viewing the beta notice is local; starting loads the pinned script once', () => {
  const env = environment();
  env.install(valid);
  env.install(valid);
  assert.equal(env.document.body.children.filter(node => node.id === 'ars-widget-beta').length, 1);
  assert.equal(env.panel.hidden, true);
  const reveal = env.text('About the beta assistant');
  assert.equal(reveal.type, 'button');
  assert.equal(reveal.getAttribute('aria-controls'), env.panel.id);
  reveal.emit('click');
  assert.equal(env.panel.hidden, false);
  const noticeCopy = env.panel.children.map(node => node.textContent).join(' ');
  assert.match(noticeCopy, /enquiries and service questions only/);
  assert.match(noticeCopy, /cannot book, change or cancel appointments/);
  assert.match(noticeCopy, /no automatic emails or texts/);
  assert.match(noticeCopy, /raw beta chat policy is 30 days/);
  assert.equal(reveal.getAttribute('aria-expanded'), 'true');
  assert.equal(env.document.activeElement, env.text('Before you start'));
  assert.equal(env.document.scriptLoads.length, 0);
  assert.equal(env.networkCalls, 0);
  const start = env.text('Start beta assistant');
  assert.equal(start.type, 'button');
  start.emit('click');
  start.emit('click');
  assert.equal(env.document.scriptLoads.length, 1);
  assert.equal(env.script.src, 'https://app.arsstataria.co.uk/widget.js');
  assert.equal(env.script.getAttribute('data-widget-token'), valid.widgetToken);
  assert.equal(start.disabled, true);
  assert.equal(env.networkCalls, 0);
});

test('close and Escape return focus without loading the widget', () => {
  const env = environment();
  env.install(valid);
  const reveal = env.text('About the beta assistant');
  reveal.emit('click');
  env.text('Not now').emit('click');
  assert.equal(env.panel.hidden, true);
  assert.equal(env.document.activeElement, reveal);
  reveal.emit('click');
  let prevented = false;
  env.panel.emit('keydown', { key: 'Escape', preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(env.panel.hidden, true);
  assert.equal(reveal.getAttribute('aria-expanded'), 'false');
  assert.equal(env.document.activeElement, reveal);
  assert.equal(env.document.scriptLoads.length, 0);
});

test('script loading is not readiness; session event alone announces the launcher', () => {
  const env = environment();
  env.install(valid);
  env.text('Start beta assistant').emit('click');
  env.script.emit('load');
  assert.match(env.status.textContent, /is loading/);
  assert.doesNotMatch(env.status.textContent, /is ready/);
  env.window.emit('ars-widget:ready');
  assert.match(env.status.textContent, /launcher is ready/);
  assert.equal(env.window.listeners.get('ars-widget:ready').length, 0);
  assert.equal(env.window.listeners.get('ars-widget:error').length, 0);
  env.script.emit('load');
  assert.match(env.status.textContent, /launcher is ready/);
});

test('script or session errors retain contact fallbacks and never auto-retry', () => {
  for (const failure of ['script', 'session']) {
    const env = environment();
    env.install(valid);
    const start = env.text('Start beta assistant');
    start.emit('click');
    if (failure === 'script') env.script.emit('error');
    else env.window.emit('ars-widget:error', { detail: { raw: 'not displayed' } });
    assert.match(env.status.textContent, /unavailable/);
    assert.doesNotMatch(env.status.textContent, /not displayed/);
    assert.equal(env.text('Contact the workshop').href, 'contact.html');
    assert.equal(env.text('call 07874 072613').href, 'tel:+447874072613');
    assert.equal(env.status.getAttribute('aria-live'), 'polite');
    start.emit('click');
    assert.equal(env.document.scriptLoads.length, 1);
  }
});

test('legacy enquiry handler remains separate and no widget control submits a form', () => {
  const env = environment();
  env.install(valid);
  assert.ok(source.includes("mode: 'no-cors'"));
  assert.equal(env.section.parentNode, env.document.body);
  const buttons = descendants(env.section).filter(node => node.tagName === 'BUTTON');
  assert.equal(buttons.length, 3);
  assert.ok(buttons.every(node => node.type === 'button'));
  assert.equal(env.networkCalls, 0);
});
