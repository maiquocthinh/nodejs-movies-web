const categoryModels = require('../../models/category.models');
const countryModels = require('../../models/country.models');
const filterFilmUtils = require('../../utils/site/filterFilm.utils');
const loadHeaderData = require('../../utils/site/loadHeaderData.utils');
const loadLeftSidebarData = require('../../utils/site/loadLeftSidebarData.util');
const url = require('url');

module.exports = async (req, res) => {
	let { categoryId, countryId, year, type, sort } = req.query;
	let { page } = req.params;

	if (page) page = page.split('-').pop();
	if (year) year = parseInt(year);

	let typeName = 'Phim';

	switch (type) {
		case 'le':
			type = 'movie';
			typeName = 'Phim Lẻ';
			break;

		case 'bo':
			type = 'series';
			typeName = 'Phim Bộ';
			break;
		case 'rap':
			type = '';
			typeName = 'Phim Chiếu Rạp';
			break;
	}

	if (categoryId) typeName += ' ' + (await categoryModels.findOne({ _id: categoryId }, { name: 1 }).then(({ name }) => name));
	if (countryId) typeName += ' ' + (await countryModels.findOne({ _id: countryId }, { name: 1 }).then(({ name }) => name));

	switch (sort) {
		case 'new':
			typeName += ' Mới';
			sort = { createdAt: -1 };
			break;

		case 'view':
			sort = { viewed: -1 };
			break;

		case 'year':
			sort = { year: -1 };
			break;

		case 'name':
			sort = { name: 1 };
			break;

		default:
			typeName += ' Mới';
			sort = { updatedAt: -1 };
	}

	if (year) typeName += ' Năm ' + year;

	const { data: films, pageNumber, totalPage } = await filterFilmUtils({ categoryId, countryId, year, sort }, page);

	// catalogue data
	const catalogue = {
		films,
		totalPage,
		pageNumber,
		currentHref: url.parse(req.originalUrl).pathname.split('/page-').shift(),
		breadcrumb: `<li><a href="#"><i class="iconify" data-icon="openmoji:filter"></i> Lọc Phim</a></li>
		<li><a href="#"><i class="iconify" data-icon="twemoji:clapper-board"></i> ${typeName}</a></li>`,
		sectionBarTitle: `<span><i class="iconify section-bar__icon" data-icon="bx:film"></i> ${typeName}</span><i class="skew-left"></i>`,
		listCategory: await categoryModels.find({}, { _id: 1, name: 1 }),
		listCountry: await countryModels.find({}, { _id: 1, name: 1 }),
	};

	// SEO
	const SEO = {
		title: `${typeName} - Trang ${pageNumber}`,
	};

	res.render('site/catalogue', {
		header: await loadHeaderData.load(),
		leftSidebar: await loadLeftSidebarData.load(),
		catalogue,
		SEO,
	});
};
