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
