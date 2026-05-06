import Report from '../models/Report.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// Report a post or comment
export const createReport = async (req, res, next) => {
    try {
        const { itemId, itemType, reason, description } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized - User not found'
            });
        }

        // Validate inputs
        if (!itemId || !itemType || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Item ID, item type, and reason are required'
            });
        }

        if (!['Post', 'Comment'].includes(itemType)) {
            return res.status(400).json({
                success: false,
                message: 'Item type must be either Post or Comment'
            });
        }

        const validReasons = ['sexist', 'racist', 'inappropriate', 'spam', 'harassment', 'other'];
        if (!validReasons.includes(reason)) {
            return res.status(400).json({
                success: false,
                message: `Reason must be one of: ${validReasons.join(', ')}`
            });
        }

        // Verify the item exists
        let item;
        if (itemType === 'Post') {
            item = await Post.findById(itemId);
        } else {
            item = await Comment.findById(itemId);
        }

        if (!item) {
            return res.status(404).json({
                success: false,
                message: `${itemType} not found`
            });
        }

        // Check if user already reported this item
        const existingReport = await Report.findOne({
            reportedItem: itemId,
            itemType,
            reportedBy: userId
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: 'You have already reported this item'
            });
        }

        // Create report
        const report = new Report({
            reportedItem: itemId,
            itemType,
            reportedBy: userId,
            reason,
            description
        });

        const savedReport = await report.save();
        const populatedReport = await savedReport.populate('reportedBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            report: populatedReport
        });
    } catch (error) {
        next(error);
    }
};

// Get all pending reports (admin only)
export const getPendingReports = async (req, res, next) => {
    try {
        const reports = await Report.find({ status: 'pending' })
            .populate('reportedBy', 'name email')
            .populate('reportedItem')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        next(error);
    }
};

// Get all reports (admin only)
export const getAllReports = async (req, res, next) => {
    try {
        const { status, reason, itemType } = req.query;
        
        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (reason) filter.reason = reason;
        if (itemType) filter.itemType = itemType;

        const reports = await Report.find(filter)
            .populate('reportedBy', 'name email')
            .populate('reportedItem')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });
    } catch (error) {
        next(error);
    }
};

// Update report status (admin only)
export const updateReportStatus = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const { status, actionTaken } = req.body;

        if (!reportId) {
            return res.status(400).json({
                success: false,
                message: 'Report ID is required'
            });
        }

        const validStatuses = ['pending', 'reviewed', 'resolved', 'dismissed'];
        const validActions = ['none', 'warning', 'content_removed', 'user_suspended'];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        if (actionTaken && !validActions.includes(actionTaken)) {
            return res.status(400).json({
                success: false,
                message: `Action taken must be one of: ${validActions.join(', ')}`
            });
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        if (status) report.status = status;
        if (actionTaken) report.actionTaken = actionTaken;

        const updatedReport = await report.save();

        // If content_removed action, delete the item
        if (actionTaken === 'content_removed') {
            if (report.itemType === 'Post') {
                await Post.findByIdAndDelete(report.reportedItem);
            } else {
                await Comment.findByIdAndDelete(report.reportedItem);
            }
        }

        res.status(200).json({
            success: true,
            message: 'Report updated successfully',
            report: updatedReport
        });
    } catch (error) {
        next(error);
    }
};

// Get report statistics (admin only)
export const getReportStats = async (req, res, next) => {
    try {
        const stats = await Report.aggregate([
            {
                $group: {
                    _id: null,
                    totalReports: { $sum: 1 },
                    pendingReports: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    resolvedReports: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                    },
                    dismissedReports: {
                        $sum: { $cond: [{ $eq: ['$status', 'dismissed'] }, 1, 0] }
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalReports: { $sum: 1 },
                    byReason: {
                        $push: {
                            reason: '$reason',
                            count: { $sum: 1 }
                        }
                    }
                }
            }
        ]);

        const reasonStats = await Report.aggregate([
            {
                $group: {
                    _id: '$reason',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            stats: stats[0] || {},
            reasonStats
        });
    } catch (error) {
        next(error);
    }
};
