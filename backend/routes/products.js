// routes/products.js
import express from 'express';
import * as ctrl from '../controllers/productsController.js';
const router = express.Router();

// public endpoints
router.get('/', ctrl.listProducts); // /api/products?q=&tag=&category=
router.get('/recommended', ctrl.recommendedProducts); // ?userId=xxx or ?skinType=dry&concerns=hydration
router.get('/:id', ctrl.getProduct);

// admin CRUD
router.post('/', ctrl.createProduct);
router.put('/:id', ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

export default router;
