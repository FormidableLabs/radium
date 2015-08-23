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

import express from 'express';
import proxy from 'express-http-proxy';
import React from 'react';
import App from './app.jsx';
import fs from 'fs';

const indexHTML = fs.readFileSync(__dirname + '/index.html').toString();
const app = express();
const host = 'localhost';
const port = 8000;

app.use('/app.js', proxy('localhost:8080', {forwardPath: () => '/app.js'}));

app.get('/', (req, res) => {
  res.write(indexHTML.replace('<!-- {{app}} -->', React.renderToString(
    <App />
  )));
  res.end();
});

app.listen(port, host, () => {
  console.log('Access the universal app at http://%s:%d', host, port);
});
