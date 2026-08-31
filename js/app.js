/**
 * KEREOS Trading Terminal - Main Application Controller
 * Pro Features:
 * - Clean User Portfolio State (Zero automated unauthorized position buying)
 * - Bloomberg Intelligence & Reuters AI Wire with sentiment gauges, takeaways & direct trade triggers
 * - Fully Responsive Mobile & Desktop Layout (Bottom mobile nav bar, touch-friendly HUD)
 * - 16 High-Liquidity Markets (Crypto, Tech Giants, Commodities, Forex)
 * - 1x to 100x Leverage Margin Trading (Long & Short) with Liquidation Math
 * - Technical Indicators: EMA 9/21/55, Bollinger Bands, RSI (14), MACD (12,26,9)
 * - 7-Day Live SVG Sparklines across tables & CSV Statement Exports
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Quantum Background Particle Network
  initBackgroundCanvas();

  // 2. Initialize Terminal Chart Engine
  window.tradingChart = new TerminalChart('trading-chart');

  // 3. Simulated AI Quant Signals
  window.aiSignals = [
    {
      id: 'SIG-101',
      ticker: 'BTC',
      action: 'STRONG BUY',
      confidence: 94,
      reason: 'EMA 9/21 golden cross & RSI oversold bounce @ 28.4',
      target: 65800.00,
      stopLoss: 63500.00
    },
    {
      id: 'SIG-102',
      ticker: 'NVDA',
      action: 'BUY MOMENTUM',
      confidence: 89,
      reason: 'Blackwell Ultra AI compute order flow breakout',
      target: 134.50,
      stopLoss: 125.00
    },
    {
      id: 'SIG-103',
      ticker: 'SOL',
      action: 'SCALP LONG',
      confidence: 92,
      reason: 'DEX transaction volume expansion + Bollinger support',
      target: 154.20,
      stopLoss: 145.00
    }
  ];

  // 4. Institutional Bloomberg AI News Wire Database
  window.newsFilter = 'ALL';
  window.newsFeedItems = [
    {
      id: 1,
      category: 'BREAKING',
      source: 'BLOOMBERG TERMINAL',
      author: 'Eric Balchunas',
      time: '1m AGO',
      headline: 'Global Sovereign Liquidity Inflows Surge to New All-Time Highs Across Spot Digital Assets',
      summary: 'Institutional asset managers allocate record capital into spot Bitcoin and Ethereum vehicles as central banks coordinate rate cut expectations.',
      takeaways: [
        'Net inflows surpassed $1.2B in single-day trading volume.',
        'Derivatives open interest spikes 18.4% across Chicago Mercantile Exchange contracts.',
        'High statistical correlation with previous major multi-month breakout cycles.'
      ],
      sentiment: 'BULLISH',
      sentimentPct: 94,
      impact: 'HIGH IMPACT',
      targetTicker: 'BTC'
    },
    {
      id: 2,
      category: 'TECH',
      source: 'REUTERS QUANT',
      author: 'Stephen Nellis',
      time: '4m AGO',
      headline: 'NVIDIA Expands Next-Gen Blackwell Ultra Computing Architecture with Hyperscaler AI Backlog',
      summary: 'Surging autonomous AI inference workloads drive unprecedented orders for high-density GPU racks and quantum networking clusters.',
      takeaways: [
        'Data center revenue forward projections revised upward by +22%.',
        'Enterprise generative AI adoption accelerates across global Fortune 500.',
        'Supply chain yields exceed baseline fabrication estimates.'
      ],
      sentiment: 'BULLISH',
      sentimentPct: 91,
      impact: 'HIGH IMPACT',
      targetTicker: 'NVDA'
    },
    {
      id: 3,
      category: 'CRYPTO',
      source: 'COINDESK WIRE',
      author: 'Helene Braun',
      time: '9m AGO',
      headline: 'Solana Network Velocity Sets Record Transaction Throughput Amid High-Frequency DEX Expansion',
      summary: 'Decentralized exchange volume surpasses traditional Layer-1 competitors as institutional automated market makers deploy low-latency liquidity pools.',
      takeaways: [
        'Daily active wallets surge past 4.2 million addresses.',
        'Fee generation reaches quarterly high with continuous stake lockup.',
        'DeFi liquidity depth shows robust bid support.'
      ],
      sentiment: 'BULLISH',
      sentimentPct: 88,
      impact: 'MARKET MOVER',
      targetTicker: 'SOL'
    },
    {
      id: 4,
      category: 'MACRO',
      source: 'FINANCIAL TIMES',
      author: 'Colby Smith',
      time: '15m AGO',
      headline: 'Federal Reserve Policy Signals Dovish Shift as Inflation Gauges Cool Below Consensus Targets',
      summary: 'Treasury yields contract across 2-year and 10-year benchmarks, providing tailwinds for equity indices and gold spot contracts.',
      takeaways: [
        'Bond market futures price in consecutive 25bps rate reductions.',
        'US Dollar Index (DXY) retreats toward major support at 101.40.',
        'Precious metals and growth equities benefit from lower discount rates.'
      ],
      sentiment: 'BULLISH',
      sentimentPct: 86,
      impact: 'MARKET MOVER',
      targetTicker: 'GOLD'
    },
    {
      id: 5,
      category: 'COMMODITIES',
      source: 'WALL STREET JOURNAL',
      author: 'Benoit Faucon',
      time: '24m AGO',
      headline: 'Brent Crude Oil Contracts Steady Near $78/bbl Following Updated Global Strategic Reserve Reports',
      summary: 'Energy markets balance refined product demand against steady non-OPEC production output in balanced spot trading.',
      takeaways: [
        'Refinery utilization stabilizes at seasonal capacity levels.',
        'Commercial stockpiles post modest inventory drawdown.',
        'Geopolitical risk premium remains rangebound.'
      ],
      sentiment: 'NEUTRAL',
      sentimentPct: 52,
      impact: 'MEDIUM IMPACT',
      targetTicker: 'CRUDE_OIL'
    },
    {
      id: 6,
      category: 'TECH',
      source: 'BLOOMBERG TECH',
      author: 'Mark Gurman',
      time: '32m AGO',
      headline: 'Apple Accelerates On-Device Neural Engine Deployment for Apple Intelligence Ecosystem',
      summary: 'Next-generation silicon architecture delivers 40% efficiency gains for private on-device machine learning workflows.',
      takeaways: [
        'iPhone replacement supercycle projections raised by leading Wall Street analysts.',
        'Services division gross margins expand to 74.2%.',
        'Hardware ecosystem retention rate holds above 96%.'
      ],
      sentiment: 'BULLISH',
      sentimentPct: 85,
      impact: 'MEDIUM IMPACT',
      targetTicker: 'AAPL'
    }
  ];

  // 5. Market Filter State
  window.currentMarketFilter = 'ALL';

  // 6. Initialize UI Components & Listeners
  initThemeSelector();
  initNavigation();
  initTickerMarquee();
  initTradeModal();
  initDepositModal();
  initFastScalpHUD();
  initTopBarControls();
  initMarketFilters();
  initNewsFilters();
  initCSVExport();
  renderAllViews();

  // 7. Start Live Simulation Engine (Only market data, zero auto-trades)
  startMarketSimulation();
  startOrderBookSimulation();
  startAISignalsRotation();

  // 8. Listen for State Updates
  window.addEventListener('kereos-state-changed', () => {
    renderAllViews();
  });
});

/* ==========================================================================
   1. Theme Selector Engine
   ========================================================================== */
