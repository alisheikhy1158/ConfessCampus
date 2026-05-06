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
router.get('/pending', authMiddleware, getPendingReports);
router.get('/all', authMiddleware, getAllReports);
router.put('/:reportId', authMiddleware, updateReportStatus);
router.get('/stats', authMiddleware, getReportStats);

export default router;
