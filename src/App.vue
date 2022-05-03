<template>
  <div class="container mx-auto flex flex-col items-center bg-white-100 p-4">
    <div
      v-if="loadingCircle"
      class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div class="container">
      <add-ticker
        @add-ticker="addTicker"
        :coinsList="coinsList"
        :alreadyAdded="alreadyAdded"
        :tickers="tickers"
      />
      <my-tickers
        @select-ticker="select"
        @delete-ticker="deleteTicker"
        :tickers="tickers"
        :selectedTicker="selectedTicker"
      />
      <ticker-graph
        @close-graph="closeGraph"
        @update-graph="updateGraph"
        :selectedTicker="selectedTicker"
        :graph="graph"
      />
    </div>
  </div>
</template>

<script>
import { loadCoinsList, subscribeToTicker, unsubFromTicker } from "./api";
import AddTicker from "./components/AddTicker.vue";
import TickerGraph from "./components/TickerGraph.vue";
import MyTickers from "./components/MyTickers.vue";

export default {
  name: "App",

  components: {
    AddTicker,
    TickerGraph,
    MyTickers,
  },

  data() {
    return {
      tickers: [],
      selectedTicker: null,

      graph: [],

      coinsList: [],
      alreadyAdded: false,
      coinInList: false,

      loadingCircle: true,
    };
  },

  beforeCreate: async function () {
    const coinsData = await loadCoinsList();

    this.coinsList = coinsData;
  },

  created: function () {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      this.page = windowData.page;
    }

    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) =>
          this.updateTicker(ticker.name, newPrice)
        );
      });
    }
  },

  methods: {
    updateTicker(tickerName, price) {
      this.tickers
        .filter((ticker) => ticker.name === tickerName)
        .forEach((ticker) => {
          if (ticker === this.selectedTicker) {
            this.graph.push(price);
          }
          ticker.price = price;
        });
    },

    addTicker(ticker) {
      const newTicker = {
        name: ticker.toUpperCase(),
        price: "-",
      };

      this.tickers = [...this.tickers, newTicker];

      subscribeToTicker(newTicker.name, (newPrice) =>
        this.updateTicker(newTicker.name, newPrice)
      );

      this.filter = "";
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    deleteTicker(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);

      unsubFromTicker(tickerToRemove.name);
    },

    updateGraph(maxGraphElements) {
      this.graph = this.graph.slice(-maxGraphElements);
    },

    closeGraph() {
      this.selectedTicker = null;
    },
  },

  watch: {
    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },

    selectedTicker() {
      this.graph = [];
    },

    coinsList() {
      this.loadingCircle = false;
    },
  },
};
</script>