function initThemeSelector() {
  const themeSelect = document.getElementById('theme-selector');
  const sm = window.stateManager;
  if (!themeSelect || !sm) return;

  const currentTheme = sm.state.settings.theme || 'cyberpunk';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeSelect.value = currentTheme;

  themeSelect.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute('data-theme', theme);
    sm.state.settings.theme = theme;
    sm.saveState();
    if (window.soundFX) window.soundFX.playClick();
    showToast(`Theme switched to ${theme.toUpperCase()}`, 'info');
  });
}

/* ==========================================================================
   2. Quantum Particle Background Canvas
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.45)' : 'rgba(168, 85, 247, 0.45)'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.18 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   3. Live Ticker Tape Marquee
   ========================================================================== */
function initTickerMarquee() {
  const track = document.getElementById('ticker-marquee-track');
  const sm = window.stateManager;
  if (!track || !sm || !sm.state.assets) return;

  function buildItems() {
    return sm.state.assets
      .map((a) => {
        const isPos = a.change24h >= 0;
        const sign = isPos ? '+' : '';
        const arrow = isPos ? '▲' : '▼';
        const color = isPos ? 'var(--accent-green)' : 'var(--accent-red)';
        const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(a.id, 'logo-box-xs') : '';
        return `
          <div class="ticker-item" onclick="window.selectChartAsset('${a.id}')">
            ${logoHTML}
            <span>${a.id}</span>
            <strong>${sm.formatCurrency(a.price)}</strong>
            <span style="color:${color}">${arrow} ${sign}${a.change24h.toFixed(2)}%</span>
          </div>
        `;
      })
      .join('');
  }

  const html = buildItems();
  track.innerHTML = html + html;
}

/* ==========================================================================
   4. Desktop & Mobile Navigation (Synced)
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-btn');
  const viewPages = document.querySelectorAll('.view-page');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      if (!target) return;

      document.querySelectorAll('.nav-link').forEach((l) => {
        l.classList.toggle('active', l.getAttribute('data-target') === target);
      });
      document.querySelectorAll('.mobile-nav-btn').forEach((l) => {
        l.classList.toggle('active', l.getAttribute('data-target') === target);
      });

      viewPages.forEach((p) => p.classList.remove('active'));
      const targetPage = document.getElementById(`page-${target}`);
      if (targetPage) {
        targetPage.classList.add('active');
      }

      if (window.soundFX) window.soundFX.playClick();

      if (target === 'dashboard' && window.tradingChart) {
        setTimeout(() => window.tradingChart.resize(), 60);
      }

      renderAllViews();
    });
  });
}

function initMarketFilters() {
  const filterBtns = document.querySelectorAll('.market-filter-chips .filter-chip');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      window.currentMarketFilter = btn.getAttribute('data-filter') || 'ALL';
      renderMarketsTable();
      if (window.soundFX) window.soundFX.playClick();
    });
  });
}

function initNewsFilters() {
  const filterBtns = document.querySelectorAll('.news-filter-chips .filter-chip');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      window.newsFilter = btn.getAttribute('data-news-filter') || 'ALL';
      renderNewsWire();
      if (window.soundFX) window.soundFX.playClick();
    });
  });
}

/* ==========================================================================
   5. 1-Click Fast Scalp & Leverage HUD Bar
   ========================================================================== */
function initFastScalpHUD() {
  const lotBtns = document.querySelectorAll('.btn-lot-size');
  const levBtns = document.querySelectorAll('.btn-leverage-size');
  const buyBtn = document.getElementById('btn-fast-scalp-buy');
  const sellBtn = document.getElementById('btn-fast-scalp-sell');
  const sm = window.stateManager;

  lotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lot = parseFloat(btn.getAttribute('data-lot'));
      if (sm) {
        sm.state.settings.scalpLotSize = lot;
        sm.saveState();
      }
      if (window.soundFX) window.soundFX.playClick();
    });
  });

  levBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lev = parseInt(btn.getAttribute('data-lev'), 10);
      if (sm) {
        sm.state.settings.leverage = lev;
        sm.saveState();
      }
      if (window.soundFX) window.soundFX.playClick();
      showToast(`Trading Leverage set to ${lev}x`, 'info');
    });
  });

  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      if (!sm) return;
      const activeTicker = sm.state.settings.activeAsset || 'BTC';
      const asset = sm.getAsset(activeTicker);
      if (!asset) return;

      const lot = sm.state.settings.scalpLotSize || 0.5;
      const lev = sm.state.settings.leverage || 10;
      const result = sm.executeTrade(activeTicker, 'LONG', lot, asset.price, lev);

      if (result.success) {
        if (window.soundFX) window.soundFX.playBuy();
        showToast(`⚡ FAST LONG: ${lot} ${activeTicker} (${lev}x) @ ${sm.formatCurrency(asset.price)}`, 'success');
        renderAllViews();
        if (window.tradingChart) window.tradingChart.render();
      } else {
        if (window.soundFX) window.soundFX.playError();
        showToast(result.message, 'error');
      }
    });
  }

  if (sellBtn) {
    sellBtn.addEventListener('click', () => {
      if (!sm) return;
      const activeTicker = sm.state.settings.activeAsset || 'BTC';
      const asset = sm.getAsset(activeTicker);
      if (!asset) return;

      const lot = sm.state.settings.scalpLotSize || 0.5;
      const lev = sm.state.settings.leverage || 10;
      const result = sm.executeTrade(activeTicker, 'SHORT', lot, asset.price, lev);

      if (result.success) {
        if (window.soundFX) window.soundFX.playSell();
        showToast(`⚡ FAST SHORT: ${lot} ${activeTicker} (${lev}x) @ ${sm.formatCurrency(asset.price)}`, 'success');
        renderAllViews();
        if (window.tradingChart) window.tradingChart.render();
      } else {
        if (window.soundFX) window.soundFX.playError();
        showToast(result.message, 'error');
      }
    });
  }
}

/* ==========================================================================
   6. AI Quant Signals Engine (Stream recommendations only)
   ========================================================================== */
