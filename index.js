require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { app, server } = require('./sockets/socket');

const User = require('./models/userModel');
const Chat = require('./models/chatModel');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const PORT = process.env.PORT || 3000;

User.createTable();
Chat.createTable();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRoutes);
app.use('/chats',chatRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
