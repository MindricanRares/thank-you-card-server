var express = require('express')
var bodyParser = require('body-parser')
var low = require('lowdb')
var FileAsync = require('lowdb/adapters/FileAsync')
var redis = require('redis');
var url = require('url')

var app = express()
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT');
  next();
});

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

app.use(bodyParser.json())

const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    app.get('/thanks', function(req, res, next) {
      client.LRANGE('thanks',0,-1,function(err,replay){
        if(replay!=null){
          res.send(replay);
        }else{
          res.send("error");
        }
      })
    });


    app.post('/thanks', function(req, res, next) {
        client.LPUSH('thanks',req.body.title);
        res.send(' ')
    })

    return db.defaults({ thanks: [] }).write()
  })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => console.log('listening on port 8000'))
  })