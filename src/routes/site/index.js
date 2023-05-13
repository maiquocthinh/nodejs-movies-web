const express = require('express');
const router = express.Router();

const {
	homeController,
	infoController,
	watchController,
	searchController,
	categoryController,
	countryController,
	catalogueController,
	filterController,
	tagController,
} = require('../../controllers/site');

const apiRoutes = require('./api.routes');

router.get('/info/:filmSlug', infoController);
router.get('/watch/:filmId', watchController);
router.use('/api', apiRoutes);

router.get('/search/:keyWord', searchController);
router.get('/category/:categorySlug', categoryController);
router.get('/country/:countrySlug', countryController);
router.get('/catalogue/filter', filterController);
router.get('/catalogue/:type', catalogueController);
router.get('/tag/:tagAscii', tagController);

router.get('/', homeController);

module.exports = router;
