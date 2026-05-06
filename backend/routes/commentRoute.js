import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    createComment,
    getCommentsByPost,
    getCommentById,
    updateComment,
    deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

// Create a comment (protected)
router.post('/', authMiddleware, createComment);

// Get comments for a post (public)
router.get('/post/:postId', getCommentsByPost);

// Get a single comment (public)
router.get('/:commentId', getCommentById);

// Update a comment (protected)
router.put('/:commentId', authMiddleware, updateComment);

// Delete a comment (protected)
router.delete('/:commentId', authMiddleware, deleteComment);

export default router;
