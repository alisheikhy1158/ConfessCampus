import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reportedItem: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemType',
        required: true
    },
    itemType: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        enum: ['sexist', 'racist', 'inappropriate', 'spam', 'harassment', 'other'],
        required: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    actionTaken: {
        type: String,
        enum: ['none', 'warning', 'content_removed', 'user_suspended'],
        default: 'none'
    }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
