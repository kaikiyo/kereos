const KEREOS_STORAGE_KEY = "kereos_demo_v4";

const DEFAULT_ACCOUNT = {
  balance: 10000,
  positions: {},
  trades: [],
  challenge: {
    active: false,
    startBalance: 100,
    target: 200,
    currentBalance: 100
  }
};

function cloneDefaultAccount() {
  return JSON.parse(JSON.stringify(DEFAULT_ACCOUNT));
}

function loadAccount() {
  try {
    const saved = localStorage.getItem(KEREOS_STORAGE_KEY);

    if (!saved) {
      return cloneDefaultAccount();
    }

    const parsed = JSON.parse(saved);

    return {
      ...cloneDefaultAccount(),
      ...parsed,
      positions: parsed.positions || {},
      trades: parsed.trades || {},
      challenge: {
        ...cloneDefaultAccount().challenge,
        ...(parsed.challenge || {})
      }
    };
  } catch (error) {
    console.error("Kereos storage error:", error);
    return cloneDefaultAccount();
  }
}

let account = loadAccount();

function saveAccount() {
  localStorage.setItem(
    KEREOS_STORAGE_KEY,
    JSON.stringify(account)
  );
}

function resetAccount() {
  account = cloneDefaultAccount();
  saveAccount();
}

function getBalance() {
  return Number(account.balance) || 0;
}

function setBalance(value) {
  account.balance = Math.max(0, Number(value) || 0);
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

  if (account.trades.length > 200) {
    account.trades.length = 200;
  }

  saveAccount();
}

function getTrades() {
  return Array.isArray(account.trades)
    ? account.trades
    : [];
}

function getChallenge() {
  return account.challenge;
}

function updateChallenge(data) {
  account.challenge = {
    ...account.challenge,
    ...data
  };

  saveAccount();
}
