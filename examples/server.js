import express from "express";
import React from "react";
import App from './app.jsx'
import fs from 'fs'
const indexHTML = fs.readFileSync(__dirname+'/index.html').toString();
const htmlRegex = /¡HTML!/;
const app = express();

console.log(__dirname+'/bundle.js')
app.use('/bundle.js', express.static(__dirname+'/bundle.js'));

app.get('/*', function (req, res) {
  let content = React.renderToString((<App />));
  let html = indexHTML.replace(htmlRegex, content);
  res.writeHead(200, {
    'Content-Length': html.length,
    'Content-Type': 'text/html'
  });
  res.write(html);
  res.end();
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
