function addTradeMarkers(symbol) {

  if (!candleSeries) return;

  const markers = getTrades()
    .filter(trade => trade.symbol === symbol)
    .map(trade => {

      const history = getHistory(symbol);

      const nearest = history.reduce(
        (best, candle) => {

          if (
            !best ||
            Math.abs(candle.time - trade.timestamp) <
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
