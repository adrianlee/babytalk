var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();

var server = http.createServer(app)
var io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(express.static(path.join(__dirname, 'public'), { maxAge: 900000 }));
  app.use(express.favicon());

  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.locals.title = "Babytalk";
  res.render('index');
});

server.listen(app.get('port'));

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});