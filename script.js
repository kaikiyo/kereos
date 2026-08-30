/* =========================================================
   KEREOS
   Paper Trading Engine
   ========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets" +
  "?vs_currency=usd" +
  "&category=meme-token" +
  "&order=market_cap_desc" +
  "&per_page=50" +
  "&page=1" +
  "&sparkline=false";


/*
  Fallback data.

  This prevents the entire website from becoming stuck
  if the public API is unavailable.
*/

const FALLBACK_COINS = [

  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image:
      "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    current_price: 0.22,
    price_change_percentage_24h: 2.4,
    market_cap: 32000000000,
    total_volume: 1200000000
  },

  {
    id: "shiba-inu",
    symbol: "shib",
    name: "Shiba Inu",
    image:
      "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    current_price: 0.000013,
    price_change_percentage_24h: -1.2,
    market_cap: 8000000000,
    total_volume: 300000000
  },

  {
    id: "pepe",
    symbol: "pepe",
    name: "Pepe",
    image:
      "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg",
    current_price: 0.00001,
    price_change_percentage_24h: 5.8,
    market_cap: 4200000000,
    total_volume: 700000000
  },

  {
    id: "bonk",
    symbol: "bonk",
    name: "Bonk",
    image:
      "https://assets.coingecko.com/coins/images/28600/large/bonk.jpg",
    current_price: 0.00002,
    price_change_percentage_24h: 3.2,
    market_cap: 1500000000,
    total_volume: 180000000
  },

  {
    id: "dogwifhat",
    symbol: "wif",
    name: "dogwifhat",
    image:
      "https://assets.coingecko.com/coins/images/33566/large/dogwifhat.jpg",
    current_price: 0.85,
    price_change_percentage_24h: -2.1,
    market_cap: 850000000,
    total_volume: 110000000
  }

];


/* =========================================================
   STATE
========================================================= */

let coins = [];

let previousPrices = {};

let positions = {};

let transactions = [];

let cash = 10000;

let selectedCoin = null;

let tradeSide = "buy";

let usingLiveData = false;


/* Challenge has its own virtual account */

let challengeCash = 100;

let challengePositions = {};

let challengeTransactions = [];


/* =========================================================
   LOAD SAVED STATE
========================================================= */

function loadState() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem("kereosState")
      );

    if (!saved) return;

    cash =
      Number(saved.cash ?? 10000);

    positions =
      saved.positions ?? {};

    transactions =
      saved.transactions ?? [];

    challengeCash =
      Number(saved.challengeCash ?? 100);

    challengePositions =
      saved.challengePositions ?? {};

    challengeTransactions =
      saved.challengeTransactions ?? [];

  } catch (error) {

    console.warn(
      "Could not load saved state:",
      error
    );

  }

}


loadState();


/* =========================================================
   SAVE STATE
========================================================= */

function saveState() {

  localStorage.setItem(
    "kereosState",
    JSON.stringify({

      cash,

      positions,

      transactions,

      challengeCash,

      challengePositions,

      challengeTransactions

    })
  );

}


/* =========================================================
   FORMATTERS
========================================================= */

function money(value) {

  if (!Number.isFinite(value)) {
    return "$0.00";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }
  ).format(value);

}


function compact(value) {

  if (!Number.isFinite(value)) {
    return "$0";
  }

  if (value >= 1e12) {
    return "$" +
      (value / 1e12).toFixed(2) +
      "T";
  }

  if (value >= 1e9) {
    return "$" +
      (value / 1e9).toFixed(2) +
      "B";
  }

  if (value >= 1e6) {
    return "$" +
      (value / 1e6).toFixed(2) +
      "M";
  }

  if (value >= 1e3) {
    return "$" +
      (value / 1e3).toFixed(2) +
      "K";
  }

  return money(value);

}


