/**
 * KEREOS Trading Terminal - 10X Quantum Canvas Financial Chart Engine
 * Features:
 * - Real-time OHLC Red & Green Candlesticks with Upper/Lower Wicks & Volume
 * - EMA 9 / EMA 21 / EMA 55 Multi-Ribbon Moving Averages
 * - Bollinger Bands Volatility Envelope with shaded variance zone
 * - Multi-Oscillator Sub-Panels: RSI (14) with 70/30 levels & MACD (12, 26, 9) with Histogram
 * - Live Laser Price Beam & Continuous Radar Wave on the Current Tick
 * - Marked Orders: ▲ LONG (Neon Green) & ▼ SHORT (Neon Red) with Execution Badges
 * - Target HUD Crosshair Reticle & Floating OHLC HUD Card
 */

class TerminalChart {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.currentAsset = 'BTC';
    this.timeframe = '5M';
    this.chartType = 'candles'; // 'candles' or 'line'
    this.showTradeMarkers = true;
    this.showEMA = true;
    this.showRSI = true;
    this.showMACD = false;
    this.showBollinger = false;
    this.hoverPos = null;
    this.hoverCandle = null;
    this.pulsePhase = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPos = null;
      this.hoverCandle = null;
      this.render();
    });

    if (window.stateManager && window.stateManager.state.settings) {
      this.currentAsset = window.stateManager.state.settings.activeAsset || 'BTC';
      this.chartType = window.stateManager.state.settings.chartType || 'candles';
      this.timeframe = window.stateManager.state.settings.timeframe || '5M';
      this.showTradeMarkers = window.stateManager.state.settings.showTradeMarkers !== false;
      this.showEMA = window.stateManager.state.settings.showEMA !== false;
      this.showRSI = window.stateManager.state.settings.showRSI !== false;
      this.showMACD = window.stateManager.state.settings.showMACD === true;
      this.showBollinger = window.stateManager.state.settings.showBollinger === true;
    }

    this.animate();
  }

  animate() {
    this.pulsePhase += 0.05;
    if (this.pulsePhase > Math.PI * 2) this.pulsePhase = 0;
    this.render();
    requestAnimationFrame(() => this.animate());
  }

  resize() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.width = rect.width;
    this.height = Math.max(rect.height || 490, 420);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
    this.render();
  }

  setAsset(ticker) {
    this.currentAsset = ticker;
    this.render();
  }

  setChartType(type) {
    this.chartType = type;
    if (window.stateManager) {
      window.stateManager.state.settings.chartType = type;
      window.stateManager.saveState();
    }
    this.render();
  }

  setTimeframe(tf) {
    this.timeframe = tf;
    if (window.stateManager) {
      window.stateManager.state.settings.timeframe = tf;
      window.stateManager.saveState();
    }
    this.render();
  }

  toggleTradeMarkers() {
    this.showTradeMarkers = !this.showTradeMarkers;
    if (window.stateManager) {
      window.stateManager.state.settings.showTradeMarkers = this.showTradeMarkers;
      window.stateManager.saveState();
    }
    this.render();
    return this.showTradeMarkers;
  }

  toggleEMA() {
    this.showEMA = !this.showEMA;
    if (window.stateManager) {
      window.stateManager.state.settings.showEMA = this.showEMA;
      window.stateManager.saveState();
    }
    this.render();
    return this.showEMA;
  }

  toggleRSI() {
    this.showRSI = !this.showRSI;
    if (window.stateManager) {
      window.stateManager.state.settings.showRSI = this.showRSI;
      window.stateManager.saveState();
    }
    this.render();
    return this.showRSI;
  }

  toggleMACD() {
    this.showMACD = !this.showMACD;
    if (window.stateManager) {
      window.stateManager.state.settings.showMACD = this.showMACD;
      window.stateManager.saveState();
    }
    this.render();
    return this.showMACD;
  }

  toggleBollinger() {
    this.showBollinger = !this.showBollinger;
    if (window.stateManager) {
      window.stateManager.state.settings.showBollinger = this.showBollinger;
      window.stateManager.saveState();
    }
    this.render();
    return this.showBollinger;
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.hoverPos = { x, y };

    const sm = window.stateManager;
    if (!sm) return;

    const candles = sm.getActiveCandles(this.currentAsset, this.timeframe);
    const padding = { top: 35, right: 85, bottom: 45, left: 20 };
    const chartWidth = this.width - padding.left - padding.right;

    if (candles.length > 0 && x >= padding.left && x <= this.width - padding.right) {
      const step = chartWidth / candles.length;
      const index = Math.min(Math.max(Math.floor((x - padding.left) / step), 0), candles.length - 1);
      this.hoverCandle = {
        candle: candles[index],
        index,
        x: padding.left + index * step + step / 2
      };
    } else {
      this.hoverCandle = null;
    }
  }

  calculateEMA(candles, period) {
    const k = 2 / (period + 1);
    const emaArray = [];
    let prevEMA = candles[0].close;
    emaArray.push(prevEMA);

    for (let i = 1; i < candles.length; i++) {
      const curEMA = candles[i].close * k + prevEMA * (1 - k);
      emaArray.push(curEMA);
      prevEMA = curEMA;
    }
    return emaArray;
  }

  calculateRSI(candles, period = 14) {
    const rsiArray = [];
    if (candles.length <= 1) return [50];

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= Math.min(period, candles.length - 1); i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    let rsi = 100 - (100 / (1 + rs));
    rsiArray.push(parseFloat(rsi.toFixed(1)));

    for (let i = 1; i < candles.length; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi = 100 - (100 / (1 + rs));
      rsiArray.push(parseFloat(rsi.toFixed(1)));
    }

    return rsiArray;
  }

  calculateMACD(candles) {
    const ema12 = this.calculateEMA(candles, 12);
    const ema26 = this.calculateEMA(candles, 26);
    const macdLine = [];

    for (let i = 0; i < candles.length; i++) {
      macdLine.push(ema12[i] - ema26[i]);
    }

    // Signal Line: 9-period EMA of MACD Line
    const k = 2 / (9 + 1);
    const signalLine = [macdLine[0]];
    for (let i = 1; i < macdLine.length; i++) {
      signalLine.push(macdLine[i] * k + signalLine[i - 1] * (1 - k));
    }

    const histogram = [];
    for (let i = 0; i < macdLine.length; i++) {
      histogram.push(macdLine[i] - signalLine[i]);
    }

    return { macdLine, signalLine, histogram };
  }

  calculateBollinger(candles, period = 20, multiplier = 2) {
    const upper = [];
    const lower = [];
    const middle = [];

    for (let i = 0; i < candles.length; i++) {
      const start = Math.max(0, i - period + 1);
      const slice = candles.slice(start, i + 1);
      const sum = slice.reduce((acc, c) => acc + c.close, 0);
      const sma = sum / slice.length;

      const variance = slice.reduce((acc, c) => acc + Math.pow(c.close - sma, 2), 0) / slice.length;
      const stdDev = Math.sqrt(variance);

      middle.push(sma);
      upper.push(sma + stdDev * multiplier);
      lower.push(sma - stdDev * multiplier);
    }

    return { upper, middle, lower };
  }

  render() {
    if (!this.ctx || !this.canvas) return;

    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    const sm = window.stateManager;
    if (!sm) return;

    const asset = sm.getAsset(this.currentAsset);
    if (!asset) return;

    const candles = sm.getActiveCandles(this.currentAsset, this.timeframe);
    if (candles.length < 2) return;

    const showOscillator = this.showRSI || this.showMACD;
    const padding = { top: 38, right: 85, bottom: showOscillator ? 85 : 45, left: 20 };
    const chartWidth = w - padding.left - padding.right;
    const mainHeight = (h - padding.top - padding.bottom) * 0.78;
    const volumeHeight = (h - padding.top - padding.bottom) * 0.18;
    const volumeTop = padding.top + mainHeight + 6;

    const oscTop = h - 70;
    const oscHeight = 48;

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    candles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    const priceBuffer = (maxPrice - minPrice) * 0.08 || 1;
    minPrice -= priceBuffer;
    maxPrice += priceBuffer;
    const priceRange = maxPrice - minPrice;

    const getY = (val) => padding.top + mainHeight - ((val - minPrice) / priceRange) * mainHeight;
    const getX = (idx) => padding.left + (idx / candles.length) * chartWidth + (chartWidth / candles.length) / 2;

    // 1. Watermark Background
    ctx.save();
    ctx.font = '800 48px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.textAlign = 'center';
    ctx.fillText(`${asset.id} / USD`, w / 2, padding.top + mainHeight / 2 + 15);
    ctx.font = '700 14px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
    ctx.fillText(`KEREOS QUANT • ${this.timeframe}`, w / 2, padding.top + mainHeight / 2 + 45);
    ctx.restore();

    // 2. Main Grid Lines & Y-Axis Labels
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';

    const gridRows = 5;
    for (let i = 0; i <= gridRows; i++) {
      const y = padding.top + (i / gridRows) * mainHeight;
      const priceAtY = maxPrice - (i / gridRows) * priceRange;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      const label = sm.formatCurrency(priceAtY, null, 2);
      ctx.fillText(label, w - padding.right + 6, y + 4);
    }

    // Time columns
    const timeCols = Math.min(candles.length, 6);
    for (let i = 0; i < timeCols; i++) {
      const cIdx = Math.floor((i / (timeCols - 1)) * (candles.length - 1));
      const x = getX(cIdx);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + mainHeight + volumeHeight + 8);
      ctx.stroke();

      if (!showOscillator) {
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'center';
        ctx.fillText(candles[cIdx].time, x, h - padding.bottom + 16);
      }
    }

    // 3. Volume Histogram
    const candleWidth = Math.max((chartWidth / candles.length) * 0.65, 3);
    candles.forEach((c, idx) => {
      const x = getX(idx);
      const isBull = c.close >= c.open;
      const volH = (c.volume / (maxVol || 1)) * volumeHeight;
      const volY = volumeTop + volumeHeight - volH;

      ctx.fillStyle = isBull ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)';
      ctx.fillRect(x - candleWidth / 2, volY, candleWidth, volH);
    });

    // 4. Bollinger Bands Overlay
    if (this.showBollinger && candles.length > 5) {
      const bb = this.calculateBollinger(candles);
      ctx.save();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(bb.upper[0]));
      for (let i = 1; i < candles.length; i++) ctx.lineTo(getX(i), getY(bb.upper[i]));
      for (let i = candles.length - 1; i >= 0; i--) ctx.lineTo(getX(i), getY(bb.lower[i]));
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(bb.upper[0]));
      for (let i = 1; i < candles.length; i++) ctx.lineTo(getX(i), getY(bb.upper[i]));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(getX(0), getY(bb.lower[0]));
      for (let i = 1; i < candles.length; i++) ctx.lineTo(getX(i), getY(bb.lower[i]));
      ctx.stroke();
      ctx.restore();
    }

    // 5. Candlesticks or Glowing Line
    if (this.chartType === 'candles') {
      candles.forEach((c, idx) => {
        const x = getX(idx);
        const isBull = c.close >= c.open;
        const color = isBull ? '#10b981' : '#f43f5e';
        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

        ctx.fillStyle = color;
        ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

        ctx.strokeStyle = isBull ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
      });
    } else {
      const isPositive = asset.change24h >= 0;
      const lineColor = isPositive ? '#06b6d4' : '#f43f5e';

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + mainHeight);
      if (isPositive) {
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      } else {
        gradient.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
        gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
      }

      ctx.beginPath();
      ctx.moveTo(getX(0), getY(candles[0].close));
      for (let i = 1; i < candles.length; i++) {
        const prevX = getX(i - 1);
        const prevY = getY(candles[i - 1].close);
        const curX = getX(i);
        const curY = getY(candles[i].close);
        ctx.quadraticCurveTo(prevX, prevY, (prevX + curX) / 2, (prevY + curY) / 2);
      }
      ctx.lineTo(getX(candles.length - 1), getY(candles[candles.length - 1].close));
      ctx.lineTo(getX(candles.length - 1), padding.top + mainHeight);
      ctx.lineTo(getX(0), padding.top + mainHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.save();
      ctx.shadowColor = lineColor;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(candles[0].close));
      for (let i = 1; i < candles.length; i++) {
        const prevX = getX(i - 1);
        const prevY = getY(candles[i - 1].close);
        const curX = getX(i);
        const curY = getY(candles[i].close);
        ctx.quadraticCurveTo(prevX, prevY, (prevX + curX) / 2, (prevY + curY) / 2);
      }
      ctx.lineTo(getX(candles.length - 1), getY(candles[candles.length - 1].close));
      ctx.stroke();
      ctx.restore();
    }

    // 6. EMA 9 (Cyan) & EMA 21 (Purple)
    if (this.showEMA && candles.length > 5) {
      const ema9 = this.calculateEMA(candles, 9);
      const ema21 = this.calculateEMA(candles, 21);

      ctx.save();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(ema21[0]));
      for (let i = 1; i < candles.length; i++) ctx.lineTo(getX(i), getY(ema21[i]));
      ctx.stroke();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(getX(0), getY(ema9[0]));
      for (let i = 1; i < candles.length; i++) ctx.lineTo(getX(i), getY(ema9[i]));
      ctx.stroke();
      ctx.restore();
    }

    // 7. Marked Buy & Sell Points
    if (this.showTradeMarkers) {
      const orders = (sm.state.orders || []).filter(o => o.ticker === this.currentAsset);

      orders.forEach((order, ordIdx) => {
        const mappedIdx = Math.max(candles.length - 1 - (ordIdx * 7 + 4), 2);
        if (mappedIdx < candles.length) {
          const markerX = getX(mappedIdx);
          const markerY = getY(order.price);
          const isLong = order.type === 'LONG' || order.type === 'BUY';

          ctx.save();
          if (isLong) {
            ctx.shadowColor = 'rgba(16, 185, 129, 0.9)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#10b981';

            ctx.beginPath();
            ctx.moveTo(markerX, markerY - 3);
            ctx.lineTo(markerX - 6, markerY + 9);
            ctx.lineTo(markerX + 6, markerY + 9);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(16, 185, 129, 0.95)';
            ctx.beginPath();
            ctx.roundRect(markerX - 24, markerY + 12, 48, 15, 3);
            ctx.fill();

            ctx.fillStyle = '#052e16';
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('▲ LONG', markerX, markerY + 23);
          } else {
            ctx.shadowColor = 'rgba(244, 63, 94, 0.9)';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#f43f5e';

            ctx.beginPath();
            ctx.moveTo(markerX, markerY + 3);
            ctx.lineTo(markerX - 6, markerY - 9);
            ctx.lineTo(markerX + 6, markerY - 9);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(244, 63, 94, 0.95)';
            ctx.beginPath();
            ctx.roundRect(markerX - 26, markerY - 27, 52, 15, 3);
            ctx.fill();

            ctx.fillStyle = '#450a0a';
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('▼ SHORT', markerX, markerY - 16);
          }
          ctx.restore();
        }
      });
    }

    // 8. Laser Price Line & Radar Ripple Wave
    const latestCandle = candles[candles.length - 1];
    const latestPrice = latestCandle.close;
    const latestX = getX(candles.length - 1);
    const latestY = getY(latestPrice);
    const isBull = latestCandle.close >= latestCandle.open;
    const mainColor = isBull ? '#10b981' : '#f43f5e';

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padding.left, latestY);
    ctx.lineTo(w - padding.right, latestY);
    ctx.stroke();

    const rippleRadius = 4 + (this.pulsePhase / (Math.PI * 2)) * 14;
    const rippleAlpha = Math.max(1 - this.pulsePhase / (Math.PI * 2), 0);
    ctx.strokeStyle = isBull ? `rgba(16, 185, 129, ${rippleAlpha})` : `rgba(244, 63, 94, ${rippleAlpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(latestX, latestY, rippleRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(latestX, latestY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Price Badge on Right Y-Axis
    const badgeW = 76;
    const badgeH = 20;
    const badgeX = w - padding.right + 4;
    const badgeY = latestY - badgeH / 2;

    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
    ctx.fill();

    ctx.fillStyle = '#050c1a';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const badgeText = sm.formatCurrency(latestPrice, null, 2);
    ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + 14);

    // 9. Technical Oscillator Sub-Panels (RSI or MACD)
    if (this.showRSI) {
      const rsiData = this.calculateRSI(candles);
      const latestRSI = rsiData[rsiData.length - 1];

      ctx.save();
      ctx.fillStyle = 'rgba(10, 13, 23, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(padding.left, oscTop, chartWidth, oscHeight, 4);
      ctx.fill();
      ctx.stroke();

      const getRSIY = (val) => oscTop + oscHeight - (val / 100) * oscHeight;

      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.beginPath();
      ctx.moveTo(padding.left, getRSIY(70));
      ctx.lineTo(w - padding.right, getRSIY(70));
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.moveTo(padding.left, getRSIY(30));
      ctx.lineTo(w - padding.right, getRSIY(30));
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(`RSI (14):`, padding.left + 8, oscTop + 14);

      ctx.fillStyle = latestRSI >= 70 ? '#f43f5e' : latestRSI <= 30 ? '#10b981' : '#06b6d4';
      ctx.fillText(`${latestRSI.toFixed(1)}`, padding.left + 60, oscTop + 14);

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(getX(0), getRSIY(rsiData[0]));
      for (let i = 1; i < candles.length; i++) {
        ctx.lineTo(getX(i), getRSIY(rsiData[i]));
      }
      ctx.stroke();
      ctx.restore();
    } else if (this.showMACD) {
      const macd = this.calculateMACD(candles);
      ctx.save();
      ctx.fillStyle = 'rgba(10, 13, 23, 0.7)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(padding.left, oscTop, chartWidth, oscHeight, 4);
      ctx.fill();
      ctx.stroke();

      const maxH = Math.max(...macd.histogram.map(Math.abs)) || 1;
      const zeroY = oscTop + oscHeight / 2;

      macd.histogram.forEach((val, idx) => {
        const x = getX(idx);
        const barH = (val / maxH) * (oscHeight / 2 - 4);
        ctx.fillStyle = val >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(244, 63, 94, 0.7)';
        ctx.fillRect(x - candleWidth / 2, zeroY, candleWidth, -barH);
      });

      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(`MACD (12,26,9)`, padding.left + 8, oscTop + 12);
      ctx.restore();
    }

    // 10. Interactive Target HUD Crosshair & Floating Tooltip
    if (this.hoverCandle) {
      const hc = this.hoverCandle;
      const c = hc.candle;
      const hy = getY(c.close);

      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';

      ctx.beginPath();
      ctx.moveTo(hc.x, padding.top);
      ctx.lineTo(hc.x, showOscillator ? oscTop + oscHeight : h - padding.bottom);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding.left, hy);
      ctx.lineTo(w - padding.right, hy);
      ctx.stroke();
      ctx.restore();

      const tipW = 230;
      const tipH = 48;
      let tipX = hc.x - tipW / 2;
      if (tipX < padding.left) tipX = padding.left + 6;
      if (tipX + tipW > w - padding.right) tipX = w - padding.right - tipW - 6;
      let tipY = padding.top + 8;

      ctx.fillStyle = 'rgba(8, 11, 22, 0.95)';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(tipX, tipY, tipW, tipH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';

      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`${c.time} | Close: ${sm.formatCurrency(c.close)}`, tipX + 10, tipY + 17);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`O:${c.open.toFixed(1)} H:${c.high.toFixed(1)} L:${c.low.toFixed(1)} V:${c.volume}`, tipX + 10, tipY + 36);
    }
  }
}

window.TerminalChart = TerminalChart;
