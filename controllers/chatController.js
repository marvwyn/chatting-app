const Chat = require('../models/chatModel');
const { io } = require('../sockets/socket');


const getChats = async(req, res) => {
  const { currentUserId, chatUserId } = req.body;
  try {
    const chats = await Chat.getChats(currentUserId, chatUserId);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

const renderChathistory = (req, res) => {
  res.render('chat-history');
};

const sendChat = (req, res) => {
  const { chatInputVal, chatUserId, currentUserId } = req.body;
  try {
    console.log("before send chat");
    
  Chat.sendChat(currentUserId, chatUserId, chatInputVal);

  console.log("after send chat");

  io.emit('sendMessage', { currentUserId, chatUserId, message: chatInputVal });
  res.status(200).json({ message: 'Message sent successfully' });
} catch (error) {
  res.status(500).json({ message: 'Error Sending Send Chat' });
}
};

const clientList = async(req, res) => {
  try {
    const clients = await Chat.clientList();
    if (clients.length > 0) {
        res.status(200).json(clients);
    } else {
        res.status(404).json({ message: 'No clients found' });
    }
} catch (error) {
    res.status(500).json({ message: 'Error fetching client list' });
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