function formatPrice(value) {

  if (!Number.isFinite(value)) {
    return "$0";
  }

  if (value < 0.00000001) {
    return "$" + value.toFixed(12);
  }

  if (value < 0.000001) {
    return "$" + value.toFixed(10);
  }

  if (value < 0.001) {
    return "$" + value.toFixed(8);
  }

  if (value < 1) {
    return "$" + value.toFixed(6);
  }

  return "$" +
    value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }
    );

}


function formatQuantity(value) {

  if (!Number.isFinite(value)) {
    return "0";
  }

  if (value < 0.000001) {
    return value.toFixed(10);
  }

  if (value < 1) {
    return value.toFixed(6);
  }

  return value.toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 4
    }
  );

}


function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer;

function toast(message, type = "success") {

  const element =
    document.getElementById("toast");

  const icon =
    document.getElementById("toastIcon");

  const text =
    document.getElementById("toastMessage");

  text.textContent = message;

  icon.textContent =
    type === "error"
      ? "!"
      : type === "warning"
        ? "!"
        : "✓";

  icon.style.color =
    type === "error"
      ? "var(--red)"
      : type === "warning"
        ? "var(--gold)"
        : "var(--green)";

  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(
      () => element.classList.remove("show"),
      3000
    );

}


/* =========================================================
   STATUS
========================================================= */

function setStatus(
  live,
  message
) {

  usingLiveData = live;

  const dots =
    document.querySelectorAll(
      ".status-dot"
    );

  const text =
    document.getElementById(
      "statusText"
    );

  const updated =
    document.getElementById(
      "lastUpdated"
    );

  dots.forEach(dot => {

    dot.style.background =
      live
        ? "var(--green)"
        : "var(--gold)";

    dot.style.boxShadow =
      live
        ? "0 0 12px rgba(53,227,154,.8)"
        : "0 0 12px rgba(255,200,87,.7)";

  });

  if (text) {

    text.textContent =
      live
        ? "LIVE DATA"
        : "DEMO DATA";

  }

  if (updated) {

    updated.textContent =
      message;

  }

}


/* =========================================================
   LOAD MARKETS
========================================================= */

async function loadMarkets() {

  setStatus(
    false,
    "Connecting..."
  );

  try {

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        9000
      );

    const response =
      await fetch(
        API_URL,
        {
          method: "GET",
          headers: {
            "Accept": "application/json"
          },
          signal: controller.signal,
          cache: "no-store"
        }
      );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        "API response " +
        response.status
      );
    }

    const data =
      await response.json();

    if (
      !Array.isArray(data) ||
      data.length === 0
    ) {
      throw new Error(
        "Empty market response"
      );
    }

    const oldCoins =
      coins;

    coins = data;

    setStatus(
      true,
      "Updated " +
      new Date().toLocaleTimeString()
    );

    detectPriceChanges(
      oldCoins,
      coins
    );

    renderEverything();

  } catch (error) {

    console.warn(
      "Live market request failed:",
      error
    );

    if (coins.length === 0) {

      coins =
        FALLBACK_COINS.map(
          coin => ({
            ...coin
          })
        );

    }

    setStatus(
      false,
      "Live API unavailable"
    );

    renderEverything();

  }

}


/* =========================================================
   PRICE CHANGE DETECTION
========================================================= */

function detectPriceChanges(
  oldCoins,
  newCoins
) {

  previousPrices = {};

  oldCoins.forEach(
    coin => {

      previousPrices[coin.id] =
        Number(
          coin.current_price
        );

    }
  );

}


/* =========================================================
   NAVIGATION
========================================================= */

const pageNames = {

  dashboard: "Dashboard",

  markets: "Markets",

  portfolio: "Portfolio",

  challenge: "Challenge"

};


