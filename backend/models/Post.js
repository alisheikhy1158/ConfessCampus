import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: [1000, 'Content cannot exceed 1000 characters']
    },
    category: {
        type: String,
        enum: ['confession', 'discussion', 'lost-found', 'carpool'],
        required: true,
        index: true
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // Lost & Found specific fields
    itemType: {
        type: String,
        enum: ['lost', 'found', null],
        default: null
    },
    itemDescription: {
        type: String,
        maxlength: [300, 'Item description cannot exceed 300 characters']
    },
    location: String,
    // Carpool specific fields
    departure: String,
    destination: String,
    departureTime: Date,
    seatsAvailable: {
        type: Number,
        min: [1, 'At least 1 seat must be available']
    },
    // Discussion/Query specific fields
    tags: [String],
    isResolved: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        maxlength: [100, 'Title cannot exceed 100 characters']
    }
}, { timestamps: true });

postSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

postSchema.virtual('commentsCount').get(function() {
    return this.comments.length;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

export default mongoose.model('Post', postSchema);