function renderAISignals() {
  const container = document.getElementById('ai-quant-signals-container');
  if (!container || !window.aiSignals) return;

  container.innerHTML = window.aiSignals
    .map(sig => {
      const isBuy = sig.action.includes('BUY') || sig.action.includes('LONG');
      const badgeClass = isBuy ? 'badge-buy' : 'badge-sell';
      const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(sig.ticker, 'logo-box-xs') : '';

      return `
        <div class="ai-signal-item">
          <div class="ai-signal-header">
            <div style="display:flex; align-items:center; gap:0.35rem;">
              ${logoHTML}
              <strong style="font-family:var(--font-mono); font-size:0.82rem; color:var(--text-main);">${sig.ticker}/USD</strong>
            </div>
            <span class="ai-signal-badge ${badgeClass}">${sig.action} (${sig.confidence}%)</span>
          </div>
          <div class="ai-signal-text">${sig.reason}</div>
          <button class="btn-execute-signal" onclick="window.executeAISignal('${sig.ticker}', '${isBuy ? 'LONG' : 'SHORT'}')">
            ⚡ Copy Trade (${sig.ticker})
          </button>
        </div>
      `;
    })
    .join('');
}

window.executeAISignal = function(ticker, type) {
  const sm = window.stateManager;
  if (!sm) return;

  const asset = sm.getAsset(ticker);
  if (!asset) return;

  const lot = sm.state.settings.scalpLotSize || 0.5;
  const lev = sm.state.settings.leverage || 10;
  const result = sm.executeTrade(ticker, type, lot, asset.price, lev);

  if (result.success) {
    if (window.soundFX) {
      if (type === 'LONG' || type === 'BUY') window.soundFX.playBuy();
      else window.soundFX.playSell();
    }
    showToast(`🤖 AI SIGNAL COPIED: ${type} ${lot} ${ticker} @ ${sm.formatCurrency(asset.price)}`, 'success');
    renderAllViews();
    if (window.tradingChart) window.tradingChart.render();
  } else {
    if (window.soundFX) window.soundFX.playError();
    showToast(result.message, 'error');
  }
};

function startAISignalsRotation() {
  renderAISignals();
  setInterval(() => {
    const sm = window.stateManager;
    if (!sm || !sm.state.assets) return;

    const randomAsset = sm.state.assets[Math.floor(Math.random() * sm.state.assets.length)];
    const isBuy = randomAsset.change24h >= 0;
    const reasons = [
      'EMA 9/21 cross confirmed + high volume inflow',
      'RSI momentum oversold bounce detected',
      'Volatility band breakout with institutional order flow',
      'Algorithmic liquidity absorption on bid support'
    ];

    window.aiSignals.unshift({
      id: `SIG-${Math.floor(100 + Math.random() * 900)}`,
      ticker: randomAsset.id,
      action: isBuy ? 'STRONG BUY' : 'TAKE PROFIT',
      confidence: Math.floor(Math.random() * 10 + 88),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      target: parseFloat((randomAsset.price * (isBuy ? 1.03 : 0.97)).toFixed(2)),
      stopLoss: parseFloat((randomAsset.price * (isBuy ? 0.98 : 1.02)).toFixed(2))
    });

    if (window.aiSignals.length > 3) window.aiSignals.pop();
    renderAISignals();
  }, 10000);
}

/* ==========================================================================
   7. 7-Day Live SVG Sparklines Generator
   ========================================================================== */
