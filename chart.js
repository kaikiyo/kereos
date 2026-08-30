let kereosChart = null;
let candleSeries = null;
let chartSymbol = null;

function initChart(symbol) {

  const container =
    document.getElementById("chart");

  if (!container) return;

  if (
    typeof LightweightCharts ===
    "undefined"
  ) {
    container.innerHTML = `
      <div class="chart-error">
        Chart library could not load.
        <br>
        Please check your internet connection.
      </div>
    `;
    return;
  }

  if (kereosChart) {
    kereosChart.remove();
  }

  chartSymbol = symbol;

  kereosChart =
    LightweightCharts.createChart(
      container,
      {
        width: container.clientWidth,
        height: container.clientHeight,

        layout: {
          background: {
            color: "#0c1017"
          },
          textColor: "#7f8a9c"
        },

        grid: {
          vertLines: {
            color: "#151b24"
          },
          horzLines: {
            color: "#151b24"
          }
        },

        crosshair: {
          mode: 0
        },

        rightPriceScale: {
          borderColor: "#202733"
        },

        timeScale: {
          borderColor: "#202733",
          timeVisible: true,
          secondsVisible: false
        }
      }
    );

  candleSeries =
    kereosChart.addCandlestickSeries({
      upColor: "#19d88a",
      downColor: "#ff5c70",
      borderVisible: false,
      wickUpColor: "#19d88a",
      wickDownColor: "#ff5c70"
    });

  renderChart(symbol);

  window.addEventListener(
    "resize",
    resizeChart
  );
}

function resizeChart() {

  if (!kereosChart) return;

  const container =
    document.getElementById("chart");

  if (!container) return;

  kereosChart.resize(
    container.clientWidth,
    container.clientHeight
  );
}

function renderChart(symbol) {

  if (!candleSeries) return;

  chartSymbol = symbol;

  const history =
    getHistory(symbol);

  if (!history.length) return;

  candleSeries.setData(
    history.map(candle => ({
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close
    }))
  );

  addTradeMarkers(symbol);

  kereosChart
    .timeScale()
    .fitContent();
}

function addTradeMarkers(symbol) {

  if (!candleSeries) return;

  const history =
    getHistory(symbol);

  const markers =
    getTrades()
      .filter(
        trade =>
          trade.symbol === symbol
      )
      .map(trade => {

        let nearest = null;

        history.forEach(candle => {

          if (
            !nearest ||
            Math.abs(
              candle.time -
              trade.timestamp
            ) <
            Math.abs(
              nearest.time -
              trade.timestamp
            )
          ) {
            nearest = candle;
          }
        });

        return {
          time: nearest
            ? nearest.time
            : Math.floor(
                trade.timestamp
              ),

          position:
            trade.side === "BUY"
              ? "belowBar"
              : "aboveBar",

          color:
            trade.side === "BUY"
              ? "#19d88a"
              : "#ff5c70",

          shape:
            trade.side === "BUY"
              ? "arrowUp"
              : "arrowDown",

          text: trade.side
        };
      });

  if (
    typeof candleSeries.setMarkers ===
    "function"
  ) {
    candleSeries.setMarkers(markers);
  }
}

function refreshChart() {

  if (chartSymbol) {
    renderChart(chartSymbol);
  }
}
