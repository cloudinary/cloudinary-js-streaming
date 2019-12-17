const {expect} = require('chai');
const {options} = require('./initOptions');
const isDebug = false;

describe('Live Stream SDK', async () => {
    it(`initLiveStream`, async () => {
      // Create new page
      page = await browser.newPage();

      // Print page's console events
      if (isDebug) {
        page.on('console', consoleMessage => console.log(consoleMessage.text()));
      }

      // Load test/index.html
      await page.goto('http://localhost:8080');

      // Try to initialize live streaming inside the loaded page
      // options is exposed to the page scope by passing it as parameter to the page.evaluate()
      let actual = await page.evaluate(async options => {
        // initLiveStream is exported as default on the cloudinaryLiveStream library
        const initLiveStream = cloudinaryLiveStream.default;
        try {
          await initLiveStream(options);
          return "initialized";
        }
        catch (e) {
          return "error";
        }
      }, options);

      expect(actual).to.equal("initialized");
    });
});



