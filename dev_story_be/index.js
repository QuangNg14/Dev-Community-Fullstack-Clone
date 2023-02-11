require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const router = require('./api');
const app = express();
mongoose.connect(
  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log('DB connected!');
    } else {
      console.error(err);
    }
  }
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(morgan('common'));
app.use(router);

const http = require('http').createServer(app);
const io = require('socket.io')(http);

let numberUser = 0;
const onlineUsers = []

io.on('connection', (socket) => {
  console.log('an user connected');
  numberUser++;

  socket.on("onlineUser",(userId)=>{
    onlineUsers[userId] = socket
  })

  socket.on("disconnect",()=>{
    numberUser--
  })

  socket.on("join_chat",(partnerId)=>{
    console.log(onlineUsers)
    socket.join()
  })
});
app.get('/userCount', (req, res) => {
  res.json(numberUser);
});
http.listen(process.env.PORT);
