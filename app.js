let selectedSymbol =
  "PEPE";

let tradeSide = "BUY";

document.addEventListener(
  "DOMContentLoaded",
  () => {

    selectedSymbol =
      localStorage.getItem(
        "kereos_selected_coin"
      ) || "PEPE";

    setupMobileMenu();
    setupNavigation();
    setupTradeControls();
    setupCoinSelector();

    updateUI();

    if (
      document.getElementById("chart")
    ) {
      initChart(selectedSymbol);
    }

    setInterval(
      updateUI,
      1000
    );
  }
);

function setupMobileMenu() {

  const button =
    document.getElementById(
      "mobileMenu"
    );

  const nav =
    document.getElementById(
      "mainNav"
    );

  if (!button || !nav) return;

  button.addEventListener(
    "click",
    () => {
      nav.classList.toggle(
        "mobile-open"
      );
    }
  );
}

function setupNavigation() {

  document.querySelectorAll(
    "[data-nav]"
  ).forEach(link => {

    link.addEventListener(
      "click",
      () => {

        const nav =
          document.getElementById(
            "mainNav"
          );

        if (nav) {
          nav.classList.remove(
            "mobile-open"
          );
        }
      }
    );
  });
}

function setupTradeControls() {

  document.querySelectorAll(
    ".trade-tab"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".trade-tab"
          )
          .forEach(btn =>
            btn.classList.remove(
              "active"
            )
          );

        button.classList.add(
          "active"
        );

        tradeSide =
          button.dataset.side;

        updateTradeButton();
      }
    );
  });

  document.querySelectorAll(
    "[data-amount]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const input =
          document.getElementById(
            "tradeAmount"
          );

        if (input) {
          input.value =
            button.dataset.amount;
        }
      }
    );
  });

  const button =
    document.getElementById(
      "tradeButton"
    );

  if (button) {
    button.addEventListener(
      "click",
      executeTrade
    );
  }
}

function setupCoinSelector() {

  const strip =
    document.getElementById(
      "marketStrip"
    );

  if (!strip) return;

  Object.keys(COINS).forEach(
    symbol => {

      const coin =
        COINS[symbol];

      const card =
        document.createElement(
          "button"
        );

      card.className =
        "market-card";

      card.dataset.symbol =
        symbol;

      card.innerHTML = `
        <div class="market-card-top">
          <span class="coin-icon">
            ${coin.icon}
          </span>

          <span>
            <strong>${coin.symbol}</strong>
            <small>${coin.name}</small>
          </span>
        </div>

        <strong
          class="market-price"
          data-price="${symbol}">
          ${formatPrice(
            getPrice(symbol)
          )}
        </strong>

        <small
          class="market-change"
          data-change="${symbol}">
          ${getChange(symbol) >= 0 ? "+" : ""}
          ${getChange(symbol).toFixed(2)}%
        </small>
      `;

      card.addEventListener(
        "click",
        () => selectCoin(symbol)
      );

      strip.appendChild(card);
    }
  );
}

function selectCoin(symbol) {

  if (!COINS[symbol]) return;

  selectedSymbol = symbol;

  localStorage.setItem(
    "kereos_selected_coin",
    symbol
  );

  updateUI();

  if (
    document.getElementById(
      "chart"
    )
  ) {
    initChart(symbol);
  }
}

function updateUI() {

  updateBalance();
  updateSelectedCoin();
  updateMarketCards();
  updatePosition();
  updatePositions();
  updateTradeButton();
}

function updateBalance() {

  const balance =
    formatMoney(getBalance());

  const header =
    document.getElementById(
      "headerBalance"
    );

  const available =
    document.getElementById(
      "availableBalance"
    );

  if (header) {
    header.textContent = balance;
  }

  if (available) {
    available.textContent =
      balance;
  }
}

