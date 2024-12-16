//se dio formato al documento con plugin prettier

describe(
  "Test Challenge con usuario 1,independientemente de si se encuentran productos en el carrito",
  { testIsolation: false },
  () => {
    //iniciamos la pagina y verificamos el titulo
    it("Verificar titulo de la pagina", () => {
      cy.visit("https://www.saucedemo.com");
      cy.title().should("eq", "Swag Labs");
    });
    //iniciamos sesion con el usuario de prueba 1
    it("Iniciar sesion", () => {
      cy.Login("standard_user", "secret_sauce");
    });

    //creamos un bucle para recoger todos los productos y agregarlos al carrito
    it("Agregar los productos al carrito", () => {
      cy.AgregarProductos();
    });

    it("comprobar que todos los productos se agregen al carrito", () => {
      cy.ComprobarProductos();
    });

    //ingresamos al carrito de compras
    it("corroborar carrito de compras", () => {
      cy.get("#shopping_cart_container").click();
    });

    //confirmamos el checkout de productos independientemente de si tiene o no productos agregados
    it("checkout de productos", () => {
      cy.get('[data-test="checkout"]').click();
      cy.CompletarForm("Diego", "Bob", "5220");
      cy.get("#finish").click();
    });

    it("corroboramos que el checkout se haya realizado correctamente", () => {
      cy.get("h2").contains("Thank you for your order!");
    });

    it("volvemos al home para deslogear y hacemos logout", () => {
      cy.VolverHome();
      cy.Logout();
    });
  }
);

describe(
  "Test Challenge con usuario 1,comprobando si el carrito tiene productos para poder realizar correctamente la compra",
  { testIsolation: false },
  () => {
    //iniciamos sesion con el usuario de prueba 1
    it("Iniciar sesion", () => {
      cy.Login("standard_user", "secret_sauce");
    });

    //ingresamos al carrito de compras
    it("corroborar carrito de compras", () => {
      cy.get("#shopping_cart_container").click();

      // Comprobar si hay productos en el carrito
      cy.get(".cart_list").then((cartList) => {
        if (!cartList.find(".cart_item").length) {
          // como no encuentra nada,lo redirige para agregarlos y volvemos al carrito
          cy.VolverHome();
          //comando para agregar productos
          cy.AgregarProductos();
          //comprobamos que se agregaron
          cy.ComprobarProductos();
          //volvemos al carrito
          cy.get("#shopping_cart_container").click();
          //realizamos el checkout
          cy.get('[data-test="checkout"]').click();
        } else {
          // Si hay productos, seguimos con el checkout
          cy.get('[data-test="checkout"]').click();
        }
      });
    });
    //idem pasos al describe anterior
    it("completamos formulario luego de verificar los productos en carrito", () => {
      cy.CompletarForm("Noelia", "Cabral", "5220");
    });

    it("damos finish y corroboramos que el checkout se haya realizado correctamente", () => {
      cy.get("#finish").click();
      cy.get("h2").contains("Thank you for your order!");
    });

    it("volvemos al home para deslogear y hacemos logout", () => {
      cy.get('button[name="back-to-products"]').click();
      cy.Logout();
    });
  }
);

describe(
  "Test Challenge con usuario 2,comprobando si el carrito tiene productos para poder realizar correctamente la compra",
  { testIsolation: false },
  () => {
    //iniciamos sesion con el usuario de prueba 2 (se cambio formas de obtener el elemento para variar)
    it("Iniciar sesion", () => {
      cy.Login("problem_user", "secret_sauce");
    });

    //recoge todos los productos y los agrega al carrito
    //error: no se pueden agregar todos los productos al carrito
    it("Agregar los productos al carrito en user 2", () => {
      cy.get(".inventory_item").each(($product, index, $list) => {
        cy.wrap($product).find(".btn_inventory").click();
      });
    });

    //comprobamos que todos los elementos se hayan agregado,al no agregarse todos,la prueba tira error./
    it("comprobar que todos los productos se agregen al carrito", () => {
      cy.ComprobarProductos();
    });

    //ingresamos al carrito de compras
    it("corroborar carrito de compras", () => {
      cy.get("#shopping_cart_container").click();
    });
    //hacemos checkout
    it("checkout de productos", () => {
      cy.get('button[name="checkout"]').click();
    });
    //confirmamos el checkout de productos independientemente de si tiene o no productos agregados
    it("completar formulario de checkout para enviar", () => {
      cy.CompletarForm("Galio", "Dog", "5220");
      cy.get("#finish").click();
    });

    it("Comprobar si hay un error al enviar el formulario", () => {
      cy.get("h3").contains("Error").should("be.visible");
    });

    it("deslogeamos", () => {
      cy.Logout();
    });
  }
);