function renderSparklineSVG(points, isPositive) {
  if (!points || points.length < 2) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 85;
  const h = 26;

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

  let pathD = '';
  points.forEach((p, idx) => {
    const x = (idx / (points.length - 1)) * (w - 4) + 2;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    pathD += `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
  });

  const areaD = `${pathD} L ${w - 2} ${h} L 2 ${h} Z`;

  return `
    <svg class="sparkline-svg" viewBox="0 0 ${w} ${h}">
      <path d="${areaD}" fill="${fillColor}" />
      <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

/* ==========================================================================
   8. CSV Ledger Export Engine
   ========================================================================== */
function initCSVExport() {
  const exportBtn = document.getElementById('btn-export-csv');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    const sm = window.stateManager;
    if (!sm) return;

    const csvData = sm.exportOrdersCSV();
    if (!csvData) {
      showToast('No orders in your private ledger to export', 'error');
      return;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `KEREOS_Trade_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.soundFX) window.soundFX.playClick();
    showToast('Downloaded trade ledger CSV statement!', 'success');
  });
}

/* ==========================================================================
   9. Top Bar & Sidebar Controls
   ========================================================================== */
function initTopBarControls() {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar && !document.getElementById('btn-sound-toggle')) {
    const footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.innerHTML = `
      <button id="btn-sound-toggle" class="btn-sidebar-action" title="Toggle Sound FX">
        🔊 AUDIO: <span id="sound-status-text">ON</span>
      </button>
      <button id="btn-reset-account" class="btn-sidebar-action" title="Reset Demo Account">
        🔄 RESET ACCOUNT
      </button>
    `;
    sidebar.appendChild(footer);

    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundStatus = document.getElementById('sound-status-text');
    if (soundBtn && window.soundFX) {
      soundStatus.textContent = window.soundFX.enabled ? 'ON' : 'MUTED';
      soundBtn.addEventListener('click', () => {
        const enabled = window.soundFX.toggleSound();
        soundStatus.textContent = enabled ? 'ON' : 'MUTED';
        showToast(`Sound FX ${enabled ? 'Enabled' : 'Muted'}`, 'info');
      });
    }

    const resetBtn = document.getElementById('btn-reset-account');
    if (resetBtn && window.stateManager) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset trading terminal to fresh $100,000 demo capital and zero positions?')) {
          window.stateManager.resetState();
          if (window.soundFX) window.soundFX.playAlert();
          showToast('Demo account reset to $100,000.00 cash (clean slate)', 'success');
        }
      });
    }
  }
}

/* ==========================================================================
   10. Deposit Modal Dialog
   ========================================================================== */
function initDepositModal() {
  const modal = document.getElementById('deposit-modal');
  const openBtn = document.getElementById('btn-open-deposit');
  const closeBtn = document.getElementById('deposit-close');
  const form = document.getElementById('deposit-form');
  const amountInput = document.getElementById('deposit-amount');
  const quickBtns = document.querySelectorAll('.btn-quick-fund');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      if (amountInput) amountInput.focus();
      if (window.soundFX) window.soundFX.playClick();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.soundFX) window.soundFX.playClick();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const amt = btn.getAttribute('data-amount');
      if (amountInput) amountInput.value = amt;
      if (window.soundFX) window.soundFX.playClick();
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amt = parseFloat(amountInput.value);
      if (isNaN(amt) || amt <= 0) {
        showToast('Please enter a valid deposit amount', 'error');
        return;
      }

      if (window.stateManager) {
        window.stateManager.depositCash(amt);
        if (window.soundFX) window.soundFX.playBuy();
        showToast(`Successfully credited ${window.stateManager.formatCurrency(amt)} demo capital!`, 'success');
        modal.classList.remove('active');
        form.reset();
        renderAllViews();
      }
    });
  }
}

/* ==========================================================================
   11. View Renderers
   ========================================================================== */
function renderAllViews() {
  renderDashboardStats();
  renderPortfolioView();
  renderMarketsTable();
  renderOrdersTable();
  renderAnalytics();
  renderNewsWire();
  renderAISignals();
  updateChartHeader();
  renderOrderBook();
}

function renderDashboardStats() {
  const sm = window.stateManager;
  if (!sm) return;

  const netWorth = sm.calculatePortfolioNetWorthUSD();
  const cash = sm.state.cash;
  const pnl = sm.calculateUnrealizedPnLUSD();

  const elPortfolio = document.getElementById('val-portfolio');
  const elCash = document.getElementById('val-cash');
  const elPnl = document.getElementById('val-pnl');
  const badgeCurr = document.getElementById('dash-badge-currency');
  const elPnlPct = document.getElementById('dash-pnl-pct');

  if (badgeCurr) badgeCurr.textContent = sm.state.settings.currency || 'USD';
  if (elPortfolio) elPortfolio.textContent = sm.formatCurrency(netWorth);
  if (elCash) elCash.textContent = sm.formatCurrency(cash);

  if (elPnl) {
    const sign = pnl >= 0 ? '+' : '';
    elPnl.textContent = `${sign}${sm.formatCurrency(pnl)}`;
    elPnl.className = `card-value ${pnl >= 0 ? 'val-positive' : 'val-negative'}`;
  }

  if (elPnlPct) {
    const pct = netWorth > 0 ? (pnl / (netWorth - pnl || 1)) * 100 : 0;
    const sign = pct >= 0 ? '+' : '';
    elPnlPct.textContent = `${sign}${pct.toFixed(2)}%`;
    elPnlPct.style.color = pct >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
  }
}

function renderPortfolioView() {
  const page = document.getElementById('page-portfolio');
  const sm = window.stateManager;
  if (!page || !sm) return;

  const netWorth = sm.calculatePortfolioNetWorthUSD();
  const cash = sm.state.cash;
  const equity = sm.calculateHoldingsValueUSD();
  const unrealizedPnL = sm.calculateUnrealizedPnLUSD();

  const elTotal = document.getElementById('port-val-total');
  const elReturn = document.getElementById('port-sub-return');
  const elCash = document.getElementById('port-val-cash');
  const elRatio = document.getElementById('port-sub-cash-ratio');
  const elEquity = document.getElementById('port-val-equity');
  const elCount = document.getElementById('port-sub-holdings-count');

  if (elTotal) elTotal.textContent = sm.formatCurrency(netWorth);
  if (elReturn) {
    const retPct = netWorth > 0 ? (unrealizedPnL / (netWorth - unrealizedPnL || 1)) * 100 : 0;
    const sign = retPct >= 0 ? '+' : '';
    elReturn.textContent = `24h Return: ${sign}${retPct.toFixed(2)}%`;
    elReturn.className = `card-subtext ${retPct >= 0 ? 'val-positive' : 'val-negative'}`;
  }

  if (elCash) elCash.textContent = sm.formatCurrency(cash);
  if (elRatio) {
    const cashPct = netWorth > 0 ? (cash / netWorth) * 100 : 100;
    elRatio.textContent = `${cashPct.toFixed(1)}% Liquidity`;
  }

  if (elEquity) elEquity.textContent = sm.formatCurrency(equity);

  const holdingsEntries = Object.entries(sm.state.holdings || {}).filter(([_, h]) => h.qty > 0);
  if (elCount) elCount.textContent = `${holdingsEntries.length} Active Positions`;

  const tbody = document.getElementById('portfolio-holdings-list');
  const barContainer = document.getElementById('portfolio-allocation-bar');
  const legendContainer = document.getElementById('portfolio-allocation-legend');

  const colors = ['#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];
  const cashPct = netWorth > 0 ? (cash / netWorth) * 100 : 100;

  if (barContainer && legendContainer) {
    let barsHTML = `<div class="allocation-segment" style="width: ${cashPct}%; background: #64748b;" title="Cash: ${cashPct.toFixed(1)}%"></div>`;
    let legendHTML = `
      <div class="legend-item">
        <div class="legend-dot" style="background: #64748b;"></div>
        <span>Cash (${cashPct.toFixed(1)}% &bull; ${sm.formatCurrency(cash)})</span>
      </div>
    `;

    holdingsEntries.forEach(([ticker, holding], idx) => {
      const asset = sm.getAsset(ticker);
      const curPrice = asset ? asset.price : holding.entryPrice;
      const val = holding.margin + (holding.side === 'SHORT' ? (holding.entryPrice - curPrice) * holding.qty : (curPrice - holding.entryPrice) * holding.qty);
      const pct = netWorth > 0 ? (val / netWorth) * 100 : 0;
      const color = colors[idx % colors.length];

      barsHTML += `<div class="allocation-segment" style="width: ${pct}%; background: ${color};" title="${ticker}: ${pct.toFixed(1)}%"></div>`;
      legendHTML += `
        <div class="legend-item">
          <div class="legend-dot" style="background: ${color};"></div>
          <span>${ticker} (${pct.toFixed(1)}% &bull; ${sm.formatCurrency(val)})</span>
        </div>
      `;
    });

    barContainer.innerHTML = barsHTML;
    legendContainer.innerHTML = legendHTML;
  }

  if (tbody) {
    if (holdingsEntries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:var(--text-dim); padding:2.5rem;">No open margin positions. Your account has zero active trades. Click LONG or SHORT on any asset to open a trade.</td></tr>`;
    } else {
      tbody.innerHTML = holdingsEntries
        .map(([ticker, holding]) => {
          const asset = sm.getAsset(ticker);
          const curPrice = asset ? asset.price : holding.entryPrice;
          const posPnl = holding.side === 'SHORT' ? (holding.entryPrice - curPrice) * holding.qty : (curPrice - holding.entryPrice) * holding.qty;
          const roePct = holding.margin > 0 ? (posPnl / holding.margin) * 100 : 0;
          const isPos = posPnl >= 0;
          const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(ticker, 'logo-box-md') : '';
          const sparklineHTML = asset ? renderSparklineSVG(asset.sparkline, isPos) : '';

          return `
            <tr>
              <td>
                <div class="asset-badge">
                  ${logoHTML}
                  <div class="asset-meta">
                    <h4>${asset ? asset.name : ticker}</h4>
                    <span>${ticker}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge ${holding.side === 'LONG' ? 'badge-buy' : 'badge-sell'}">
                  ${holding.side} ${holding.leverage || 1}x
                </span>
              </td>
              <td>${holding.qty.toLocaleString('en-US', { maximumFractionDigits: 4 })}</td>
              <td>${sm.formatCurrency(holding.entryPrice)}</td>
              <td style="font-weight:700;">${sm.formatCurrency(curPrice)}</td>
              <td style="color:var(--accent-red); font-size:0.8rem;">${sm.formatCurrency(holding.liqPrice || 0)}</td>
              <td>${sparklineHTML}</td>
              <td class="${isPos ? 'val-positive' : 'val-negative'}">
                ${isPos ? '+' : ''}${sm.formatCurrency(posPnl)} (${isPos ? '+' : ''}${roePct.toFixed(2)}% ROE)
              </td>
              <td>
                <button class="btn-trade btn-sell" onclick="window.closePosition('${ticker}')">CLOSE</button>
              </td>
            </tr>
          `;
        })
        .join('');
    }
  }
}

window.closePosition = function(ticker) {
  const sm = window.stateManager;
  if (!sm) return;
  const holding = sm.state.holdings[ticker];
  if (!holding) return;
  const asset = sm.getAsset(ticker);
  const curPrice = asset ? asset.price : holding.entryPrice;

  const result = sm.executeTrade(ticker, 'SELL', holding.qty, curPrice);
  if (result.success) {
    if (window.soundFX) window.soundFX.playSell();
    showToast(`Closed position in ${ticker} @ ${sm.formatCurrency(curPrice)}`, 'success');
    renderAllViews();
    if (window.tradingChart) window.tradingChart.render();
  }
};

function updateChartHeader() {
  const chartContainer = document.querySelector('.chart-container');
  if (!chartContainer) return;

  const sm = window.stateManager;
  if (!sm) return;

  const activeAssetId = sm.state.settings.activeAsset || 'BTC';
  const asset = sm.getAsset(activeAssetId);
  if (!asset) return;

  const pairLabel = document.getElementById('orderbook-pair');
  if (pairLabel) pairLabel.textContent = `${asset.id}/USD`;

  let chipsContainer = chartContainer.querySelector('.asset-chips-container');
  if (!chipsContainer) {
    chipsContainer = document.createElement('div');
    chipsContainer.className = 'asset-chips-container';
    chartContainer.insertBefore(chipsContainer, chartContainer.firstChild);
  }

  chipsContainer.innerHTML = sm.state.assets
    .map((a) => {
      const isAct = a.id === activeAssetId;
      const isPos = a.change24h >= 0;
      const sign = isPos ? '+' : '';
      const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(a.id, 'logo-box-xs') : '';
      return `
        <button class="asset-chip ${isAct ? 'active' : ''}" onclick="window.selectChartAsset('${a.id}')">
          ${logoHTML}
          <strong>${a.id}</strong>
          <span style="color:${isPos ? 'var(--accent-green)' : 'var(--accent-red)'}">${sign}${a.change24h.toFixed(1)}%</span>
        </button>
      `;
    })
    .join('');

  let chartHeader = chartContainer.querySelector('.chart-header');
  if (!chartHeader) {
    chartHeader = document.createElement('div');
    chartHeader.className = 'chart-header';
    chipsContainer.after(chartHeader);
  }

  const isPos = asset.change24h >= 0;
  const sign = isPos ? '+' : '';
  const chartType = sm.state.settings.chartType || 'candles';
  const showMarkers = sm.state.settings.showTradeMarkers !== false;
  const showEMA = sm.state.settings.showEMA !== false;
  const showRSI = sm.state.settings.showRSI !== false;
  const showMACD = sm.state.settings.showMACD === true;
  const showBollinger = sm.state.settings.showBollinger === true;
  const bigLogoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(asset.id, 'logo-box-lg') : '';

  chartHeader.innerHTML = `
    <div class="chart-asset-info">
      ${bigLogoHTML}
      <div>
        <div class="chart-ticker">${asset.name} (${asset.id})</div>
        <div style="font-size:0.72rem; color:var(--text-muted)">CAT: ${asset.category} &bull; 24H VOL: ${asset.volume}</div>
      </div>
      <div class="chart-price">${sm.formatCurrency(asset.price)}</div>
      <span class="badge ${isPos ? 'badge-buy' : 'badge-sell'}">${sign}${asset.change24h.toFixed(2)}%</span>
    </div>

    <div class="chart-controls">
      <div class="chart-type-toggle">
        <button class="btn-chart-type ${chartType === 'candles' ? 'active' : ''}" id="btn-toggle-candles">
          🕯️ Candles
        </button>
        <button class="btn-chart-type ${chartType === 'line' ? 'active' : ''}" id="btn-toggle-line">
          📈 Line
        </button>
      </div>

      <button class="btn-toggle-hud ${showEMA ? 'active' : ''}" id="btn-toggle-ema">
        ⚡ EMA 9/21/55
      </button>

      <button class="btn-toggle-hud ${showRSI ? 'active' : ''}" id="btn-toggle-rsi">
        📊 RSI (14)
      </button>

      <button class="btn-toggle-hud ${showMACD ? 'active' : ''}" id="btn-toggle-macd">
        📐 MACD
      </button>

      <button class="btn-toggle-hud ${showBollinger ? 'active' : ''}" id="btn-toggle-bollinger">
        🌊 Bollinger
      </button>

      <button class="btn-toggle-hud ${showMarkers ? 'active' : ''}" id="btn-trade-markers">
        🎯 Trades
      </button>

      <div style="display:flex; gap:0.25rem;">
        <button class="btn-timeframe ${sm.state.settings.timeframe === '1M' ? 'active' : ''}" data-tf="1M">1M</button>
        <button class="btn-timeframe ${sm.state.settings.timeframe === '5M' ? 'active' : ''}" data-tf="5M">5M</button>
        <button class="btn-timeframe ${sm.state.settings.timeframe === '1H' ? 'active' : ''}" data-tf="1H">1H</button>
        <button class="btn-timeframe ${sm.state.settings.timeframe === '1D' ? 'active' : ''}" data-tf="1D">1D</button>
      </div>
    </div>
  `;

  // Attach event handlers
  const btnCandles = chartHeader.querySelector('#btn-toggle-candles');
  const btnLine = chartHeader.querySelector('#btn-toggle-line');
  const btnEMA = chartHeader.querySelector('#btn-toggle-ema');
  const btnRSI = chartHeader.querySelector('#btn-toggle-rsi');
  const btnMACD = chartHeader.querySelector('#btn-toggle-macd');
  const btnBollinger = chartHeader.querySelector('#btn-toggle-bollinger');
  const btnMarkers = chartHeader.querySelector('#btn-trade-markers');

  if (btnCandles) {
    btnCandles.addEventListener('click', () => {
      if (window.tradingChart) window.tradingChart.setChartType('candles');
      if (window.soundFX) window.soundFX.playClick();
      updateChartHeader();
    });
  }

  if (btnLine) {
    btnLine.addEventListener('click', () => {
      if (window.tradingChart) window.tradingChart.setChartType('line');
      if (window.soundFX) window.soundFX.playClick();
      updateChartHeader();
    });
  }

  if (btnEMA) {
    btnEMA.addEventListener('click', () => {
      if (window.tradingChart) {
        window.tradingChart.toggleEMA();
        if (window.soundFX) window.soundFX.playClick();
        updateChartHeader();
      }
    });
  }

  if (btnRSI) {
    btnRSI.addEventListener('click', () => {
      if (window.tradingChart) {
        window.tradingChart.toggleRSI();
        if (window.soundFX) window.soundFX.playClick();
        updateChartHeader();
      }
    });
  }

  if (btnMACD) {
    btnMACD.addEventListener('click', () => {
      if (window.tradingChart) {
        window.tradingChart.toggleMACD();
        if (window.soundFX) window.soundFX.playClick();
        updateChartHeader();
      }
    });
  }

  if (btnBollinger) {
    btnBollinger.addEventListener('click', () => {
      if (window.tradingChart) {
        window.tradingChart.toggleBollinger();
        if (window.soundFX) window.soundFX.playClick();
        updateChartHeader();
      }
    });
  }

  if (btnMarkers) {
    btnMarkers.addEventListener('click', () => {
      if (window.tradingChart) {
        window.tradingChart.toggleTradeMarkers();
        if (window.soundFX) window.soundFX.playClick();
        updateChartHeader();
      }
    });
  }

  chartHeader.querySelectorAll('.btn-timeframe').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tf = btn.getAttribute('data-tf');
      if (window.tradingChart) {
        window.tradingChart.setTimeframe(tf);
      }
      if (window.soundFX) window.soundFX.playClick();
      updateChartHeader();
    });
  });
}

