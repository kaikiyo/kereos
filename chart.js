/**
 * HTML5 Canvas Candlestick & Trade Marker Engine
 */
class CandlestickChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.candles = [];
    this.activeAssetId = 'btc';
    this.initData();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
    this.render();
  }

  initData() {
    const basePrice = 78000;
    let current = basePrice;
    this.candles = [];
    
    for (let i = 0; i < 40; i++) {
      const open = current;
      const close = open + (Math.random() - 0.48) * 200;
      const high = Math.max(open, close) + Math.random() * 100;
      const low = Math.min(open, close) - Math.random() * 100;
      this.candles.push({ open, high, low, close });
      current = close;
    }
  }

  updateLiveTick(currentPrice) {
    if (this.candles.length === 0) return;
    const last = this.candles[this.candles.length - 1];
    last.close = currentPrice;
    last.high = Math.max(last.high, currentPrice);
    last.low = Math.min(last.low, currentPrice);
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    // Calculate Price Min / Max Scales
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    this.candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    const padding = (maxPrice - minPrice) * 0.1 || 10;
    minPrice -= padding;
    maxPrice += padding;

    const candleWidth = (width - 60) / this.candles.length;

    // Draw Background Grid Lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = (height / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width - 60, y);
      this.ctx.stroke();
    }

    // Render Candlesticks
    this.candles.forEach((c, idx) => {
      const x = idx * candleWidth + candleWidth / 2;
      const isBull = c.close >= c.open;
      const color = isBull ? '#10b981' : '#ef4444';

      const yHigh = height - ((c.high - minPrice) / (maxPrice - minPrice)) * height;
      const yLow = height - ((c.low - minPrice) / (maxPrice - minPrice)) * height;
      const yOpen = height - ((c.open - minPrice) / (maxPrice - minPrice)) * height;
      const yClose = height - ((c.close - minPrice) / (maxPrice - minPrice)) * height;

      // Draw Wick
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(x, yHigh);
      this.ctx.lineTo(x, yLow);
      this.ctx.stroke();

      // Draw Body
      this.ctx.fillStyle = color;
      const bodyY = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));
      this.ctx.fillRect(x - candleWidth * 0.35, bodyY, candleWidth * 0.7, bodyHeight);
    });

    // Render Trade Execution Markers
    const markers = window.stateManager.state.markers[this.activeAssetId] || [];
    markers.forEach(m => {
      const y = height - ((m.price - minPrice) / (maxPrice - minPrice)) * height;
      const isBuy = m.type === 'BUY';

      this.ctx.fillStyle = isBuy ? '#10b981' : '#ef4444';
      this.ctx.beginPath();
      this.ctx.arc(width - 80, y, 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '10px monospace';
      this.ctx.fillText(`${m.type} @ $${m.price.toFixed(2)}`, width - 70, y + 3);
    });
  }
}

window.candlestickChart = null;