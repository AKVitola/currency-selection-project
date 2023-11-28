<script setup>
import { ref } from 'vue'
import { items } from '@/assets/currencies.json'

const availableCurrencies = ref(items)
const selectedCurrencies = ref([])

function toggleCurrencySelection(code) {
  const index = selectedCurrencies.value.indexOf(code)

  if (index === -1) {
    selectedCurrencies.value.push(code)
  } else {
    selectedCurrencies.value.splice(index, 1)
  }
}

function removeCurrencyCodeFromSelected(code) {
  const index = selectedCurrencies.value.indexOf(code)

  if (index !== -1) {
    selectedCurrencies.value.splice(index, 1)

    const correspondingCurrency = availableCurrencies.value.find((item) => item.code === code)
    if (correspondingCurrency) correspondingCurrency.selected = false
  }
}
</script>

<template>
  <div class="app">
    <div class="selected-currency-wrapper grid" data-cy="selected-currency-wrapper">
      <div v-for="selectedCurrencyCode in selectedCurrencies" :key="selectedCurrencyCode" data-cy="selected-currency">
        <div class="selected-currency-code grid-item">
          {{ selectedCurrencyCode }}

          <div
            @click="removeCurrencyCodeFromSelected(selectedCurrencyCode)"
            class="remove-currency-button"
            data-cy="remove-currency-button"
          >
            <span class="remove-icon">X</span>
          </div>
        </div>
      </div>
    </div>

    <div class="available-currency-wrapper grid" data-cy="available-currency-wrapper">
      <div v-for="currency in availableCurrencies" :key="currency.id" data-cy="available-currency">
        <div class="currency-item grid-item" :class="{ 'currency-is-selected': currency.selected }" data-cy="available-currency-item">
          <input
            class="currency-item-checkbox visually-hidden"
            type="checkbox"
            :id="currency.code"
            v-model="currency.selected"
            @change="toggleCurrencySelection(currency.code)"
            data-cy="currency-checkbox"
          />
          <label
            class="currency-code custom-checkbox"
            :class="{ checked: currency.selected }"
            :for="currency.code"
            data-cy="currency-label"
          >
            <span class="custom-checkbox-icon" />
            {{ currency.code }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