function navigate(page) {

  const pages =
    document.querySelectorAll(
      ".page"
    );

  const navButtons =
    document.querySelectorAll(
      ".nav-item"
    );

  pages.forEach(
    section => {

      section.classList.remove(
        "active-page"
      );

    }
  );

  navButtons.forEach(
    button => {

      button.classList.remove(
        "active"
      );

    }
  );


  const target =
    document.getElementById(
      page + "Page"
    );

  const nav =
    document.querySelector(
      `.nav-item[data-page="${page}"]`
    );


  if (target) {

    target.classList.add(
      "active-page"
    );

  }

  if (nav) {

    nav.classList.add(
      "active"
    );

  }


  const title =
    document.getElementById(
      "pageTitle"
    );

  const name =
    document.getElementById(
      "pageName"
    );

  if (title) {

    title.textContent =
      pageNames[page];

  }

  if (name) {

    name.textContent =
      pageNames[page];

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (page === "portfolio") {

    renderPortfolio();

  }

  if (page === "challenge") {

    renderChallenge();

  }

}


document
  .querySelectorAll(".nav-item")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        navigate(
          button.dataset.page
        );

      }
    );

  });


document
  .querySelectorAll("[data-page-jump]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        navigate(
          button.dataset.pageJump
        );

      }
    );

  });


/* =========================================================
   MARKET HELPERS
========================================================= */

function getCoin(id) {

  return coins.find(
    coin => coin.id === id
  );

}


function currentPrice(id) {

  const coin =
    getCoin(id);

  return coin
    ? Number(coin.current_price)
    : 0;

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

  renderMarkets();

  renderDashboardMarkets();

  renderQuickTrades();

  renderPortfolio();

  renderRecentActivity();

  renderChallenge();

  updateAccountStats();

}


/* =========================================================
   MARKET TABLE
========================================================= */

