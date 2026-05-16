import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost, likePost, unlikePost, getUserPublicPosts } from '../controllers/postController.js';

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(createPost);

router.route('/user/:userId')
    .get(getUserPublicPosts);

router.route('/:id')
    .get(getPostById)
    .put(updatePost)
    .delete(deletePost);

router.route('/:id/like')
    .post(likePost);

router.route('/:id/unlike')
    .post(unlikePost);

// Category-specific routes (alternative to query params)
router.get('/category/:category', getPosts);

export default router;