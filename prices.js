const COINS = {
  PEPE: {
    name: "Pepe",
    symbol: "PEPE",
    icon: "🐸",
    price: 0.0000124
  },

  DOGE: {
    name: "Dogecoin",
    symbol: "DOGE",
    icon: "🐕",
    price: 0.2134
  },

  SHIB: {
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "🐶",
    price: 0.0000142
  },

  BONK: {
    name: "Bonk",
    symbol: "BONK",
    icon: "🐕",
    price: 0.0000211
  },

  FLOKI: {
    name: "Floki",
    symbol: "FLOKI",
    icon: "🐺",
    price: 0.000091
  },

  WIF: {
    name: "dogwifhat",
    symbol: "WIF",
    icon: "🐶",
    price: 0.842
  },

  BRETT: {
    name: "Brett",
    symbol: "BRETT",
    icon: "🐸",
    price: 0.0412
  },

  POPCAT: {
    name: "Popcat",
    symbol: "POPCAT",
    icon: "🐱",
    price: 0.421
  },

  MOG: {
    name: "Mog Coin",
    symbol: "MOG",
    icon: "😼",
    price: 0.00000112
  },

  TURBO: {
    name: "Turbo",
    symbol: "TURBO",
    icon: "🤖",
    price: 0.00342
  }
};

const MARKET = {};

Object.keys(COINS).forEach(symbol => {
  MARKET[symbol] = {
    price: COINS[symbol].price,
    previousPrice: COINS[symbol].price,
    change24h: (Math.random() - 0.45) * 18,
    candles: []
  };

  createHistory(symbol);
});

function createHistory(symbol) {
  const market = MARKET[symbol];

  let price = market.price;

  const now = Math.floor(Date.now() / 1000);

  for (let i = 120; i >= 0; i--) {
    const open = price;

    const move =
      1 + (Math.random() - 0.5) * 0.012;

    const close = Math.max(
      open * move,
      open * 0.95
    );

    const high =
      Math.max(open, close) *
      (1 + Math.random() * 0.004);

    const low =
      Math.min(open, close) *
      (1 - Math.random() * 0.004);

    market.candles.push({
      time: now - i * 10,
      open,
      high,
      low,
      close
    });

    price = close;
  }

  market.price = price;
}

function getPrice(symbol) {
  return MARKET[symbol]
    ? MARKET[symbol].price
    : 0;
}

function getChange(symbol) {
  return MARKET[symbol]
    ? MARKET[symbol].change24h
    : 0;
}

function getHistory(symbol) {
  return MARKET[symbol]
    ? MARKET[symbol].candles
    : [];
}

function formatPrice(value) {
  value = Number(value) || 0;

  if (value >= 100) {
    return "$" + value.toFixed(2);
  }

  if (value >= 1) {
    return "$" + value.toFixed(4);
  }

  if (value >= 0.01) {
    return "$" + value.toFixed(6);
  }

  if (value >= 0.0001) {
    return "$" + value.toFixed(7);
  }

  return "$" + value.toFixed(10);
}

function updateMarketPrices() {

  Object.keys(MARKET).forEach(symbol => {

    const market = MARKET[symbol];

    market.previousPrice = market.price;

    const movement =
      1 + (Math.random() - 0.5) * 0.01;

    const open = market.price;

    const close = Math.max(
      open * movement,
      open * 0.8
    );

    const high =
      Math.max(open, close) *
      (1 + Math.random() * 0.003);

    const low =
      Math.min(open, close) *
      (1 - Math.random() * 0.003);

    market.price = close;

    market.change24h +=
      (Math.random() - 0.5) * 0.12;

    market.candles.push({
      time: Math.floor(Date.now() / 1000),
      open,
      high,
      low,
      close
    });

    if (market.candles.length > 300) {
      market.candles.shift();
    }
  });

  document.dispatchEvent(
    new CustomEvent("kereos:prices")
  );
}

setInterval(updateMarketPrices, 2500);
