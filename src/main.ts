// 开发者工具箱
type ToolId = 'hidden-char' | 'json-format' | 'timestamp';

interface Tool {
  id: ToolId;
  name: string;
  icon: string;
  description: string;
}

const tools: Tool[] = [
  { id: 'hidden-char', name: '隐藏字符检测', icon: '🔍', description: '检测文本中的隐藏字符' },
  { id: 'json-format', name: 'JSON格式化', icon: '📋', description: '格式化和压缩JSON' },
  { id: 'timestamp', name: '时间戳转换', icon: '⏰', description: '时间戳与日期互转' },
];

// ==================== 隐藏字符检测工具 ====================

interface HiddenChar {
  char: string;
  code: string;
  name: string;
  position: number;
  category: string;
}

const charCategories: Record<string, { name: string; color: string; bgColor: string; borderColor: string }> = {
  zeroWidth: {
    name: '零宽字符',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700',
  },
  invisible: {
    name: '不可见字符',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    borderColor: 'border-orange-300 dark:border-orange-700',
  },
  control: {
    name: '控制字符',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-300 dark:border-purple-700',
  },
  special: {
    name: '特殊空白',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
  },
};

const hiddenCharMap: Record<string, { name: string; category: string }> = {
  '\u200B': { name: '零宽空格', category: 'zeroWidth' },
  '\u200C': { name: '零宽非连接符', category: 'zeroWidth' },
  '\u200D': { name: '零宽连接符', category: 'zeroWidth' },
  '\uFEFF': { name: '字节顺序标记', category: 'zeroWidth' },
  '\u2060': { name: '单词连接符', category: 'zeroWidth' },
  '\u2061': { name: '函数应用', category: 'zeroWidth' },
  '\u2062': { name: '不可见乘号', category: 'zeroWidth' },
  '\u2063': { name: '不可见分隔符', category: 'zeroWidth' },
  '\u2064': { name: '不可见加号', category: 'zeroWidth' },
  '\u00A0': { name: '不间断空格', category: 'invisible' },
  '\u2028': { name: '行分隔符', category: 'invisible' },
  '\u2029': { name: '段落分隔符', category: 'invisible' },
  '\u200E': { name: '从左到右标记', category: 'invisible' },
  '\u200F': { name: '从右到左标记', category: 'invisible' },
  '\u202A': { name: '从左到右嵌入', category: 'invisible' },
  '\u202B': { name: '从右到左嵌入', category: 'invisible' },
  '\u202C': { name: '弹出方向格式', category: 'invisible' },
  '\u202D': { name: '从左到右覆盖', category: 'invisible' },
  '\u202E': { name: '从右到左覆盖', category: 'invisible' },
  '\u2000': { name: 'EN四开空格', category: 'special' },
  '\u2001': { name: 'EM四开空格', category: 'special' },
  '\u2002': { name: 'EN空格', category: 'special' },
  '\u2003': { name: 'EM空格', category: 'special' },
  '\u2004': { name: '三分之一EM空格', category: 'special' },
  '\u2005': { name: '四分之一EM空格', category: 'special' },
  '\u2006': { name: '六分之一EM空格', category: 'special' },
  '\u2007': { name: '数字空格', category: 'special' },
  '\u2008': { name: '标点空格', category: 'special' },
  '\u2009': { name: '窄空格', category: 'special' },
  '\u200A': { name: '极窄空格', category: 'special' },
  '\u202F': { name: '窄不间断空格', category: 'special' },
  '\u205F': { name: '中等数学空格', category: 'special' },
  '\u3000': { name: '表意空格(全角)', category: 'special' },
};

function isControlChar(code: number): boolean {
  return (code >= 0x0000 && code <= 0x001f) || code === 0x007f || (code >= 0x0080 && code <= 0x009f);
}

