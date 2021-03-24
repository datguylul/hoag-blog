const Router = require('express').Router();
const axios = require('axios');
const jwt_auth = require('./jwt_auth');

const User = require('../models/user');
const Blog = require('../models/blog');
const Tag = require('../models/tag');
const HeaderMenu = require('../models/header_menu');

Router.use(async (req, res, next) => {
    res.locals.headermenu = await HeaderMenu.find();

    res.locals.user = req.session.token;
    next();
});

Router.get('/', jwt_auth, async (req, res) => {
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

Router.get('/blog', jwt_auth, async (req, res) => {
    try {
        const list = await Blog.find();

        const data = {
            blogs: list
        }
        res.render('../views/pages/admin/bloglist', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/headermenu', jwt_auth, async (req, res) => {
    try {
        const list = await HeaderMenu.find();
        const data = {
            blogs: list
        }
        res.render('../views/pages/admin/headermenulist', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/tag', jwt_auth, async (req, res) => {
    try {
        const list = await Tag.find();
        const data = {
            blogs: list
        }
        res.render('../views/pages/admin/taglist', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/blog/create', jwt_auth, async (req, res) => {
    try {
        const data = {
            tags: await Tag.find(),
            author_id: req.session.user_id
        }
        res.render('../views/pages/admin/createblog', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/blog/edit/:id', jwt_auth, async (req, res) => {
    try {
        const data = {
            tags: await Tag.find(),
            blog: await Blog.findById(req.params.id)
        }
        res.render('../views/pages/admin/editblog', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/headermenu/edit/:id', jwt_auth, async (req, res) => {
    try {
        const data = {
            header: await HeaderMenu.findById(req.params.id)
        }
        res.render('../views/pages/admin/editheadermenu', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/tag/edit/:id', jwt_auth, async (req, res) => {
    try {
        const data = {
            tag: await Tag.findById(req.params.id)
        }
        res.render('../views/pages/admin/edittag', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/profile/', jwt_auth, async (req, res) => {
    try {
        const id = req.session.user_id;
        const user = await User.findById(id);

        res.render('../views/pages/admin/userprofile', user);
    } catch (err) {
        console.log(err);
    }
});

module.exports = Router;