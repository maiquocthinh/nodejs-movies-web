const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const dashboardController = require('../../controllers/admin/dashboard.controller');

// PAGE
router.get('/dashboard', authMiddleware.auth, dashboardController.dashboard);

module.exports = router;
