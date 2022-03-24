const API_KEY =
  "3294f8fd72a5910e9986cb28429003066e5c9bdae06c6f22e87785f980270642";

//TODO: refactor to use URLSearchParams
export const loadTickers = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers.join(
      ","
    )}&api_key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((rawData) =>
      Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, 1 / value])
      )
    );
