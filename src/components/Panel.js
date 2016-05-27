import React from 'react';
import Radium from 'radium';
import Delay from 'react-delay';
import { findDOMNode } from 'react-dom';
import fetch from 'isomorphic-fetch';

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, panelContent: null };
  }
  componentDidMount() {
    const filebase = `vdb/displays/${this.props.iface.group}/${this.props.iface.name}`;
    this.serverRequest = fetch(`${filebase}/png/${this.props.panelKey}.json`)
      .then(response => response.json())
      .then(json => {
        this.setState({ panelContent: json, loaded: true });
      });
    // fade in on new component
    const elem = findDOMNode(this);
    elem.style.opacity = 0;
    setTimeout(() => (elem.style.opacity = 1), 10);
  }
  componentWillUnmount() {
    // need to do something like:
    // this.serverRequest.abort();
    // but I can't find a single non-jQuery JS http library that supports aborting a request
  }
  render() {
    return (
      <div style={[this.props.style.bounding, this.props.dimStyle]}>
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
                    dangerouslySetInnerHTML={{__html: d.value}}
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
  panelKey: React.PropTypes.string,
  dimStyle: React.PropTypes.object
};

export default Radium(Panel);
