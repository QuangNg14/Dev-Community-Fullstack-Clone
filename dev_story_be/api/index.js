const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/me', require('./me'));
router.use('/post', require('./post'));
router.use('/upload', require('./upload'));

module.exports = router;
