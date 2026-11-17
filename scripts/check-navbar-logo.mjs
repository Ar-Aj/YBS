import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
const source = ts.transpileModule(fs.readFileSync('src/components/layout/NavbarLogo.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
async function setup({ reduced = false, failure = null, debug = true } = {}) {
  const preference = new EventTarget(); preference.matches = reduced;
  const document = new EventTarget(); document.visibilityState = 'visible';
  const window = new EventTarget(); const timers = new Map(); let tick = 0;
  Object.assign(window, { location: { search: debug ? '?logodebug=1' : '' }, matchMedia: () => preference, requestAnimationFrame: f => { timers.set(++tick, f); return tick; }, cancelAnimationFrame: id => timers.delete(id), setTimeout: f => { timers.set(++tick, f); return tick; }, clearTimeout: id => timers.delete(id) });
  const video = new EventTarget(); Object.assign(video, { paused: true, ended: false, readyState: 0, networkState: 0, error: null, calls: 0, loads: 0, setAttribute() {}, removeAttribute() {}, load() { this.loads++; this.error = null; }, pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }, play() { this.calls++; if (failure) { const name = failure; failure = null; return Promise.reject(new DOMException('', name)); } this.paused = false; this.dispatchEvent(new Event('playing')); return Promise.resolve(); } });
  const mark = { dataset: { logoState: 'static' } }; const output = { hidden: true, dataset: {} }; const refs = [output, mark, video]; let effect;
  const context = { exports: {}, window, document, URLSearchParams, DOMException, require: name => name === 'react' ? { useRef: () => ({ current: refs.shift() }), useEffect: f => { effect = f; } } : name === 'react/jsx-runtime' ? { jsx() {}, jsxs() {} } : { default: {} } };
  vm.runInNewContext(source, context); context.exports.NavbarLogo(); const cleanup = effect();
  const flush = async () => { const tasks = [...timers.values()]; timers.clear(); tasks.forEach(f => f()); await new Promise(r => setImmediate(r)); };
  const event = (target, name) => target.dispatchEvent(new Event(name));
  return { video, mark, output, document, window, preference, flush, event, cleanup, timers };
}
(async () => {
  let s = await setup(); assert.equal(s.mark.dataset.logoState, 'static'); await s.flush(); assert.equal(s.mark.dataset.logoState, 'playing'); assert(s.video.muted && s.video.defaultMuted && s.video.playsInline); s.video.ended = true; s.event(s.video, 'ended'); s.event(s.document, 'click'); assert.equal(s.video.calls, 1); assert.match(s.output.textContent, /played completely/); s.cleanup();
  s = await setup({failure:'NotAllowedError'}); await s.flush(); assert.match(s.output.textContent, /Autoplay blocked/); assert.equal(s.mark.dataset.logoState, 'static'); s.event(s.document, 'click'); await s.flush(); assert.equal(s.mark.dataset.logoState, 'playing'); s.cleanup();
  s = await setup({reduced:true}); await s.flush(); assert.equal(s.video.calls,1); assert.equal(s.mark.dataset.logoState,'playing'); assert.match(s.output.textContent,/Success/); s.event(s.preference,'change'); assert.equal(s.mark.dataset.logoState,'playing'); s.video.ended=true; s.event(s.video,'ended'); assert.equal(s.mark.dataset.logoState,'static'); s.cleanup();
  s = await setup(); await s.flush(); s.document.visibilityState='hidden'; s.event(s.document,'visibilitychange'); assert.equal(s.mark.dataset.logoState,'static'); s.document.visibilityState='visible'; s.event(s.document,'visibilitychange'); await s.flush(); assert.equal(s.mark.dataset.logoState,'playing'); s.cleanup();
  s = await setup(); await s.flush(); s.video.error={code:2}; s.event(s.video,'error'); assert.equal(s.mark.dataset.logoState,'static'); await s.flush(); assert.equal(s.video.loads,2); s.video.error={code:2}; s.event(s.video,'error'); await s.flush(); assert.equal(s.video.loads,2); assert.match(s.output.textContent,/media failed/); s.cleanup();
  s = await setup({failure:'AbortError'}); await s.flush(); await s.flush(); assert.equal(s.mark.dataset.logoState,'playing'); s.cleanup();
  s = await setup({debug:false}); await s.flush(); assert.equal(s.output.hidden,false); s.cleanup();
  s = await setup(); s.cleanup(); await s.flush(); assert.equal(s.video.calls,0);
  console.log('PASS: logo playback, attributes, completion, blocked autoplay/gesture retry, reduced motion, visibility, bounded network reload, interrupted play, always-visible diagnostics, cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1;});
