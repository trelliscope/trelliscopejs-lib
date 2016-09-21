import React from 'react';
import Radium from 'radium';
import Delay from 'react-delay';
import { json as getJSON } from 'd3-request';
import { findWidget } from '../loadAssets';

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      panelContent: null,
      panelData: null
    };
    this.panelContent = null;
  }
  componentDidMount() {
    let filebase = `${this.props.cfg.display_base}/displays/${this.props.iface.group}`;
    filebase = `${filebase}/${this.props.iface.name}`;

    this.xhr = getJSON(`${filebase}/json/${this.props.panelKey}.json`, (json) => {
      this.setState({
        panelContent: this.props.panelRenderer.fn(json, this.props.style.panelContent,
          false, this.props.panelKey),
        panelData: json,
        loaded: true });
      // do post-rendering (if any)
      this.props.panelRenderer.fn(this.state.panelData, this.props.style.panelContent,
        true, this.props.panelKey);
    });

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
  // componentDidUpdate() {
  //   if (this.state.loaded && this.props.panelInterface.type === 'htmlwidget') {
  //     const widget = findWidget(this.props.panelInterface.deps.name);
  //     if (widget) {
  //       const el = document.getElementById(`widget_${this.props.panelKey}`);
  //       // this.state.panelData.x.elementid
  //       if (el) {
  //         el.style.width = `${this.props.style.panelContent.width}px`;
  //         el.style.height = `${this.props.style.panelContent.height}px`;
  //         widget.resize(el, this.props.style.panelContent.width,
  //           this.props.style.panelContent.height);
  //       }
  //     }
  //   }
  // }
  componentWillUnmount() {
    // stop requesting panel assets
    this.xhr.abort();
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
  dimStyle: React.PropTypes.object,
  panelRenderer: React.PropTypes.object,
  panelInterface: React.PropTypes.object
};

export default Radium(Panel);
