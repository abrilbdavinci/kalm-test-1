// routes/stories.js
import express from 'express';
import * as ctrl from '../controllers/storiesController.js';
const router = express.Router();

// Public
router.get('/', ctrl.listStories);
router.get('/:id', ctrl.getStory);

// Admin / CRUD (protegidos con auth middleware si corresponde)
router.post('/', ctrl.createStory);
router.put('/:id', ctrl.updateStory);
router.delete('/:id', ctrl.deleteStory);

export default router;
