/**
 * KEREOS State Engine — Single Source of Truth
 */
const KEREOS_STATE_KEY = 'KEREOS_STATE_V14';

const DEFAULT_ASSETS = [
  { id: 'btc', name: 'Bitcoin', ticker: 'BTC', price: 78520.00, change: 2.45, category: 'major', color: '#f7931a' },
  { id: 'eth', name: 'Ethereum', ticker: 'ETH', price: 3420.50, change: -1.15, category: 'major', color: '#627eea' },
  { id: 'sol', name: 'Solana', ticker: 'SOL', price: 185.30, change: 5.80, category: 'major', color: '#14f195' },
  { id: 'xrp', name: 'XRP', ticker: 'XRP', price: 1.12, change: 0.45, category: 'major', color: '#23292f' },
  { id: 'ada', name: 'Cardano', ticker: 'ADA', price: 0.78, change: -0.85, category: 'major', color: '#0033ad' },
  { id: 'bnb', name: 'BNB', ticker: 'BNB', price: 590.20, change: 1.20, category: 'major', color: '#f3ba2f' },
  { id: 'doge', name: 'Dogecoin', ticker: 'DOGE', price: 0.165, change: 12.40, category: 'meme', color: '#c2a633' },
  { id: 'pepe', name: 'Pepe', ticker: 'PEPE', price: 0.0000089, change: -4.20, category: 'meme', color: '#55a954' }
];

const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0 },
  INR: { symbol: '₹', rate: 86.5 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.78 }
};

class StateManager {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.startPriceSimulation();
  }

  loadState() {
    const saved = localStorage.getItem(KEREOS_STATE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { console.error('State load error', e); }
    }
    return {
      cash: 50000.00,
      holdings: {}, // { btc: { qty: 0.5, avgPrice: 75000 } }
      orders: [],
      markers: {}, // { btc: [ { type: 'BUY', price: 78000, time: 123456 } ] }
      watchlist: ['btc', 'eth', 'sol'],
      settings: { sound: true, currency: 'USD', theme: 'dark' },
      assets: DEFAULT_ASSETS
    };
  }

  saveState() {
    localStorage.setItem(KEREOS_STATE_KEY, JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // Continuous market tick generation
  startPriceSimulation() {
    setInterval(() => {
      this.state.assets.forEach(asset => {
        const deltaPct = (Math.random() - 0.49) * 0.004; // Small price swing
        asset.price = Math.max(0.0000001, asset.price * (1 + deltaPct));
        asset.change = +(asset.change + deltaPct * 100).toFixed(2);
      });
      this.saveState();
    }, 2000);
  }

  // Mathematical Portfolio Calculation
  getPortfolioMetrics() {
    let investedValue = 0;
    let currentValue = 0;

    Object.keys(this.state.holdings).forEach(id => {
      const pos = this.state.holdings[id];
      const asset = this.state.assets.find(a => a.id === id);
      if (pos && pos.qty > 0 && asset) {
        investedValue += pos.qty * pos.avgPrice;
        currentValue += pos.qty * asset.price;
      }
    });

    const cash = this.state.cash;
    const totalValue = cash + currentValue;
    const unrealizedPnL = currentValue - investedValue;

    return { cash, investedValue, currentValue, totalValue, unrealizedPnL };
  }

  executeTrade(assetId, type, quantity) {
    const asset = this.state.assets.find(a => a.id === assetId);
    if (!asset || quantity <= 0) return { success: false, reason: 'Invalid Asset or Qty' };

    const price = asset.price;
    const totalCost = quantity * price;

    if (type === 'BUY') {
      if (this.state.cash < totalCost) return { success: false, reason: 'Insufficient Cash Balance' };
      this.state.cash -= totalCost;

      const currentPos = this.state.holdings[assetId] || { qty: 0, avgPrice: 0 };
      const newQty = currentPos.qty + quantity;
      const newAvg = ((currentPos.qty * currentPos.avgPrice) + totalCost) / newQty;

      this.state.holdings[assetId] = { qty: newQty, avgPrice: newAvg };
    } else if (type === 'SELL') {
      const currentPos = this.state.holdings[assetId];
      if (!currentPos || currentPos.qty < quantity) return { success: false, reason: 'Insufficient Position Qty' };

      this.state.cash += totalCost;
      currentPos.qty -= quantity;
      if (currentPos.qty <= 0.00000001) {
        delete this.state.holdings[assetId];
      }
    }

    // Record Order History
    const order = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleTimeString(),
      assetId,
      ticker: asset.ticker,
      type,
      price,
      quantity,
      total: totalCost
    };
    this.state.orders.unshift(order);

    // Record Exact Trade Marker for Canvas Charts
    if (!this.state.markers[assetId]) this.state.markers[assetId] = [];
    this.state.markers[assetId].push({
      type,
      price,
      timestamp: Date.now()
    });

    this.saveState();
    return { success: true, order };
  }

  formatCurrency(val) {
    const cur = CURRENCIES[this.state.settings.currency] || CURRENCIES.USD;
    const converted = val * cur.rate;
    return cur.symbol + converted.toLocaleString(undefined, {
      minimumFractionDigits: converted < 1 ? 4 : 2,
      maximumFractionDigits: converted < 1 ? 6 : 2
    });
  }
}

window.stateManager = new StateManager();