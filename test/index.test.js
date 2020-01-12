const {expect} = require('chai');
const {options} = require('./initOptions');

describe('Live Stream SDK', async () => {
    it(`initLiveStream`, async () => {
      // Create new page
      page = await browser.newPage();

      // Print page's console events
      page.on('console', consoleMessage => console.log(consoleMessage.text()));

      // Load test/index.html
      await page.goto('http://localhost:9880');

      // Try to initialize live streaming inside the loaded page
      // options is exposed to the page scope by passing it as parameter to the page.evaluate()
      let actual = await page.evaluate(async options => {
        // initLiveStream is exported as default on the cloudinaryLiveStream library
        let result, isResultOk;

        const {initLiveStream} = cloudinaryJsStreaming;
        try {
          result = await initLiveStream(options);
        }
        catch (e) {
          result = e;
        }

        isResultOk = result && result.response && result.response.public_id;
        return isResultOk ? "initialized" : result;
      }, options);

      expect(actual).to.equal("initialized");
    });
});



