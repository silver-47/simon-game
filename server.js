require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.enable('trust proxy');
app.use((req, res, next) => {
  if (req.secure) next();
  else res.redirect('https://' + req.headers.host + req.url);
});
mongoose.connect(process.env.DB_URL,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
);

const User = mongoose.model("User", {
  name: String,
  highScore: {type: Number, default: 0},
  scores: [Number]
});

app.get('/', (req, res) => {
  User.find().select('name highScore')
  .sort({highScore: -1}).limit(3)
  .exec((err, leaders) => res.render('getName', {leaders}));
});

app.post('/', (req, res) => {
  res.redirect('/playas/' + req.body.nickName);
});

app.get('/playas/:name', (req, res) => {
  const {name} = req.params;
  res.render('game', {name});
});

app.post('/playas/:name', (req, res) => {
  const {name} = req.params;
  const score = parseInt(req.body.score);
  User.findOneAndUpdate({name}, {
      name,
      $push: {scores: score},
    },
    {upsert: true, new: true, setDefaultsOnInsert: true},
    (err, result) => {
      User.updateOne({name: result.name}, {
        $set: {highScore: (score > result.highScore)? score : result.highScore}
      }, (er) => {if (!er) res.status(201).end();});
      if (!err) res.status(201).end();
    });
});


app.listen(process.env.PORT || 3000, () => console.log("Server started Successfully..."));
