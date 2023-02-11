const authMdw = require('../middleware/auth');
const { createPost, getListPost, getPost } = require('../services/post');

const router = require('express').Router();

router.get('/', authMdw({ optional: true }), (req, res) => {
  getListPost(req.user).then((posts) => {
    res.json(posts);
  });
});

router.post('/', authMdw(), (req, res) => {
  createPost(req.user, req.body).then((post) => res.json(post));
});

router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  getPost(slug).then((post) => res.json(post));
});

module.exports = router;
