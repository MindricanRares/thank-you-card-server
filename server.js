const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const app = express()
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json())

const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {

    app.get('/thanks', (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      const post = db.get('thanks')
        .value()

      res.send(post)
    })


    app.post('/thanks', (req, res) => {
        console.log(req)
        db.get('thanks')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(post => res.send(post))
    })

    return db.defaults({ thanks: [] }).write()
  })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => console.log('listening on port 8000'))
  })