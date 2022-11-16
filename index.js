const express = require('express');
const got = require('got');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const urlencodedparser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: '' })
});

app.post('/send-url', urlencodedparser, (req, res) => {
    let url = req.body.myurl;

    (async () => {
        const response = await got(url);

        const $ = cheerio.load(response.body)

        let title = $('body').html();
        res.render('index', { title: title })
    })();
});

app.listen(PORT, () => {
    console.log(`Server started: Listening to port ${PORT}`);
});