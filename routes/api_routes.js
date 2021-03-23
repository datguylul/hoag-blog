const Router = require('express').Router();
const joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');

const Blog = require('../models/blog');
const HeaderMenu = require('../models/header_menu');
const Tag = require('../models/tag');
const User = require('../models/user');

Router.get('/blog', async (req, res) => {
    try {
        const list = await Blog.find();

        res.send(list);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/blog/:slug', async (req, res) => {
    try {
        const blog = await Blog.find({ slug: req.params.slug });

        res.send(blog);
    } catch (err) {
        console.log(err);
    }
});

Router.post('/blog', async (req, res) => {
    try {
        // const blog = new Blog({
        //     title: "Money Money",
        //     alt_title: "Money n shjt",
        //     content: "blank",
        //     display_img: "img here"
        // });
        const slug = slugify(req.body.title, { lower: true, strict: true });
        const blog = new Blog({
            title: req.body.title,
            alt_title: req.body.alt_title,
            content: req.body.content,
            display_img: req.body.display_img,
            tags_id: req.body.tags,
            slug: slug
        });

        console.log(blog);

        const result = await blog.save();

        res.send("result");
    } catch (err) {
        console.log(err);
    }
});

Router.put('/blog/:id', async (req, res) => {
    try {

        const slug = slugify(req.body.title, { lower: true, strict: true });
        const result = await Blog.updateOne({ _id: req.params.id }, {
            $set: {
                title: req.body.title,
                alt_title: req.body.alt_title,
                content: req.body.content,
                display_img: req.body.display_img,
                slug: slug,
                tags_id: req.body.tags,
                modify_date: Date.now()
            }
        });
        res.send(result);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/headermenu', async (req, res) => {
    try {
        const list = await HeaderMenu.find();

        res.send(list);
    } catch (err) {
        console.log(err);
    }
});

Router.post('/headermenu', async (req, res) => {
    try {
        const headermenu = new HeaderMenu({
            id: req.body.id,
            name: req.body.name,
            link: req.body.link,
            active: true
        });

        const result = await headermenu.save();

        res.send(result);
    } catch (err) {
        console.log(err);
    }
});

Router.put('/headermenu/:id', async (req, res) => {
    try {
        const result = await HeaderMenu.updateOne({ _id: req.params.id }, {
            $set: {
                name: req.body.name,
                link: req.body.link,
                modify_date: Date.now()
            }
        });
        res.send(result);
    } catch (err) {
        console.log(err);
    }
});

Router.get('/tag', async (req, res) => {
    try {
        const list = await Tag.find();

        res.send(list);
    } catch (err) {
        console.log(err);
    }
});

Router.post('/tag', async (req, res) => {
    try {
        const slug = slugify(req.body.name, { lower: true, strict: true });
        const tag = new Tag({
            id: req.body.id,
            name: req.body.name,
            slug: slug,
        });

        const result = await tag.save();

        res.send(result);
    } catch (err) {
        console.log(err);
    }
});

Router.post('/user/login', async (req, res) => {
    const login_schema = joi.object({
        username: joi.string().required(),
        password: joi.string().min(6).required()
    });
    try {
        const { error } = login_schema.validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send({ message: 'username or password not correct' });

        const validpwd = await bcrypt.compare(req.body.password, user.password);
        if (!validpwd) return res.status(400).send({ message: 'username or password not correct' });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);
        // req.session.User = {
        //     id: user._id,
        //     token: token
        // }
        res.status(200).header('auth-token', token).send(token);
        //res.status(200).send({ message: 'logged in' });
    } catch (err) {
        console.log(err);
        res.status(404).send({ message: 'error' });
    }
});

Router.post('/user/signup', async (req, res) => {
    const signup_schema = joi.object({
        name: joi.string().required(),
        username: joi.string().required(),
        password: joi.string().min(6).required(),
        email: joi.string().email()
    });
    try {
        const { error } = signup_schema.validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user_check = await User.findOne({ username: req.body.username });
        if (user_check) return res.status(400).send({ message: 'username already taken' });

        const salt = await bcrypt.genSalt(10);
        const hashpwd = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashpwd,
            email: req.body.email || "",
            phone: req.body.phone || "",
            address: req.body.address || "",
        });

        const result = await user.save();
        console.log({ user: user._id });
        if (!result) return res.status(400).send({ message: 'fail' });
        res.status(200).send({ message: 'success' });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'fail', error: err });
    }
});

// Router.get('/user/profile', jwt_verify.userauth, async (req, res) => {
//     try {
//         if (req.session.User) {
//             return res.status(200).json({ status: 'success', session: req.session.User })
//         } else res.status(400).send({ message: 'cant get user data' });
//     } catch (err) {
//         console.log(err);
//         res.status(400).send({ message: 'fail', error: err });
//     }
// });

// Router.post('/user/logout', jwt_verify.userauth, async (req, res) => {
//     try {
//         req.session.destroy(function (err) {
//             return res.status(200).json({ status: 'success', session: 'cannot access session here' })
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(400).send({ message: 'fail', error: err });
//     }
// });

module.exports = Router;