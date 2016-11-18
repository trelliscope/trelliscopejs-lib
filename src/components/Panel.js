import React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Delay from 'react-delay';
import { fade } from 'material-ui/utils/colorManipulator';
import { json as d3json } from 'd3-request';
import { default as getJSONP } from 'browser-jsonp';
import { findWidget } from '../loadAssets';
import uiConsts from '../assets/styles/uiConsts';

const getJSON = obj =>
  d3json(obj.url, json => obj.callback(json));

class Panel extends React.Component {
  constructor(props) {
    super(props);

    if (props.panelData !== undefined && props.cfg.display_base === '__self__') {
      this.state = {
        panelContent: props.panelRenderer.fn(props.panelData,
          props.dims.ww, props.dims.hh, false, props.panelKey),
        panelData: props.panelData,
        loaded: true
      };
    } else {
      this.state = {
        loaded: false,
        panelContent: null,
        panelData: null,
        hover: ''
      };
    }
  }
  componentDidMount() {
    // async stuff
    if (!this.state.loaded) {
      let filebase = `${this.props.cfg.cog_server.info.base}/${this.props.iface.group}`;
      filebase = `${filebase}/${this.props.iface.name}`;

      if (!window.__panel__) {
        window.__panel__ = {};
      }

      window.__panel__[`_${this.props.panelKey}`] = (json2) => {
        this.setState({
          panelContent: this.props.panelRenderer.fn(json2, this.props.dims.ww,
            this.props.dims.hh, false, this.props.panelKey),
          panelData: json2,
          loaded: true });
        // do post-rendering (if any)
        this.props.panelRenderer.fn(this.state.panelData, this.props.dims.ww,
          this.props.dims.hh, true, this.props.panelKey);
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
    } else {
      this.props.panelRenderer.fn(this.props.panelData, this.props.dims.ww,
        this.props.dims.hh, true, this.props.panelKey);
    }

    // fade in on new component
    const elem = this._panel;
    elem.style.opacity = 0;
    setTimeout(() => (elem.style.opacity = 1), 10);
  }
  componentWillReceiveProps(nprops) {
    // when there is an update, if the size changed, update
    const dh = nprops.dims.ww !== this.props.dims.ww;
    if (this.state.loaded && dh) {
      if (nprops.panelInterface.type === 'image') {
        this.setState({
          panelContent: nprops.panelRenderer.fn(this.state.panelData,
            nprops.dims.ww, nprops.dims.hh, false, nprops.panelKey)
        });
      } else if (nprops.panelInterface.type === 'htmlwidget') {
        const widget = findWidget(nprops.panelInterface.deps.name);
        if (widget) {
          const el = document.getElementById(`widget_${nprops.panelKey}`);
          // this.state.panelData.x.elementid
          if (el) {
            el.style.width = `${nprops.dims.ww}px`;
            el.style.height = `${nprops.dims.hh}px`;
            widget.resize(el, nprops.dims.ww, nprops.dims.hh);
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
    if (this.props.cfg.display_base !== '__self__') {
      window.__panel__[`_${this.props.panelKey}`] = null;
    }
  }
  handleHover(val) {
    this.setState({ hover: val });
  }
  render() {
    const { classes } = this.props.sheet;
    const dims = this.props.dims;
    const rowIndex = this.props.rowIndex;
    const iColIndex = this.props.iColIndex;

    const styles = {
      bounding: {
        width: dims.ww + 2,
        height: dims.hh + (dims.nLabels * dims.labelHeight) + 2,
        top: (dims.pHeight * rowIndex) + ((rowIndex + 1) * dims.pPad) +
          // dims.hOffset +
          (rowIndex * 2),
        right: (dims.pWidth * iColIndex) + ((iColIndex + 1) * dims.pPad) +
          dims.wOffset +
          (iColIndex * 2) + 1
      },
      panel: {
        width: dims.ww,
        height: dims.hh
        // lineHeight: `${dims.hh}px`
      },
      panelContent: {
        width: dims.ww,
        height: dims.hh
      },
      labelTable: {
        width: dims.ww
      },
      labelRow: {
        width: dims.ww,
        height: dims.labelHeight,
        fontSize: dims.labelHeight - ((12 * dims.labelHeight) / 26)
      },
      labelClose: {
        fontSize: dims.labelHeight - ((12 * dims.labelHeight) / 26)
      }
    };

    return (
      <div
        className={classes.bounding}
        style={styles.bounding}
        ref={(d) => { this._panel = d; }}
      >
        <div className={classes.panel} style={styles.panel}>
          {this.state.loaded ?
            this.state.panelContent :
              <Delay wait={500}>
                <div>&apos;loading...&apos;</div>
              </Delay>}
        </div>
        <div>
          <table className={classes.labelTable} style={styles.labelTable}>
            <tbody>
              {this.props.labels.map((d, i) => {
                let labelDiv;
                const removeLabelDiv = (
                  <button
                    className={classes.labelClose}
                    style={Object.assign({}, styles.labelClose,
                      this.state.hover !== d.name && { display: 'none' })}
                    onTouchTap={() => this.props.removeLabel(d.name, this.props.labelArr)}
                  >
                    <i className="icon-times-circle" />
                  </button>
                );
                if (d.type === 'href') {
                  labelDiv = (
                    <div className={classes.labelInner}>
                      <a href={d.value} rel="noopener noreferrer" target="_blank">link</a>
                    </div>
                  );
                } else {
                  labelDiv = (
                    <div
                      className={classes.labelInner}
                      title={d.value}
                    >
                      <p className={classes.labelP}>{d.value}</p>
                    </div>
                  );
                }
                return (
                  <tr
                    key={`label${i}`}
                    className={classNames({
                      [classes.labelRow]: true,
                      [classes.labelRowHover]: this.state.hover === d.name
                    })}
                    style={styles.labelRow}
                    onMouseOver={() => this.handleHover(d.name)}
                    onMouseOut={() => this.handleHover('')}
                  >
                    <td
                      className={`${classes.labelCell} ${classes.labelNameCell}`}
                    >
                      <div className={classes.labelInner}>
                        <span>
                          <a
                            style={{ color: 'inherit', textDecoration: 'none' }}
                            data-tip data-for={`ptooltip_${d.name}`}
                          >
                            <span>{d.name}</span>
                          </a>
                          <ReactTooltip place="right" id={`ptooltip_${d.name}`}>
                            <span>{d.desc}</span>
                          </ReactTooltip>
                        </span>
                      </div>
                    </td>
                    <td className={`${classes.labelCell} ${classes.labelValueCell}`}>
                      <div className={classes.labelOuter}>
                        {labelDiv}
                        {removeLabelDiv}
                      </div>
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
  labels: React.PropTypes.array,
  labelArr: React.PropTypes.array,
  iface: React.PropTypes.object,
  cfg: React.PropTypes.object,
  panelKey: React.PropTypes.string,
  dims: React.PropTypes.object,
  rowIndex: React.PropTypes.number,
  iColIndex: React.PropTypes.number,
  sheet: React.PropTypes.object,
  panelRenderer: React.PropTypes.object,
  panelInterface: React.PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  panelData: React.PropTypes.object,
  removeLabel: React.PropTypes.func
};

// ------ static styles ------

const staticStyles = {
  bounding: {
    transitionProperty: 'all',
    transitionDuration: uiConsts.trans.duration,
    transitionTimingFunction: uiConsts.trans.timing,
    position: 'absolute',
    overflow: 'hidden',
    padding: 0,
    boxSizing: 'border-box',
    border: '1px solid #ddd'
  },
  panel: {
    transitionProperty: 'all',
    transitionDuration: uiConsts.trans.duration,
    transitionTimingFunction: uiConsts.trans.timing,
    boxSizing: 'border-box',
    // background: '#f6f6f6',
    textAlign: 'center',
    color: '#bbb'
  },
  panelContent: {
    transitionProperty: 'all',
    transitionDuration: uiConsts.trans.duration,
    transitionTimingFunction: uiConsts.trans.timing,
    display: 'block'
  },
  labelTable: {
    transitionProperty: 'all',
    transitionDuration: uiConsts.trans.duration,
    transitionTimingFunction: uiConsts.trans.timing,
    padding: 0,
    tableLayout: 'fixed',
    borderSpacing: 0,
    boxSizing: 'border-box'
  },
  labelRow: {
    transitionProperty: 'all',
    transitionDuration: uiConsts.trans.duration,
    transitionTimingFunction: uiConsts.trans.timing,
    background: '#f6f6f6'
  },
  labelRowHover: {
    background: fade('#f6f6f6', 0.4)
  },
  labelCell: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 8,
    paddingRight: 8
    // borderTop: '1px solid white'
  },
  labelNameCell: {
    width: '33%',
    borderRight: '1px solid #fff',
    fontWeight: 400
  },
  labelValueCell: {
    width: '67%'
  },
  labelOuter: {
    position: 'relative',
    overflow: 'hidden'
  },
  labelInner: {
    paddingRight: 3,
    overflow: 'hidden',
    whiteSpace: 'normal',
    verticalAlign: 'middle'
    // overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis'
  },
  labelP: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
    margin: 0
  },
  labelClose: {
    // float: 'right',
    transition: '1s',
    position: 'absolute',
    top: 0,
    right: 2,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
    margin: 0,
    opacity: 0.5
  }
};

export default injectSheet(staticStyles)(Panel);
