import React from 'react';
import Radium from 'radium';
import Delay from 'react-delay';
import { json as getJSON } from 'd3-request';

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, panelContent: null };
  }
  componentDidMount() {
    let filebase = `${this.props.cfg.display_base}/displays/${this.props.iface.group}`;
    filebase = `${filebase}/${this.props.iface.name}`;

    this.xhr = getJSON(`${filebase}/json/${this.props.panelKey}.json`, json => {
      this.setState({ panelContent: json, loaded: true });
    });

    // fade in on new component
    const elem = this._panel;
    elem.style.opacity = 0;
    setTimeout(() => (elem.style.opacity = 1), 10);
  }
  componentWillUnmount() {
    this.xhr.abort();
  }
  render() {
    return (
      <div
        style={[this.props.style.bounding, this.props.dimStyle]}
        ref={d => { this._panel = d; }}
      >
        <div style={this.props.style.panel}>
        {this.state.loaded ?
          <img
            src={this.state.panelContent}
            alt="panel"
            style={this.props.style.panelContent}
          /> :
          <Delay wait={500}>
            <div>'loading...'</div>
          </Delay>}
        </div>
        <div>
          <table style={this.props.style.labelTable}>
            <tbody>
            {this.props.labels.map((d, i) => {
              let labelDiv;
              if (d.type === 'href') {
                labelDiv = (
                  <div
                    // TODO? do we need to use dompurify here to be safe?
                    dangerouslySetInnerHTML={{ __html: d.value }} // eslint-disable-line react/no-danger, max-len
                    style={this.props.style.labelOverflow}
                  />
                );
              } else {
                labelDiv = (
                  <div
                    style={this.props.style.labelOverflow}
                    title={d.value}
                  >
                    {d.value}
                  </div>
                );
              }
              return (
                <tr key={`label${i}`} style={this.props.style.labelRow}>
                  <td
                    style={[this.props.style.labelCell,
                    this.props.style.labelNameCell]}
                  >
                    <div style={this.props.style.labelOverflow}>
                      {d.name}
                    </div>
                  </td>
                  <td
                    style={[this.props.style.labelCell,
                    this.props.style.labelValueCell]}
                  >
                    {labelDiv}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Panel.propTypes = {
  style: React.PropTypes.object,
  labels: React.PropTypes.array,
  iface: React.PropTypes.object,
  cfg: React.PropTypes.object,
  panelKey: React.PropTypes.string,
  dimStyle: React.PropTypes.object
};

export default Radium(Panel);
