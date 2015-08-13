import express from "express";
import React from "react";

import App from './app.jsx'


const app = express();

app.set('views', './examples');
app.set('view engine', 'jade');

app.all('/*', function (req, res, next) {
  console.log('access to : ', req.url)
  next()
});

console.log(__dirname+'/bundle.js')
app.use('/js/bundle.js', express.static(__dirname+'/bundle.js'));

app.get('/*', function (req, res) {

  console.log('generic access : ', req.url)

  let content = React.renderToString((<App />));
  res.render('index', { content: content });;

});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
