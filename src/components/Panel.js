import React from 'react';
import Radium from 'radium';

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, panelContent: null };
  }
  componentDidMount() {
    const filebase = `vdb/displays/${this.props.iface.group}/${this.props.iface.name}`;
    fetch(`${filebase}/png/${this.props.panelKey}.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ panelContent: json, loaded: true });
      });
  }
  render() {
    return (
      <td>
        <table style={this.props.style.panelTable}>
        <tbody>
          <tr>
            <td style={this.props.style.plotCell}>
              <div style={this.props.style.plotDiv}>
              {this.state.loaded ?
                <img
                  src={this.state.panelContent}
                  alt="panel"
                  style={this.props.style.plotObject}
                /> : 'loading...'}
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <table style={this.props.style.labelTable}>
              <tbody>
              {this.props.labels.map((d, i) => (
                <tr key={i} style={this.props.style.labelRow}>
                  <td style={[this.props.style.labelCell, this.props.style.labelNameCell]}>
                    <div style={this.props.style.labelOverflow}>
                      {d.name}
                    </div>
                  </td>
                  <td style={[this.props.style.labelCell, this.props.style.labelValueCell]}>
                    <div style={this.props.style.labelOverflow}>
                      {d.value}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
              </table>
            </td>
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
