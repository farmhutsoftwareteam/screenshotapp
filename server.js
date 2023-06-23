const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const fs = require('fs');


app.get('/pdf', async (req, res) => {
  const url = req.query.url;
  try {
    const browser = await puppeteer.launch();
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

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
//will write thus code will it be compiled by this system>