function renderMarketsTable() {
  const tbody = document.getElementById('markets-list');
  const sm = window.stateManager;
  if (!tbody || !sm) return;

  const filter = window.currentMarketFilter || 'ALL';
  const assets = sm.state.assets.filter((a) => filter === 'ALL' || a.category === filter);

  tbody.innerHTML = '';
  assets.forEach((asset) => {
    const tr = document.createElement('tr');
    tr.id = `row-asset-${asset.id}`;
    const isPos = asset.change24h >= 0;
    const sign = isPos ? '+' : '';
    const holding = sm.state.holdings[asset.id];
    const holdingQty = holding && holding.qty > 0 ? `${holding.qty.toFixed(holding.qty < 1 ? 4 : 2)} (${holding.side})` : '0';
    const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(asset.id, 'logo-box-md') : '';
    const sparklineHTML = renderSparklineSVG(asset.sparkline, isPos);

    tr.innerHTML = `
      <td>
        <div class="asset-badge">
          ${logoHTML}
          <div class="asset-meta">
            <h4>${asset.name}</h4>
            <span>${asset.id} &bull; Position: ${holdingQty}</span>
          </div>
        </div>
      </td>
      <td class="col-price" style="font-weight:700;">${sm.formatCurrency(asset.price)}</td>
      <td class="col-change">
        <span class="badge ${isPos ? 'badge-buy' : 'badge-sell'}">
          ${sign}${asset.change24h.toFixed(2)}%
        </span>
      </td>
      <td class="col-sparkline">${sparklineHTML}</td>
      <td>
        <span style="color:var(--accent-green); font-size:0.75rem;">${sm.formatCurrency(asset.high24h)}</span> / 
        <span style="color:var(--accent-red); font-size:0.75rem;">${sm.formatCurrency(asset.low24h)}</span>
      </td>
      <td style="color:var(--text-dim); font-size:0.8rem;">$${asset.volume}</td>
      <td>
        <div class="btn-action-group">
          <button class="btn-chart-select" onclick="window.selectChartAsset('${asset.id}')">CHART</button>
          <button class="btn-trade btn-buy" onclick="window.openTradeModal('${asset.id}', 'LONG')">LONG</button>
          <button class="btn-trade btn-sell" onclick="window.openTradeModal('${asset.id}', 'SHORT')">SHORT</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-list');
  const sm = window.stateManager;
  if (!tbody || !sm) return;

  tbody.innerHTML = '';
  if (!sm.state.orders || sm.state.orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-dim); padding:2.5rem;">No orders executed in this session. Your private ledger is completely empty.</td></tr>`;
    return;
  }

  sm.state.orders.forEach((ord) => {
    const tr = document.createElement('tr');
    const isLong = ord.type === 'LONG' || ord.type === 'BUY';
    const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(ord.ticker, 'logo-box-sm') : '';
    tr.innerHTML = `
      <td style="color:var(--text-muted); font-size:0.8rem;">#${ord.id}</td>
      <td style="color:var(--text-dim);">${ord.time}</td>
      <td>
        <div style="display:flex; align-items:center; gap:0.4rem;">
          ${logoHTML}
          <strong style="color:var(--accent-cyan);">${ord.ticker}</strong>
        </div>
      </td>
      <td><span class="badge ${isLong ? 'badge-buy' : 'badge-sell'}">${ord.type}</span></td>
      <td><span class="badge badge-neutral">${ord.leverage || 1}x</span></td>
      <td>${sm.formatCurrency(ord.price)}</td>
      <td>${ord.quantity.toLocaleString('en-US', { maximumFractionDigits: 4 })}</td>
      <td style="font-weight:700;">${sm.formatCurrency(ord.total)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAnalytics() {
  const page = document.getElementById('page-analytics');
  const sm = window.stateManager;
  if (!page || !sm) return;

  const totalTrades = sm.state.orders ? sm.state.orders.length : 0;
  const longOrders = (sm.state.orders || []).filter((o) => o.type === 'LONG' || o.type === 'BUY').length;
  const shortOrders = (sm.state.orders || []).filter((o) => o.type === 'SHORT').length;
  const realizedPnL = sm.state.realizedPnL || 0;

  const elRealized = document.getElementById('analytics-realized-pnl');
  const elTotal = document.getElementById('analytics-total-trades');
  const elSub = document.getElementById('analytics-sub-trades');

  if (elRealized) {
    elRealized.textContent = `${realizedPnL >= 0 ? '+' : ''}${sm.formatCurrency(realizedPnL)}`;
    elRealized.className = `card-value ${realizedPnL >= 0 ? 'val-positive' : 'val-negative'}`;
  }
  if (elTotal) elTotal.textContent = totalTrades;
  if (elSub) elSub.textContent = `${longOrders} Longs • ${shortOrders} Shorts`;
}

/* ==========================================================================
   12. Bloomberg Intelligence AI Wire Renderer
   ========================================================================== */
function renderNewsWire() {
  const container = document.getElementById('news-feed-container');
  if (!container || !window.newsFeedItems) return;

  const filter = window.newsFilter || 'ALL';
  const items = window.newsFeedItems.filter(item => filter === 'ALL' || item.category === filter);

  container.innerHTML = items
    .map((item) => {
      const isBullish = item.sentiment === 'BULLISH';
      const sentimentColor = isBullish ? 'var(--accent-green)' : (item.sentiment === 'BEARISH' ? 'var(--accent-red)' : 'var(--text-muted)');
      const badgeCatColor = item.category === 'BREAKING' ? 'background:rgba(244,63,94,0.2); color:#f43f5e; border:1px solid #f43f5e;' : 'background:rgba(6,182,212,0.15); color:#06b6d4; border:1px solid #06b6d4;';

      const takeawaysHTML = item.takeaways.map(t => `<li>${t}</li>`).join('');
      const targetLogo = window.getAssetLogoHTML ? window.getAssetLogoHTML(item.targetTicker, 'logo-box-xs') : '';

      return `
        <div class="news-card-pro">
          <div class="news-top-meta">
            <span class="news-badge-category" style="${badgeCatColor}">${item.category} &bull; ${item.impact}</span>
            <span>${item.source} &bull; ${item.time}</span>
          </div>

          <h3 class="news-headline-pro">${item.headline}</h3>

          <div class="news-summary-box">
            ${item.summary}
          </div>

          <ul class="news-takeaways-list">
            ${takeawaysHTML}
          </ul>

          <div class="news-sentiment-gauge">
            <div style="display:flex; align-items:center; gap:0.4rem;">
              <span style="color:${sentimentColor}; font-weight:800;">● ${item.sentimentPct}% ${item.sentiment}</span>
            </div>
            <button class="news-trade-shortcut" onclick="window.selectChartAsset('${item.targetTicker}')">
              <span style="display:inline-flex; align-items:center; gap:0.25rem;">
                ${targetLogo}
                <span>Trade ${item.targetTicker}</span>
              </span>
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

/* ==========================================================================
   13. Live Order Book & Global Public Feed Simulation (Read-only tape)
   ========================================================================== */
function renderOrderBook() {
  const sm = window.stateManager;
  if (!sm) return;

  const activeAssetId = sm.state.settings.activeAsset || 'BTC';
  const asset = sm.getAsset(activeAssetId);
  if (!asset) return;

  const asksContainer = document.getElementById('orderbook-asks');
  const bidsContainer = document.getElementById('orderbook-bids');
  const midPriceEl = document.getElementById('orderbook-mid-price');

  if (midPriceEl) midPriceEl.textContent = sm.formatCurrency(asset.price);

  if (asksContainer && bidsContainer) {
    const curPrice = asset.price;
    const step = curPrice * 0.0004;

    let asksHTML = '';
    for (let i = 5; i >= 1; i--) {
      const p = curPrice + i * step;
      const size = (Math.random() * 2 + 0.1).toFixed(3);
      const total = (p * parseFloat(size)).toFixed(0);
      const depthPct = Math.min((parseFloat(size) / 2.5) * 100, 100);

      asksHTML += `
        <div class="orderbook-row">
          <div class="orderbook-depth-bar" style="width:${depthPct}%"></div>
          <span>${sm.formatCurrency(p, null, 2)}</span>
          <span>${size}</span>
          <span>${total}</span>
        </div>
      `;
    }
    asksContainer.innerHTML = asksHTML;

    let bidsHTML = '';
    for (let i = 1; i <= 5; i++) {
      const p = curPrice - i * step;
      const size = (Math.random() * 2 + 0.1).toFixed(3);
      const total = (p * parseFloat(size)).toFixed(0);
      const depthPct = Math.min((parseFloat(size) / 2.5) * 100, 100);

      bidsHTML += `
        <div class="orderbook-row">
          <div class="orderbook-depth-bar" style="width:${depthPct}%"></div>
          <span>${sm.formatCurrency(p, null, 2)}</span>
          <span>${size}</span>
          <span>${total}</span>
        </div>
      `;
    }
    bidsContainer.innerHTML = bidsHTML;
  }
}

function startOrderBookSimulation() {
  const tradesContainer = document.getElementById('recent-trades-list');
  if (!tradesContainer) return;

  tradesContainer.innerHTML = `
    <div class="trade-tick-row" style="color:var(--accent-green);">
      <span>BUY</span> <span>0.420 BTC</span> <span>16:55:01</span>
    </div>
    <div class="trade-tick-row" style="color:var(--accent-red);">
      <span>SELL</span> <span>1.150 BTC</span> <span>16:54:54</span>
    </div>
  `;

  setInterval(() => {
    const sm = window.stateManager;
    if (!sm) return;

    const activeAssetId = sm.state.settings.activeAsset || 'BTC';
    const asset = sm.getAsset(activeAssetId);
    if (!asset) return;

    const isBuy = Math.random() > 0.48;
    const qty = (Math.random() * 1.5 + 0.05).toFixed(3);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const color = isBuy ? 'var(--accent-green)' : 'var(--accent-red)';

    const row = document.createElement('div');
    row.className = 'trade-tick-row';
    row.style.color = color;
    row.innerHTML = `
      <span>${isBuy ? 'BUY' : 'SELL'}</span>
      <span>${qty} ${asset.id}</span>
      <span>${time}</span>
    `;

    tradesContainer.insertBefore(row, tradesContainer.firstChild);
    if (tradesContainer.children.length > 5) {
      tradesContainer.removeChild(tradesContainer.lastChild);
    }

    renderOrderBook();
  }, 2200);
}

/* ==========================================================================
   14. Chart Asset Selector
   ========================================================================== */
window.selectChartAsset = function (ticker) {
  const sm = window.stateManager;
  if (!sm) return;

  sm.state.settings.activeAsset = ticker;
  sm.saveState();

  if (window.tradingChart) {
    window.tradingChart.setAsset(ticker);
  }

  const dashboardLink = document.querySelector('.nav-link[data-target="dashboard"]');
  if (dashboardLink) dashboardLink.click();

  updateChartHeader();
  renderOrderBook();
};

/* ==========================================================================
   15. Trade Modal Execution
   ========================================================================== */
function initTradeModal() {
  const modal = document.getElementById('trade-modal');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('trade-form');
  const qtyInput = document.getElementById('trade-qty');
  const pctButtons = document.querySelectorAll('.btn-pct:not(.btn-quick-fund):not(.btn-modal-lev)');
  const levButtons = document.querySelectorAll('.btn-modal-lev');

  let selectedModalLev = 10;

  levButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      levButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedModalLev = parseInt(btn.getAttribute('data-lev'), 10);
      if (window.soundFX) window.soundFX.playClick();
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.soundFX) window.soundFX.playClick();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  pctButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pct = parseFloat(btn.getAttribute('data-pct')) / 100;
      const assetId = document.getElementById('trade-asset-id').value;
      const sm = window.stateManager;
      if (!sm) return;

      const asset = sm.getAsset(assetId);
      if (!asset || asset.price <= 0) return;

      const availableBudget = sm.state.cash * pct * selectedModalLev;
      const calcQty = availableBudget / asset.price;
      qtyInput.value = parseFloat(calcQty.toFixed(4));

      if (window.soundFX) window.soundFX.playClick();
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const assetId = document.getElementById('trade-asset-id').value;
      const mode = document.getElementById('trade-mode').value;
      const qty = parseFloat(qtyInput.value);
      const sm = window.stateManager;
      if (!sm) return;

      const asset = sm.getAsset(assetId);
      if (!asset) return;

      const result = sm.executeTrade(assetId, mode, qty, asset.price, selectedModalLev);

      if (result.success) {
        if (window.soundFX) {
          if (mode === 'LONG' || mode === 'BUY') window.soundFX.playBuy();
          else window.soundFX.playSell();
        }
        showToast(result.message, 'success');
        modal.classList.remove('active');
        form.reset();
        renderAllViews();
        if (window.tradingChart) window.tradingChart.render();
      } else {
        if (window.soundFX) window.soundFX.playError();
        showToast(result.message, 'error');
      }
    });
  }
}