function detectHiddenChars(text: string): HiddenChar[] {
  const result: HiddenChar[] = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);
    if (hiddenCharMap[char]) {
      const info = hiddenCharMap[char];
      result.push({
        char,
        code: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
        name: info.name,
        position: i,
        category: info.category,
      });
    } else if (isControlChar(code)) {
      result.push({
        char,
        code: 'U+' + code.toString(16).toUpperCase().padStart(4, '0'),
        name: getControlCharName(code),
        position: i,
        category: 'control',
      });
    }
  }
  return result;
}

function getControlCharName(code: number): string {
  const names: Record<number, string> = {
    0x00: '空字符', 0x07: '响铃', 0x08: '退格', 0x09: '水平制表符',
    0x0A: '换行', 0x0B: '垂直制表符', 0x0C: '换页', 0x0D: '回车',
    0x1B: '转义', 0x7F: '删除',
  };
  return names[code] || '控制字符';
}

function getCharVisualization(char: string): string {
  const code = char.charCodeAt(0);
  const visualMap: Record<number, string> = {
    0x200B: 'ZWSP', 0x200C: 'ZWNJ', 0x200D: 'ZWJ', 0xFEFF: 'BOM',
    0x2060: 'WJ', 0x2061: 'FA', 0x2062: 'IT', 0x2063: 'IS', 0x2064: 'IP',
    0x200E: 'LRM', 0x200F: 'RLM', 0x202A: 'LRE', 0x202B: 'RLE',
    0x202C: 'PDF', 0x202D: 'LRO', 0x202E: 'RLO',
    0x00A0: 'NBSP', 0x3000: 'IDEO', 0x2000: 'EN Q', 0x2001: 'EM Q',
    0x2002: 'ENSP', 0x2003: 'EMSP', 0x2004: '1/3EM', 0x2005: '1/4EM',
    0x2006: '1/6EM', 0x2007: 'FSP', 0x2008: 'PSP', 0x2009: 'THSP',
    0x200A: 'HSP', 0x202F: 'NNBSP', 0x205F: 'MMSP',
    0x2028: 'LS', 0x2029: 'PS', 0x09: 'TAB', 0x0A: 'LF', 0x0D: 'CR',
  };
  if (visualMap[code]) return visualMap[code];
  if (code < 0x20 || code === 0x7F) return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
  return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== 主应用 ====================

export function initApp(): void {
  const app = document.getElementById('app');
  if (!app) return;

  let currentTool: ToolId = 'hidden-char';

  app.innerHTML = `
    <div class="flex flex-col h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <!-- 顶部导航栏 -->
      <header class="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between h-14 px-6">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🧰</span>
            <h1 class="text-lg font-bold text-slate-800 dark:text-slate-100">开发工具箱</h1>
          </div>
          <div class="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <!-- 联系我们 -->
            <div class="relative group">
              <button class="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                联系我们
              </button>
              <!-- 悬浮联系卡片 -->
              <div class="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">有任何建议或合作可联系开发者</div>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <svg class="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982z"/>
                    </svg>
                    <span class="font-medium">微信：</span>
                    <span class="text-slate-800 dark:text-slate-200">sunDevelop</span>
                  </div>
                  <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span class="font-medium">邮箱：</span>
                    <span class="text-slate-800 dark:text-slate-200">983885733@qq.com</span>
                  </div>
                </div>
              </div>
            </div>
            <span class="text-slate-300 dark:text-slate-600">|</span>
            <span>本地运行 · 数据安全</span>
          </div>
        </div>
      </header>

      <!-- 主内容区：三栏布局 -->
      <div class="flex flex-1 overflow-hidden">
        <!-- 左侧工具导航 - 悬浮卡片样式 -->
        <aside class="hide-scrollbar w-56 flex-shrink-0 overflow-y-auto p-4">
          <nav class="space-y-2">
            ${tools.map(tool => `
              <button
                data-tool="${tool.id}"
                class="tool-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  currentTool === tool.id
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10 border border-blue-100 dark:border-blue-900/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                }"
              >
                <span class="text-xl">${tool.icon}</span>
                <div class="min-w-0">
                  <div class="text-sm font-medium truncate">${tool.name}</div>
                </div>
              </button>
            `).join('')}
          </nav>
        </aside>

        <!-- 中间主内容区 - 自适应宽度 -->
        <main class="hide-scrollbar flex-1 min-w-0 overflow-y-auto pt-4 pb-6 pr-6 pl-2">
          <div id="toolContent" class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 p-6">
            ${renderHiddenCharTool()}
          </div>
        </main>

        <!-- 右侧悬浮广告区 - 固定宽度 -->
        <aside class="hide-scrollbar w-60 flex-shrink-0 overflow-y-auto pt-4 pb-4 pr-4 pl-2">
          <div class="space-y-4">
            <!-- 广告卡片1 -->
            <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/25">
              <div class="text-xs font-medium opacity-80 mb-2">推荐</div>
              <h3 class="font-bold text-lg mb-2">提升开发效率</h3>
              <p class="text-sm opacity-90 mb-4">探索更多强大的开发工具，让编码更轻松</p>
              <button class="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                了解更多
              </button>
            </div>

            <!-- 广告卡片2 -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">💡</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">小贴士</span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                使用 <span class="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 rounded">Ctrl+V</span> 快速粘贴检测
              </p>
            </div>

            <!-- 广告卡片3 -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800/50">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">⚡</span>
                <span class="font-semibold text-amber-800 dark:text-amber-400">快速操作</span>
              </div>
              <ul class="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  一键粘贴检测
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  实时格式转换
                </li>
                <li class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  本地安全处理
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  // 工具切换事件
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const toolId = (btn as HTMLElement).dataset.tool as ToolId;
      if (toolId && toolId !== currentTool) {
        currentTool = toolId;
        updateToolNav(toolId);
        renderTool(toolId);
      }
    });
  });

  function updateToolNav(toolId: ToolId) {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      const id = (btn as HTMLElement).dataset.tool;
      if (id === toolId) {
        btn.className = 'tool-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10 border border-blue-100 dark:border-blue-900/50';
      } else {
        btn.className = 'tool-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50';
      }
    });
  }

  function renderTool(toolId: ToolId) {
    const content = document.getElementById('toolContent');
    if (!content) return;

    switch (toolId) {
      case 'hidden-char':
        content.innerHTML = renderHiddenCharTool();
        initHiddenCharEvents();
        break;
      case 'json-format':
        content.innerHTML = renderJsonFormatTool();
        initJsonFormatEvents();
        break;
      case 'timestamp':
        content.innerHTML = renderTimestampTool();
        initTimestampEvents();
        break;
    }
  }

  // 初始化隐藏字符检测事件
  initHiddenCharEvents();
}

// ==================== 隐藏字符检测工具渲染 ====================

function renderHiddenCharTool(): string {
  return `
    <div class="space-y-6">
      <div class="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
        <span class="text-3xl">🔍</span>
        <div>
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">隐藏字符检测</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">检测文本中的零宽字符、不可见字符、控制字符等</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">输入文本</label>
          <button id="hc-paste" class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors font-medium">
            <span>📋</span> 粘贴
          </button>
        </div>
        <textarea id="hc-input" rows="6" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 font-mono text-sm resize-none transition-shadow" placeholder="在此粘贴或输入需要检测的文本..."></textarea>
        <button id="hc-detect" class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30">
          开始检测
        </button>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">文本可视化展示</label>
          <span id="hc-stats" class="text-xs px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full font-medium hidden"></span>
        </div>
        <div id="hc-visual" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl min-h-28 font-mono text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all leading-relaxed border border-slate-200 dark:border-slate-600">
          <span class="text-slate-400 dark:text-slate-500">隐藏字符会以彩色标签显示</span>
        </div>
        <div class="flex items-center gap-4 flex-wrap text-xs text-slate-500 dark:text-slate-400">
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-red-100 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-800"></span> 零宽字符</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-orange-100 dark:bg-orange-900/50 rounded-md border border-orange-200 dark:border-orange-800"></span> 不可见字符</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-purple-100 dark:bg-purple-900/50 rounded-md border border-purple-200 dark:border-purple-800"></span> 控制字符</span>
          <span class="flex items-center gap-1.5"><span class="w-3 h-3 bg-blue-100 dark:bg-blue-900/50 rounded-md border border-blue-200 dark:border-blue-800"></span> 特殊空白</span>
        </div>
      </div>

      <div id="hc-list-container" class="space-y-3 hidden">
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300 block">检测到的隐藏字符</label>
        <div id="hc-list" class="space-y-2 max-h-64 overflow-y-auto pr-2"></div>
      </div>

      <!-- 隐藏字符类型说明 -->
      <div class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-2">
          <span class="text-lg">📖</span>
          <h3 class="text-base font-semibold text-slate-700 dark:text-slate-300">隐藏字符类型说明</h3>
        </div>
        
        <!-- 零宽字符 -->
        <details class="group" open>
          <summary class="flex items-center gap-3 cursor-pointer p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <span class="text-xl">⚠️</span>
            <span class="font-semibold text-red-700 dark:text-red-400">零宽字符</span>
            <span class="text-xs text-red-600/70 dark:text-red-400/70">完全不可见的格式控制字符</span>
            <span class="ml-auto text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="mt-2 overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-red-600 dark:text-red-400 border-b border-red-200 dark:border-red-800">
                  <th class="pb-2 font-semibold w-20">编码</th>
                  <th class="pb-2 font-semibold">名称</th>
                  <th class="pb-2 font-semibold w-16">缩写</th>
                  <th class="pb-2 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody class="text-slate-600 dark:text-slate-400">
                <tr class="border-b border-red-100 dark:border-red-900/30"><td class="py-2 font-mono text-red-600 dark:text-red-400">U+200B</td><td>零宽空格</td><td class="font-mono text-slate-400">ZWSP</td><td>不可见的空格，用于可能需要断行的位置</td></tr>
                <tr class="border-b border-red-100 dark:border-red-900/30"><td class="py-2 font-mono text-red-600 dark:text-red-400">U+200C</td><td>零宽非连接符</td><td class="font-mono text-slate-400">ZWNJ</td><td>阻止字符间的连接，用于波斯语等</td></tr>
                <tr class="border-b border-red-100 dark:border-red-900/30"><td class="py-2 font-mono text-red-600 dark:text-red-400">U+200D</td><td>零宽连接符</td><td class="font-mono text-slate-400">ZWJ</td><td>连接字符，用于组合Emoji</td></tr>
                <tr class="border-b border-red-100 dark:border-red-900/30"><td class="py-2 font-mono text-red-600 dark:text-red-400">U+FEFF</td><td>字节顺序标记</td><td class="font-mono text-slate-400">BOM</td><td>用于标识文本编码的字符</td></tr>
                <tr class="border-b border-red-100 dark:border-red-900/30"><td class="py-2 font-mono text-red-600 dark:text-red-400">U+2060</td><td>单词连接符</td><td class="font-mono text-slate-400">WJ</td><td>阻止在此位置断行</td></tr>
              </tbody>
            </table>
          </div>
        </details>

        <!-- 不可见字符 -->
        <details class="group">
          <summary class="flex items-center gap-3 cursor-pointer p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800/50 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <span class="text-xl">👁️</span>
            <span class="font-semibold text-orange-700 dark:text-orange-400">不可见字符</span>
            <span class="text-xs text-orange-600/70 dark:text-orange-400/70">特殊空白和方向控制字符</span>
            <span class="ml-auto text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="mt-2 overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-orange-600 dark:text-orange-400 border-b border-orange-200 dark:border-orange-800">
                  <th class="pb-2 font-semibold w-20">编码</th>
                  <th class="pb-2 font-semibold">名称</th>
                  <th class="pb-2 font-semibold w-16">缩写</th>
                  <th class="pb-2 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody class="text-slate-600 dark:text-slate-400">
                <tr class="border-b border-orange-100 dark:border-orange-900/30"><td class="py-2 font-mono text-orange-600 dark:text-orange-400">U+00A0</td><td>不间断空格</td><td class="font-mono text-slate-400">NBSP</td><td>不会被自动断行的空格</td></tr>
                <tr class="border-b border-orange-100 dark:border-orange-900/30"><td class="py-2 font-mono text-orange-600 dark:text-orange-400">U+2028</td><td>行分隔符</td><td class="font-mono text-slate-400">LS</td><td>标识行的边界</td></tr>
                <tr class="border-b border-orange-100 dark:border-orange-900/30"><td class="py-2 font-mono text-orange-600 dark:text-orange-400">U+2029</td><td>段落分隔符</td><td class="font-mono text-slate-400">PS</td><td>标识段落的边界</td></tr>
                <tr class="border-b border-orange-100 dark:border-orange-900/30"><td class="py-2 font-mono text-orange-600 dark:text-orange-400">U+200E</td><td>从左到右标记</td><td class="font-mono text-slate-400">LRM</td><td>强制文本从左到右显示</td></tr>
                <tr class="border-b border-orange-100 dark:border-orange-900/30"><td class="py-2 font-mono text-orange-600 dark:text-orange-400">U+200F</td><td>从右到左标记</td><td class="font-mono text-slate-400">RLM</td><td>强制文本从右到左显示</td></tr>
              </tbody>
            </table>
          </div>
        </details>

        <!-- 控制字符 -->
        <details class="group">
          <summary class="flex items-center gap-3 cursor-pointer p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <span class="text-xl">🎮</span>
            <span class="font-semibold text-purple-700 dark:text-purple-400">控制字符</span>
            <span class="text-xs text-purple-600/70 dark:text-purple-400/70">ASCII控制字符</span>
            <span class="ml-auto text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="mt-2 overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-purple-600 dark:text-purple-400 border-b border-purple-200 dark:border-purple-800">
                  <th class="pb-2 font-semibold w-20">编码</th>
                  <th class="pb-2 font-semibold">名称</th>
                  <th class="pb-2 font-semibold w-16">缩写</th>
                  <th class="pb-2 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody class="text-slate-600 dark:text-slate-400">
                <tr class="border-b border-purple-100 dark:border-purple-900/30"><td class="py-2 font-mono text-purple-600 dark:text-purple-400">U+0009</td><td>水平制表符</td><td class="font-mono text-slate-400">TAB</td><td>Tab键字符</td></tr>
                <tr class="border-b border-purple-100 dark:border-purple-900/30"><td class="py-2 font-mono text-purple-600 dark:text-purple-400">U+000A</td><td>换行</td><td class="font-mono text-slate-400">LF</td><td>Unix换行符</td></tr>
                <tr class="border-b border-purple-100 dark:border-purple-900/30"><td class="py-2 font-mono text-purple-600 dark:text-purple-400">U+000D</td><td>回车</td><td class="font-mono text-slate-400">CR</td><td>回到行首</td></tr>
                <tr class="border-b border-purple-100 dark:border-purple-900/30"><td class="py-2 font-mono text-purple-600 dark:text-purple-400">U+0000</td><td>空字符</td><td class="font-mono text-slate-400">NUL</td><td>字符串结束标记</td></tr>
                <tr class="border-b border-purple-100 dark:border-purple-900/30"><td class="py-2 font-mono text-purple-600 dark:text-purple-400">U+007F</td><td>删除</td><td class="font-mono text-slate-400">DEL</td><td>删除字符</td></tr>
              </tbody>
            </table>
          </div>
        </details>

        <!-- 特殊空白 -->
        <details class="group">
          <summary class="flex items-center gap-3 cursor-pointer p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <span class="text-xl">␣</span>
            <span class="font-semibold text-blue-700 dark:text-blue-400">特殊空白</span>
            <span class="text-xs text-blue-600/70 dark:text-blue-400/70">具有特殊宽度的空格字符</span>
            <span class="ml-auto text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div class="mt-2 overflow-x-auto">
            <table class="w-full text-xs">
              <thead>
                <tr class="text-left text-blue-600 dark:text-blue-400 border-b border-blue-200 dark:border-blue-800">
                  <th class="pb-2 font-semibold w-20">编码</th>
                  <th class="pb-2 font-semibold">名称</th>
                  <th class="pb-2 font-semibold w-16">缩写</th>
                  <th class="pb-2 font-semibold">说明</th>
                </tr>
              </thead>
              <tbody class="text-slate-600 dark:text-slate-400">
                <tr class="border-b border-blue-100 dark:border-blue-900/30"><td class="py-2 font-mono text-blue-600 dark:text-blue-400">U+2002</td><td>EN空格</td><td class="font-mono text-slate-400">ENSP</td><td>宽度为0.5em</td></tr>
                <tr class="border-b border-blue-100 dark:border-blue-900/30"><td class="py-2 font-mono text-blue-600 dark:text-blue-400">U+2003</td><td>EM空格</td><td class="font-mono text-slate-400">EMSP</td><td>宽度为1em</td></tr>
                <tr class="border-b border-blue-100 dark:border-blue-900/30"><td class="py-2 font-mono text-blue-600 dark:text-blue-400">U+2009</td><td>窄空格</td><td class="font-mono text-slate-400">THSP</td><td>宽度为1/6em</td></tr>
                <tr class="border-b border-blue-100 dark:border-blue-900/30"><td class="py-2 font-mono text-blue-600 dark:text-blue-400">U+202F</td><td>窄不间断空格</td><td class="font-mono text-slate-400">NNBSP</td><td>窄版不间断空格</td></tr>
                <tr class="border-b border-blue-100 dark:border-blue-900/30"><td class="py-2 font-mono text-blue-600 dark:text-blue-400">U+3000</td><td>表意空格</td><td class="font-mono text-slate-400">IDSP</td><td>全角空格，与汉字同宽</td></tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  `;
}

function initHiddenCharEvents(): void {
  const input = document.getElementById('hc-input') as HTMLTextAreaElement;
  const detectBtn = document.getElementById('hc-detect') as HTMLButtonElement;
  const pasteBtn = document.getElementById('hc-paste') as HTMLButtonElement;
  const visual = document.getElementById('hc-visual') as HTMLDivElement;
  const stats = document.getElementById('hc-stats') as HTMLSpanElement;
  const listContainer = document.getElementById('hc-list-container') as HTMLDivElement;
  const list = document.getElementById('hc-list') as HTMLDivElement;

  if (!input || !detectBtn) return;

  detectBtn.addEventListener('click', () => {
    const text = input.value;
    if (!text.trim()) {
      alert('请输入需要检测的文本');
      return;
    }
    const hiddenChars = detectHiddenChars(text);
    updateHiddenCharUI(text, hiddenChars, visual, stats, listContainer, list);
  });

  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      const hiddenChars = detectHiddenChars(text);
      updateHiddenCharUI(text, hiddenChars, visual, stats, listContainer, list);
    } catch {
      alert('无法读取剪贴板');
    }
  });
}

function updateHiddenCharUI(text: string, hiddenChars: HiddenChar[], visual: HTMLDivElement, stats: HTMLSpanElement, listContainer: HTMLDivElement, list: HTMLDivElement): void {
  if (hiddenChars.length > 0) {
    stats.textContent = `${hiddenChars.length} 个隐藏字符`;
    stats.classList.remove('hidden');
  } else {
    stats.classList.add('hidden');
  }

  const charMap = new Map<number, HiddenChar>();
  hiddenChars.forEach(c => charMap.set(c.position, c));

  let visualHtml = '';
  for (let i = 0; i < text.length; i++) {
    const hc = charMap.get(i);
    if (hc) {
      const info = charCategories[hc.category];
      visualHtml += `<span class="inline-flex items-center ${info.bgColor} ${info.color} px-1.5 py-0.5 rounded-md font-mono text-xs mx-0.5 border ${info.borderColor} shadow-sm">${getCharVisualization(text[i])}</span>`;
    } else {
      visualHtml += escapeHtml(text[i]);
    }
  }
  visual.innerHTML = visualHtml || '<span class="text-slate-400">无内容</span>';

  if (hiddenChars.length > 0) {
    listContainer.classList.remove('hidden');
    list.innerHTML = hiddenChars.map(c => {
      const info = charCategories[c.category];
      return `
        <div class="flex items-center gap-3 ${info.bgColor} rounded-xl p-3 border ${info.borderColor}">
          <span class="font-mono text-xs ${info.color} font-semibold px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm">${getCharVisualization(c.char)}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-medium ${info.color} text-sm">${c.name}</span>
              <span class="font-mono text-xs text-slate-400">${c.code}</span>
            </div>
            <div class="text-xs text-slate-400 mt-0.5">位置 ${c.position + 1}</div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    listContainer.classList.add('hidden');
  }
}

