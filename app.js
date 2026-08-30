let selectedSymbol = getSelectedCoin();
let tradeSide = "buy";

document.addEventListener("DOMContentLoaded", () => {

  setupNavigation();
  setupTrading();
  setupMarketStrip();
  setupTimeframes();

  selectedSymbol = getSelectedCoin();

  updateEverything();

  createChart();

  setInterval(updateEverything, 1000);
});

function setupNavigation() {

  const menu =
    document.getElementById("mobileMenu");

  const nav =
    document.querySelector(".nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
}

function setupTrading() {

  document.querySelectorAll(".trade-tab")
    .forEach(button => {

      button.addEventListener("click", () => {

        document.querySelectorAll(".trade-tab")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        tradeSide =
          button.dataset.side;

        updateTradeButton();
      });
    });

  document.querySelectorAll(".quick-amounts button")
    .forEach(button => {

      button.addEventListener("click", () => {

        const input =
          document.getElementById("tradeAmount");

        input.value =
          button.dataset.amount;
      });
    });

  const tradeButton =
    document.getElementById("tradeButton");

  if (tradeButton) {
    tradeButton.addEventListener(
      "click",
      executeTrade
    );
  }
}

function setupMarketStrip() {

  const strip =
    document.getElementById("marketStrip");

  if (!strip) return;

  Object.keys(COINS).forEach(symbol => {

    const coin = COINS[symbol];

    const card =
      document.createElement("div");

    card.className = "market-card";

    card.dataset.symbol = symbol;

    card.innerHTML = `
      <div class="market-card-top">
        <div class="coin-icon">
          ${coin.icon}
        </div>

        <div>
          <strong>${coin.symbol}</strong>
          <small>${coin.name}</small>
        </div>
      </div>

      <strong class="market-price"
        data-price="${symbol}">
        ${formatPrice(getPrice(symbol))}
      </strong>

      <small
        class="market-change"
        data-change="${symbol}">
        ${getChange(symbol).toFixed(2)}%
      </small>
    `;

    card.addEventListener("click", () => {
      selectCoin(symbol);
    });

    strip.appendChild(card);
  });
}

function setupTimeframes() {

  document.querySelectorAll(".timeframe")
    .forEach(button => {

      button.addEventListener("click", () => {

        document.querySelectorAll(".timeframe")
          .forEach(btn =>
            btn.classList.remove("active")
          );

        button.classList.add("active");

        /*
          The demo currently uses the same simulated
          stream for each timeframe.
        */
        refreshChart();
      });
    });
}

function selectCoin(symbol) {

  if (!COINS[symbol]) return;

  selectedSymbol = symbol;

  setSelectedCoin(symbol);

  updateEverything();

  if (typeof updateChart === "function") {
    updateChart(symbol);
  }
}

function updateEverything() {

  updateHeader();

  updateSelectedCoin();

  updateMarketCards();

  updatePositionPreview();

  updatePositionsList();

  updateTradeButton();
}

function updateHeader() {

  const balance =
    document.getElementById("headerBalance");

  const available =
    document.getElementById("availableBalance");

  const value =
    formatMoney(getBalance());

  if (balance) balance.textContent = value;
  if (available) available.textContent = value;
}

function updateSelectedCoin() {

  const coin = COINS[selectedSymbol];

  if (!coin) return;

  const price = getPrice(selectedSymbol);
  const change = getChange(selectedSymbol);

  const icon =
    document.getElementById("selectedCoinIcon");

  const name =
    document.getElementById("selectedCoinName");

  const symbol =
    document.getElementById("selectedCoinSymbol");

  const priceEl =
    document.getElementById("selectedPrice");

  const changeEl =
    document.getElementById("selectedChange");

  const tradePrice =
    document.getElementById("tradePrice");

  if (icon) icon.textContent = coin.icon;
  if (name) name.textContent = coin.name;
  if (symbol) symbol.textContent = coin.symbol;

  if (priceEl) {

    const oldPrice =
      Number(
        priceEl.dataset.price ||
        price
      );

    flashPrice(
      priceEl,
      price >= oldPrice
        ? "up"
        : "down"
    );

    priceEl.textContent =
      formatPrice(price);

    priceEl.dataset.price = price;
  }

  if (tradePrice) {
    tradePrice.textContent =
      formatPrice(price);
  }

  if (changeEl) {

    changeEl.textContent =
      `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

    changeEl.className =
      change >= 0
        ? "positive"
        : "negative";
  }

  document.querySelectorAll(".market-card")
    .forEach(card => {

      card.classList.toggle(
        "active",
        card.dataset.symbol === selectedSymbol
      );

    });
}

function updateMarketCards() {

  Object.keys(COINS).forEach(symbol => {

    const priceEl =
      document.querySelector(
        `[data-price="${symbol}"]`
      );

    const changeEl =
      document.querySelector(
        `[data-change="${symbol}"]`
      );

    if (priceEl) {
      priceEl.textContent =
        formatPrice(getPrice(symbol));
    }

    if (changeEl) {

      const change =
        getChange(symbol);

      changeEl.textContent =
        `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

      changeEl.className =
        "market-change " +
        (change >= 0
          ? "positive"
          : "negative");
    }
  });
}

