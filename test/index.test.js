const {expect} = require('chai');
const {options} = require('./initOptions');

const printErrors = async msg => {
  const args = await msg.args();
  args.forEach(async (arg) => {
    const val = await arg.jsonValue();
    // value is serializable
    if (JSON.stringify(val) !== JSON.stringify({})) console.log(val);
    // value is unserializable (or an empty oject)
    else {
      const {type, subtype, description} = arg._remoteObject;
      console.log(`type: ${type}, subtype: ${subtype}, description:\n ${description}`);
    }
  })
};

const printErrorText = consoleMessage => console.log(consoleMessage.text());

describe('Live Stream SDK', async () => {
  it(`initLiveStream`, async () => {
    // Create new page
    page = await browser.newPage();

    // Print page's console events
    page.on('console', printErrorText);

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
      } catch (e) {
        result = e;
      }

      isResultOk = result && result.response && result.response.public_id;
      return isResultOk ? "initialized" : result;
    }, options);

    expect(actual).to.equal("initialized");
  });
  if (process.env.WITH_CAMERA) {
    it(`attachCamera`, async () => {

      // Create new page
      page = await browser.newPage();

      // Print page's console events
      page.on('console', printErrors);
      // Load test/index.html
      await page.goto('http://localhost:9880');

      // Try to initialize live streaming inside the loaded page
      // options is exposed to the page scope by passing it as parameter to the page.evaluate()
      let actual = await page.evaluate(async () => {
        // initLiveStream is exported as default on the cloudinaryLiveStream library
        let isError = false;

        const {attachCamera} = cloudinaryJsStreaming;
        try {
          await attachCamera(document.getElementById("video"));
        } catch (e) {
          isError = e;
        }

        return isError;
      });

      expect(actual).to.equal(false);
    });
    it(`detachCamera`, async () => {
      // Create new page
      page = await browser.newPage();

      // Print page's console events
      page.on('console', printErrors);
      // Load test/index.html
      await page.goto('http://localhost:9880');

      // Try to initialize live streaming inside the loaded page
      // options is exposed to the page scope by passing it as parameter to the page.evaluate()
      let actual = await page.evaluate(async () => {
        const promisedTimeout = (func, milliseconds) => {
          return new Promise(function (resolve, reject) {
            setTimeout(() => {
              try {
                console.log('resolving');
                resolve(func());
              } catch (e) {
                reject(e);
              }
            }, milliseconds);
          });
        };

        // initLiveStream is exported as default on the cloudinaryLiveStream library
        let isError = false;

        const {attachCamera, detachCamera} = cloudinaryJsStreaming;
        try {
          let video = document.getElementById("video");
          await attachCamera(video);
          await promisedTimeout(() => detachCamera(video), 3000);
        } catch (e) {

          console.log(e);
          isError = e;
        }

        return isError;
      });

      expect(actual).to.equal(false);
    });
  }
  describe('Streamer', async () => {
    it(`initLiveStream`, async () => {
      // Create new page
      page = await browser.newPage();

      // Print page's console events
      page.on('console', printErrorText);

      // Load test/index.html
      await page.goto('http://localhost:9880');

      // Try to initialize live streaming inside the loaded page
      // options is exposed to the page scope by passing it as parameter to the page.evaluate()
      let actual = await page.evaluate(async options => {
        // initLiveStream is exported as default on the cloudinaryLiveStream library
        let result, isResultOk;

        const {Streamer} = cloudinaryJsStreaming;
        try {
          result = await Streamer.initLiveStream(options);
        } catch (e) {
          result = e;
        }

        isResultOk = result && result.response && result.response.public_id;
        return isResultOk ? "initialized" : result;
      }, options);

      expect(actual).to.equal("initialized");
    });
    if (process.env.WITH_CAMERA) {
      it(`attachCamera`, async () => {

        // Create new page
        page = await browser.newPage();

        // Print page's console events
        page.on('console', printErrors);
        // Load test/index.html
        await page.goto('http://localhost:9880');

        // Try to initialize live streaming inside the loaded page
        // options is exposed to the page scope by passing it as parameter to the page.evaluate()
        let actual = await page.evaluate(async () => {
          // initLiveStream is exported as default on the cloudinaryLiveStream library
          let isError = false;

          const {Streamer} = cloudinaryJsStreaming;
          const streamer = new Streamer(document.getElementById("video"));
          try {
            await streamer.attachCamera();
          } catch (e) {
            isError = e;
          }

          return isError;
        });

        expect(actual).to.equal(false);
      });
      it(`detachCamera`, async () => {
        // Create new page
        page = await browser.newPage();

        // Print page's console events
        page.on('console', printErrors);
        // Load test/index.html
        await page.goto('http://localhost:9880');

        // Try to initialize live streaming inside the loaded page
        // options is exposed to the page scope by passing it as parameter to the page.evaluate()
        let actual = await page.evaluate(async () => {
          const promisedTimeout = (func, milliseconds) => {
            return new Promise(function (resolve, reject) {
              setTimeout(() => {
                try {
                  resolve(func());
                } catch (e) {
                  reject(e);
                }
              }, milliseconds);
            });
          };

          // initLiveStream is exported as default on the cloudinaryLiveStream library
          let isError = false;

          const {Streamer} = cloudinaryJsStreaming;
          const streamer = new Streamer(document.getElementById("video"));

          try {
            await streamer.attachCamera();
            await promisedTimeout(() => streamer.detachCamera(), 3000);
          } catch (e) {

            console.log(e);
            isError = e;
          }

          return isError;
        });

        expect(actual).to.equal(false);
      });
    }
  });
});