function updateSelectedCoin() {

  const coin =
    COINS[selectedSymbol];

  if (!coin) return;

  const price =
    getPrice(selectedSymbol);

  const change =
    getChange(selectedSymbol);

  const icon =
    document.getElementById(
      "selectedCoinIcon"
    );

  const name =
    document.getElementById(
      "selectedCoinName"
    );

  const symbol =
    document.getElementById(
      "selectedCoinSymbol"
    );

  const priceElement =
    document.getElementById(
      "selectedPrice"
    );

  const changeElement =
    document.getElementById(
      "selectedChange"
    );

  const tradePrice =
    document.getElementById(
      "tradePrice"
    );

  if (icon) {
    icon.textContent =
      coin.icon;
  }

  if (name) {
    name.textContent =
      coin.name;
  }

  if (symbol) {
    symbol.textContent =
      coin.symbol;
  }

  if (priceElement) {

    const previous =
      Number(
        priceElement.dataset.price ||
        price
      );

    flashElement(
      priceElement,
      price >= previous
        ? "up"
        : "down"
    );

    priceElement.textContent =
      formatPrice(price);

    priceElement.dataset.price =
      price;
  }

  if (tradePrice) {
    tradePrice.textContent =
      formatPrice(price);
  }

  if (changeElement) {

    changeElement.textContent =
      `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

    changeElement.className =
      change >= 0
        ? "positive"
        : "negative";
  }
}

function updateMarketCards() {

  Object.keys(COINS).forEach(
    symbol => {

      const priceElement =
        document.querySelector(
          `[data-price="${symbol}"]`
        );

      const changeElement =
        document.querySelector(
          `[data-change="${symbol}"]`
        );

      if (priceElement) {
        priceElement.textContent =
          formatPrice(
            getPrice(symbol)
          );
      }

      if (changeElement) {

        const change =
          getChange(symbol);

        changeElement.textContent =
          `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

        changeElement.className =
          "market-change " +
          (
            change >= 0
              ? "positive"
              : "negative"
          );
      }
    }
  );

  document.querySelectorAll(
    ".market-card"
  ).forEach(card => {

    card.classList.toggle(
      "active",
      card.dataset.symbol ===
      selectedSymbol
    );
  });
}

function updateTradeButton() {

  const button =
    document.getElementById(
      "tradeButton"
    );

  if (!button) return;

  const coin =
    COINS[selectedSymbol];

  button.textContent =
    `${tradeSide === "BUY" ? "Buy" : "Sell"} ${coin.symbol}`;

  button.className =
    "trade-button " +
    (
      tradeSide === "BUY"
        ? "buy-button"
        : "sell-button"
    );
}

function executeTrade() {

  const input =
    document.getElementById(
      "tradeAmount"
    );

  const amount =
    Number(input?.value);

  if (!amount || amount <= 0) {

    showToast(
      "Enter a valid amount.",
      "normal"
    );

    return;
  }

  const price =
    getPrice(selectedSymbol);

  if (tradeSide === "BUY") {
    buy(selectedSymbol, amount, price);
  } else {
    sell(selectedSymbol, amount, price);
  }
}

function buy(symbol, usd, price) {

  if (usd > getBalance()) {

    showToast(
      "Not enough demo balance.",
      "normal"
    );

    return;
  }

  const quantity =
    usd / price;

  const existing =
    getPosition(symbol);

  if (existing) {

    const newCost =
      existing.cost + usd;

    const newQuantity =
      existing.quantity +
      quantity;

    existing.quantity =
      newQuantity;

    existing.cost =
      newCost;

    existing.entryPrice =
      newCost / newQuantity;

    savePosition(existing);

  } else {

    savePosition({
      symbol,
      quantity,
      cost: usd,
      entryPrice: price,
      openedAt: Date.now()
    });
  }

  setBalance(
    getBalance() - usd
  );

  addTrade({
    id: Date.now(),
    symbol,
    side: "BUY",
    amount: usd,
    quantity,
    price,
    timestamp:
      Math.floor(
        Date.now() / 1000
      )
  });

  showToast(
    `Bought ${COINS[symbol].name} for ${formatMoney(usd)}`,
    "buy"
  );

  updateUI();
  refreshChart();
}

function sell(symbol, usd, price) {

  const position =
    getPosition(symbol);

  if (!position) {

    showToast(
      `You don't own ${COINS[symbol].name}.`,
      "normal"
    );

    return;
  }

  const currentValue =
    position.quantity * price;

  const amount =
    Math.min(
      usd,
      currentValue
    );

  const quantitySold =
    amount / price;

  const ratio =
    quantitySold /
    position.quantity;

  position.quantity -=
    quantitySold;

  position.cost *=
    Math.max(0, 1 - ratio);

  setBalance(
    getBalance() + amount
  );

  addTrade({
    id: Date.now(),
    symbol,
    side: "SELL",
    amount,
    quantity: quantitySold,
    price,
    timestamp:
      Math.floor(
        Date.now() / 1000
      )
  });

  if (
    position.quantity <=
    0.0000000001
  ) {

    removePosition(symbol);

  } else {

    savePosition(position);
  }

  showToast(
    `Sold ${COINS[symbol].name} for ${formatMoney(amount)}`,
    "sell"
  );

  updateUI();
  refreshChart();
}

