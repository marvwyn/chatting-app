const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { io } = require('../sockets/socket');
const { Op } = require('sequelize');

(async () => {
  await Chat.sync();
  console.log('Users table is ready');
})();
  const getChats = async(req, res) => {
    const { currentUserId, chatUserId } = req.body;
    try {
      const chats = await Chat.findAll({
          where: {
              [Op.or]: [
                  { user_id: currentUserId, to_user_id: chatUserId },
                  { user_id: chatUserId, to_user_id: currentUserId }
              ]
          },
          order: [['created', 'ASC']]
      });
      res.status(200).json(chats);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
  };

  const renderChathistory = (req, res) => {
    res.render('chat-history');
  };

  const sendChat = async(req, res) => {
    const { chatInputVal, chatUserId, currentUserId } = req.body;
    try {
      console.log("before send chat");
      
    await Chat.create({ user_id: currentUserId, to_user_id: chatUserId, message: chatInputVal });
    // Chat.sendChat(currentUserId, chatUserId, chatInputVal);

    console.log("after send chat");

    io.emit('sendMessage', { currentUserId, chatUserId, message: chatInputVal });
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.log("error send chat: ", error);
    
    res.status(500).json({ message: 'Error Sending Send Chat' });
  }
  };

  const clientList = async(req, res) => {
    try {
      const clients = await User.findAll({ attributes: ['username', 'email', 'id'] });
      if (clients.length > 0) {
          res.status(200).json(clients);
      } else {
          res.status(404).json({ message: 'No clients found' });
      }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client list', error: error.message });
    }
  }

  const typingEvent = (req, res) => {
    const {currentUserId,chatUserId} = req.body;
    io.emit('typing', { currentUserId, chatUserId });
  }

  const stopTyping = (req, res) => {
    const {currentUserId,chatUserId} = req.body;
    io.emit('stopTyping', { currentUserId, chatUserId });
  }
  module.exports = { getChats, sendChat, clientList, typingEvent, stopTyping,renderChathistory };
