const API_KEY =
  "3294f8fd72a5910e9986cb28429003066e5c9bdae06c6f22e87785f980270642";

const tickersHandlers = new Map();

//TODO: refactor to use URLSearchParams
const loadTickers = () => {
  if (tickersHandlers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
      ...tickersHandlers.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((tickersData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(tickersData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, callback) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, callback]);
};

export const unsubFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

export const loadCoinsList = () =>
  fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
    .then((response) => response.json())
    .then((coinsData) => Object.values(coinsData.Data));

setInterval(loadTickers, 5000);
