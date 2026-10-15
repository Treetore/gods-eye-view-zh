# 署名与许可声明 · Attribution & Licensing

本文件说明本仓库与原项目的关系、做了哪些修改，以及各自的许可条款。
**请在使用（尤其是商业使用）前完整阅读。**

---

## 1. 原项目 / Upstream

| 项目 | 内容 |
| --- | --- |
| 名称 | **God's Eye View** |
| 作者 | **Bilawal Sidhu**（[@bilawalsidhu](https://github.com/bilawalsidhu)） |
| 仓库 | <https://github.com/bilawalsidhu/gods-eye-view> |
| 官网 | <https://maptheworld.ai/> |
| 许可 | **MIT License**（版权 © 2026 Bilawal Sidhu）——**仅覆盖源代码** |
| 本仓库所基于的提交 | [`f0a1b22`](https://github.com/bilawalsidhu/gods-eye-view/commit/f0a1b22dc82c6c5cd9690d07c1cdb297818da86f)（2026-10-14） |

原项目的完整 MIT 许可原文保留于本仓库根目录 [`LICENSE`](LICENSE)，**未作任何修改**。

---

## 2. 本仓库 / This repository

| 项目 | 内容 |
| --- | --- |
| 性质 | **非官方简体中文本地化**（unofficial Simplified Chinese localization） |
| 维护者 | **Treetore** |
| 许可（新增部分） | MIT |

> ⚠️ **本仓库不是官方项目，与原作者 Bilawal Sidhu 无隶属或背书关系。**
> 原作者的署名、README 内容、演示视频与品牌标识均予保留，以明确致谢与出处。

---

## 3. 本仓库所做的修改

**业务源码未作任何修改。** 全部改动均为「新增模块 + 极小接线」，便于与上游比对与合并：

| 类型 | 路径 | 说明 |
| --- | --- | --- |
| 新增 | `src/i18n/index.js` | 运行时中文本地化引擎（DOM 文本/属性翻译 + MutationObserver） |
| 新增 | `src/i18n/zh-CN.js` | 词典装配与动态文案模式规则 |
| 新增 | `src/i18n/dict-*.js` | 简体中文词典，共 **3394 条**（其中实际译为中文 3185 条） |
| 新增 | `src/quit/index.js` | 应用内「退出项目」按钮（两次点击确认） |
| 新增 | `server/standalone/quit.js` | `POST /api/quit` 端点，含四重同源/回环安全校验 |
| 新增 | `start-gev.cmd` / `stop-gev.cmd` | Windows 启动/停止脚本（所有缓存与临时目录固定到非系统盘） |
| 修改 | `index.html` | 引入上述两个模块；`lang` 由 `en` 改为 `zh-CN` |
| 修改 | `server/standalone/vite.config.js` | 注册退出插件（1 处） |

本地化采用**运行时 DOM 翻译**而非改写源码，因此上游代码可原样保持，后续与上游同步的成本极低。

---

## 4. 许可条款 / Licensing

### 4.1 源代码

- 上游源代码：**MIT**，版权归 **Bilawal Sidhu**（见 [`LICENSE`](LICENSE)）
- 本仓库新增代码：**MIT**，版权归 **Treetore**

MIT 许可允许使用、复制、修改、合并、发布、分发、再许可与销售，条件是**保留上述版权声明与许可声明**。本仓库已完整保留。

### 4.2 第三方数据与资源 —— **不适用 MIT**

原项目在 `LICENSE` 中明确声明：**MIT 授权不延伸至任何第三方数据**。本仓库作为衍生分发，同样受这些条款约束：

| 资源 | 位置 | 许可 | 限制 |
| --- | --- | --- | --- |
| TeleGeography 海底光缆图 | `src/data/local_data/telegeography_submarine_cables/` | **CC BY-NC-SA 3.0** | **非商业** + 相同方式共享 |
| Bhote Koshi 事件影像与派生河道中心线 | `public/events/bhote-koshi-2026/`、`src/data/bhoteKoshiFloodPath.js` | **CC BY-NC 4.0**（Vantor / GeoPera） | **非商业** |
| 数据中心与水坝 | `src/data/local_data/`（OSM / Open Infrastructure Map 摘录） | **ODbL 1.0** | 署名 + 数据相同方式共享 |
| NASA FIRMS 火点快照 | `src/data/local_data/` | CC0 / 美国公有领域 | 建议引用 |
| 3D 模型 | `public/models/` | 各自许可 | 见 `public/models/README.md` |
| 运行期实时数据源 | Google Maps、OpenSky、adsb.lol、AISStream、CelesTrak、USGS、OSM Overpass、City of Austin、GBFS 等 | 各自服务条款 | 部分限制商业使用，且需自备凭据 |

> ### ⚠️ 重要：本仓库整体**不得用于商业用途**
>
> 由于包含上述 **CC BY-NC-SA 3.0** 与 **CC BY-NC 4.0** 的非商业（NC）数据，
> 本仓库的**整体分发**应视为非商业用途。若你需要商业使用，**必须**先移除这些
> 数据集（至少包含 `src/data/local_data/telegeography_submarine_cables/`、
> `public/events/bhote-koshi-2026/` 与 `src/data/bhoteKoshiFloodPath.js`），
> 或自行向相应权利人取得商业授权。
>
> TeleGeography 数据带**相同方式共享（ShareAlike）**条款：若你基于它创作衍生
> 数据，需以相同许可发布该衍生数据。

完整的逐源许可与署名清单见 [`DATA_SOURCES.md`](DATA_SOURCES.md)；npm 依赖的第三方
软件许可见 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。

### 4.3 第三方数据未被修改

本仓库未对上述任何第三方数据集进行修改，因此沿用原项目提供于各子目录 README 中的
署名与修改声明即可：

- `public/models/README.md`
- `public/events/bhote-koshi-2026/README.md`

---

## 5. 商标 / Trademark

MIT 许可**不授予商标权**。「God's Eye View」「WorldView」及相关名称、标识与视觉资产
归原作者所有。本仓库以「非官方汉化」名义分发，**不得**被表述为官方版本，也不得暗示
原作者的认可或背书。

---

## 6. 免责声明 / Disclaimer

本仓库按「原样」提供，不附带任何形式的担保。参见 [`LICENSE`](LICENSE) 中的免责条款。
汉化可能包含翻译偏差；如有歧义，以原项目英文文档为准。
