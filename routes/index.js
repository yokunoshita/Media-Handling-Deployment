const router = require('express').Router();
const { image } = require('../libs/multer');
const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'Connected',
    data: null
  });
});

// upload imagekit
router.post('/upload', image.single('file'), controller.create);

//router
router.get('/index', controller.index);
router.get('/show/:id', controller.show);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);

module.exports = router;