window.openTradeModal = function (ticker, mode) {
  const modal = document.getElementById('trade-modal');
  const title = document.getElementById('modal-title');
  const assetInput = document.getElementById('trade-asset-id');
  const modeInput = document.getElementById('trade-mode');
  const submitBtn = document.getElementById('btn-submit-trade');
  const qtyInput = document.getElementById('trade-qty');
  const sm = window.stateManager;

  if (!modal || !sm) return;

  const asset = sm.getAsset(ticker);
  if (!asset) return;

  assetInput.value = ticker;
  modeInput.value = mode;
  title.textContent = `Open ${mode} Position on ${asset.name} (${ticker})`;

  submitBtn.className = `btn-submit ${mode === 'LONG' || mode === 'BUY' ? 'btn-buy' : 'btn-sell'}`;
  submitBtn.textContent = `CONFIRM ${mode} ORDER`;

  let infoBox = modal.querySelector('.modal-trade-info');
  if (!infoBox) {
    infoBox = document.createElement('div');
    infoBox.className = 'modal-trade-info';
    const form = document.getElementById('trade-form');
    form.insertBefore(infoBox, form.firstChild);
  }

  const holding = sm.state.holdings[ticker];
  const holdingQty = holding && holding.qty > 0 ? `${holding.qty.toFixed(4)} (${holding.side})` : '0';
  const logoHTML = window.getAssetLogoHTML ? window.getAssetLogoHTML(ticker, 'logo-box-sm') : '';

  infoBox.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
      ${logoHTML}
      <strong style="color:var(--text-main); font-size:0.95rem;">${asset.name} (${ticker})</strong>
    </div>
    <div class="modal-info-row">
      <span>Market Price:</span>
      <span>${sm.formatCurrency(asset.price)}</span>
    </div>
    <div class="modal-info-row">
      <span>Available Free Cash:</span>
      <span>${sm.formatCurrency(sm.state.cash)}</span>
    </div>
    <div class="modal-info-row">
      <span>Current Position:</span>
      <span>${holdingQty}</span>
    </div>
  `;

  qtyInput.value = '';
  modal.classList.add('active');
  qtyInput.focus();

  if (window.soundFX) window.soundFX.playClick();
};

/* ==========================================================================
   16. Real-Time Market Simulation Engine (Prices only, zero auto-trades)
   ========================================================================== */
let simCycle = 0;

function startMarketSimulation() {
  setInterval(() => {
    const sm = window.stateManager;
    if (!sm || !sm.state.assets) return;

    simCycle++;
    const shouldNewCandle = simCycle % 8 === 0;

    const countToUpdate = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < countToUpdate; i++) {
      const idx = Math.floor(Math.random() * sm.state.assets.length);
      const asset = sm.state.assets[idx];
      if (!asset) continue;

      const vol = asset.category === 'CRYPTO' ? 0.0065 : (asset.category === 'FOREX' ? 0.0015 : 0.0035);
      const changePct = (Math.random() - 0.485) * vol;
      const oldPrice = asset.price;
      const newPrice = Math.max(parseFloat((oldPrice * (1 + changePct)).toFixed(asset.category === 'FOREX' ? 4 : 2)), 0.0001);

      asset.price = newPrice;
      asset.change24h = parseFloat((((newPrice - asset.prevPrice) / asset.prevPrice) * 100).toFixed(2));
      asset.high24h = Math.max(asset.high24h, newPrice);
      asset.low24h = Math.min(asset.low24h, newPrice);

      // Update sparkline
      if (asset.sparkline) {
        asset.sparkline.push(newPrice);
        if (asset.sparkline.length > 18) asset.sparkline.shift();
      }

      // Update multi-timeframe candles
      if (asset.timeframes) {
        ['1M', '5M', '1H', '1D'].forEach(tf => {
          const list = asset.timeframes[tf];
          if (!list || list.length === 0) return;

          if (shouldNewCandle && tf === '1M') {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            list.push({
              time,
              open: oldPrice,
              high: Math.max(oldPrice, newPrice),
              low: Math.min(oldPrice, newPrice),
              close: newPrice,
              volume: Math.floor(Math.random() * 400 + 100)
            });
            if (list.length > 45) list.shift();
          } else {
            const curCandle = list[list.length - 1];
            curCandle.close = newPrice;
            curCandle.high = Math.max(curCandle.high, newPrice);
            curCandle.low = Math.min(curCandle.low, newPrice);
            curCandle.volume += Math.floor(Math.random() * 30 + 10);
          }
        });
      }

      // Flash table row
      const row = document.getElementById(`row-asset-${asset.id}`);
      if (row) {
        const flashClass = newPrice >= oldPrice ? 'flash-green' : 'flash-red';
        row.classList.add(flashClass);
        setTimeout(() => row.classList.remove(flashClass), 350);

        const priceCell = row.querySelector('.col-price');
        if (priceCell) priceCell.textContent = sm.formatCurrency(newPrice);

        const changeCell = row.querySelector('.col-change');
        if (changeCell) {
          const isPos = asset.change24h >= 0;
          const sign = isPos ? '+' : '';
          changeCell.innerHTML = `<span class="badge ${isPos ? 'badge-buy' : 'badge-sell'}">${sign}${asset.change24h.toFixed(2)}%</span>`;
        }

        const sparkCell = row.querySelector('.col-sparkline');
        if (sparkCell) {
          sparkCell.innerHTML = renderSparklineSVG(asset.sparkline, asset.change24h >= 0);
        }
      }
    }

    renderDashboardStats();
    initTickerMarquee();
  }, 1200);
}

/* ==========================================================================
   17. Toast Notifications
   ========================================================================== */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '⚡';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

window.showToast = showToast;
