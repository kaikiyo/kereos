/**
 * Main Dynamic UI & Navigation Event Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Chart Canvas Engine
  window.candlestickChart = new CandlestickChart('trading-chart');

  // Background Particles Engine
  initParticleBackground();

  // Subscribe UI to State updates
  window.stateManager.subscribe(updateUI);
  updateUI();

  // Setup Navigation Routing
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = link.getAttribute('data-target');
      
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.view-page').forEach(p => p.classList.remove('active'));

      link.classList.add('active');
      const pageEl = document.getElementById(`page-${targetPage}`);
      if (pageEl) pageEl.classList.add('active');
    });
  });

  // Modal Action Listeners
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('trade-form').addEventListener('submit', handleTradeSubmit);

  // Quick Percentage Selectors
  document.querySelectorAll('.btn-pct').forEach(btn => {
    btn.addEventListener('click', () => {
      const pct = parseFloat(btn.getAttribute('data-pct'));
      const assetId = document.getElementById('trade-asset-id').value;
      const mode = document.getElementById('trade-mode').value;
      const asset = window.stateManager.state.assets.find(a => a.id === assetId);

      if (mode === 'SELL') {
        const pos = window.stateManager.state.holdings[assetId];
        if (pos) {
          document.getElementById('trade-qty').value = (pos.qty * (pct / 100)).toFixed(4);
        }
      } else {
        const cash = window.stateManager.state.cash;
        const targetSpend = cash * (pct / 100);
        document.getElementById('trade-qty').value = (targetSpend / asset.price).toFixed(4);
      }
    });
  });
});

function updateUI() {
  const metrics = window.stateManager.getPortfolioMetrics();

  // Top Bar & Dashboard Balances
  document.getElementById('val-portfolio').textContent = window.stateManager.formatCurrency(metrics.totalValue);
  document.getElementById('val-cash').textContent = window.stateManager.formatCurrency(metrics.cash);
  
  const pnlEl = document.getElementById('val-pnl');
  pnlEl.textContent = window.stateManager.formatCurrency(metrics.unrealizedPnL);
  pnlEl.className = `card-value ${metrics.unrealizedPnL >= 0 ? 'val-up' : 'val-down'}`;

  // Render Markets Table
  renderMarketsTable();

  // Render Orders Table
  renderOrdersTable();

  // Live Chart Update for active asset
  if (window.candlestickChart) {
    const activeAsset = window.stateManager.state.assets.find(a => a.id === window.candlestickChart.activeAssetId);
    if (activeAsset) window.candlestickChart.updateLiveTick(activeAsset.price);
  }
}

function renderMarketsTable() {
  const tbody = document.getElementById('markets-list');
  if (!tbody) return;

  tbody.innerHTML = window.stateManager.state.assets.map(asset => `
    <tr>
      <td class="asset-cell">
        <div class="asset-icon" style="background:${asset.color}"></div>
        <div>
          <div>${asset.name}</div>
          <small style="color:var(--text-muted)">${asset.ticker}</small>
        </div>
      </td>
      <td>${window.stateManager.formatCurrency(asset.price)}</td>
      <td class="${asset.change >= 0 ? 'val-up' : 'val-down'}">${asset.change >= 0 ? '+' : ''}${asset.change}%</td>
      <td>
        <button class="btn-action" onclick="openTradeModal('${asset.id}', 'BUY')">BUY</button>
        <button class="btn-action" onclick="openTradeModal('${asset.id}', 'SELL')">SELL</button>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-list');
  if (!tbody) return;

  tbody.innerHTML = window.stateManager.state.orders.map(ord => `
    <tr>
      <td style="font-family:var(--font-mono)">${ord.id}</td>
      <td>${ord.timestamp}</td>
      <td><strong>${ord.ticker}</strong></td>
      <td class="${ord.type === 'BUY' ? 'val-up' : 'val-down'}">${ord.type}</td>
      <td>${window.stateManager.formatCurrency(ord.price)}</td>
      <td>${ord.quantity}</td>
      <td>${window.stateManager.formatCurrency(ord.total)}</td>
    </tr>
  `).join('');
}

function openTradeModal(assetId, mode) {
  const asset = window.stateManager.state.assets.find(a => a.id === assetId);
  if (!asset) return;

  document.getElementById('trade-asset-id').value = asset.id;
  document.getElementById('trade-mode').value = mode;
  document.getElementById('modal-title').textContent = `${mode} ${asset.name} (${asset.ticker})`;
  
  const submitBtn = document.getElementById('btn-submit-trade');
  submitBtn.textContent = `CONFIRM ${mode}`;
  submitBtn.className = `btn-submit ${mode === 'BUY' ? 'btn-buy' : 'btn-sell'}`;

  document.getElementById('trade-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('trade-modal').classList.remove('active');
}

function handleTradeSubmit(e) {
  e.preventDefault();
  const assetId = document.getElementById('trade-asset-id').value;
  const mode = document.getElementById('trade-mode').value;
  const qty = parseFloat(document.getElementById('trade-qty').value);

  const result = window.stateManager.executeTrade(assetId, mode, qty);
  if (result.success) {
    if (mode === 'BUY') window.soundEngine.playBuySound();
    else window.soundEngine.playSellSound();

    showToast(`Order Executed: ${mode} ${qty} ${assetId.toUpperCase()}`);
    closeModal();
  } else {
    showToast(`Error: ${result.reason}`);
  }
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}