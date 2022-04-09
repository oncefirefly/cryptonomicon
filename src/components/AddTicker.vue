<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keyup.enter.exact="addTicker"
            @keydown.exact="removeWarning"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-if="ticker"
          class="flex bg-white p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="coin in autoCompleteList"
            :key="coin"
            @click="ticker = coin.toString()"
            @click.exact="addTicker"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ coin.toString() }}
          </span>
        </div>
        <div v-if="isAlreadyAdded" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
        <div v-if="noSuchCoinInList" class="text-sm text-red-600">
          Такого тикера не существует
        </div>
      </div>
    </div>
    <button
      @click="addTicker"
      type="button"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      <!-- Heroicon name: solid/mail -->
      <svg
        class="-ml-0.5 mr-2 h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="#ffffff"
      >
        <path
          d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        ></path>
      </svg>
      Добавить
    </button>
  </section>
</template>

<script>
export default {
  props: {
    coinsList: {
      type: Array,
      required: true,
      default: null,
    },

    alreadyAdded: {
      type: Boolean,
      required: true,
      default: false,
    },

    tickers: {
      type: Array,
      required: true,
      default: null,
    },
  },

  emits: {
    "add-ticker": (value) => typeof value === "string",
  },

  data() {
    return {
      ticker: "",

      isAlreadyAdded: false,
      noSuchCoinInList: false,
    };
  },

  methods: {
    addTicker() {
      if (this.ticker.length === 0) {
        return;
      }

      this.isInCoinsList(this.ticker);

      if (this.noSuchCoinInList === false) {
        if (this.tickers.length) {
          const existingTicker = this.tickers.filter(
            (t) => t.name === this.ticker.toUpperCase()
          );

          if (existingTicker.length) {
            this.isAlreadyAdded = true;
          } else {
            this.isAlreadyAdded = false;

            this.$emit("add-ticker", this.ticker);
            this.ticker = "";
          }
        } else {
          this.$emit("add-ticker", this.ticker);
          this.ticker = "";
        }
      }
    },

    isInCoinsList(tickerToCheck) {
      const checkedTicker = this.coinsList.filter(
        (coin) =>
          tickerToCheck.toUpperCase() === coin.FullName ||
          tickerToCheck.toUpperCase() === coin.Symbol
      );

      if (checkedTicker.length) {
        this.noSuchCoinInList = false;
      } else this.noSuchCoinInList = true;
    },

    removeWarning() {
      this.isAlreadyAdded = false;
      this.noSuchCoinInList = false;
    },
  },

  computed: {
    autoCompleteList() {
      const autoCompleteArray = this.coinsList.filter((coin) =>
        coin.Symbol.includes(this.ticker.toUpperCase())
      );

      return autoCompleteArray.map((coin) => coin.Symbol).slice(0, 4);
    },
  },
};
</script>
