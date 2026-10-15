/**
 * 退出端点：从应用内完全结束项目。
 *
 * 请求 `POST /api/quit` 会先返回 JSON 应答，随后关闭 HTTP 服务器并结束
 * Vite 进程；`npm run dev` 随之退出，启动它的批处理窗口也会结束。
 *
 * 为什么必须加门禁：这个端点的作用是「杀掉开发服务器」。若不加防护，任意
 * 恶意网页都能通过 `fetch('http://localhost:4173/api/quit')`（简单请求不触发
 * CORS 预检）把你的服务关掉，属于典型的 CSRF/本地服务攻击面。所以这里要求：
 *   1. 仅接受 loopback 套接字来源；
 *   2. 仅接受 POST；
 *   3. 复用项目既有的 `admitSameSiteRequest`（拒绝代理头、跨站
 *      `Sec-Fetch-Site`、以及不匹配的 `Origin`）；
 *   4. 要求 `Content-Type: application/json`（跨站页面无法在不触发预检的情况下
 *      发送该类型，预检必然失败）。
 */
import { admitSameSiteRequest } from '../../src/localRequestGate.mjs';

const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

/** 套接字是否来自本机回环地址。 */
function isLoopbackSocket(req) {
  const addr = String(req.socket?.remoteAddress || '').trim();
  return LOOPBACK.has(addr);
}

/**
 * @param {{exit?: (code:number)=>void, delayMs?: number}} [options]
 * @returns {import('vite').Plugin}
 */
export function quitPlugin({ exit = (code) => process.exit(code), delayMs = 250 } = {}) {
  const install = (server) => {
    server.middlewares.use('/api/quit', (req, res) => {
      const reply = (status, body) => {
        res.writeHead(status, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        });
        res.end(JSON.stringify(body));
      };

      if (req.method !== 'POST') {
        return reply(405, { error: 'Method not allowed' });
      }
      if (!isLoopbackSocket(req)) {
        return reply(403, { error: 'Loopback clients only' });
      }

      const verdict = admitSameSiteRequest({
        hostHeader: req.headers.host,
        protocol: 'http:',
        origin: req.headers.origin,
        secFetchSite: req.headers['sec-fetch-site'],
        proxyHeaders: req.headers,
      });
      if (!verdict.ok) {
        return reply(verdict.status, { error: verdict.error });
      }

      const contentType = String(req.headers['content-type'] || '')
        .split(';')[0]
        .trim()
        .toLowerCase();
      if (contentType !== 'application/json') {
        return reply(415, { error: 'Expected application/json' });
      }

      reply(200, { ok: true, message: 'God\u2019s Eye View is shutting down' });

      // 先让应答刷出，再关闭监听并结束进程，避免客户端看到连接重置。
      const httpServer = server.httpServer;
      setTimeout(() => {
        try {
          httpServer?.close();
        } catch {
          /* 已经在关闭中，直接退出即可 */
        }
        exit(0);
      }, delayMs);
    });
  };

  return {
    name: 'gev-quit',
    configureServer: install,
    configurePreviewServer: install,
  };
}