function renderMarkets() {

  const table =
    document.getElementById(
      "marketTable"
    );

  const search =
    document.getElementById(
      "marketSearch"
    )?.value
      ?.trim()
      ?.toLowerCase() || "";


  const filtered =
    coins
      .filter(
        coin => {

          return (

            String(
              coin.name
            )
              .toLowerCase()
              .includes(search)

            ||

            String(
              coin.symbol
            )
              .toLowerCase()
              .includes(search)

          );

        }
      )
      .slice(0, 50);


  const count =
    document.getElementById(
      "coinCount"
    );

  if (count) {

    count.textContent =
      filtered.length;

  }


  if (!filtered.length) {

    table.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            No matching coins found.
          </div>
        </td>
      </tr>
    `;

    return;

  }


  table.innerHTML =
    filtered
      .map(
        (coin, index) => {

          const change =
            Number(
              coin.price_change_percentage_24h ?? 0
            );

          const oldPrice =
            previousPrices[coin.id];

          let animationClass = "";

          if (
            oldPrice &&
            Number(coin.current_price) > oldPrice
          ) {

            animationClass =
              "price-up";

          } else if (
            oldPrice &&
            Number(coin.current_price) < oldPrice
          ) {

            animationClass =
              "price-down";

          }


          return `
            <tr class="${animationClass}">

              <td>
                ${index + 1}
              </td>

              <td>

                <div class="table-coin">

                  <img
                    src="${escapeHTML(
                      coin.image || ""
                    )}"
                    alt="${escapeHTML(
                      coin.name
                    )}"
                    onerror="
                      this.style.visibility='hidden'
                    "
                  >

                  <div>

                    <strong>
                      ${escapeHTML(
                        coin.name
                      )}
                    </strong>

                    <small>
                      ${escapeHTML(
                        String(
                          coin.symbol || ""
                        ).toUpperCase()
                      )}
                    </small>

                  </div>

                </div>

              </td>

              <td>

                <strong>
                  ${formatPrice(
                    Number(
                      coin.current_price
                    )
                  )}
                </strong>

              </td>

              <td
                class="${
                  change >= 0
                    ? "positive"
                    : "negative"
                }"
              >

                ${
                  change >= 0
                    ? "+"
                    : ""
                }${change.toFixed(2)}%

              </td>

              <td>
                ${compact(
                  Number(
                    coin.market_cap
                  )
                )}
              </td>

              <td>
                ${compact(
                  Number(
                    coin.total_volume
                  )
                )}
              </td>

              <td>

                <button
                  class="buy-small"
                  onclick="
                    openTrade(
                      '${escapeHTML(
                        coin.id
                      )}',
                      'buy'
                    )
                  "
                >
                  BUY
                </button>

              </td>

            </tr>
          `;

        }
      )
      .join("");

}


/* =========================================================
   DASHBOARD MARKETS
========================================================= */

function renderDashboardMarkets() {

  const container =
    document.getElementById(
      "dashboardMarkets"
    );

  if (!coins.length) {

    container.innerHTML =
      `<div class="loading-box">
        Loading markets...
      </div>`;

    return;

  }


  container.innerHTML =
    coins
      .slice(0, 6)
      .map(
        coin => {

          const change =
            Number(
              coin.price_change_percentage_24h ?? 0
            );

          return `
            <div class="mini-market">

              <div class="coin-info">

                <img
                  class="coin-image"
                  src="${escapeHTML(
                    coin.image || ""
                  )}"
                  alt=""
                  onerror="
                    this.style.visibility='hidden'
                  "
                >

                <div>

                  <div class="coin-name">
                    ${escapeHTML(
                      coin.name
                    )}
                  </div>

                  <div class="coin-symbol">
                    ${escapeHTML(
                      String(
                        coin.symbol || ""
                      ).toUpperCase()
                    )}
                  </div>

                </div>

              </div>

              <div class="coin-right">

                <div class="coin-price">
                  ${formatPrice(
                    Number(
                      coin.current_price
                    )
                  )}
                </div>

                <div
                  class="coin-change ${
                    change >= 0
                      ? "positive"
                      : "negative"
                  }"
                >
                  ${
                    change >= 0
                      ? "+"
                      : ""
                  }${change.toFixed(2)}%
                </div>

              </div>

            </div>
          `;

        }
      )
      .join("");

}


/* =========================================================
   QUICK TRADES
========================================================= */

function renderQuickTrades() {

  const container =
    document.getElementById(
      "quickTradeList"
    );

  if (!coins.length) {

    container.innerHTML =
      `<div class="loading-box">
        Loading...
      </div>`;

    return;

  }


  container.innerHTML =
    coins
      .slice(0, 5)
      .map(
        coin => {

          return `
            <div class="mini-market">

              <div class="coin-info">

                <img
                  class="coin-image"
                  src="${escapeHTML(
                    coin.image || ""
                  )}"
                  alt=""
                >

                <div>

                  <div class="coin-name">
                    ${escapeHTML(
                      coin.name
                    )}
                  </div>

                  <div class="coin-symbol">
                    ${formatPrice(
                      Number(
                        coin.current_price
                      )
                    )}
                  </div>

                </div>

              </div>

              <button
                class="buy-small"
                onclick="
                  openTrade(
                    '${escapeHTML(
                      coin.id
                    )}',
                    'buy'
                  )
                "
              >
                BUY
              </button>

            </div>
          `;

        }
      )
      .join("");

}


/* =========================================================
   ACCOUNT CALCULATIONS
========================================================= */

function getHoldingsValue() {

  let total = 0;

  Object.values(
    positions
  ).forEach(
    position => {

      const coin =
        getCoin(position.id);

      if (!coin) return;

      total +=
        Number(position.quantity) *
        Number(coin.current_price);

    }
  );

  return total;

}


function getInvestedValue() {

  let total = 0;

  Object.values(
    positions
  ).forEach(
    position => {

      total +=
        Number(position.invested || 0);

    }
  );

  return total;

}


function getPortfolioValue() {

  return (
    cash +
    getHoldingsValue()
  );

}


function getPnL() {

  return (
    getHoldingsValue() -
    getInvestedValue()
  );

}


/* =========================================================
   ACCOUNT STATS
========================================================= */

function updateAccountStats() {

  const portfolio =
    getPortfolioValue();

  const holdings =
    getHoldingsValue();

  const pnl =
    getPnL();


  const values = {

    topBalance:
      portfolio,

    mobileBalance:
      portfolio,

    dashboardPortfolio:
      portfolio,

    dashboardCash:
      cash,

    dashboardPnL:
      pnl,

    dashboardPositions:
      Object.keys(
        positions
      ).length,

    portfolioTotal:
      portfolio,

    portfolioCash:
      cash,

    portfolioHoldings:
      holdings,

    portfolioPnL:
      pnl

  };


  Object.entries(values)
    .forEach(
      ([id, value]) => {

        const element =
          document.getElementById(id);

        if (!element) return;

        element.textContent =
          id === "dashboardPositions"
            ? value
            : money(value);

      }
    );


  const pnlElements = [
    "dashboardPnL",
    "portfolioPnL"
  ];

  pnlElements.forEach(
    id => {

      const element =
        document.getElementById(id);

      if (!element) return;

      element.classList.remove(
        "positive",
        "negative",
        "neutral"
      );

      element.classList.add(
        pnl > 0
          ? "positive"
          : pnl < 0
            ? "negative"
            : "neutral"
      );

    }
  );

}


/* =========================================================
   OPEN TRADE
========================================================= */

function openTrade(
  id,
  side = "buy"
) {

  const coin =
    getCoin(id);

  if (!coin) {

    toast(
      "Coin is currently unavailable.",
      "error"
    );

    return;

  }


  selectedCoin =
    coin;

  tradeSide =
    side;


  const modal =
    document.getElementById(
      "tradeModal"
    );

  const image =
    document.getElementById(
      "modalCoinImage"
    );

  const name =
    document.getElementById(
      "modalCoinName"
    );

  const symbol =
    document.getElementById(
      "modalCoinSymbol"
    );

  const price =
    document.getElementById(
      "modalPrice"
    );


  image.src =
    coin.image || "";

  image.onerror =
    () => {
      image.style.visibility =
        "hidden";
    };

  name.textContent =
    coin.name;

  symbol.textContent =
    String(
      coin.symbol || ""
    ).toUpperCase();

  price.textContent =
    formatPrice(
      Number(
        coin.current_price
      )
    );


  document.getElementById(
    "tradeAmount"
  ).value = "";


  updateTradeTabs();

  updateTradePreview();


  modal.classList.add(
    "show"
  );

}


function closeTrade() {

  document
    .getElementById(
      "tradeModal"
    )
    .classList.remove(
      "show"
    );

  selectedCoin =
    null;

}


document
  .getElementById(
    "closeModal"
  )
  .addEventListener(
    "click",
    closeTrade
  );


document
  .querySelector(
    ".modal-overlay"
  )
  .addEventListener(
    "click",
    closeTrade
  );


/* =========================================================
   TRADE TABS
========================================================= */

function updateTradeTabs() {

  const buy =
    document.getElementById(
      "buyTab"
    );

  const sell =
    document.getElementById(
      "sellTab"
    );

  const submit =
    document.getElementById(
      "executeTrade"
    );


  buy.classList.toggle(
    "active",
    tradeSide === "buy"
  );

  sell.classList.toggle(
    "active",
    tradeSide === "sell"
  );


  submit.classList.toggle(
    "buy-submit",
    tradeSide === "buy"
  );

  submit.classList.toggle(
    "sell-submit",
    tradeSide === "sell"
  );


  submit.textContent =
    tradeSide === "buy"
      ? "Confirm Buy"
      : "Confirm Sell";

}


document
  .getElementById(
    "buyTab"
  )
  .addEventListener(
    "click",
    () => {

      tradeSide = "buy";

      updateTradeTabs();

      updateTradePreview();

    }
  );


document
  .getElementById(
    "sellTab"
  )
  .addEventListener(
    "click",
    () => {

      tradeSide = "sell";

      updateTradeTabs();

      updateTradePreview();

    }
  );


/* =========================================================
   TRADE PREVIEW
========================================================= */

function updateTradePreview() {

  const input =
    document.getElementById(
      "tradeAmount"
    );

  const amount =
    Number(input.value || 0);

  const tokens =
    document.getElementById(
      "estimatedTokens"
    );

  const available =
    document.getElementById(
      "availableAmount"
    );


  if (!selectedCoin) {

    tokens.textContent =
      "0";

    available.textContent =
      "$0";

    return;

  }


  const livePrice =
    Number(
      selectedCoin.current_price
    );


  if (
    amount > 0 &&
    livePrice > 0
  ) {

    tokens.textContent =
      formatQuantity(
        amount / livePrice
      );

  } else {

    tokens.textContent =
      "0";

  }


  if (tradeSide === "buy") {

    available.textContent =
      money(cash);

  } else {

    const position =
      positions[
        selectedCoin.id
      ];

    const value =
      position
        ? Number(position.quantity) *
          livePrice
        : 0;

    available.textContent =
      money(value);

  }

}


document
  .getElementById(
    "tradeAmount"
  )
  .addEventListener(
    "input",
    updateTradePreview
  );


/* =========================================================
   EXECUTE TRADE
========================================================= */

function executeTrade() {

  if (!selectedCoin) return;


  const amount =
    Number(
      document.getElementById(
        "tradeAmount"
      ).value
    );


  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {

    toast(
      "Enter a valid USD amount.",
      "error"
    );

    return;

  }


  const livePrice =
    Number(
      selectedCoin.current_price
    );


  if (
    !Number.isFinite(livePrice) ||
    livePrice <= 0
  ) {

    toast(
      "Current price unavailable.",
      "error"
    );

    return;

  }


  if (tradeSide === "buy") {

    executeBuy(
      selectedCoin,
      amount,
      livePrice
    );

  } else {

    executeSell(
      selectedCoin,
      amount,
      livePrice
    );

  }

}


/* =========================================================
   BUY
========================================================= */

function executeBuy(
  coin,
  amount,
  livePrice
) {

  if (amount > cash) {

    toast(
      "Not enough virtual cash.",
      "error"
    );

    return;

  }


  const quantity =
    amount / livePrice;


  if (!positions[coin.id]) {

    positions[coin.id] = {

      id:
        coin.id,

      name:
        coin.name,

      symbol:
        coin.symbol,

      image:
        coin.image,

      quantity:
        0,

      invested:
        0

    };

  }


  positions[
    coin.id
  ].quantity += quantity;


  positions[
    coin.id
  ].invested += amount;


  cash -= amount;


  transactions.unshift({

    id:
      Date.now(),

    side:
      "buy",

    coinId:
      coin.id,

    coinName:
      coin.name,

    symbol:
      coin.symbol,

    quantity,

    price:
      livePrice,

    amount,

    time:
      new Date().toISOString()

  });


  transactions =
    transactions.slice(
      0,
      50
    );


  saveState();

  closeTrade();

  renderEverything();


  toast(
    `Bought ${formatQuantity(quantity)} ${String(coin.symbol).toUpperCase()}`
  );

}


/* =========================================================
   SELL
========================================================= */

function executeSell(
  coin,
  amount,
  livePrice
) {

  const position =
    positions[coin.id];


  if (
    !position ||
    Number(position.quantity) <= 0
  ) {

    toast(
      "You don't own this coin.",
      "error"
    );

    return;

  }


  const quantity =
    amount / livePrice;


  if (
    quantity >
    Number(position.quantity)
  ) {

    toast(
      "You don't own enough of this coin.",
      "error"
    );

    return;

  }


  const averageCost =
    Number(position.invested) /
    Number(position.quantity);


  const costRemoved =
    averageCost *
    quantity;


  position.quantity -=
    quantity;

  position.invested -=
    costRemoved;


  cash += amount;


  transactions.unshift({

    id:
      Date.now(),

    side:
      "sell",

    coinId:
      coin.id,

    coinName:
      coin.name,

    symbol:
      coin.symbol,

    quantity,

    price:
      livePrice,

    amount,

    time:
      new Date().toISOString()

  });


  transactions =
    transactions.slice(
      0,
      50
    );


  if (
    position.quantity <=
    0.0000000001
  ) {

    delete positions[
      coin.id
    ];

  }


  saveState();

  closeTrade();

  renderEverything();


  toast(
    `Sold ${formatQuantity(quantity)} ${String(coin.symbol).toUpperCase()}`
  );

}


/* =========================================================
   PORTFOLIO
========================================================= */

function renderPortfolio() {

  const container =
    document.getElementById(
      "positionsList"
    );


  const entries =
    Object.values(
      positions
    );


  if (!entries.length) {

    container.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          ◈
        </div>

        <strong>
          No open positions
        </strong>

        <p>
          Visit Markets and buy a coin using virtual funds.
        </p>

        <button
          class="primary-button"
          data-page-jump="markets"
        >
          Explore Markets
        </button>

      </div>
    `;


    container
      .querySelector(
        "[data-page-jump]"
      )
      .addEventListener(
        "click",
        () => navigate("markets")
      );


    updateAccountStats();

    return;

  }


  container.innerHTML =
    entries
      .map(
        position => {

          const coin =
            getCoin(
              position.id
            );

          if (!coin) return "";


          const livePrice =
            Number(
              coin.current_price
            );


          const quantity =
            Number(
              position.quantity
            );


          const invested =
            Number(
              position.invested
            );


          const value =
            quantity *
            livePrice;


          const pnl =
            value -
            invested;


          const pnlPercent =
            invested > 0
              ? (
                  pnl /
                  invested
                ) * 100
              : 0;


          return `
            <div class="position-row">

              <div class="position-main">

                <img
                  src="${escapeHTML(
                    coin.image || ""
                  )}"
                  alt=""
                >

                <div>

                  <div class="coin-name">
                    ${escapeHTML(
                      coin.name
                    )}
                  </div>

                  <div class="coin-symbol">
                    ${escapeHTML(
                      String(
                        coin.symbol
                      ).toUpperCase()
                    )}
                  </div>

                </div>

              </div>


              <div>

                <div class="position-label">
                  Quantity
                </div>

                <div class="position-value">
                  ${formatQuantity(
                    quantity
                  )}
                </div>

              </div>


              <div>

                <div class="position-label">
                  Entry
                </div>

                <div class="position-value">
                  ${formatPrice(
                    invested /
                    quantity
                  )}
                </div>

              </div>


              <div>

                <div class="position-label">
                  Current
                </div>

                <div class="position-value">
                  ${formatPrice(
                    livePrice
                  )}
                </div>

              </div>


              <div>

                <div class="position-label">
                  P/L
                </div>

                <div
                  class="
                    position-value
                    ${
                      pnl >= 0
                        ? "positive"
                        : "negative"
                    }
                  "
                >
                  ${
                    pnl >= 0
                      ? "+"
                      : ""
                  }${money(pnl)}
                  <br>
                  ${
                    pnlPercent >= 0
                      ? "+"
                      : ""
                  }${pnlPercent.toFixed(2)}%
                </div>

              </div>


              <div>

                <button
                  class="sell-small"
                  onclick="
                    openTrade(
                      '${escapeHTML(
                        coin.id
                      )}',
                      'sell'
                    )
                  "
                >
                  SELL
                </button>

              </div>

            </div>
          `;

        }
      )
      .join("");


  updateAccountStats();

}


