// routes/banners.js
import express from 'express';
import * as ctrl from '../controllers/bannersController.js';
const router = express.Router();

router.get('/', ctrl.listBanners);
router.get('/:id', ctrl.getBanner);

// Admin
router.post('/', ctrl.createBanner);
router.put('/:id', ctrl.updateBanner);
router.delete('/:id', ctrl.deleteBanner);

export default router;
