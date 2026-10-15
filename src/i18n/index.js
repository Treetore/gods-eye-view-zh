/**
 * 运行时中文本地化层（汉化引擎）
 *
 * 设计要点：
 *  - 不修改任何业务源码，只在 DOM 层做文本替换，随应用重渲染自动重新翻译
 *  - 跳过 material-symbols 图标元素（其文本是图标名，翻译会破坏图标）
 *  - 跳过 script/style/canvas/code 等非文案节点
 *  - 通过 MutationObserver 处理动态内容，用 microtask 批量以降低开销
 */
import { ZH, PATTERNS } from './zh-CN.js';

const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];

const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'CANVAS', 'CODE', 'PRE', 'KBD', 'SAMP', 'SVG', 'TEXTAREA',
]);

// material-symbols 的文本是图标 ligature 名，绝不能翻译
const SKIP_CLASS = /material-symbols|cesium-credit-logo|cesium-credit-image/;

/**
 * 这些元素的文本被业务代码「读回」并与写入值做相等比较，翻译它们会造成功能损坏：
 *  - global-loading-label / traffic-sync-label / cctv-sync-label 走 split-flap
 *    翻牌动画（splitFlap.js），每 tick 比较 `element.textContent === next`；
 *    中文与写入的英文永不相等，动画会无限重启且单元格永不归位。
 *  - traffic-sync-progress 在 shellFeedback.js 中做同样的相等比较。
 * 详见审计：src/splitFlap.js:456、src/ui/shellFeedback.js:86。
 */
const SKIP_IDS = new Set([
  'global-loading-label',
  'traffic-sync-label',
  'cctv-sync-label',
  'traffic-sync-progress',
]);

const EDGES = /^(\s*)([\s\S]*?)(\s*)$/;

let LOWER = null;

function lowerMap() {
  if (LOWER) return LOWER;
  LOWER = new Map();
  for (const [k, v] of Object.entries(ZH)) {
    const lk = k.toLowerCase();
    // 只收录无歧义的小写映射（避免 "us"/"it" 之类误伤）
    if (!LOWER.has(lk)) LOWER.set(lk, v);
  }
  return LOWER;
}

/** 返回中文，未命中返回 null */
function lookup(text) {
  const key = text.replace(/\s+/g, ' ').trim();
  if (!key || !/[A-Za-z]/.test(key)) return null;

  // 1) 精确匹配
  if (Object.prototype.hasOwnProperty.call(ZH, key)) return ZH[key];

  // 2) 忽略大小写匹配
  const hit = lowerMap().get(key.toLowerCase());
  if (hit !== undefined) return hit;

  // 3) 模式规则：全部累积应用，以便逐段翻译「模式+高度带+地标+区域」这类拼接串
  let out = key;
  for (let i = 0; i < PATTERNS.length; i++) {
    const [re, rep] = PATTERNS[i];
    re.lastIndex = 0;
    if (re.test(out)) {
      re.lastIndex = 0;
      out = out.replace(re, rep);
    }
  }
  return out === key ? null : out;
}

function isSkipped(el) {
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.id && SKIP_IDS.has(el.id)) return true;
  const cls = el.className;
  if (typeof cls === 'string' && cls && SKIP_CLASS.test(cls)) return true;
  if (typeof cls !== 'string' && el.getAttribute) {
    const c = el.getAttribute('class');
    if (c && SKIP_CLASS.test(c)) return true;
  }
  return false;
}

function translateText(node) {
  const raw = node.nodeValue;
  if (!raw || raw.length < 2) return;
  if (!/[A-Za-z]/.test(raw)) return;
  const m = EDGES.exec(raw);
  if (!m) return;
  const core = m[2];
  if (!core) return;
  const out = lookup(core);
  if (out === null || out === core) return;
  node.nodeValue = m[1] + out + m[3];
}

function translateAttrs(el) {
  if (!el.getAttribute) return;
  for (let i = 0; i < ATTRS.length; i++) {
    const a = ATTRS[i];
    if (!el.hasAttribute(a)) continue;
    const v = el.getAttribute(a);
    if (!v || !/[A-Za-z]/.test(v)) continue;
    const out = lookup(v);
    if (out === null || out === v) continue;
    el.setAttribute(a, out);
  }
}

function walk(el) {
  if (el.nodeType === 1) {
    if (isSkipped(el)) return;
    translateAttrs(el);
  }
  const kids = el.childNodes;
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i];
    if (c.nodeType === 3) translateText(c);
    else if (c.nodeType === 1) walk(c);
  }
}

/* ---------- 变更调度 ---------- */
const roots = new Set();
let queued = false;
let running = false;

function flush() {
  queued = false;
  const batch = [...roots];
  roots.clear();
  if (running) return;
  running = true;
  try {
    for (const el of batch) {
      if (el && el.isConnected) walk(el);
    }
  } finally {
    running = false;
  }
}

function enqueue(node) {
  const el = node.nodeType === 1 ? node : node.parentElement;
  if (!el) return;
  roots.add(el);
  if (queued) return;
  queued = true;
  queueMicrotask(flush);
}

let observer = null;

function onMutations(records) {
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (r.type === 'characterData') {
      enqueue(r.target);
      continue;
    }
    if (r.type === 'attributes') {
      translateAttrs(r.target);
      continue;
    }
    const added = r.addedNodes;
    for (let j = 0; j < added.length; j++) enqueue(added[j]);
  }
}

export function install() {
  if (observer) return;

  document.documentElement.lang = 'zh-CN';

  if (document.body) walk(document.body);
  const t = document.querySelector('title');
  if (t) walk(t);

  observer = new MutationObserver(onMutations);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });
}

// 尽早安装，之后由 observer 持续跟进
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    install();
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) walk(document.body);
    });
  } else {
    install();
  }
}