/* =========================================================
   TRANSACTION HISTORY
========================================================= */

function renderRecentActivity() {

  const container =
    document.getElementById(
      "recentActivity"
    );

  renderTransactionContainer(
    container,
    5
  );

}


function renderTransactionHistory() {

  const container =
    document.getElementById(
      "transactionHistory"
    );

  renderTransactionContainer(
    container,
    50
  );

}


function renderTransactionContainer(
  container,
  limit
) {

  if (
    !transactions.length
  ) {

    container.innerHTML = `
      <div class="empty-state">
        No transactions yet.
      </div>
    `;

    return;

  }


  container.innerHTML =
    transactions
      .slice(0, limit)
      .map(
        tx => {

          const date =
            new Date(
              tx.time
            );


          return `
            <div class="transaction">

              <div class="transaction-left">

                <div
                  class="
                    transaction-badge
                    ${tx.side}
                  "
                >
                  ${
                    tx.side === "buy"
                      ? "BUY"
                      : "SELL"
                  }
                </div>

                <div class="transaction-name">

                  <strong>
                    ${escapeHTML(
                      tx.coinName
                    )}
                  </strong>

                  <small>
                    ${formatQuantity(
                      tx.quantity
                    )}
                    ${String(
                      tx.symbol
                    ).toUpperCase()}
                    @
                    ${formatPrice(
                      tx.price
                    )}
                  </small>

                </div>

              </div>


              <div class="transaction-right">

                <strong>
                  ${money(
                    tx.amount
                  )}
                </strong>

                <small>
                  ${date.toLocaleString()}
                </small>

              </div>

            </div>
          `;

        }
      )
      .join("");

}


