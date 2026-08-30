const STORAGE_KEY = "kereos_demo_account_v2";

const defaultAccount = {
  balance: 10000,
  positions: {},
  trades: [],
  selectedCoin: "PEPE"
};

function loadAccount() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(defaultAccount);
    }

    const account = JSON.parse(saved);

    return {
      ...structuredClone(defaultAccount),
      ...account,
      positions: account.positions || {},
      trades: account.trades || []
    };

  } catch (error) {
    console.error("Could not load account:", error);
    return structuredClone(defaultAccount);
  }
}

let account = loadAccount();

function saveAccount() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
}

function resetAccount() {
  account = structuredClone(defaultAccount);
  saveAccount();
  location.reload();
}

function getBalance() {
  return account.balance;
}

function setBalance(value) {
  account.balance = Math.max(0, Number(value));
  saveAccount();
}

function getPosition(symbol) {
  return account.positions[symbol] || null;
}

function getAllPositions() {
  return Object.values(account.positions);
}

function savePosition(position) {
  account.positions[position.symbol] = position;
  saveAccount();
}

function removePosition(symbol) {
  delete account.positions[symbol];
  saveAccount();
}

function addTrade(trade) {
  account.trades.unshift(trade);

  if (account.trades.length > 100) {
    account.trades = account.trades.slice(0, 100);
  }

  saveAccount();
}

function getTrades() {
  return account.trades;
}

function setSelectedCoin(symbol) {
  account.selectedCoin = symbol;
  saveAccount();
}

function getSelectedCoin() {
  return account.selectedCoin;
}