describe(
  "Test Challenge con usuario 1,pruebas adicionales",
  { testIsolation: false },
  () => {
    it("Iniciar sesion con usuario y contraseña incorrecto", () => {
      cy.Login("standard_user1", "secret_sauce1");
      cy.get("h3").contains(
        "Username and password do not match any user in this service"
      );
    });
    it("Ingresamos nuevamente a usuario 1", () => {
      cy.get('input[name="user-name"]').clear(); //limpiamos el login
      cy.get('input[name="password"]').clear(); //limpiamos el login
      cy.Login("standard_user", "secret_sauce");
    });
    //comprobamos filtro de la A a la Z
    it("Comprobar filtro de la A a la Z", () => {
      cy.get("select").select("Name (A to Z)");
      cy.verificarOrdenProductos("asc");
    });

    //Comprobamos filtro de la Z a la A
    it("Comprobar filtro de la Z a la A", () => {
      cy.get("select").select("Name (Z to A)");
      cy.verificarOrdenProductos("desc");
    });

    //Comprobamos filtro de mayor precio a menor
    it("Comprobar filtro orden de mayor precio a menor", () => {
      cy.get("select").select("Price (high to low)");
      // Obtener los precios de los productos
      cy.get(".inventory_item_price").then(($precios) => {
        //bucle
        const precios = $precios //creamos la constante para almacenar los precios
          .map((i, el) => {
            //recorremos cada elemento y aplicamos un mapeo
            const texto = Cypress.$(el)
              .text()
              .replace(/[^\d.]/g, ""); //extraemos el precio y limpiamos el signo $
            return parseFloat(texto); //devolvemos solo el precio en numero flotante
          })
          .get(); //devolvemos el resultado en un array
        expect(precios).to.deep.equal([...precios].sort((a, b) => b - a)); //comparamos los precios con una version ordenada para verificar el filtro
      });
    });
    //Comprobamos filtro de menor precio a mayor
    it("Comprobar filtro orden de menor precio a mayor", () => {
      cy.get("select").select("Price (low to high)");
      cy.get(".inventory_item_price").then(($precios) => {
        const precios = $precios
          .map((i, el) => {
            const texto = Cypress.$(el)
              .text()
              .replace(/[^\d.]/g, "");
            return parseFloat(texto);
          })
          .get();
        expect(precios).to.deep.equal([...precios].sort((a, b) => a - b)); //comparamos los precios con una version ordenada pero al reves
      });
    });

    it("Comprobar en carrito que todos los productos se puedan eliminar correctamente", () => {
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
      cy.get("#shopping_cart_container").click();//voy al carrito

      //comprobamos con un bucle que se pueda hacer clic en el boton remove de los productos y verificamos que no quede nada en el carrito
      cy.get(".cart_item").each(($product) => {
        cy.wrap($product).find(".btn").contains('Remove').click();
      });
      cy.get(".cart_list").then((cartList) => {
        if (!cartList.find(".cart_item").length) {//si no encuentra ninguna lista,va a devolver un mensaje por consola,y si no va a avisar que quedan productos dentro
          cy.log("El carrito de compras está vacío.");
        } else {
          throw new Error("El carrito sigue con productos.");
        }
      });
    });

    it('corroborar link twitter',()=>{
      cy.get('[data-test="social-twitter"]')
      .should('have.attr', 'href', 'https://twitter.com/saucelabs');//corroboramos que el enlace vaya a la ruta especificada sin necesidad de salir de la pag
    })

    it('corroborar link facebook',()=>{
      cy.get('[data-test="social-facebook"]')
      .should('have.attr', 'href', 'https://www.facebook.com/saucelabs');//corroboramos que el enlace vaya a la ruta especificada sin necesidad de salir de la pag
    })

    it('corroborar link linkedIn',()=>{
      cy.get('[data-test="social-linkedin"]')
      .should('have.attr', 'href', 'https://www.linkedin.com/company/sauce-labs/');//corroboramos que el enlace vaya a la ruta especificada sin necesidad de salir de la pag
    })
  }
  
);
