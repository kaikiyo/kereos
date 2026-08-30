let chart = null;
let candleSeries = null;
let currentChartSymbol = null;

function createChart() {

  const container = document.getElementById("chart");

  if (!container || typeof LightweightCharts === "undefined") {
    console.error("Chart container or Lightweight Charts unavailable.");
    return;
  }

  chart = LightweightCharts.createChart(container, {
    layout: {
      background: {
        color: "#0d1118"
      },
      textColor: "#8b95a7"
    },

    grid: {
      vertLines: {
        color: "#151b24"
      },
      horzLines: {
        color: "#151b24"
      }
    },

    rightPriceScale: {
      borderColor: "#202733"
    },

    timeScale: {
      borderColor: "#202733",
      timeVisible: true
    },

    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal
    },

    width: container.clientWidth,
    height: 480
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: "#20d98b",
    downColor: "#ff5c70",
    borderVisible: false,
    wickUpColor: "#20d98b",
    wickDownColor: "#ff5c70"
  });

  window.addEventListener("resize", () => {

    if (!chart) return;

    chart.applyOptions({
      width: container.clientWidth
    });

  });

  updateChart(getSelectedCoin());
}

function updateChart(symbol) {

  if (!candleSeries) return;

  currentChartSymbol = symbol;

  const history = getHistory(symbol);

  if (!history.length) return;

  const candles = history.map(candle => ({
    time: candle.time,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close
  }));

  candleSeries.setData(candles);

  addTradeMarkers(symbol);

  chart.timeScale().fitContent();
}

function addTradeMarkers(symbol) {

  if (!candleSeries) return;

  const trades = getTrades()
    .filter(trade => trade.symbol === symbol)
    .map(trade => {

      const history = getHistory(symbol);

      let nearest = history.reduce(
        (best, candle) => {

          if (
            !best ||
            Math.abs(candle.time - trade.timestamp)
              <
            Math.abs(best.time - trade.timestamp)
          ) {
            return candle;
          }

          return best;
        },
        null
      );

      return {
        time: nearest
          ? nearest.time
          : Math.floor(trade.timestamp),

        position:
          trade.side === "BUY"
            ? "belowBar"
            : "aboveBar",

        color:
          trade.side === "BUY"
            ? "#20d98b"
            : "#ff5c70",

        shape:
          trade.side === "BUY"
            ? "arrowUp"
            : "arrowDown",

        text:
          trade.side === "BUY"
            ? "BUY"
            : "SELL"
      };
    });

  candleSeries.setMarkers(markers);
}

function refreshChart() {

  if (!currentChartSymbol) return;

  updateChart(currentChartSymbol);
}
