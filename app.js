var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express();

var server = http.createServer(app)

var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

app.configure(function(){
  app.set('port', process.env.VCAP_APP_PORT || 3000);
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
  res.render('index', { port: app.get('port') });
});

server.listen(app.get('port'));

var room = {};

bs.on('connection', function(client) {
  // Incoming stream from browsers
  client.on('stream', function(stream, meta) {
    if (meta.type && meta.type == 'read') {
      room[meta.hash] = stream;
    } else {
      var parts = [];

      stream.on('data', function(data) {
        parts.push(data);
      });

      stream.on('end', function() {
        for (i in room) {
          if (meta.hash != i && !room[i]._closed && !room[i]._ended) {
            try {
              room[i].write(parts);
            } catch (e) {
              console.log(e);
              delete room[i];
            }
          }
        }
        stream.end();
        stream.destroy();
      });

      stream.on('close', function() {
        console.log("a client disconnected");
        // console.log(bs.clients);
      });

      client.on('error', function(e) {
        console.log(e.stack, e.message);
      });
    }
  });
});