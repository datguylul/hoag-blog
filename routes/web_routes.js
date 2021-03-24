const Router = require('express').Router();
const axios = require('axios');
const jwt_auth = require('./jwt_auth');

const User = require('../models/user');
const Blog = require('../models/blog');
const Tag = require('../models/tag');
const HeaderMenu = require('../models/header_menu');
const header_menu = require('../models/header_menu');

const api = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'

Router.use(async (req, res, next) => {
    const menu = await HeaderMenu.find();
    res.locals.headermenu = menu;

    const popular = await Blog.find().sort({ view_count: 'desc' }).limit(6);
    res.locals.popular = popular;

    const tag = await Tag.find();
    res.locals.tag = tag;

    res.locals.user = req.session.token;
    next();
});

Router.get('/', async (req, res) => {
    try {

        const data = {
            headingblog: await Blog.findOne()
                .sort({ 'created_date': -1 }),
            recentblog: await Blog.find()
                .sort({ 'created_date': -1 })
                .skip(1)
                .limit(4),
            more: await Blog.find()
                .sort({ 'created_date': -1 })
                .limit(6)
        }

        res.render('../views/pages/client/index', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/contact', async (req, res) => {
    try {

        res.render('../views/pages/client/contact');
    } catch (err) {
        console.log(err);
    }
});

Router.get('/blogs/:page?', async (req, res) => {
    const pagesize = 10;
    const page = req.params.page || 1;
    try {
        const list = await Blog.find()
            .sort({ 'created_date': -1 })
            .skip(page > 0 ? ((page - 1) * pagesize) : 0)
            .limit(pagesize);

        const data = {
            page: page,
            blogs: list
        }

        res.render('../views/pages/client/blogs', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/blog/:slug', async (req, res) => {
    try {

        const blog = await Blog.findOne({ "slug": req.params.slug });
        const result = await Blog.updateOne({ _id: blog.id }, {
            $set: {
                view_count: blog.view_count + 1
            }
        });

        const data = {
            blog: blog,
            tags: await Tag.find({ id: blog.tags_id })
        }

        res.render('../views/pages/client/detail', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/tag/:slug', async (req, res) => {
    try {
        const tag = await Tag.findOne({ slug: req.params.slug });
        const list = await Blog.find({
            tags_id:
                { $in: tag.id }

        }).sort({ 'created_date': -1 });

        const data = {
            page: 0,
            blogs: list
        }
        res.render('../views/pages/client/blogs', data);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/login', async (req, res) => {
    try {
        if (req.session.token) {
            return res.redirect('/admin');
        }
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
        //const url = `${process.env.API_URL}/api/user/login/`;
        const url = `${process.env.HEROKU_URL}/api/user/login/`;
        await axios({
            method: "post",
            url: url,
            data: {
                username: req.body.username,
                password: req.body.password
            }
        }).then(resp => {
            req.session.token = resp.data;
        }).catch(err => {
            message = err.response.data.message;
        });

        if (req.session.token) {
            return res.redirect('/admin');
        }

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

Router.get('/logout', async (req, res) => {
    try {
        if (req.session.token) {
            req.session.token = null;
            return res.redirect('/login');
        }

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

// Router.get('/admin', jwt_auth, async (req, res) => {
//     try {
//         const list = await Blog.find();

//         const data = {
//             blogs: list
//         }
//         res.render('../views/pages/admin/index', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/blog', jwt_auth, async (req, res) => {
//     try {
//         const list = await Blog.find();

//         const data = {
//             blogs: list
//         }
//         res.render('../views/pages/admin/bloglist', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/headermenu', jwt_auth, async (req, res) => {
//     try {
//         const list = await HeaderMenu.find();
//         const data = {
//             blogs: list
//         }
//         res.render('../views/pages/admin/headermenulist', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/tag', jwt_auth, async (req, res) => {
//     try {
//         const list = await Tag.find();
//         const data = {
//             blogs: list
//         }
//         res.render('../views/pages/admin/taglist', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/blog/create', jwt_auth, async (req, res) => {
//     try {
//         const data = {
//             tags: await Tag.find()
//         }
//         res.render('../views/pages/admin/createblog', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/blog/edit/:id', jwt_auth, async (req, res) => {
//     try {
//         const data = {
//             tags: await Tag.find(),
//             blog: await Blog.findById(req.params.id)
//         }
//         res.render('../views/pages/admin/editblog', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/headermenu/edit/:id', jwt_auth, async (req, res) => {
//     try {
//         const data = {
//             header: await HeaderMenu.findById(req.params.id)
//         }
//         res.render('../views/pages/admin/editheadermenu', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Router.get('/admin/tag/edit/:id', jwt_auth, async (req, res) => {
//     try {
//         const data = {
//             tag: await Tag.findById(req.params.id)
//         }
//         res.render('../views/pages/admin/edittag', data);
//     } catch (err) {
//         console.log(err);
//     }
// });

module.exports = Router;