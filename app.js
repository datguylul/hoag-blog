require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const body_parser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const ejs = require('ejs');
const layout = require('express-ejs-layouts');
const path = require('path');

const web_routes = require('./routes/web_routes');
const api_routes = require('./routes/api_routes');
const port = process.env.PORT || 3000;

app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'hoag', 
    cookie: { maxAge: 60000 }}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(layout);
app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use(web_routes);
app.use('/api', api_routes);

app.get('*', async (req, res) => res.render('../views/pages/client/notfound'));

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log("connect fail");
    else console.log("db connected");
});

app.listen(port, () => {
    console.log(`running at: ${port}`);
});
