const http = require('http');
const app = require('./app');
const { Server } = require("socket.io");

rest_sockets = {} ; //global variable
cust_sockets = {} ; //global variable





const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '8500');

app.set('port', port);

const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Variables are processed first thus this is equivalent of calling it on top.
// const server = http.createServer(app);

const serverCreate = (app, port) => {
  const server = http.createServer(app);
  server.on('error', errorHandler);
  server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
return server;
}

const server = serverCreate(app, port);


const io = new Server(server, {
    cors: {origin:"http://localhost:3000", methods: ["GET", "POST"]},
});

io.on("connection", socket => {
  socket.on("addUser", req => {
        if(req.role === "vendor"){
          const restID = req.id
          console.log("new restaurant joined ", );
          socket.user = restID;
          rest_sockets[restID] = socket;
        }
        else if(req.role === "user"){
          const custID = req.id
          console.log("new customer joined ", custID);
          socket.user = custID;
          cust_sockets[custID] = socket;
        }
        
      });
    
     

  socket.on("disconnect", () => {
    console.log(`user ${socket.user} is disconnected`);
   
    });
  
});

// server.on('error', errorHandler);
// server.on('listening', () => {
//   const address = server.address();
//   const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
//   console.log('Listening on ' + bind);
// });
  
//   server.listen(port);
  module.exports = server
  // exports.rest_sockets = rest_sockets;