function updatePosition() {

  const position =
    getPosition(selectedSymbol);

  const quantity =
    document.getElementById(
      "positionQuantity"
    );

  const entry =
    document.getElementById(
      "positionEntry"
    );

  const value =
    document.getElementById(
      "positionValue"
    );

  const pnl =
    document.getElementById(
      "positionPnl"
    );

  const status =
    document.getElementById(
      "positionStatus"
    );

  if (!position) {

    if (quantity)
      quantity.textContent = "0";

    if (entry)
      entry.textContent =
        "$0.00000000";

    if (value)
      value.textContent =
        "$0.00";

    if (pnl) {
      pnl.textContent =
        "$0.00";
      pnl.className = "";
    }

    if (status)
      status.textContent =
        "No position";

    return;
  }

  const currentPrice =
    getPrice(selectedSymbol);

  const currentValue =
    position.quantity *
    currentPrice;

  const profit =
    currentValue -
    position.cost;

  const percent =
    position.cost > 0
      ? (profit /
          position.cost) *
        100
      : 0;

  if (quantity)
    quantity.textContent =
      formatQuantity(
        position.quantity
      );

  if (entry)
    entry.textContent =
      formatPrice(
        position.entryPrice
      );

  if (value)
    value.textContent =
      formatMoney(
        currentValue
      );

  if (pnl) {

    pnl.textContent =
      `${profit >= 0 ? "+" : ""}${formatMoney(profit)} (${percent.toFixed(2)}%)`;

    pnl.className =
      profit >= 0
        ? "positive"
        : "negative";
  }

  if (status)
    status.textContent =
      "Open";
}

function updatePositions() {

  const list =
    document.getElementById(
      "positionsList"
    );

  if (!list) return;

  const positions =
    getAllPositions();

  if (!positions.length) {

    list.innerHTML = `
      <div class="empty-state">
        No open positions.
        <br>
        Start a demo trade to see it here.
      </div>
    `;

    return;
  }

  list.innerHTML =
    positions.map(
      position => {

        const coin =
          COINS[position.symbol];

        const price =
          getPrice(
            position.symbol
          );

        const value =
          position.quantity *
          price;

        const profit =
          value -
          position.cost;

        return `
          <div class="position-card">

            <div class="position-coin">
              <span class="coin-icon">
                ${coin.icon}
              </span>

              <div>
                <strong>
                  ${coin.name}
                </strong>

                <small>
                  ${coin.symbol}
                </small>
              </div>
            </div>

            <div class="metric">
              <span>Entry</span>
              <strong>
                ${formatPrice(
                  position.entryPrice
                )}
              </strong>
            </div>

            <div class="metric">
              <span>Value</span>
              <strong>
                ${formatMoney(value)}
              </strong>
            </div>

            <div class="metric">
              <span>P&L</span>
              <strong class="${
                profit >= 0
                  ? "positive"
                  : "negative"
              }">
                ${profit >= 0 ? "+" : ""}
                ${formatMoney(profit)}
              </strong>
            </div>

            <button
              class="close-position"
              data-sell-symbol="${position.symbol}">
              Sell
            </button>

          </div>
        `;
      }
    ).join("");

  list
    .querySelectorAll(
      "[data-sell-symbol]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const symbol =
            button.dataset.sellSymbol;

          const position =
            getPosition(symbol);

          if (!position) return;

          selectedSymbol =
            symbol;

          tradeSide =
            "SELL";

          const value =
            position.quantity *
            getPrice(symbol);

          const amount =
            document.getElementById(
              "tradeAmount"
            );

          if (amount) {
            amount.value =
              value.toFixed(2);
          }

          updateUI();
        }
      );
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
  ).format(
    Number(value) || 0
  );
}

function formatQuantity(value) {

  return Number(value).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 8
    }
  );
}

document.addEventListener(
  "kereos:prices",
  () => {

    updateUI();

    if (
      typeof refreshChart ===
      "function"
    ) {
      refreshChart();
    }
  }
);
