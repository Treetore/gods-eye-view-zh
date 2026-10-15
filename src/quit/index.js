/**
 * 应用内「退出项目」按钮。
 *
 * 自包含：不改动任何业务源码，只在右下角注入一个与 HUD 主题一致的按钮。
 * 点击两次（第二次确认）后 POST /api/quit，服务端随之关闭并结束进程，
 * `npm run dev`、启动它的批处理窗口一并退出 —— 即完全结束项目。
 *
 * 用内联 SVG 而非 material-symbols 图标：图标字体在 index.html 里是按
 * glyph 子集加载的，新增一个图标名会让 ligature 失效并显示成文字，所以这里
 * 不依赖该字体。
 */

const ID = 'gev-quit-button';
const LABEL = '退出项目';
const CONFIRM = '确认退出？';
const WORKING = '正在退出…';
const DONE = '已退出 · 可关闭此页';
const FAILED = '退出失败，重试';

const style = `
#${ID} {
  position: fixed;
  right: 20px;
  bottom: 62px;
  z-index: 2147483000;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  font: 500 12px/1.2 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.06em;
  color: #6eeaff;
  background: rgba(6, 18, 22, 0.88);
  border: 1px solid rgba(110, 234, 255, 0.42);
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: color .15s, border-color .15s, background .15s;
  -webkit-user-select: none;
}
#${ID}:hover { color: #b8f4ff; border-color: rgba(110, 234, 255, 0.8); background: rgba(10, 32, 38, 0.94); }
#${ID}[data-state='confirm'] { color: #ffd166; border-color: rgba(255, 209, 102, 0.75); }
#${ID}[data-state='working'] { color: #9fb6bd; border-color: rgba(159, 182, 189, 0.4); cursor: progress; }
#${ID}[data-state='done'] { color: #7ee787; border-color: rgba(126, 231, 135, 0.6); cursor: default; }
#${ID}[data-state='failed'] { color: #ff8a8a; border-color: rgba(255, 138, 138, 0.7); }
#${ID} svg { width: 13px; height: 13px; flex: none; }
#${ID}[data-state='working'] svg { animation: gev-quit-spin 1.1s linear infinite; }
@keyframes gev-quit-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { #${ID}[data-state='working'] svg { animation: none; } }
`;

const POWER_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
  'stroke-linecap="round" aria-hidden="true">' +
  '<path d="M12 3v9" /><path d="M6.6 7.2a7.5 7.5 0 1 0 10.8 0" /></svg>';

function build() {
  if (document.getElementById(ID)) return null;

  const css = document.createElement('style');
  css.textContent = style;
  document.head.appendChild(css);

  const btn = document.createElement('button');
  btn.id = ID;
  btn.type = 'button';
  btn.dataset.state = 'idle';
  btn.title = '完全结束本项目：关闭服务器并退出';
  btn.innerHTML = POWER_ICON;
  btn.appendChild(document.createTextNode(LABEL));

  let armed = false;
  let timer = 0;

  const setLabel = (text) => {
    // 保留 SVG，只替换文本节点
    const svg = btn.querySelector('svg');
    btn.textContent = '';
    if (svg) btn.appendChild(svg);
    btn.appendChild(document.createTextNode(text));
  };

  btn.addEventListener('click', async () => {
    const state = btn.dataset.state;
    if (state === 'working' || state === 'done') return;

    if (!armed) {
      armed = true;
      btn.dataset.state = 'confirm';
      setLabel(CONFIRM);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        armed = false;
        btn.dataset.state = 'idle';
        setLabel(LABEL);
      }, 4000);
      return;
    }

    window.clearTimeout(timer);
    armed = false;
    btn.dataset.state = 'working';
    setLabel(WORKING);

    try {
      const res = await fetch('/api/quit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      btn.dataset.state = 'done';
      setLabel(DONE);
      btn.disabled = true;
    } catch {
      btn.dataset.state = 'failed';
      setLabel(FAILED);
      window.setTimeout(() => {
        btn.dataset.state = 'idle';
        btn.disabled = false;
        setLabel(LABEL);
      }, 2500);
    }
  });

  document.body.appendChild(btn);
  return btn;
}

if (typeof document !== 'undefined') {
  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
}
