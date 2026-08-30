```javascript
/* =========================================================
   KEREOS DEMO TRADING ENGINE
   ========================================================= */

const DEFAULT_BALANCE = 10000;

const markets = {

    BTC: {
        name: "Bitcoin",
        symbol: "BTC",
        emoji: "₿",
        price: 108500,
        change: 2.84,
        meme: false
    },

    ETH: {
        name: "Ethereum",
        symbol: "ETH",
        emoji: "Ξ",
        price: 4300,
        change: 1.42,
        meme: false
    },

    SOL: {
        name: "Solana",
        symbol: "SOL",
        emoji: "◎",
        price: 205,
        change: 4.72,
        meme: false
    },

    XRP: {
        name: "XRP",
        symbol: "XRP",
        emoji: "✕",
        price: 2.85,
        change: -1.12,
        meme: false
    },

    DOGE: {
        name: "Dogecoin",
        symbol: "DOGE",
        emoji: "🐕",
        price: 0.24,
        change: 8.41,
        meme: true
    },

    SHIB: {
        name: "Shiba Inu",
        symbol: "SHIB",
        emoji: "🐕",
        price: 0.000014,
        change: 12.73,
        meme: true
    },

    PEPE: {
        name: "Pepe",
        symbol: "PEPE",
        emoji: "🐸",
        price: 0.0000124,
        change: 18.42,
        meme: true
    },

    BONK: {
        name: "Bonk",
        symbol: "BONK",
        emoji: "🐶",
        price: 0.000028,
        change: -5.32,
        meme: true
    },

    WIF: {
        name: "dogwifhat",
        symbol: "WIF",
        emoji: "🧢",
        price: 1.62,
        change: 14.12,
        meme: true
    },

    FLOKI: {
        name: "Floki",
        symbol: "FLOKI",
        emoji: "🐺",
        price: 0.000091,
        change: 7.32,
        meme: true
    }

};


/* =========================================================
   ACCOUNT
   ========================================================= */

let account = {

    balance: DEFAULT_BALANCE,

    holdings: {},

    transactions: [],

    startingValue: DEFAULT_BALANCE,

    challenge: null

};


function saveAccount() {

    localStorage.setItem(
        "kereosAccount",
        JSON.stringify(account)
    );

}


function loadAccount() {

    const saved =
        localStorage.getItem("kereosAccount");

    if (saved) {

        try {

            account = JSON.parse(saved);

        } catch {

            console.log("Could not load account.");

        }

    }

}


/* =========================================================
   ACCOUNT VALUES
   ========================================================= */

function portfolioValue() {

    let value = 0;

    Object.keys(account.holdings).forEach(symbol => {

        if (markets[symbol]) {

            value +=
                account.holdings[symbol].amount *
                markets[symbol].price;

        }

    });

    return value;

}


function totalValue() {

    return account.balance + portfolioValue();

}


function formatMoney(value) {

    if (!Number.isFinite(value)) return "$0.00";

    return value.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


function formatPrice(value) {

    if (value < 0.001) {

        return "$" + value.toFixed(8);

    }

    if (value < 1) {

        return "$" + value.toFixed(4);

    }

    return formatMoney(value);

}


/* =========================================================
   BUY
   ========================================================= */

function buy(symbol, amount) {

    symbol = symbol.toUpperCase();

    amount = Number(amount);

    if (!markets[symbol]) {

        alert("Asset not found.");

        return false;

    }

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Enter a valid amount.");

        return false;

    }

    const coin = markets[symbol];

    const cost = coin.price * amount;

    if (cost > account.balance) {

        alert("Not enough demo funds.");

        return false;

    }

    account.balance -= cost;


    if (!account.holdings[symbol]) {

        account.holdings[symbol] = {

            amount: 0,

            invested: 0

        };

    }


    account.holdings[symbol].amount += amount;

    account.holdings[symbol].invested += cost;


    account.transactions.push({

        type: "BUY",

        symbol,

        amount,

        price: coin.price,

        total: cost,

        timestamp: new Date().toLocaleString()

    });


    saveAccount();

    refreshEverything();

    showTradeMessage(
        `Bought ${amount} ${symbol} for ${formatMoney(cost)}`
    );

    return true;

}


/* =========================================================
   SELL
   ========================================================= */

function sell(symbol, amount) {

    symbol = symbol.toUpperCase();

    amount = Number(amount);

    if (!markets[symbol]) {

        alert("Asset not found.");

        return false;

    }

    const holding = account.holdings[symbol];

    if (!holding || holding.amount < amount) {

        alert("You don't own enough of this asset.");

        return false;

    }

    if (!Number.isFinite(amount) || amount <= 0) {

        alert("Enter a valid amount.");

        return false;

    }


    const coin = markets[symbol];

    const received = coin.price * amount;

    const averageCost =
        holding.invested / holding.amount;

    const pnl =
        (coin.price - averageCost) * amount;


    account.balance += received;

    holding.amount -= amount;

    holding.invested -=
        averageCost * amount;


    if (holding.amount <= 0.0000000001) {

        delete account.holdings[symbol];

    }


    account.transactions.push({

        type: "SELL",

        symbol,

        amount,

        price: coin.price,

        total: received,

        pnl,

        timestamp: new Date().toLocaleString()

    });


    saveAccount();

    refreshEverything();

    showTradeMessage(
        `Sold ${amount} ${symbol} • P&L ${formatMoney(pnl)}`
    );

    return true;

}


/* =========================================================
   FUNDS
   ========================================================= */

function openAddFunds() {

    const modal =
        document.getElementById("fundsModal");

    if (modal) {

        modal.classList.add("open");

    }

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.remove("open");

    }

}


function addFunds(amount) {

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {

        return;

    }

    account.balance += amount;

    saveAccount();

    refreshEverything();

    closeModal("fundsModal");

    showTradeMessage(
        `${formatMoney(amount)} demo funds added.`
    );

}


function addCustomFunds() {

    const input =
        document.getElementById("customFunds");

    if (!input) return;

    addFunds(input.value);

    input.value = "";

}


/* =========================================================
   RESET
   ========================================================= */

function resetKereos() {

    const confirmed =
        confirm(
            "Reset your entire Kereos demo account?"
        );

    if (!confirmed) return;

    account = {

        balance: DEFAULT_BALANCE,

        holdings: {},

        transactions: [],

        startingValue: DEFAULT_BALANCE,

        challenge: null

    };

    saveAccount();

    location.reload();

}


/* =========================================================
   MARKET CARDS
   ========================================================= */

function createCoinCard(symbol) {

    const coin = markets[symbol];

    const changeClass =
        coin.change >= 0
            ? "positive"
            : "negative";

    const changeSign =
        coin.change >= 0
            ? "+"
            : "";


    return `

        <div class="coin-card">

            <div class="coin-top">

                <div class="coin-icon">
                    ${coin.emoji}
                </div>

                <span class="${changeClass}">
                    ${changeSign}${coin.change.toFixed(2)}%
                </span>

            </div>

            <div class="coin-name">
                ${coin.name}
            </div>

            <div class="coin-symbol">
                ${coin.symbol}
            </div>

            <div class="coin-price">
                ${formatPrice(coin.price)}
            </div>

            <button
                class="coin-action"
                onclick="openQuickTrade('${symbol}','buy')">

                Trade ${symbol}

            </button>

        </div>

    `;

}


function renderDashboardMarkets() {

    const container =
        document.getElementById(
            "dashboardMarkets"
        );

    if (!container) return;

    const symbols =
        ["BTC","ETH","SOL","DOGE"];

    container.innerHTML =
        symbols
            .map(createCoinCard)
            .join("");

}


/* =========================================================
   MARKET PAGE
   ========================================================= */

function renderMarketsPage() {

    const container =
        document.getElementById(
            "fullMarketList"
        );

    if (!container) return;


    const search =
        document.getElementById(
            "marketSearch"
        )?.value
        .toLowerCase()
        .trim() || "";


    const symbols =
        Object.keys(markets)
        .filter(symbol => {

            const coin = markets[symbol];

            return (
                symbol.toLowerCase().includes(search) ||
                coin.name.toLowerCase().includes(search)
            );

        });


    container.innerHTML =
        symbols.map(symbol => {

            const coin = markets[symbol];

            const changeClass =
                coin.change >= 0
                    ? "positive"
                    : "negative";

            return `

                <div
                    class="market-row"
                    onclick="selectTradingAsset('${symbol}')">

                    <div class="market-asset">

                        <div class="market-asset-icon">
                            ${coin.emoji}
                        </div>

                        <div>

                            <strong>
                                ${coin.name}
                            </strong>

                            <div class="coin-symbol">
                                ${symbol}
                            </div>

                        </div>

                    </div>

                    <div>

                        <div class="market-row-price">
                            ${formatPrice(coin.price)}
                        </div>

                        <div class="${changeClass} market-row-change">
                            ${coin.change >= 0 ? "+" : ""}
                            ${coin.change.toFixed(2)}%
                        </div>

                    </div>

                    <button
                        class="coin-action"
                        onclick="event.stopPropagation(); openQuickTrade('${symbol}','buy')">

                        Trade

                    </button>

                </div>

            `;

        }).join("");

}


/* =========================================================
   MEME GRID
   ========================================================= */

function renderMemeGrid() {

    const container =
        document.getElementById("memeGrid");

    if (!container) return;

    const symbols =
        Object.keys(markets)
        .filter(symbol => markets[symbol].meme);


    container.innerHTML =
        symbols
            .map(createCoinCard)
            .join("");

}


/* =========================================================
   PORTFOLIO
   ========================================================= */

function renderPortfolio() {

    const container =
        document.getElementById(
            "portfolioHoldings"
        );

    if (!container) return;


    const symbols =
        Object.keys(account.holdings);


    if (symbols.length === 0) {

        container.innerHTML = `

            <div class="empty-state"
                 style="padding:30px">

                Your portfolio is empty.
                Visit Markets to make your first demo trade.

            </div>

        `;

        return;

    }


    container.innerHTML =
        symbols.map(symbol => {

            const holding =
                account.holdings[symbol];

            const coin =
                markets[symbol];

            const value =
                holding.amount *
                coin.price;

            const average =
                holding.invested /
                holding.amount;

            const pnl =
                (coin.price - average) *
                holding.amount;

            const pnlPercent =
                average > 0
                    ? ((coin.price - average) / average) * 100
                    : 0;


            const pnlClass =
                pnl >= 0
                    ? "positive"
                    : "negative";


            return `

                <div class="portfolio-row">

                    <div>
                        <strong>
                            ${coin.emoji} ${coin.name}
                        </strong>

                        <div class="coin-symbol">
                            ${symbol}
                        </div>
                    </div>

                    <div>
                        ${holding.amount.toFixed(6)}
                    </div>

                    <div>
                        ${formatMoney(value)}
                    </div>

                    <div class="${pnlClass}">

                        ${pnl >= 0 ? "+" : ""}
                        ${formatMoney(pnl)}

                        <small>
                            (${pnlPercent.toFixed(2)}%)
                        </small>

                    </div>

                </div>

            `;

        }).join("");


    updatePortfolioStats();

}


/* =========================================================
   PORTFOLIO STATS
   ========================================================= */

function updatePortfolioStats() {

    const total =
        totalValue();

    const invested =
        portfolioValue();

    const pnl =
        total - account.startingValue;

    const pnlPercent =
        account.startingValue > 0
            ? (pnl / account.startingValue) * 100
            : 0;


    setText(
        "portfolioTotal",
        formatMoney(total)
    );

    setText(
        "portfolioCash",
        formatMoney(account.balance)
    );

    setText(
        "portfolioInvested",
        formatMoney(invested)
    );

    setText(
        "positionCount",
        Object.keys(account.holdings).length
    );


    const pnlElement =
        document.getElementById("portfolioPnl");

    if (pnlElement) {

        pnlElement.className =
            "profit " +
            (pnl >= 0
                ? "positive"
                : "negative");

        pnlElement.textContent =
            `${pnl >= 0 ? "+" : ""}${formatMoney(pnl)}
             (${pnlPercent.toFixed(2)}%)`;

    }


    const trades =
        account.transactions;

    const sells =
        trades.filter(
            trade => trade.type === "SELL"
        );

    const wins =
        sells.filter(
            trade => Number(trade.pnl) > 0
        ).length;

    const losses =
        sells.filter(
            trade => Number(trade.pnl) <= 0
        ).length;

    const rate =
        sells.length
            ? (wins / sells.length) * 100
            : 0;


    setText("totalTrades", trades.length);

    setText("winningTrades", wins);

    setText("losingTrades", losses);

    setText(
        "portfolioWinRate",
        rate.toFixed(0) + "%"
    );

    setText(
        "winRate",
        rate.toFixed(0) + "%"
    );


    renderTransactions();

}


/* =========================================================
   TRANSACTIONS
   ========================================================= */

function renderTransactions() {

    const container =
        document.getElementById(
            "transactionHistory"
        );

    if (!container) return;


    const transactions =
        [...account.transactions]
        .reverse()
        .slice(0,8);


    if (transactions.length === 0) {

        container.innerHTML =
            `<div class="empty-state">
                No trades yet.
             </div>`;

        return;

    }


    container.innerHTML =
        transactions.map(trade => {

            const cls =
                trade.type === "BUY"
                    ? "positive"
                    : "negative";


            return `

                <div class="transaction">

                    <strong class="${cls}">
                        ${trade.type}
                        ${trade.symbol}
                    </strong>

                    <span>
                        ${formatMoney(trade.total)}
                    </span>

                    <small>
                        ${trade.timestamp}
                    </small>

                </div>

            `;

        }).join("");

}


/* =========================================================
   DASHBOARD PORTFOLIO
   ========================================================= */

function renderDashboardPortfolio() {

    const container =
        document.getElementById(
            "dashboardPortfolio"
        );

    if (!container) return;


    const symbols =
        Object.keys(account.holdings)
        .slice(0,4);


    if (!symbols.length) {

        container.innerHTML =
            `<div class="empty-state">
                No positions yet.
             </div>`;

        return;

    }


    container.innerHTML =
        symbols.map(symbol => {

            const holding =
                account.holdings[symbol];

            const coin =
                markets[symbol];

            const value =
                holding.amount *
                coin.price;


            return `

                <div class="transaction">

                    <strong>
                        ${coin.emoji} ${symbol}
                    </strong>

                    <span>
                        ${formatMoney(value)}
                    </span>

                </div>

            `;

        }).join("");

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {

    const total =
        totalValue();

    const pnl =
        total - account.startingValue;

    const percent =
        (pnl / account.startingValue) * 100;


    setText(
        "dashboardBalance",
        formatMoney(total)
    );

    setText(
        "availableCash",
        formatMoney(account.balance)
    );

    setText(
        "investedValue",
        formatMoney(portfolioValue())
    );

    const pnlElement =
        document.getElementById(
            "dashboardPnl"
        );

    if (pnlElement) {

        pnlElement.className =
            "profit " +
            (pnl >= 0
                ? "positive"
                : "negative");

        pnlElement.textContent =
            `${pnl >= 0 ? "+" : ""}${formatMoney(pnl)}
             (${percent.toFixed(2)}%)`;

    }


    setText(
        "todayPnl",
        `${pnl >= 0 ? "+" : ""}${formatMoney(pnl)}`
    );

}


/* =========================================================
   TRADING
   ========================================================= */

let selectedAsset = "BTC";

let tradeSide = "buy";


function selectTradingAsset(symbol) {

    selectedAsset = symbol;

    const coin =
        markets[symbol];

    setText(
        "tradeSymbol",
        `${symbol} / USD`
    );

    setText(
        "tradePrice",
        formatPrice(coin.price)
    );

    const change =
        document.getElementById(
            "tradeChange"
        );

    if (change) {

        change.className =
            coin.change >= 0
                ? "positive"
                : "negative";

        change.textContent =
            `${coin.change >= 0 ? "+" : ""}
             ${coin.change.toFixed(2)}%`;

    }

    updateTradeButton();

    drawChart();

}


function setTradeSide(side) {

    tradeSide = side;

    document
        .getElementById("buyTab")
        ?.classList.toggle(
            "selected",
            side === "buy"
        );

    document
        .getElementById("sellTab")
        ?.classList.toggle(
            "selected",
            side === "sell"
        );

    updateTradeButton();

}


function updateTradeButton() {

    const button =
        document.getElementById(
            "executeTrade"
        );

    if (!button) return;

    button.textContent =
        `${tradeSide === "buy" ? "Buy" : "Sell"} ${selectedAsset}`;

}


function executeCurrentTrade() {

    const input =
        document.getElementById(
            "tradeAmount"
        );

    if (!input) return;

    const amount =
        Number(input.value);

    const success =
        tradeSide === "buy"
            ? buy(selectedAsset, amount)
            : sell(selectedAsset, amount);


    if (success) {

        input.value = "";

        addOrderMarker(
            tradeSide,
            selectedAsset,
            markets[selectedAsset].price
        );

        drawChart();

    }

}


/* =========================================================
   QUICK TRADE
   ========================================================= */

function openQuickTrade(symbol, side) {

    selectedAsset = symbol;

    tradeSide = side;


    if (location.pathname.includes("markets.html")) {

        selectTradingAsset(symbol);

        setTradeSide(side);

        return;

    }


    const amountText =
        prompt(
            `${side.toUpperCase()} ${symbol}\n\n` +
            `Price: ${formatPrice(markets[symbol].price)}\n\n` +
            `Enter amount of ${symbol}:`
        );


    if (amountText === null) return;

    const amount =
        Number(amountText);


    if (side === "buy") {

        buy(symbol, amount);

    } else {

        sell(symbol, amount);

    }

}


/* =========================================================
   CHART
   ========================================================= */

let chartHistory = {};

let orderMarkers = [];


function generateHistory(symbol) {

    const coin =
        markets[symbol];

    let price =
        coin.price * 0.94;

    const points = [];

    for (let i = 0; i < 70; i++) {

        const movement =
            (Math.random() - .47) * .025;

        price *=
            1 + movement;

        points.push(price);

    }

    points.push(coin.price);

    return points;

}


function drawChart() {

    const canvas =
        document.getElementById(
            "priceChart"
        );

    if (!canvas) return;


    const ctx =
        canvas.getContext("2d");

    const rect =
        canvas.getBoundingClientRect();


    canvas.width =
        rect.width * devicePixelRatio;

    canvas.height =
        rect.height * devicePixelRatio;

    ctx.scale(
        devicePixelRatio,
        devicePixelRatio
    );


    const width =
        rect.width;

    const height =
        rect.height;


    if (!chartHistory[selectedAsset]) {

        chartHistory[selectedAsset] =
            generateHistory(
                selectedAsset
            );

    }


    const data =
        chartHistory[selectedAsset];


    const min =
        Math.min(...data);

    const max =
        Math.max(...data);

    const range =
        max - min || 1;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* GRID */

    ctx.strokeStyle =
        "rgba(255,255,255,.055)";

    ctx.lineWidth = 1;


    for (let i = 1; i < 5; i++) {

        const y =
            (height / 5) * i;

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(width,y);

        ctx.stroke();

    }


    /* PRICE LINE */

    ctx.beginPath();


    data.forEach((price,index) => {

        const x =
            (index / (data.length - 1))
            * width;

        const y =
            height -
            ((price - min) / range)
            * (height - 30) -
            15;


        if (index === 0) {

            ctx.moveTo(x,y);

        } else {

            ctx.lineTo(x,y);

        }

    });


    ctx.strokeStyle =
        "#8b6cff";

    ctx.lineWidth = 2;

    ctx.stroke();


    /* AREA */

    const gradient =
        ctx.createLinearGradient(
            0,0,0,height
        );

    gradient.addColorStop(
        0,
        "rgba(139,108,255,.22)"
    );

    gradient.addColorStop(
        1,
        "rgba(139,108,255,0)"
    );


    ctx.lineTo(
        width,
        height
    );

    ctx.lineTo(
        0,
        height
    );

    ctx.closePath();

    ctx.fillStyle =
        gradient;

    ctx.fill();


    /* ORDER MARKERS */

    orderMarkers
        .filter(
            marker =>
                marker.symbol ===
                selectedAsset
        )
        .forEach(marker => {

            const normalized =
                (marker.price - min)
                / range;

            const y =
                height -
                normalized *
                (height - 30) -
                15;


            ctx.beginPath();

            ctx.arc(
                width - 12,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                marker.side === "buy"
                    ? "#31e981"
                    : "#ff5572";

            ctx.fill();

        });

}


/* =========================================================
   ORDER MARKERS
   ========================================================= */

function addOrderMarker(
    side,
    symbol,
    price
) {

    orderMarkers.push({

        side,
        symbol,
        price

    });


    if (orderMarkers.length > 30) {

        orderMarkers.shift();

    }


    const container =
        document.getElementById(
            "orderMarkers"
        );

    if (container) {

        container.innerHTML = `

            <span class="${
                side === "buy"
                    ? "positive"
                    : "negative"
            }">

                ● ${side.toUpperCase()}
                ${symbol}
                @ ${formatPrice(price)}

            </span>

        `;

    }

}


/* =========================================================
   CHALLENGES
   ========================================================= */

const challenges = {

    starter: {

        name: "Double Up",

        start: 100,

        target: 200,

        duration: 24 * 60 * 60 * 1000

    },

    trader: {

        name: "Five Hundred",

        start: 500,

        target: 1000,

        duration: 3 * 24 * 60 * 60 * 1000

    },

    pro: {

        name: "Big League",

        start: 1000,

        target: 2500,

        duration: 7 * 24 * 60 * 60 * 1000

    },

    meme: {

        name: "Absolute Degenerate",

        start: 10000,

        target: 25000,

        duration: 24 * 60 * 60 * 1000

    }

};


function startChallenge(type) {

    const challenge =
        challenges[type];

    if (!challenge) return;


    account.challenge = {

        type,

        name: challenge.name,

        start: challenge.start,

        target: challenge.target,

        started:
            Date.now(),

        expires:
            Date.now() +
            challenge.duration

    };


    saveAccount();

    renderChallenge();

    showTradeMessage(
        `${challenge.name} challenge started.`
    );

}


function renderChallenge() {

    const container =
        document.getElementById(
            "activeChallenge"
        );

    if (!container) return;


    const challenge =
        account.challenge;


    if (!challenge) {

        container.innerHTML =
            `<div class="empty-state">
                No active challenge.
             </div>`;

        return;

    }


    const current =
        totalValue();

    const progress =
        Math.min(
            100,
            Math.max(
                0,
                ((current - challenge.start) /
                (challenge.target - challenge.start))
                * 100
            )
        );


    container.innerHTML = `

        <div>

            <h3>
                ${challenge.name}
            </h3>

            <p class="muted">
                Target:
                ${formatMoney(challenge.target)}
            </p>

            <div class="progress-bar">

                <div style="width:${progress}%"></div>

            </div>

            <div class="challenge-row">

                <span>
                    Current:
                    ${formatMoney(current)}
                </span>

                <strong>
                    ${progress.toFixed(0)}%
                </strong>

            </div>

        </div>

    `;

}


/* =========================================================
   CHALLENGE DASHBOARD
   ========================================================= */

function updateChallengePreview() {

    const challenge =
        account.challenge;


    if (!challenge) {

        setText(
            "challengeCurrent",
            "$100"
        );

        const bar =
            document.getElementById(
                "challengeProgress"
            );

        if (bar) bar.style.width = "0%";

        return;

    }


    const current =
        totalValue();


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                ((current - challenge.start) /
                (challenge.target - challenge.start))
                * 100
            )
        );


    setText(
        "challengeCurrent",
        formatMoney(current)
    );


    const bar =
        document.getElementById(
            "challengeProgress"
        );

    if (bar) {

        bar.style.width =
            progress + "%";

    }

}


/* =========================================================
   SIMULATED LIVE MARKET
   ========================================================= */

function simulateMarket() {

    Object.keys(markets)
        .forEach(symbol => {

            const coin =
                markets[symbol];

            const volatility =
                coin.meme
                    ? 0.025
                    : 0.008;


            const movement =
                (Math.random() - .5)
                * volatility;


            coin.price *=
                1 + movement;


            coin.change +=
                movement * 100;


            coin.change =
                Math.max(
                    -99,
                    Math.min(
                        999,
                        coin.change
                    )
                );

        });


    refreshEverything();

    if (
        document.getElementById(
            "priceChart"
        )
    ) {

        chartHistory[selectedAsset] =
            chartHistory[selectedAsset] ||
            generateHistory(selectedAsset);


        chartHistory[selectedAsset].shift();

        chartHistory[selectedAsset].push(
            markets[selectedAsset].price
        );


        selectTradingAsset(
            selectedAsset
        );

    }

}


/* =========================================================
   REFRESH
   ========================================================= */

function refreshEverything() {

    updateDashboard();

    renderDashboardMarkets();

    renderDashboardPortfolio();

    renderMarketsPage();

    renderMemeGrid();

    renderPortfolio();

    renderChallenge();

    updateChallengePreview();

}


/* =========================================================
   HELPERS
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


function showTradeMessage(message) {

    let toast =
        document.getElementById(
            "kereosToast"
        );


    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "kereosToast";

        toast.style.position =
            "fixed";

        toast.style.bottom =
            "25px";

        toast.style.right =
            "25px";

        toast.style.zIndex =
            "100";

        toast.style.padding =
            "14px 18px";

        toast.style.background =
            "#111722";

        toast.style.border =
            "1px solid rgba(255,255,255,.12)";

        toast.style.borderRadius =
            "10px";

        toast.style.color =
            "#fff";

        toast.style.fontSize =
            "12px";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;

    toast.style.opacity =
        "1";


    setTimeout(() => {

        toast.style.opacity =
            "0";

    }, 2500);

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAccount();

        refreshEverything();

        selectTradingAsset(
            selectedAsset
        );

    }
);


/* =========================================================
   LIVE SIMULATION
   ========================================================= */

setInterval(
    simulateMarket,
    5000
);
```
