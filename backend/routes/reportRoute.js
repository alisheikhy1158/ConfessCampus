import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    createReport,
    getPendingReports,
    getAllReports,
    updateReportStatus,
    getReportStats
} from '../controllers/reportController.js';

const router = express.Router();

// User routes (protected)
router.post('/create', authMiddleware, createReport);

// Admin routes (protected - would need admin middleware in production)
// Must come before /:reportId to avoid being matched by wildcard
router.get('/pending', authMiddleware, getPendingReports);
router.get('/all', authMiddleware, getAllReports);
router.get('/stats', authMiddleware, getReportStats);
router.put('/:reportId', authMiddleware, updateReportStatus);

export default router;