// ==================== JSON格式化工具渲染 ====================

function renderJsonFormatTool(): string {
  return `
    <div class="space-y-6">
      <div class="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
        <span class="text-3xl">📋</span>
        <div>
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">JSON格式化</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">格式化、压缩和校验JSON数据</p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">输入JSON</label>
            <button id="json-paste" class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg transition-colors font-medium">
              <span>📋</span> 粘贴
            </button>
          </div>
          <textarea id="json-input" rows="10" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 font-mono text-sm resize-none transition-shadow" placeholder='{"name": "example"}'></textarea>
          <div class="flex gap-2">
            <button id="json-format" class="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/25">
              格式化
            </button>
            <button id="json-minify" class="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors">
              压缩
            </button>
            <button id="json-clear" class="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-xl transition-colors">
              清空
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">输出结果</label>
            <button id="json-copy" class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors font-medium">
              <span>📋</span> 复制
            </button>
          </div>
          <textarea id="json-output" rows="10" readonly class="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700/50 dark:text-slate-100 font-mono text-sm resize-none" placeholder="格式化结果将显示在这里"></textarea>
          <div id="json-status" class="text-sm"></div>
        </div>
      </div>
    </div>
  `;
}

function initJsonFormatEvents(): void {
  const input = document.getElementById('json-input') as HTMLTextAreaElement;
  const output = document.getElementById('json-output') as HTMLTextAreaElement;
  const status = document.getElementById('json-status') as HTMLDivElement;

  document.getElementById('json-paste')?.addEventListener('click', async () => {
    try {
      input.value = await navigator.clipboard.readText();
    } catch {
      alert('无法读取剪贴板');
    }
  });

  document.getElementById('json-format')?.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(input.value);
      output.value = JSON.stringify(parsed, null, 2);
      status.innerHTML = '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-medium text-xs"><span>✓</span> 格式化成功</span>';
    } catch (e) {
      status.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium text-xs"><span>✗</span> ${(e as Error).message}</span>`;
    }
  });

  document.getElementById('json-minify')?.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(input.value);
      output.value = JSON.stringify(parsed);
      status.innerHTML = '<span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg font-medium text-xs"><span>✓</span> 压缩成功</span>';
    } catch (e) {
      status.innerHTML = `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium text-xs"><span>✗</span> ${(e as Error).message}</span>`;
    }
  });

  document.getElementById('json-clear')?.addEventListener('click', () => {
    input.value = '';
    output.value = '';
    status.innerHTML = '';
  });

  document.getElementById('json-copy')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(output.value);
      const btn = document.getElementById('json-copy');
      if (btn) {
        btn.textContent = '✓ 已复制';
        setTimeout(() => btn.textContent = '📋 复制', 2000);
      }
    } catch {
      alert('复制失败');
    }
  });
}

