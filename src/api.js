const API_KEY =
  "3294f8fd72a5910e9986cb28429003066e5c9bdae06c6f22e87785f980270642";

//TODO: refactor to use URLSearchParams
export const loadTicker = (tickerName) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=${API_KEY}`
  ).then((response) => response.json());
