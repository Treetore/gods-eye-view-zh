/**
 * 汉化词典装配 + 动态模式规则
 *
 * 模式规则按「先具体、后通用」排序，并全部累积应用，
 * 因此可以逐段翻译「模式 + 高度带 + 地标 + 区域 + 读数」这类代码拼接串。
 */
import core from './dict-01-core.js';
import shortA from './dict-05-short-a.js';
import shortB from './dict-05-short-b.js';
import shortC from './dict-05-short-c.js';
import shortD from './dict-05-short-d.js';
import midA from './dict-06-mid-a.js';
import midB from './dict-06-mid-b.js';
import longText from './dict-07-long.js';
import gaps from './dict-08-gaps.js';
import final from './dict-09-final.js';

export const ZH = Object.assign({}, core, shortA, shortB, shortC, shortD, midA, midB, longText, gaps, final);

export const PATTERNS = [
  /* ---------- HUD 摘要拼接串（hud.js:665 的模板） ---------- */
  [/\bSTREET NEAR\b/g, '街道 · 靠近'],
  [/\bCITY NEAR\b/g, '城区 · 靠近'],
  [/\bMETRO NEAR\b/g, '都市 · 靠近'],
  [/\bREGIONAL NEAR\b/g, '区域 · 靠近'],
  [/\bGLOBAL NEAR\b/g, '全球 · 靠近'],
  [/\bSECTOR\b/g, '区段'],
  [/\bSTREET\b/g, '街道'],
  [/\bCITY\b/g, '城区'],
  [/\bMETRO\b/g, '都市'],
  [/\bREGIONAL\b/g, '区域'],
  [/\bGLOBAL\b/g, '全球'],
  [/\bNEAR\b/g, '靠近'],
  [/\bWINDOW\b/g, '视窗'],
  [/\bSUN\b/g, '太阳'],
  [/\bAWAITING\b/gi, '等待中'],

  /* ---------- 区域名 ---------- */
  [/\bNORTH AMERICA\b/g, '北美'],
  [/\bSOUTH AMERICA\b/g, '南美'],
  [/\bCENTRAL AMERICA\b/g, '中美洲'],
  [/\bNORTHERN OCEANIC GRID\b/g, '北半球海域网格'],
  [/\bSOUTHERN OCEANIC GRID\b/g, '南半球海域网格'],
  [/\bEUROPE\b/g, '欧洲'],
  [/\bAFRICA\b/g, '非洲'],
  [/\bMIDDLE EAST\b/g, '中东'],
  [/\bSOUTH ASIA\b/g, '南亚'],
  [/\bEAST ASIA\b/g, '东亚'],
  [/\bSOUTHEAST ASIA\b/g, '东南亚'],
  [/\bCENTRAL ASIA\b/g, '中亚'],
  [/\bOCEANIA\b/g, '大洋洲'],
  [/\bANTARCTICA\b/g, '南极洲'],
  [/\bARCTIC\b/g, '北极'],

  /* ---------- 状态后缀（覆盖所有 ": X" 动态组合） ---------- */
  [/: OFF$/g, '：关'],
  [/: ON$/g, '：开'],
  [/: dense$/gi, '：密集'],
  [/: sparse$/gi, '：稀疏'],
  [/: AUTO$/g, '：自动'],
  [/: MANUAL$/g, '：手动'],
  [/: N\/A$/g, '：无'],
  [/: empty$/gi, '：为空'],
  [/^NO RESULTS$/g, '无结果'],
  [/^NO DATA$/g, '无数据'],
  [/^NONE$/g, '无'],

  /* ---------- 动态提示 ---------- */
  [/^Flying to (.+?)\.\.\.$/g, '正在飞往 $1…'],
  [/^Loading (.+?)\.\.\.$/g, '正在加载 $1…'],
  [/^Waiting for (.+?)\.\.\.$/g, '正在等待 $1…'],
  [/^Searching (.+?)\.\.\.$/g, '正在搜索 $1…'],
  [/^Expand (.+)$/g, '展开 $1'],
  [/^Collapse (.+)$/g, '折叠 $1'],
  [/^Open (.+)$/g, '打开 $1'],
  [/^Close (.+)$/g, '关闭 $1'],
  [/^Show (.+)$/g, '显示 $1'],
  [/^Hide (.+)$/g, '隐藏 $1'],
  [/^Toggle (.+)$/g, '切换 $1'],
  [/^Enable (.+)$/g, '启用 $1'],
  [/^Disable (.+)$/g, '禁用 $1'],

  /* ---------- 计数 ---------- */
  [/(\d+)\s+response\(s\)/g, '$1 次响应'],
  [/(\d+)\s+results?\b/g, '$1 条结果'],
  [/(\d+)\s+records?\b/g, '$1 条记录'],
  [/(\d+)\s+cameras?\b/g, '$1 个摄像头'],
  [/(\d+)\s+stations?\b/g, '$1 个电台'],
  [/(\d+)\s+contacts?\b/g, '$1 个目标'],
  [/(\d+)\s+keys?\s+waiting/gi, '$1 个密钥待配置'],
  [/(\d+)\s+in view/g, '视野内 $1 个'],
  [/(\d+)\s+images?\b/g, '$1 张影像'],
  [/(\d+)\s+days?\b/gi, '$1 天'],
  [/(\d+)\s+frames?\b/gi, '$1 帧'],

  /* ---------- 单位 ---------- */
  [/\bKM\b/g, '公里'],
  [/\bMSL\b/g, '海平面高'],
  [/\bAGL\b/g, '离地高'],

  /* ---------- 动态读数中的标签（HUD / 场景镜头元数据） ---------- */
  [/\bNORMAL\b/g, '普通'],
  [/ · OFF · /g, ' · 关 · '],
  [/\bCOLL:\s/g, '采集：'],
  [/\bORB:\s/g, '轨道：'],
  [/\bPASS:\s/g, '过境：'],
  [/\bSEEK\b/g, '搜索'],
  // 密钥数量变化后 "POWER UP · N KEYS WAITING" 是动态串，需按词翻译
  [/\bPOWER UP\b/g, '增强'],
  [/\bKEYS WAITING\b/g, '个密钥待配置'],
  [/\bKEY REQUIRED\b/g, '需要密钥'],
];
