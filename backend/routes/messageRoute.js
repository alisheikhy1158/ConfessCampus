import express from 'express';
import {
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
    getPendingRequests,
    sendMessage,
    getMessages,
    getChats,
    deleteMessage
} from '../controllers/messageController.js';

const router = express.Router();

// Chat requests - must come before other routes
router.route('/request')
    .post(sendChatRequest);

router.route('/requests')
    .get(getPendingRequests);

router.route('/request/:requestId/accept')
    .put(acceptChatRequest);

router.route('/request/:requestId/reject')
    .put(rejectChatRequest);

// Get all chats
router.route('/')
    .get(getChats);

// Messages - must come before /:chatId
router.route('/message/:messageId')
    .delete(deleteMessage);

router.route('/chat/:chatId')
    .get(getMessages)
    .post(sendMessage);

export default router;