function updateTradeButton() {

  const button =
    document.getElementById("tradeButton");

  if (!button) return;

  const coin =
    COINS[selectedSymbol];

  button.textContent =
    `${tradeSide === "buy" ? "Buy" : "Sell"} ${coin.symbol}`;

  button.classList.toggle(
    "buy-button",
    tradeSide === "buy"
  );

  button.classList.toggle(
    "sell-button",
    tradeSide === "sell"
  );
}

function executeTrade() {

  const input =
    document.getElementById("tradeAmount");

  const amount =
    Number(input.value);

  if (!amount || amount <= 0) {
    showToast(
      "Enter a valid amount.",
      "normal"
    );
    return;
  }

  const price =
    getPrice(selectedSymbol);

  if (tradeSide === "buy") {

    buyCoin(
      selectedSymbol,
      amount,
      price
    );

  } else {

    sellCoin(
      selectedSymbol,
      amount,
      price
    );
  }
}

function buyCoin(symbol, usdAmount, price) {

  if (usdAmount > getBalance()) {

    showToast(
      "Insufficient demo balance.",
      "normal"
    );

    return;
  }

  const oldPosition =
    getPosition(symbol);

  const quantity =
    usdAmount / price;

  if (oldPosition) {

    const totalCost =
      oldPosition.cost + usdAmount;

    const totalQuantity =
      oldPosition.quantity + quantity;

    oldPosition.quantity =
      totalQuantity;

    oldPosition.cost =
      totalCost;

    oldPosition.entryPrice =
      totalCost / totalQuantity;

    savePosition(oldPosition);

  } else {

    savePosition({
      symbol,
      quantity,
      cost: usdAmount,
      entryPrice: price,
      openedAt: Date.now()
    });
  }

  setBalance(
    getBalance() - usdAmount
  );

  addTrade({
    id: Date.now(),
    symbol,
    side: "BUY",
    amount: usdAmount,
    quantity,
    price,
    timestamp: Math.floor(Date.now() / 1000)
  });

  showToast(
    `Bought ${COINS[symbol].name} for ${formatMoney(usdAmount)}`,
    "buy"
  );

  updateEverything();

  if (currentChartSymbol === symbol) {
    refreshChart();
  }
}

function sellCoin(symbol, usdAmount, price) {

  const position =
    getPosition(symbol);

  if (!position) {

    showToast(
      `You don't own ${COINS[symbol].name}.`,
      "normal"
    );

    return;
  }

  const sellAmount =
    Math.min(
      usdAmount,
      position.quantity * price
    );

  const quantitySold =
    sellAmount / price;

  position.quantity -= quantitySold;

  const proportion =
    quantitySold /
    (position.quantity + quantitySold);

  position.cost -=
    position.cost * proportion;

  setBalance(
    getBalance() + sellAmount
  );

  addTrade({
    id: Date.now(),
    symbol,
    side: "SELL",
    amount: sellAmount,
    quantity: quantitySold,
    price,
    timestamp: Math.floor(Date.now() / 1000)
  });

  if (
    position.quantity <= 0.0000000001
  ) {

    removePosition(symbol);

  } else {

    savePosition(position);
  }

  showToast(
    `Sold ${COINS[symbol].name} for ${formatMoney(sellAmount)}`,
    "sell"
  );

  updateEverything();

  if (currentChartSymbol === symbol) {
    refreshChart();
  }
}

