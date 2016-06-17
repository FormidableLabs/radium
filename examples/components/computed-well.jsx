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

const React = require('react');
const Radium = require('../../src/index');

const ComputedWell = React.createClass({
  getInitialState: function() {
    return {
      dynamicBg: '#000'
    };
  },

  getStyles: function() {
    return {
      padding: '1em',
      borderRadius: 5,
      background: this.state.dynamicBg
    };
  },

  handleSubmit: function(ev) {
    ev.preventDefault();

    this.setState({
      dynamicBg: this.refs.input.getDOMNode().value
    });
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit} style={this.getStyles()}>
        <input placeholder="black" ref="input" type="text" />

        <button>Change Background Color</button>
      </form>
    );
  }
});

module.exports = Radium(ComputedWell);
