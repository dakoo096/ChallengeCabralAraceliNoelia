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

Cypress.Commands.add("AgregarTodosLosProd",()=>{
   //a traves de un bucle agregamos todos los productos del carrito si es que ya no estan agregados
   cy.get(".inventory_item").each(($product) => {
    cy.wrap($product)
      .find(".btn_inventory")
      .then(($btn) => {
        const buttonText = $btn.text().trim();
        if (buttonText === "Add to cart") {//si el texto del boton es Add to cart se agrega,si es remove no hace nada
          cy.wrap($btn).click(); 
        }
      });
  });
})


Cypress.Commands.add("elimitaryVerificarCarrito",()=>{
  //tomamos todos los productos del carrito y los eliminamos
  cy.get(".cart_item").each(($product) => {
    cy.wrap($product).find(".btn").contains('Remove').click();
  });
  //comprobamos con un bucle que se pueda hacer clic en el boton remove de los productos y verificamos que no quede nada en el carrito
  cy.get(".cart_list").then((cartList) => {
    if (!cartList.find(".cart_item").length) {//si no encuentra ninguna lista,va a devolver un mensaje por consola,y si no va a avisar que quedan productos dentro
      cy.log("El carrito de compras está vacío.");
    } else {
      throw new Error("El carrito sigue con productos.");
    }
  });
  
})
