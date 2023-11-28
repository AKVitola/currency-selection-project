describe('Currency Selection App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the selected currencies and allows removal', () => {
    cy.get(
      '[data-cy=currency-label]:contains("USD"), [data-cy=currency-label]:contains("EUR")'
    ).click({ multiple: true })
    cy.get('[data-cy=selected-currency]').should('have.length', 2)
    cy.get('[data-cy=selected-currency]').contains('USD')
    cy.get('[data-cy=selected-currency]').contains('EUR')

    cy.get('[data-cy=selected-currency]:contains("EUR") [data-cy=remove-currency-button]').click()
    cy.get('[data-cy=selected-currency]').should('have.length', 1)
    cy.get('[data-cy=selected-currency]').contains('USD')
  })

  
  it('toggles currency selection when available currency label/checkbox is clicked', () => {
    cy.get('[data-cy=currency-label]').last().click()
    cy.get('[data-cy=selected-currency]').should('have.length', 1)
    cy.get('[data-cy=currency-label]').last().should('have.class', 'checked')
    cy.get('[data-cy=available-currency-item]').last().should('have.class', 'currency-is-selected')

    cy.get('[data-cy=currency-label]').last().click()
    cy.get('[data-cy=selected-currency]').should('not.exist')
    cy.get('[data-cy=currency-label]').last().should('not.have.class', 'checked')
    cy.get('[data-cy=available-currency-item]')
      .last()
      .should('not.have.class', 'currency-is-selected')
  })
})
