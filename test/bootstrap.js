const puppeteer = require('puppeteer');
const { expect } = require('chai');
const globalVariables = {browser: global.browser, expect: global.expect};

// puppeteer options
const opts = {
  headless: true,
  slowMo: 100,
  timeout: 20000,
};

// expose variables
before (async function () {
  global.expect = expect;
  global.browser = await puppeteer.launch(opts);
  console.log(await browser.version());
});

// close browser and reset global variables
after (async function () {
    await global.browser.close();

    global.browser = globalVariables.browser;
    global.expect = globalVariables.expect;
});
