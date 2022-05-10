const csv = require('csv-parser');
const fs = require('fs');
const puppeteer = require('puppeteer');
const results =[];

  fs.createReadStream('voec_29.03.2022.csv')
    .pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.forEach((result) => {
        getPhoto(result);
      });
    });


  async function getPhoto(result) {

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto('http://'+ result['Website (URL)']);

    await page.setViewport({
      width: 1200,
      height: 800
    });

    await page.screenshot({path: 'images/'+ result['Company name'] +'.png'});

    await browser.close();
  };