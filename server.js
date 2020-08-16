const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.enable('trust proxy');
app.use((req, res, next) => {
  if (req.secure) next();
  else res.redirect('https://' + req.headers.host + req.url);
});

let leaders = [
  {name: 'None', score: 0},
  {name: 'None', score: 0},
  {name: 'None', score: 0}
];

app.get('/', (req, res) => {
  res.render('getName', {leaders});
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
  leaders = leaders.concat({name, score}).sort((a,b)=>b.score-a.score).slice(0,3);
  res.status(201).end();
});


app.listen(process.env.PORT || 3000, () => console.log("Server started Successfully..."));
