import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Message content is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // MongoDB will automatically delete the message after 24 hours
    }
}); 

export default mongoose.model('Message', messageSchema);