const Router = require('express').Router();
const axios = require('axios');
const jwt_auth = require('./jwt_auth');

const User = require('../models/user');
const Blog = require('../models/blog');
const Tag = require('../models/tag');
const HeaderMenu = require('../models/header_menu');

const api = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'

Router.use(async (req, res, next) => {
    const data = await HeaderMenu.find();
    res.locals.headermenu = data;
    next();
});

Router.get('/', async (req, res) => {
    try {
        res.render('../views/pages/client/index');
    } catch (err) {
        console.log(err);
    }
});

Router.get('/news/:page?', async (req, res) => {
    const pagesize = 10;
    const page = req.params.page || 1;
    try {
        const list = await Blog.find()
            .sort({ create_date: 1 })
            .skip(page > 0 ? ((page - 1) * pagesize) : 0)
            .limit(pagesize);
        const tag = await Tag.find();

        const data = {
            page: page,
            blogs: list,
            tag: tag
        }

        res.render('../views/pages/client/news', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/blog/:slug', async (req, res) => {
    try {

        const blog = await Blog.findOne({ "slug": req.params.slug });
        const tag = await Tag.find();

        const data = {
            blog: blog,
            tag: tag
        }

        res.render('../views/pages/client/detail', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/tag/:slug', async (req, res) => {
    try {
        const list = await Blog.find({ slug: req.params.slug });

        res.send(list);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/login', async (req, res) => {
    try {

        const data = {
            username: "",
            password: "",
            error: ""
        }

        res.render('../views/pages/client/login', data);
    } catch (err) {
        console.log(err);
    }
});

Router.post('/login', async (req, res) => {
    try {
        let message = "";
        //const url = 'http://localhost:3000/api/user/login/';
        const url = 'https://hoag-blog.herokuapp.com/api/user/login/';
        await axios({
            method: "post",
            url: url,
            data: {
                username: req.body.username,
                password: req.body.password
            }
        }).then(resp => {
            const token = resp.data;
            // req.session.User = {
            //     token: token
            // }
            res.header('auth-token', token).writeHead(302, { 'Location': '/admin' });
            return res.end();
        }).catch(err => {
            message = err.response.data.message;
        });

        const data = {
            username: req.body.username,
            password: req.body.password,
            error: message
        }

        res.render('../views/pages/client/login', data);
    } catch (err) {
        console.log(err);
    }
});


Router.get('/admin', async (req, res) => {
    try {
        const list = await Blog.find();

        const data = {
            blogs: list
        }
        res.render('../views/pages/admin/index', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/admin/blog/create', async (req, res) => {
    try {
        const data = {
            error: ""
        }
        res.render('../views/pages/admin/createblog', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/admin/blog/edit/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        console.log(blog);
        const data = {
            error: ""
        }
        res.render('../views/pages/admin/editblog', { blog: blog });
    } catch (err) {
        console.log(err);
    }
});

module.exports = Router;