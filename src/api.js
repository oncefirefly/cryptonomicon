const API_KEY =
  "3294f8fd72a5910e9986cb28429003066e5c9bdae06c6f22e87785f980270642";

const AGGREGATE_INDEX = "5";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (event) => {
  const {
    TYPE: type,
    FROMSYMBOL: currecy,
    PRICE: newPrice,
  } = JSON.parse(event.data);

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currecy) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

function unsubToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, callback) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, callback]);
  subToTickerOnWs(ticker);
};

export const unsubFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubToTickerOnWs(ticker);
};

export const loadCoinsList = () =>
  fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
    .then((response) => response.json())
    .then((coinsData) => Object.values(coinsData.Data));
