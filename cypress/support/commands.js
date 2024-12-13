Cypress.Commands.add("Login", (username, password) => {
  cy.get("#user-name").type(username);
  cy.get("#password").type(password);
  cy.get("#login-button").click();
});

Cypress.Commands.add("Logout", () => {
  cy.get("#react-burger-menu-btn").click();
  cy.get("a").contains("Logout").click();
});

Cypress.Commands.add("VolverHome", () => {
  cy.get("#react-burger-menu-btn").click();
  cy.get("a").contains("All Items").click();
});

Cypress.Commands.add("AgregarProductos", () => {
  cy.get(".inventory_item").each(($product, index, $list) => {
    cy.wrap($product).find(".btn_inventory").click();
  });
});

Cypress.Commands.add("ComprobarProductos", () => {
  cy.get(".inventory_item").each(($product, index, $list) => {
    cy.wrap($product).find(".btn_inventory").contains("Remove");
  });
});

Cypress.Commands.add("CompletarForm", (firstName, lastName, postalCode) => {
  cy.get("#first-name").type(firstName);
  cy.get("#last-name").type(lastName);
  cy.get("#postal-code").type(postalCode);
  cy.get('input[name="continue"]').click();
});

Cypress.Commands.add("verificarOrdenProductos", (orden) => {
  // Seleccionamos los productos a traves de un bucle y los guardamos en una constante
  cy.get(".inventory_item_name").then(($productos) => {
    const nombres = $productos.map((i, el) => Cypress.$(el).text()).get();
    //creamos un condicional para que al llamar asc o desc nos indique si estan ordenados
    if (orden === "asc") {
      expect(nombres).to.deep.equal([...nombres].sort());
    } else if (orden === "desc") {
      expect(nombres).to.deep.equal([...nombres].sort().reverse());
    }
  });
});
