/**
 * KEREOS Trading Terminal - Quant State & Leverage Trading Engine
 * Features:
 * - Clean Demo Portfolio State (Zero automated unauthorized orders)
 * - 1x to 100x Leverage Margin Trading (Long & Short) with Liquidation Math
 * - Expanded Universe of 16 Instruments (Crypto, Tech Giants, Precious Metals, Forex)
 * - Multi-Timeframe Candles, Live RSI/MACD/Bollinger Math, Quant Backtester
 */

class StateManager {
  constructor() {
    this.STORAGE_KEY = 'KEREOS_TERMINAL_STATE_V5';
    this.rates = {
      USD: 1.0,
      INR: 86.50,
      EUR: 0.92,
      GBP: 0.79
    };
    this.symbols = {
      USD: '$',
      INR: '₹',
      EUR: '€',
      GBP: '£'
    };
    this.state = this.loadState();
  }

  generateTimeframeCandles(currentPrice, count, intervalMinutes, volatility) {
    const candles = [];
    const now = Date.now();
    const intervalMs = intervalMinutes * 60 * 1000;

    const prices = [currentPrice];
    let p = currentPrice;

    for (let i = 1; i < count; i++) {
      const change = (Math.random() - 0.495) * volatility * p;
      p = Math.max(p - change, currentPrice * 0.4);
      prices.unshift(parseFloat(p.toFixed(2)));
    }

    for (let i = 0; i < count; i++) {
      const open = i === 0 ? prices[0] : candles[i - 1].close;
      const close = prices[i];
      const wickRange = Math.abs(close - open) * 0.6 + open * (volatility * 0.4);
      const high = parseFloat((Math.max(open, close) + Math.random() * wickRange).toFixed(2));
      const low = parseFloat((Math.min(open, close) - Math.random() * wickRange).toFixed(2));
      const volume = Math.floor(Math.random() * 3000 + 400);

      const timestamp = new Date(now - (count - 1 - i) * intervalMs);
      let timeLabel = '';
      if (intervalMinutes < 60) {
        timeLabel = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (intervalMinutes < 1440) {
        timeLabel = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        timeLabel = timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }

      candles.push({
        time: timeLabel,
        open: parseFloat(open.toFixed(2)),
        high,
        low,
        close: parseFloat(close.toFixed(2)),
        volume
      });
    }

    const last = candles[candles.length - 1];
    last.close = currentPrice;
    last.high = Math.max(last.high, currentPrice);
    last.low = Math.min(last.low, currentPrice);

    return candles;
  }

  generateSparkline(basePrice, volatility) {
    const points = [];
    let p = basePrice * (1 - (Math.random() * 0.04 - 0.02));
    for (let i = 0; i < 18; i++) {
      p += (Math.random() - 0.48) * volatility * p;
      points.push(parseFloat(p.toFixed(2)));
    }
    points[points.length - 1] = basePrice;
    return points;
  }

  buildAssetTimeframes(basePrice, volatility) {
    return {
      '1M': this.generateTimeframeCandles(basePrice, 40, 1, volatility * 0.6),
      '5M': this.generateTimeframeCandles(basePrice, 40, 5, volatility),
      '1H': this.generateTimeframeCandles(basePrice, 32, 60, volatility * 1.8),
      '1D': this.generateTimeframeCandles(basePrice, 28, 1440, volatility * 3.5)
    };
  }

  getDefaultAssets() {
    return [
      // Crypto Assets
      {
        id: 'BTC',
        name: 'Bitcoin',
        category: 'CRYPTO',
        price: 64280.50,
        prevPrice: 63100.00,
        change24h: 1.87,
        high24h: 65120.00,
        low24h: 62800.00,
        volume: '42.8B',
        sparkline: this.generateSparkline(64280.50, 0.006),
        timeframes: this.buildAssetTimeframes(64280.50, 0.004)
      },
      {
        id: 'ETH',
        name: 'Ethereum',
        category: 'CRYPTO',
        price: 3450.25,
        prevPrice: 3380.00,
        change24h: 2.08,
        high24h: 3510.00,
        low24h: 3340.00,
        volume: '18.4B',
        sparkline: this.generateSparkline(3450.25, 0.008),
        timeframes: this.buildAssetTimeframes(3450.25, 0.0055)
      },
      {
        id: 'SOL',
        name: 'Solana',
        category: 'CRYPTO',
        price: 148.75,
        prevPrice: 142.10,
        change24h: 4.68,
        high24h: 152.40,
        low24h: 140.50,
        volume: '6.9B',
        sparkline: this.generateSparkline(148.75, 0.012),
        timeframes: this.buildAssetTimeframes(148.75, 0.008)
      },
      {
        id: 'BNB',
        name: 'BNB Chain',
        category: 'CRYPTO',
        price: 574.60,
        prevPrice: 568.20,
        change24h: 1.13,
        high24h: 582.00,
        low24h: 565.00,
        volume: '2.4B',
        sparkline: this.generateSparkline(574.60, 0.005),
        timeframes: this.buildAssetTimeframes(574.60, 0.0045)
      },
      {
        id: 'XRP',
        name: 'Ripple XRP',
        category: 'CRYPTO',
        price: 0.584,
        prevPrice: 0.569,
        change24h: 2.64,
        high24h: 0.598,
        low24h: 0.562,
        volume: '1.8B',
        sparkline: this.generateSparkline(0.584, 0.014),
        timeframes: this.buildAssetTimeframes(0.584, 0.01)
      },
      {
        id: 'DOGE',
        name: 'Dogecoin',
        category: 'CRYPTO',
        price: 0.1145,
        prevPrice: 0.1085,
        change24h: 5.53,
        high24h: 0.1180,
        low24h: 0.1070,
        volume: '1.2B',
        sparkline: this.generateSparkline(0.1145, 0.018),
        timeframes: this.buildAssetTimeframes(0.1145, 0.012)
      },

      // Tech Equities
      {
        id: 'NVDA',
        name: 'NVIDIA Corp',
        category: 'STOCKS',
        price: 128.40,
        prevPrice: 125.10,
        change24h: 2.64,
        high24h: 130.20,
        low24h: 124.80,
        volume: '54.2M',
        sparkline: this.generateSparkline(128.40, 0.007),
        timeframes: this.buildAssetTimeframes(128.40, 0.005)
      },
      {
        id: 'AAPL',
        name: 'Apple Inc',
        category: 'STOCKS',
        price: 224.30,
        prevPrice: 226.10,
        change24h: -0.80,
        high24h: 227.50,
        low24h: 223.10,
        volume: '38.1M',
        sparkline: this.generateSparkline(224.30, 0.004),
        timeframes: this.buildAssetTimeframes(224.30, 0.0035)
      },
      {
        id: 'TSLA',
        name: 'Tesla Inc',
        category: 'STOCKS',
        price: 218.90,
        prevPrice: 224.50,
        change24h: -2.49,
        high24h: 226.00,
        low24h: 216.40,
        volume: '45.9M',
        sparkline: this.generateSparkline(218.90, 0.01),
        timeframes: this.buildAssetTimeframes(218.90, 0.0075)
      },
      {
        id: 'MSFT',
        name: 'Microsoft Corp',
        category: 'STOCKS',
        price: 418.50,
        prevPrice: 414.20,
        change24h: 1.04,
        high24h: 421.80,
        low24h: 413.50,
        volume: '22.8M',
        sparkline: this.generateSparkline(418.50, 0.004),
        timeframes: this.buildAssetTimeframes(418.50, 0.003)
      },
      {
        id: 'AMZN',
        name: 'Amazon.com Inc',
        category: 'STOCKS',
        price: 178.20,
        prevPrice: 175.40,
        change24h: 1.60,
        high24h: 180.10,
        low24h: 174.90,
        volume: '31.5M',
        sparkline: this.generateSparkline(178.20, 0.005),
        timeframes: this.buildAssetTimeframes(178.20, 0.004)
      },

      // Commodities & Precious Metals
      {
        id: 'GOLD',
        name: 'Gold Spot / USD',
        category: 'COMMODITIES',
        price: 2514.80,
        prevPrice: 2502.10,
        change24h: 0.51,
        high24h: 2522.00,
        low24h: 2498.50,
        volume: '14.2B',
        sparkline: this.generateSparkline(2514.80, 0.003),
        timeframes: this.buildAssetTimeframes(2514.80, 0.002)
      },
      {
        id: 'SILVER',
        name: 'Silver Spot / USD',
        category: 'COMMODITIES',
        price: 29.45,
        prevPrice: 28.90,
        change24h: 1.90,
        high24h: 29.80,
        low24h: 28.75,
        volume: '4.6B',
        sparkline: this.generateSparkline(29.45, 0.008),
        timeframes: this.buildAssetTimeframes(29.45, 0.006)
      },
      {
        id: 'CRUDE_OIL',
        name: 'Brent Crude Oil',
        category: 'COMMODITIES',
        price: 78.45,
        prevPrice: 79.80,
        change24h: -1.69,
        high24h: 80.20,
        low24h: 77.90,
        volume: '9.8B',
        sparkline: this.generateSparkline(78.45, 0.009),
        timeframes: this.buildAssetTimeframes(78.45, 0.006)
      },

      // Forex Currencies
      {
        id: 'EUR_USD',
        name: 'EUR / USD Spot',
        category: 'FOREX',
        price: 1.1085,
        prevPrice: 1.1062,
        change24h: 0.21,
        high24h: 1.1110,
        low24h: 1.1050,
        volume: '128.5B',
        sparkline: this.generateSparkline(1.1085, 0.002),
        timeframes: this.buildAssetTimeframes(1.1085, 0.0015)
      },
      {
        id: 'GBP_USD',
        name: 'GBP / USD Spot',
        category: 'FOREX',
        price: 1.3180,
        prevPrice: 1.3140,
        change24h: 0.30,
        high24h: 1.3210,
        low24h: 1.3125,
        volume: '94.2B',
        sparkline: this.generateSparkline(1.3180, 0.0025),
        timeframes: this.buildAssetTimeframes(1.3180, 0.0018)
      }
    ];
  }

  getDefaultState() {
    return {
      cash: 100000.00,
      settings: {
        currency: 'USD',
        theme: 'cyberpunk',
        sound: true,
        activeAsset: 'BTC',
        timeframe: '5M',
        chartType: 'candles',
        showTradeMarkers: true,
        showEMA: true,
        showRSI: true,
        showMACD: false,
        showBollinger: false,
        scalpLotSize: 0.5,
        leverage: 10 // Default 10x leverage
      },
      holdings: {}, // Clean slate! ZERO automated open positions
      orders: [],   // Clean slate! ZERO pre-existing fake orders
      realizedPnL: 0,
      assets: this.getDefaultAssets()
    };
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.assets || parsed.assets.length < 12) {
          parsed.assets = this.getDefaultAssets();
        }
        if (!parsed.settings.chartType) parsed.settings.chartType = 'candles';
        if (!parsed.settings.theme) parsed.settings.theme = 'cyberpunk';
        if (parsed.settings.showRSI === undefined) parsed.settings.showRSI = true;
        if (parsed.settings.showMACD === undefined) parsed.settings.showMACD = false;
        if (parsed.settings.showBollinger === undefined) parsed.settings.showBollinger = false;
        if (!parsed.settings.scalpLotSize) parsed.settings.scalpLotSize = 0.5;
        if (!parsed.settings.leverage) parsed.settings.leverage = 10;
        if (!parsed.holdings) parsed.holdings = {};
        if (!parsed.orders) parsed.orders = [];
        return parsed;
      }
    } catch (e) {
      console.warn('Reverting to default clean quant state', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('kereos-state-changed', { detail: this.state }));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  resetState() {
    this.state = this.getDefaultState();
    this.saveState();
  }

  depositCash(amountUSD) {
    const amt = parseFloat(amountUSD);
    if (isNaN(amt) || amt <= 0) return false;
    this.state.cash += amt;
    this.saveState();
    return true;
  }

  getAsset(ticker) {
    return this.state.assets.find(a => a.id === ticker) || null;
  }

  getActiveCandles(ticker, timeframe = null) {
    const asset = this.getAsset(ticker);
    if (!asset || !asset.timeframes) return [];
    const tf = timeframe || this.state.settings.timeframe || '5M';
    return asset.timeframes[tf] || asset.timeframes['5M'] || [];
  }

  convertCurrency(usdValue, targetCurrency = null) {
    const code = targetCurrency || this.state.settings.currency || 'USD';
    const rate = this.rates[code] || 1.0;
    return usdValue * rate;
  }

  formatCurrency(usdValue, targetCurrency = null, decimals = 2) {
    const code = targetCurrency || this.state.settings.currency || 'USD';
    const symbol = this.symbols[code] || '$';
    const converted = this.convertCurrency(usdValue, code);
    const dec = Math.abs(converted) > 0 && Math.abs(converted) < 1 ? 4 : decimals;
    
    return `${symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    })}`;
  }

  calculateHoldingsValueUSD() {
    let total = 0;
    for (const [ticker, holding] of Object.entries(this.state.holdings || {})) {
      if (holding.qty > 0) {
        const asset = this.getAsset(ticker);
        const curPrice = asset ? asset.price : holding.entryPrice;
        total += holding.margin + (holding.side === 'SHORT' ? (holding.entryPrice - curPrice) * holding.qty : (curPrice - holding.entryPrice) * holding.qty);
      }
    }
    return Math.max(total, 0);
  }

  calculatePortfolioNetWorthUSD() {
    return this.state.cash + this.calculateHoldingsValueUSD();
  }

  calculateUnrealizedPnLUSD() {
    let pnl = 0;
    for (const [ticker, holding] of Object.entries(this.state.holdings || {})) {
      if (holding.qty > 0) {
        const asset = this.getAsset(ticker);
        if (asset) {
          const diff = holding.side === 'SHORT' ? (holding.entryPrice - asset.price) : (asset.price - holding.entryPrice);
          pnl += holding.qty * diff;
        }
      }
    }
    return pnl;
  }

  /**
   * Executes a user manual trade (Spot or Leveraged Long/Short)
   */
  executeTrade(ticker, type, qty, price, leverage = null) {
    const quantity = parseFloat(qty);
    const orderPrice = parseFloat(price);
    const lev = leverage || this.state.settings.leverage || 1;
    const notionalUSD = quantity * orderPrice;
    const requiredMarginUSD = notionalUSD / lev;

    if (isNaN(quantity) || quantity <= 0) {
      return { success: false, message: 'Invalid quantity provided' };
    }

    const side = (type === 'BUY' || type === 'LONG') ? 'LONG' : (type === 'SHORT' ? 'SHORT' : 'SELL');

    if (side === 'LONG' || side === 'SHORT') {
      if (this.state.cash < requiredMarginUSD) {
        return { 
          success: false, 
          message: `Insufficient margin. Required: ${this.formatCurrency(requiredMarginUSD)}, Available Cash: ${this.formatCurrency(this.state.cash)}` 
        };
      }

      this.state.cash -= requiredMarginUSD;

      // Calculate Liquidation Price
      let liqPrice = 0;
      if (side === 'LONG') {
        liqPrice = orderPrice * (1 - (1 / lev) + 0.005);
      } else {
        liqPrice = orderPrice * (1 + (1 / lev) - 0.005);
      }

      const existing = this.state.holdings[ticker];
      if (existing && existing.side === side) {
        const totalQty = existing.qty + quantity;
        const totalMargin = existing.margin + requiredMarginUSD;
        const avgEntry = ((existing.qty * existing.entryPrice) + notionalUSD) / totalQty;
        this.state.holdings[ticker] = {
          qty: totalQty,
          entryPrice: avgEntry,
          margin: totalMargin,
          leverage: lev,
          side: side,
          liqPrice: Math.max(liqPrice, 0.001)
        };
      } else {
        this.state.holdings[ticker] = {
          qty: quantity,
          entryPrice: orderPrice,
          margin: requiredMarginUSD,
          leverage: lev,
          side: side,
          liqPrice: Math.max(liqPrice, 0.001)
        };
      }
    } else if (side === 'SELL') {
      const existing = this.state.holdings[ticker];
      if (!existing || existing.qty < quantity) {
        return { 
          success: false, 
          message: `Insufficient position. You hold ${existing ? existing.qty.toFixed(4) : '0'} ${ticker}` 
        };
      }

      const fraction = quantity / existing.qty;
      const marginToReturn = existing.margin * fraction;
      const pnl = (orderPrice - existing.entryPrice) * quantity;

      this.state.realizedPnL = (this.state.realizedPnL || 0) + pnl;
      this.state.cash += (marginToReturn + pnl);

      const remainingQty = existing.qty - quantity;
      if (remainingQty <= 0.000001) {
        delete this.state.holdings[ticker];
      } else {
        this.state.holdings[ticker].qty = remainingQty;
        this.state.holdings[ticker].margin = existing.margin - marginToReturn;
      }
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ticker,
      type: side,
      price: orderPrice,
      quantity,
      leverage: lev,
      total: notionalUSD
    };

    this.state.orders.unshift(newOrder);
    this.saveState();

    return { 
      success: true, 
      order: newOrder,
      message: `Executed ${side} ${quantity} ${ticker} (${lev}x) @ ${this.formatCurrency(orderPrice)}` 
    };
  }

  exportOrdersCSV() {
    const orders = this.state.orders || [];
    if (orders.length === 0) return null;

    const headers = ['Order ID', 'Timestamp', 'Asset', 'Side', 'Leverage', 'Execution Price (USD)', 'Quantity', 'Notional Total (USD)'];
    const rows = orders.map(o => [
      o.id,
      o.time,
      o.ticker,
      o.type,
      `${o.leverage || 1}x`,
      o.price.toFixed(2),
      o.quantity.toFixed(4),
      o.total.toFixed(2)
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

window.stateManager = new StateManager();
