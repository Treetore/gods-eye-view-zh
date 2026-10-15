/**
 * 汉化词典 · 第九批：第二轮激进提取（含全大写短词/模板文本）发现的最终长尾
 *
 * 故意未收录的条目：
 *  - "Answer what the user asked from the returned context: …"
 *  - "Current God's Eye View viewport screenshot. Read any clearly visible …"
 *    这两条是发给 OpenAI 的系统提示词，既不显示给用户，翻译还会改变模型行为。
 *  - 字体名 / SVG transform / 品牌名：保留原文。
 */
export default {
  /* ---- 面板与控件 ---- */
  'Expand panel': '展开面板',
  'Expand Visual Presets': '展开视觉预设',
  'Detection overlay': '探测叠加层',
  'Play selected radio station': '播放所选电台',
  'Play selected station': '播放所选电台',
  'Reset map to north up': '地图恢复正北朝上',
  'Turn Street Level on or off': '开启或关闭街景',

  /* ---- 天气图层单位 ---- */
  '2 m air temperature': '2 米气温',
  '2 m above ground': '离地 2 米',
  '10 m above ground': '离地 10 米',

  /* ---- 主题化标题条 ---- */
  '// CYBER': '// 赛博',
  'NAVIGATION DECK // 01': '导航甲板 // 01',
  'NAV // COMMAND // VIS': '导航 // 指挥 // 视觉',
  'VISUAL MATRIX // 03': '视觉矩阵 // 03',
  'TARGET SCANNING // LIVE VECTOR': '目标扫描 // 实时矢量',
  'SYS 06 // SENSOR FUSION // READY': '系统 06 // 传感器融合 // 就绪',
  'ACQUIRING FRAME': '正在获取画面',
  'FLIGHT / VESSEL WINDOW': '航班 / 船舶窗口',
  'LOC / GRID': '位置 / 网格',
  'OPT / MATRIX': '光学 / 矩阵',
  'Named areas (': '命名区域（',

  /* ---- 错误与状态信息 ---- */
  'A cable source must return cables and landingPoints GeoJSON collections':
    '电缆数据源必须返回 cables 与 landingPoints 的 GeoJSON 集合',
  'Ion world imagery did not return a Bing imagery endpoint':
    'Ion 世界影像未返回 Bing 影像端点',
  'geoid.js: geoidHeight() called before ensureGeoidReady() resolved —':
    'geoid.js：在 ensureGeoidReady() 完成前调用了 geoidHeight() —',
  'rate table in src/voice/voiceCost.js.': 'src/voice/voiceCost.js 中的费率表。',
  'The camera image is too large to return': '相机图像过大，无法返回',
  'The image is too large to return': '图像过大，无法返回',

  /* ---- 品牌/字体名（显式登记为保留原文） ---- */
  'Google Maps': 'Google Maps',
  'Fira Code': 'Fira Code',
  'SF Mono': 'SF Mono',
};
