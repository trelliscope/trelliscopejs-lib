import React from 'react';
import Radium from 'radium';
import ReactTooltip from 'react-tooltip';
import Delay from 'react-delay';
import { json as d3json } from 'd3-request';
import { default as getJSONP } from 'browser-jsonp';
import { findWidget } from '../loadAssets';

const getJSON = obj =>
  d3json(obj.url, json => obj.callback(json));

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      panelContent: null,
      panelData: null,
      hover: ''
    };
    this.panelContent = null;
  }
  componentDidMount() {
    let filebase = `${this.props.cfg.cog_server.info.base}/${this.props.iface.group}`;
    filebase = `${filebase}/${this.props.iface.name}`;

    if (!window.__panel__) {
      window.__panel__ = {};
    }

    window.__panel__[`_${this.props.panelKey}`] = (json2) => {
      this.setState({
        panelContent: this.props.panelRenderer.fn(json2, this.props.style.panelContent,
          false, this.props.panelKey),
        panelData: json2,
        loaded: true });
      // do post-rendering (if any)
      this.props.panelRenderer.fn(this.state.panelData, this.props.style.panelContent,
        true, this.props.panelKey);
    };

    if (this.props.cfg.cog_server.type === 'jsonp') {
      this.xhr = getJSONP({
        url: `${filebase}/jsonp/${this.props.panelKey}.jsonp`,
        callbackName: `__panel_${this.props.panelKey}__`
      });
    } else {
      this.xhr = getJSON({
        url: `${filebase}/json/${this.props.panelKey}.json`,
        callback: window.__panel__[`_${this.props.panelKey}`]
      });
    }

    // fade in on new component
    const elem = this._panel;
    elem.style.opacity = 0;
    setTimeout(() => (elem.style.opacity = 1), 10);
  }
  componentWillReceiveProps(nprops) {
    // when there is an update, if the size changed, update
    const dh = nprops.style.panelContent.width !== this.props.style.panelContent.width;
    if (this.state.loaded && dh) {
      if (this.props.panelInterface.type === 'image') {
        this.setState({
          panelContent: this.props.panelRenderer.fn(this.state.panelData,
            nprops.style.panelContent, false, this.props.panelKey)
        });
      } else if (this.props.panelInterface.type === 'htmlwidget') {
        const widget = findWidget(this.props.panelInterface.deps.name);
        if (widget) {
          const el = document.getElementById(`widget_${this.props.panelKey}`);
          // this.state.panelData.x.elementid
          if (el) {
            el.style.width = `${nprops.style.panelContent.width}px`;
            el.style.height = `${nprops.style.panelContent.height}px`;
            widget.resize(el, nprops.style.panelContent.width,
              nprops.style.panelContent.height);
          }
        }
      }
    }
  }
  componentWillUnmount() {
    // stop requesting panel assets
    if (this.xhr) {
      this.xhr.abort();
    }
    // remove callback
    window.__panel__[`_${this.props.panelKey}`] = null;
  }
  handleHover(val) {
    this.setState({ hover: val });
  }
  render() {
    return (
      <div
        style={[this.props.style.bounding, this.props.dimStyle]}
        ref={(d) => { this._panel = d; }}
      >
        <div style={this.props.style.panel}>
          {this.state.loaded ?
            this.state.panelContent :
              <Delay wait={500}>
                <div>&apos;loading...&apos;</div>
              </Delay>}
        </div>
        <div>
          <table style={this.props.style.labelTable}>
            <tbody>
              {this.props.labels.map((d, i) => {
                let labelDiv;
                const removeLabelDiv = (
                  <button
                    style={[
                      this.props.style.labelClose,
                      this.state.hover !== d.name && { display: 'none' }
                    ]}
                    onClick={() => this.props.removeLabel(d.name, this.props.labelArr)}
                  >
                    <i className="icon-times-circle" />
                  </button>
                );
                if (d.type === 'href') {
                  labelDiv = (
                    <div
                      style={this.props.style.labelOverflow}
                    >
                      <a href={d.value} rel="noopener noreferrer" target="_blank">link</a>
                      {removeLabelDiv}
                    </div>
                  );
                } else {
                  labelDiv = (
                    <div
                      style={this.props.style.labelOverflow}
                      title={d.value}
                    >
                      {d.value}
                      {removeLabelDiv}
                    </div>
                  );
                }
                return (
                  <tr
                    key={`label${i}`}
                    style={[
                      this.props.style.labelRow,
                      this.state.hover === d.name && this.props.style.labelRowHover
                    ]}
                    onMouseOver={() => this.handleHover(d.name)}
                    onMouseOut={() => this.handleHover('')}
                  >
                    <td
                      style={[this.props.style.labelCell,
                      this.props.style.labelNameCell]}
                    >
                      <div style={this.props.style.labelOverflow}>
                        <span>
                          <a style={{ color: 'inherit' }} data-tip data-for={`ptooltip_${d.name}`}>
                            <span>{d.name}</span>
                          </a>
                          <ReactTooltip place="right" id={`ptooltip_${d.name}`}>
                            <span>{d.desc}</span>
                          </ReactTooltip>
                        </span>
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
  labelArr: React.PropTypes.array,
  iface: React.PropTypes.object,
  cfg: React.PropTypes.object,
  panelKey: React.PropTypes.string,
  dimStyle: React.PropTypes.object,
  panelRenderer: React.PropTypes.object,
  panelInterface: React.PropTypes.object,
  removeLabel: React.PropTypes.func
};

export default Radium(Panel);
