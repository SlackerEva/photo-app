const csv = require('csv-parser');
const fs = require('fs');
const puppeteer = require('puppeteer');
const results =[];

  fs.createReadStream('voec_29.03.2022.csv')
    .pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      getPhoto(results);
    });


  async function getPhoto() {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    let resultId = 0;
    let writeStream = fs.createWriteStream('log.csv');
    for (let result of results) {
      try {
        await page.goto('http://'+ result['Website (URL)'], {
          waitUntil: "networkidle0",
          timeout: 10000
        });

        await page.waitForSelector('footer');
    
        await page.setViewport({
          width: 1920,
          height: 1080
        });

        await page.screenshot({path: 'images/'+ result['Company name'] +'.jpeg'});

        writeStream.write(resultId + ' : done!' + '\r\n');
        resultId = resultId + 1;
      } catch(e) {
        writeStream.write(resultId + ' : page is not working '+ e + '\r\n');
        resultId = resultId + 1;
      }
    }
    writeStream.end();
    await browser.close();  
  };
