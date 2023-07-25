const express = require('express');
const app = express();
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const puppeteer = require('puppeteer');
const fs = require('fs');

const getBrowser = () => 
IS_PRODUCTION
?
puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=4e8385cf-4e0e-47ed-84a3-8b41def51202' })
:
puppeteer.launch();




app.get('/', (req, res) => {
  res.send('Server is running');
});
app.get('/pdf', async (req, res) => {



  const url = req.query.url;
  let browser = null;
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(url, { timeout: 6000000, waitUntil: 'networkidle2' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      scale: 1,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await browser.close();

    const pdfPath = `public/${Date.now()}.pdf`;
    fs.writeFileSync(pdfPath, pdfBuffer);

    res.set('Content-Type', 'application/pdf');
    res.download(pdfPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error capturing PDF');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port  ${port}`);
});
//will write thus code will it be compiled by this system>