// Imports
const fs = require('fs');
const compression = require('compression');
const config = require('./webpack.config');
const express = require('express');
const open = require('open');
const path = require('path');
const webpack = require('webpack');


// Other variables
const app = express();
const compiler = webpack(config);
const PROD = process.env.NODE_ENV === 'production';
const port = PROD ? 8080: 3000;
const baseDir = PROD ? 'build' : 'dist';

// Middleware
if (PROD) {
  app.use(compression());
}
else {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use(express.static(baseDir));

app.listen(port, () => {
  open(`http://localhost:${port}`);
});


///////////////////////////////
// api routes

app.get('/api/news', (req, res) => {
  fs.readFile('./data/news/data.json', 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

app.get('/api/news/:newsId', (req, res) => {
  const newsId = req.params.newsId;
  fs.readFile(`./data/news/${newsId}.json`, 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

app.get('/api/faculty', (req, res) => {
  fs.readFile(`./data/faculty/data.json`, 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

app.get('/api/faculty/:facultyId', (req, res) => {
  const facultyId = req.params.facultyId;
  fs.readFile(`./data/faculty/${facultyId}.json`, 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

app.get('/api/nav', (req, res) => {
  fs.readFile('./data/menu.json', 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

app.get('/api/slider', (req, res) => {
  fs.readFile('./data/slider/data.json', 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

app.get('/api/topic', (req, res) => {
  fs.readFile('./data/topic/data.json', 'utf8', (err, data) => {
    if (err) { return console.log(err); }
    res.send(data);
  });
});

////////////////////////////////////


// Client routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './', baseDir, '/index.html'));
});