// ==================== 时间戳转换工具渲染 ====================

function renderTimestampTool(): string {
  const now = Date.now();
  const nowDate = new Date();
  const localDate = nowDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  return `
    <div class="space-y-6">
      <div class="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
        <span class="text-3xl">⏰</span>
        <div>
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">时间戳转换</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">时间戳与日期时间互转</p>
        </div>
      </div>

      <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">当前时间</span>
          <button id="ts-refresh" class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-blue-600 dark:text-blue-400 rounded-lg transition-colors font-medium shadow-sm">
            🔄 刷新
          </button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">毫秒时间戳</div>
            <div id="ts-now-ms" class="font-mono text-base font-semibold text-slate-800 dark:text-slate-200 break-all">${now}</div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">秒时间戳</div>
            <div id="ts-now-s" class="font-mono text-base font-semibold text-slate-800 dark:text-slate-200">${Math.floor(now / 1000)}</div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">本地时间</div>
            <div id="ts-now-date" class="font-mono text-base font-semibold text-slate-800 dark:text-slate-200">${localDate}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-3">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">时间戳 → 日期</label>
          <input id="ts-input" type="text" class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 font-mono text-sm" placeholder="输入时间戳 (毫秒或秒)" value="${now}">
          <button id="ts-to-date" class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/25">
            转换为日期
          </button>
          <div id="ts-date-result" class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl font-mono text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            ${localDate}
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">日期 → 时间戳</label>
          <input id="date-input" type="datetime-local" class="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 text-sm" value="${nowDate.toISOString().slice(0, 16)}">
          <button id="date-to-ts" class="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/25">
            转换为时间戳
          </button>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">毫秒</div>
              <div id="ts-ms-result" class="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">${now}</div>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">秒</div>
              <div id="ts-s-result" class="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">${Math.floor(now / 1000)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initTimestampEvents(): void {
  function updateNow() {
    const now = Date.now();
    const nowDate = new Date();
    const localDate = nowDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    const nowMs = document.getElementById('ts-now-ms');
    const nowS = document.getElementById('ts-now-s');
    const nowDateEl = document.getElementById('ts-now-date');

    if (nowMs) nowMs.textContent = now.toString();
    if (nowS) nowS.textContent = Math.floor(now / 1000).toString();
    if (nowDateEl) nowDateEl.textContent = localDate;
  }

  document.getElementById('ts-refresh')?.addEventListener('click', updateNow);

  document.getElementById('ts-to-date')?.addEventListener('click', () => {
    const input = document.getElementById('ts-input') as HTMLInputElement;
    const result = document.getElementById('ts-date-result');

    if (!input || !result) return;

    let ts = parseInt(input.value.trim());
    if (isNaN(ts)) {
      result.innerHTML = '<span class="text-red-500">请输入有效的时间戳</span>';
      return;
    }

    // 如果是秒级时间戳，转换为毫秒
    if (ts < 1e12) ts *= 1000;

    const date = new Date(ts);
    result.innerHTML = `
      <div class="space-y-1">
        <div><span class="text-slate-500">本地时间:</span> ${date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</div>
        <div><span class="text-slate-500">ISO格式:</span> ${date.toISOString()}</div>
        <div><span class="text-slate-500">UTC时间:</span> ${date.toUTCString()}</div>
      </div>
    `;
  });

  document.getElementById('date-to-ts')?.addEventListener('click', () => {
    const input = document.getElementById('date-input') as HTMLInputElement;
    const msResult = document.getElementById('ts-ms-result');
    const sResult = document.getElementById('ts-s-result');

    if (!input || !msResult || !sResult) return;

    const date = new Date(input.value);
    if (isNaN(date.getTime())) {
      msResult.innerHTML = '<span class="text-red-500 text-xs">无效日期</span>';
      return;
    }

    const ms = date.getTime();
    msResult.textContent = ms.toString();
    sResult.textContent = Math.floor(ms / 1000).toString();
  });
}