function updatePositionPreview() {

  const position =
    getPosition(selectedSymbol);

  const quantityEl =
    document.getElementById("positionQuantity");

  const entryEl =
    document.getElementById("positionEntry");

  const valueEl =
    document.getElementById("positionValue");

  const pnlEl =
    document.getElementById("positionPnl");

  const statusEl =
    document.getElementById("positionStatus");

  const chartPosition =
    document.getElementById("chartPositionText");

  if (!position) {

    if (quantityEl) quantityEl.textContent = "0";
    if (entryEl) entryEl.textContent = "$0.00000000";
    if (valueEl) valueEl.textContent = "$0.00";

    if (pnlEl) {
      pnlEl.textContent = "$0.00";
      pnlEl.className = "";
    }

    if (statusEl) {
      statusEl.textContent = "None";
    }

    if (chartPosition) {
      chartPosition.textContent =
        "No open position";
    }

    return;
  }

  const currentPrice =
    getPrice(selectedSymbol);

  const value =
    position.quantity *
    currentPrice;

  const pnl =
    value - position.cost;

  const pnlPercent =
    position.cost > 0
      ? (pnl / position.cost) * 100
      : 0;

  if (quantityEl) {
    quantityEl.textContent =
      formatQuantity(position.quantity);
  }

  if (entryEl) {
    entryEl.textContent =
      formatPrice(position.entryPrice);
  }

  if (valueEl) {
    valueEl.textContent =
      formatMoney(value);
  }

  if (pnlEl) {

    pnlEl.textContent =
      `${pnl >= 0 ? "+" : ""}${formatMoney(pnl)} (${pnlPercent.toFixed(2)}%)`;

    pnlEl.className =
      pnl >= 0
        ? "positive"
        : "negative";
  }

  if (statusEl) {
    statusEl.textContent = "Open";
  }

  if (chartPosition) {

    chartPosition.textContent =
      `Entry ${formatPrice(position.entryPrice)} • P&L ${formatMoney(pnl)}`;

    chartPosition.className =
      pnl >= 0
        ? "positive"
        : "negative";
  }
}

function updatePositionsList() {

  const list =
    document.getElementById("positionsList");

  if (!list) return;

  const positions =
    getAllPositions();

  if (!positions.length) {

    list.innerHTML = `
      <div class="empty-state">
        No open positions yet.
        <br>
        Choose a meme coin above to start your demo trade.
      </div>
    `;

    return;
  }

  list.innerHTML =
    positions.map(position => {

      const coin =
        COINS[position.symbol];

      const current =
        getPrice(position.symbol);

      const value =
        position.quantity * current;

      const pnl =
        value - position.cost;

      return `
        <div class="position-card">

          <div class="position-coin">
            <div class="coin-icon">
              ${coin.icon}
            </div>

            <div>
              <strong>${coin.name}</strong>
              <small>${coin.symbol}</small>
            </div>
          </div>

          <div class="position-metric">
            <span>Entry</span>
            <strong>${formatPrice(position.entryPrice)}</strong>
          </div>

          <div class="position-metric">
            <span>Value</span>
            <strong>${formatMoney(value)}</strong>
          </div>

          <div class="position-metric">
            <span>P&L</span>
            <strong class="${pnl >= 0 ? "positive" : "negative"}">
              ${pnl >= 0 ? "+" : ""}${formatMoney(pnl)}
            </strong>
          </div>

          <button
            class="close-position"
            data-close="${position.symbol}">
            Sell
          </button>

        </div>
      `;
    }).join("");

  list.querySelectorAll("[data-close]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const symbol =
          button.dataset.close;

        const position =
          getPosition(symbol);

        if (!position) return;

        tradeSide = "sell";
        selectedSymbol = symbol;

        const value =
          position.quantity *
          getPrice(symbol);

        document.getElementById(
          "tradeAmount"
        ).value =
          value.toFixed(2);

        updateEverything();
      });
    });
}

function formatMoney(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(value);
}

function formatQuantity(value) {

  if (value >= 1000) {
    return value.toLocaleString(
      "en-US",
      {
        maximumFractionDigits: 2
      }
    );
  }

  return value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 8
    }
  );
}

document.addEventListener(
  "kereosPricesUpdated",
  () => {

    updateEverything();

    if (
      typeof refreshChart === "function" &&
      currentChartSymbol === selectedSymbol
    ) {
      refreshChart();
    }

  }
);
