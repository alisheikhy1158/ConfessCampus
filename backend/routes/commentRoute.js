import express from 'express';
import { addComment, getPostComments, deleteComment } from '../controllers/commentController.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/:postId').get(getPostComments);

router.route('/:postId').post(isAuthenticated, addComment);
router.route('/:commentId', ).delete(isAuthenticated, deleteComment);

export default router;