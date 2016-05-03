import React from 'react';
import Radium from 'radium';

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, panelContent: null };
  }
  componentDidMount() {
    fetch(`vdb/displays/${this.props.iface.group}/${this.props.iface.name}/png/${this.props.panelKey}.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ panelContent: json, loaded: true });
      });
  }
  render() {
    return (
      <td>
      <table>
      <tbody>
      <tr>
      <td>
      {this.state.loaded ? <img src={this.state.panelContent} alt="stuff" style={this.props.style.plot} /> : 'panel...'}
      </td>
      </tr>
      <tr>
      {this.props.labels.map((d, i) => (
        <tr key={i} style={this.props.style.labels}>
        <td>
        {d.value}
        </td>
        </tr>
      ))}
      </tr>
      </tbody>
      </table>
      </td>
    );
  }
}

Panel.propTypes = {
  style: React.PropTypes.object,
  labels: React.PropTypes.array,
  iface: React.PropTypes.object,
  panelKey: React.PropTypes.string
};

export default Radium(Panel);
