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

const express = require('express');
const proxy = require('express-http-proxy');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
import App from './app'; // Leave ESM import
const fs = require('fs');
const path = require('path');

const indexHTML = fs
  .readFileSync(path.resolve(__dirname, 'index.html'))
  .toString();
const app = express();
const host = 'localhost';
const port = 8000;

app.use('/app.js', proxy('localhost:8080', {forwardPath: () => '/app.js'}));

app.get('/', (req, res) => {
  const appHtml = ReactDOMServer.renderToString(
    <App radiumConfig={{userAgent: req.headers['user-agent']}} />
  );
  res.write(indexHTML.replace('<!-- {{app}} -->', appHtml));
  res.end();
});

app.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log('Access the universal app at http://%s:%d', host, port);
});
