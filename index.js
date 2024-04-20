const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.get('/',()=>{
    res.send({
        "Status":200
    })
})
app.get('/screen', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('https://www.notion.so/');
    }
    try {
        // Get the user's screen size
        const screenWidth = req.query.width || 1920; // Default width is 1920
        const screenHeight = req.query.height || 1080; // Default height is 1080

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Set viewport to full screen
        await page.setViewport({
            width: screenWidth,
            height: screenHeight,
        });

        await page.goto(url, { waitUntil: 'networkidle0' });

        // Capture screenshot of the entire page
        const screenshot = await page.screenshot({
            fullPage: true,
        });

        await browser.close();

        res.set('Content-Type', 'image/png');
        res.send(screenshot);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