function renderRecentAndHistory() {

  renderRecentActivity();

  renderTransactionHistory();

}


/* =========================================================
   CHALLENGE
========================================================= */

function getChallengeHoldings() {

  let total = 0;


  Object.values(
    challengePositions
  ).forEach(
    position => {

      const coin =
        getCoin(
          position.id
        );

      if (!coin) return;


      total +=
        Number(
          position.quantity
        ) *
        Number(
          coin.current_price
        );

    }
  );


  return total;

}


function getChallengeValue() {

  return (
    challengeCash +
    getChallengeHoldings()
  );

}


function renderChallenge() {

  const value =
    getChallengeValue();


  const progress =
    Math.max(
      0,
      Math.min(
        100,
        (
          (value - 100) /
          100
        ) * 100
      )
    );


  const balance =
    document.getElementById(
      "challengeBalance"
    );

  const bar =
    document.getElementById(
      "challengeProgress"
    );

  const message =
    document.getElementById(
      "challengeMessage"
    );


  if (balance) {

    balance.textContent =
      money(value);

  }


  if (bar) {

    bar.style.width =
      progress + "%";

  }


  if (message) {

    if (value >= 200) {

      message.textContent =
        "🏆 Challenge complete! You reached $200.";

    } else if (value <= 0) {

      message.textContent =
        "Challenge lost. Resetting is available in a future update.";

    } else {

      message.textContent =
        "Challenge in progress — keep trading.";

    }

  }

}


