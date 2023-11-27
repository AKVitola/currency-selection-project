import { mount } from '@vue/test-utils'
import CurrencySelectionApp from '@/CurrencySelectionApp.vue'

describe('CurrencySelectionApp', () => {
  describe('Initial state tests', () => {
    it('selectedCurrencies initially is an empty array', () => {
      const wrapper = mount(CurrencySelectionApp)
      expect(wrapper.vm.selectedCurrencies).toEqual([])
    })

    it('ensures all currencies in availableCurrencies have selected property set to false initially', () => {
      const wrapper = mount(CurrencySelectionApp)
      const availableCurrencies = wrapper.vm.availableCurrencies

      availableCurrencies.forEach((currency) => {
        expect(currency.selected).toBe(false)
      })
    })
  })

  describe('Rendering and styling tests', () => {
    it('renders correct number of selected and available currencies', async () => {
      const mockedAvailableCurrencies = [
        { code: 'EUR', selected: true },
        { code: 'PLN', selected: true },
        { code: 'GEL', selected: false }
      ]

      const mockedSelectedCurrencies = [
        { code: 'DKK', selected: true },
        { code: 'CZK', selected: true }
      ]

      const wrapper = mount(CurrencySelectionApp)
      wrapper.vm.availableCurrencies = mockedAvailableCurrencies
      wrapper.vm.selectedCurrencies = mockedSelectedCurrencies

      await wrapper.vm.$nextTick()

      const availableCurrencies = wrapper.findAll('.currency-item')
      const selectedCurrencies = wrapper.findAll('.selected-currency-code')

      expect(availableCurrencies.length).toBe(3)
      expect(selectedCurrencies.length).toBe(2)
    })

    it('applies styling classes based on the selected state', async () => {
      const mockedCurrencies = [
        { code: 'EUR', selected: true },
        { code: 'PLN', selected: false }
      ]

      const wrapper = mount(CurrencySelectionApp)
      wrapper.vm.availableCurrencies = mockedCurrencies

      await wrapper.vm.$nextTick()

      const currencyItems = wrapper.findAll('.currency-item')
      currencyItems.forEach((currencyItem, index) => {
        const currency = mockedCurrencies[index]

        expect(currencyItem.classes('currency-is-selected')).toBe(currency.selected)
        expect(wrapper.find(`label[for="${currency.code}"]`).classes('checked')).toBe(
          currency.selected
        )
      })
    })

    it('associates checkboxes and labels correctly with each currency in available-currency-wrapper', async () => {
      const wrapper = mount(CurrencySelectionApp)
      const availableCurrencies = wrapper.vm.availableCurrencies

      await wrapper.vm.$nextTick()

      // Iterate through availableCurrencies and check each associated checkbox and label
      availableCurrencies.forEach((currency) => {
        const checkboxInput = wrapper.find(`input[type="checkbox"][id="${currency.code}"]`)
        const labelElement = wrapper.find(`label[for="${currency.code}"]`)

        expect(checkboxInput.exists()).toBe(true)
        expect(labelElement.exists()).toBe(true)
        expect(checkboxInput.element.checked).toBe(currency.selected)
        expect(labelElement.classes('checked')).toBe(currency.selected)
      })
    })
  })

  describe('Interaction tests', () => {
    it('toggles currency selection when checkbox/label is clicked and triggers toggleCurrencySelection method', async () => {
      const wrapper = mount(CurrencySelectionApp)
      const firstCurrency = wrapper.vm.availableCurrencies[0]
      const checkboxInput = wrapper.find('input[type="checkbox"]')

      // checking toggles selected status to true
      await checkboxInput.setChecked()
      expect(checkboxInput.element.checked).toBe(true)
      expect(wrapper.vm.availableCurrencies[0].selected).toBe(true)

      // toggleCurrencySelection method adds the currencie to selectedCurrencies
      expect(wrapper.vm.selectedCurrencies).toContain(firstCurrency.code)

      // checking toggles selected status to false
      await checkboxInput.setChecked(false)
      expect(checkboxInput.element.checked).toBe(false)
      expect(wrapper.vm.availableCurrencies[0].selected).toBe(false)

      // toggleCurrencySelection method removes the currencie from selectedCurrencies
      expect(wrapper.vm.selectedCurrencies).not.toContain(firstCurrency.code)
    })

    it('renders remove button and currency code for each selected currency', async () => {
      const mockedSelectedCurrencies = [
        { code: 'DKK', selected: true },
        { code: 'CZK', selected: true }
      ]

      const wrapper = mount(CurrencySelectionApp)
      wrapper.vm.selectedCurrencies = mockedSelectedCurrencies

      await wrapper.vm.$nextTick()

      mockedSelectedCurrencies.forEach((selectedCurrency) => {
        const correspondingSelectedCurrencyDiv = wrapper.find(
          `.selected-currency-code:contains("${selectedCurrency.code}") .remove-currency-button`
        )
        expect(correspondingSelectedCurrencyDiv.exists()).toBe(true)
      })
    })

    it('clicking on remove button triggers removeCurrencyCodeFromSelected method', async () => {
      const wrapper = mount(CurrencySelectionApp)
      const firstCurrency = wrapper.vm.availableCurrencies[0]

      await wrapper.vm.toggleCurrencySelection(firstCurrency.code)
      expect(wrapper.vm.selectedCurrencies).toContain(firstCurrency.code)

      const removeButton = wrapper.find('.remove-currency-button')
      await removeButton.trigger('click')

      // removeCurrencyCodeFromSelected removes currencie from selectedCurrencies
      expect(wrapper.vm.selectedCurrencies).not.toContain(firstCurrency.code)
      const correspondingCurrency = wrapper.vm.availableCurrencies.find(
        (item) => item.code === firstCurrency.code
      )
      // removeCurrencyCodeFromSelected sets the removed currencies selected status to false
      expect(correspondingCurrency.selected).toBe(false)
    })
  })
})
