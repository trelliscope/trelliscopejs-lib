import React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';
// import ReactTooltip from 'react-tooltip';
import Delay from 'react-delay';
import { fade } from 'material-ui/utils/colorManipulator';
import { json as d3json } from 'd3-request';
import { default as getJSONP } from 'browser-jsonp'; // eslint-disable-line import/no-named-default
import { findWidget } from '../loadAssets';
import uiConsts from '../assets/styles/uiConsts';

const getJSON = obj =>
  d3json(obj.url, json => obj.callback(json));

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.isImageSrc = props.panelInterface.type === 'image_src';
    this.isSelfContained = props.panelData !== undefined &&
      props.cfg.display_base === '__self__';

    if (this.isImageSrc) {
      this.state = {
        panelContent: props.panelRenderer.fn(props.panelData.url,
          props.dims.ww, props.dims.hh, false, props.panelKey),
        panelData: props.panelData,
        loaded: true
      };
    } else if (this.isSelfContained) {
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
    if (!(this.isSelfContained || this.isImageSrc)) {
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
        lineHeight: `${dims.labelHeight}px`
      },
      labelSpan: {
        fontSize: dims.fontSize,
        position: 'absolute'
      },
      labelClose: {
        fontSize: dims.fontSize,
        lineHeight: `${dims.labelHeight}px`
      },
      labelInner: {
        height: dims.labelHeight
      },
      labelNameCell: {
        paddingLeft: (dims.labelPad / 2) + 2,
        paddingRIght: (dims.labelPad / 2) + 2,
        width: dims.labelWidth
      },
      labelValueCell: {
        paddingLeft: (dims.labelPad / 2) + 2,
        paddingRIght: (dims.labelPad / 2) + 2
      },
      linkIcon: {
        textDecoration: 'none',
        fontSize: dims.fontSize - 2
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
                    <div className={classes.labelInner} style={styles.labelInner}>
                      <a
                        style={{ ...styles.labelSpan, textDecoration: 'none' }}
                        href={d.value}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <i className="icon-open" style={styles.linkIcon} />
                      </a>
                    </div>
                  );
                } else {
                  labelDiv = (
                    <div
                      className={classes.labelInner}
                      style={styles.labelInner}
                      title={d.value}
                    >
                      <span className={classes.labelP} style={styles.labelSpan}>{d.value}</span>
                    </div>
                  );
                }
                return (
                  <tr
                    key={`${d.name}`}
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
                      style={styles.labelNameCell}
                    >
                      <div className={classes.labelInner} style={styles.labelInner}>
                        <span style={styles.labelSpan}>{d.name}</span>
                      </div>
                    </td>
                    <td
                      className={classes.labelCell}
                      style={styles.labelValueCell}
                    >
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
  labels: React.PropTypes.array.isRequired,
  labelArr: React.PropTypes.array.isRequired,
  iface: React.PropTypes.object.isRequired,
  cfg: React.PropTypes.object.isRequired,
  panelKey: React.PropTypes.string.isRequired,
  dims: React.PropTypes.object.isRequired,
  rowIndex: React.PropTypes.number.isRequired,
  iColIndex: React.PropTypes.number.isRequired,
  sheet: React.PropTypes.object.isRequired,
  panelRenderer: React.PropTypes.object.isRequired,
  panelInterface: React.PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  panelData: React.PropTypes.object,
  removeLabel: React.PropTypes.func.isRequired
};

Panel.defaultProps = () => ({
  panelInterface: undefined,
  panelData: undefined
});

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
    overflow: 'hidden',
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
    paddingBottom: 0
    // borderTop: '1px solid white'
  },
  labelNameCell: {
    borderRight: '1px solid #fff',
    fontWeight: 400
  },
  labelOuter: {
    position: 'relative',
    overflow: 'hidden'
  },
  labelInner: {
    paddingRight: 3,
    overflow: 'hidden',
    whiteSpace: 'normal',
    verticalAlign: 'middle',
    position: 'relative'
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