/* =========================================================
   SEARCH
========================================================= */

document
  .getElementById(
    "marketSearch"
  )
  .addEventListener(
    "input",
    renderMarkets
  );


/* =========================================================
   REFRESH BUTTON
========================================================= */

document
  .getElementById(
    "refreshButton"
  )
  .addEventListener(
    "click",
    async () => {

      const button =
        document.getElementById(
          "refreshButton"
        );

      button.disabled =
        true;

      button.textContent =
        "↻ Updating...";

      await loadMarkets();

      button.disabled =
        false;

      button.textContent =
        "↻ Refresh";

    }
  );


/* =========================================================
   MODAL ENTER KEY
========================================================= */

document
  .getElementById(
    "tradeAmount"
  )
  .addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        executeTrade();

      }

      if (
        event.key === "Escape"
      ) {

        closeTrade();

      }

    }
  );


document
  .getElementById(
    "executeTrade"
  )
  .addEventListener(
    "click",
    executeTrade
  );


/* =========================================================
   PERIODIC LIVE DATA
========================================================= */

/*
  Refresh every 60 seconds.

  This is deliberately conservative because public APIs
  can rate-limit aggressive requests.
*/

setInterval(
  loadMarkets,
  60000
);


/*
  Recalculate the portfolio every 3 seconds.

  This means the portfolio UI is always based on the
  newest price information currently stored in the app.
*/

setInterval(
  () => {

    updateAccountStats();

    renderPortfolio();

    renderChallenge();

  },
  3000
);


/* =========================================================
   INITIALIZATION
========================================================= */

renderEverything();

loadMarkets();


/*
  Keep transaction history synchronized.
*/

setTimeout(
  renderRecentAndHistory,
  500
);
