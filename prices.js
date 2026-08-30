const COINS = {
  PEPE: {
    symbol: "PEPE",
    name: "Pepe",
    price: 0.0000124,
    icon: "🐸"
  },

  DOGE: {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.2134,
    icon: "🐕"
  },

  SHIB: {
    symbol: "SHIB",
    name: "Shiba Inu",
    price: 0.0000142,
    icon: "🐶"
  },

  BONK: {
    symbol: "BONK",
    name: "Bonk",
    price: 0.0000211,
    icon: "🐕"
  },

  FLOKI: {
    symbol: "FLOKI",
    name: "Floki",
    price: 0.000091,
    icon: "🐺"
  },

  WIF: {
    symbol: "WIF",
    name: "dogwifhat",
    price: 0.842,
    icon: "🐶"
  },

  BRETT: {
    symbol: "BRETT",
    name: "Brett",
    price: 0.0412,
    icon: "🐸"
  },

  POPCAT: {
    symbol: "POPCAT",
    name: "Popcat",
    price: 0.421,
    icon: "🐱"
  }
};

const marketState = {};

Object.keys(COINS).forEach(symbol => {
  marketState[symbol] = {
    price: COINS[symbol].price,
    previousPrice: COINS[symbol].price,
    change24h: (Math.random() - 0.45) * 20,
    history: []
  };

  createInitialHistory(symbol);
});

function createInitialHistory(symbol) {
  const state = marketState[symbol];
  let price = state.price;

  const now = Math.floor(Date.now() / 1000);

  for (let i = 120; i >= 0; i--) {
    const volatility = 0.006;
    const movement = 1 + ((Math.random() - 0.5) * volatility);

    const open = price;
    const close = price * movement;

    const high = Math.max(open, close) * (1 + Math.random() * 0.002);
    const low = Math.min(open, close) * (1 - Math.random() * 0.002);

    state.history.push({
      time: now - i * 10,
      open,
      high,
      low,
      close
    });

    price = close;
  }

  state.price = price;
}

function getCoin(symbol) {
  return COINS[symbol];
}

function getPrice(symbol) {
  return marketState[symbol]?.price || 0;
}

function getChange(symbol) {
  return marketState[symbol]?.change24h || 0;
}

function getHistory(symbol) {
  return marketState[symbol]?.history || [];
}

function formatPrice(price) {
  if (price >= 1) {
    return "$" + price.toFixed(4);
  }

  if (price >= 0.01) {
    return "$" + price.toFixed(6);
  }

  if (price >= 0.0001) {
    return "$" + price.toFixed(7);
  }

  return "$" + price.toFixed(10);
}

function updatePrices() {

  Object.keys(COINS).forEach(symbol => {

    const state = marketState[symbol];

    state.previousPrice = state.price;

    /*
      Small random movement.

      This is intentionally simulated.
      It does not represent actual market prices.
    */

    const volatility = 0.008;
    const movement = 1 + ((Math.random() - 0.5) * volatility);

    const open = state.price;
    const close = Math.max(
      state.price * movement,
      state.price * 0.8
    );

    const high = Math.max(open, close) *
      (1 + Math.random() * 0.003);

    const low = Math.min(open, close) *
      (1 - Math.random() * 0.003);

    state.price = close;

    state.change24h += (Math.random() - 0.5) * 0.15;

    state.history.push({
      time: Math.floor(Date.now() / 1000),
      open,
      high,
      low,
      close
    });

    if (state.history.length > 500) {
      state.history.shift();
    }
  });

  document.dispatchEvent(
    new CustomEvent("kereosPricesUpdated")
  );
}

setInterval(updatePrices, 3000);
