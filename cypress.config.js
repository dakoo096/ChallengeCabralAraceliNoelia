const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  reporter: "cypress-mochawesome-reporter", // Definimos el reporte
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
    },
  },
  video: true, // Guardamos los videos
  screenshotOnRunFailure: true, // Guardar las capturas de pantallas de los tests que fallaron
  videosFolder: "cypress/videos", // Le decimos en que carpeta guardar los videos
  screenshotsFolder: "cypress/screenshots", // Le decimos en que carpeta guardar las capturas
  pageLoadTimeout: 10000, //aumenta el tiempo 10 seg
});
