/**
 * The examples provided by Formidable Labs are for non-commercial testing and
 * evaluation purposes only. Formidable Labs reserves all rights not expressly
 * granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FORMIDABLE LABS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import express from "express";
import React from "react";
import App from './app.jsx';
import fs from 'fs';

const indexHTML = fs.readFileSync(__dirname + '/index.html').toString();
const htmlRegex = /¡HTML!/;
const app = express();

const host = 'localhost';
const port = 8000;

app.use('/bundle.js', express.static(__dirname + '/bundle.js'));

app.get('/*', function (req, res) {
  let html = indexHTML.
    replace('app.js', 'http://localhost:8080/app.js').
    replace('<!-- {{app}} -->', React.renderToString(<App />));

  res.writeHead(200, {
    'Content-Length': html.length,
    'Content-Type': 'text/html'
  });
  res.write(html);
  res.end();
});

var server = app.listen(port, host, function () {
  console.log('Access the universal app at http://%s:%d', host, port);
});
