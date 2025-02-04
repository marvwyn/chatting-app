const express = require('express');
const { getChats, sendChat, clientList, typingEvent, stopTyping, renderChathistory } = require('../controllers/chatController');
const { checkTokenMiddleware } = require('../middlewares/tokenMiddleWare');

const router = express.Router();

router.get('/',renderChathistory);
router.post('/getChats',checkTokenMiddleware, getChats);
router.post('/sendChat',checkTokenMiddleware, sendChat);
router.post('/clientList',checkTokenMiddleware, clientList);
router.post('/typingEvent',checkTokenMiddleware, typingEvent);
router.post('/stopTyping',checkTokenMiddleware, stopTyping);

module.exports = router;
