import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Delay from 'react-delay';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Popover from '@material-ui/core/Popover';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { json as d3json } from 'd3-request';
import { default as getJSONP } from 'browser-jsonp'; // eslint-disable-line import/no-named-default
import { getLocalStorageKey, setPanelCogInput } from '../inputUtils';
import { findWidget } from '../loadAssets';
import uiConsts from '../assets/styles/uiConsts';

const getJSON = (obj) => d3json(obj.url, (json) => obj.callback(json));

class Panel extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();

    this.isSelfContained = props.panelData !== undefined
      && props.cfg.display_base === '__self__';

    let names = [props.curDisplayInfo.info.name];
    if (props.relDispPositions.length > 0) {
      names = props.relDispPositions.map((d) => d.name);
    }

    const initialState = {
      panels: {},
      hover: '',
      textInputOpen: '',
      textInputValue: '',
      inputChangeCounter: 0 // to trigger state change if user inputs are updated
    };

    names.forEach((name) => {
      const { panelInterface } = props.displayInfo[name].info;
      const isImageSrc = panelInterface.type === 'image_src';
      if (isImageSrc) {
        initialState.panels[name] = {
          panelContent: props.panelRenderers[name].fn(
            props.displayInfo[name].info.imgSrcLookup[props.panelKey],
            props.dims.ww, props.dims.hh, false, props.panelKey),
          panelData: props.panelData,
          loaded: true
        };
      } else if (this.isSelfContained) {
        initialState.panels[name] = {
          panelContent: props.panelRenderers[name].fn(props.panelData,
            props.dims.ww, props.dims.hh, false, props.panelKey),
          panelData: props.panelData,
          loaded: true
        };
      } else {
        initialState.panels[name] = {
          loaded: false,
          panelContent: null,
          panelData: null
        };
      }
    });
    this.state = initialState;
  }

  componentDidMount() {
    // async stuff
    const { panels } = this.state;
    // const loaded = Object.keys(panels).every((k) => panels[k].loaded);
    const {
      cfg, panelKey, panelRenderers, dims, curDisplayInfo,
      displayInfo, relDispPositions
    } = this.props;

    let names = [curDisplayInfo.info.name];
    if (relDispPositions.length > 0) {
      names = relDispPositions.map((d) => d.name);
    }
    names.forEach((name, i) => {
      const panelRenderer = panelRenderers[name];
      const curIface = displayInfo[name].info.cogInterface;

      let width = dims.ww;
      let height = dims.hh;
      if (relDispPositions.length > 0) {
        height = dims.hh * relDispPositions[i].height;
        width = height / relDispPositions[i].aspect;
      }

      if (!panels[name].loaded) {
        let filebase = `${cfg.cog_server.info.base}${curIface.group}`;
        filebase = `${filebase}/${curIface.name}`;

        if (!window.__panel__) {
          window.__panel__ = {};
        }

        window.__panel__[`_${panelKey}_${name}`] = (json2) => {
          // eslint-disable-next-line react/destructuring-assignment
          const pnls = this.state.panels;
          this.setState({
            panels: {
              ...pnls,
              [name]: {
                panelContent: panelRenderer.fn(json2, width,
                  height, false, `${panelKey}_${name}`),
                panelData: json2,
                loaded: true
              }
            }
          });
        };

        if (cfg.cog_server.type === 'jsonp') {
          this.xhr = getJSONP({
            url: `${filebase}/jsonp/${panelKey}.jsonp`,
            callbackName: `__panel_${panelKey}_${name}`
          });
        } else {
          this.xhr = getJSON({
            url: `${filebase}/json/${panelKey}.json`,
            callback: window.__panel__[`_${panelKey}_${name}`]
          });
        }
      } else {
        panelRenderer.fn(panels[name].panelData, width,
          height, true, `${panelKey}_${name}`);
      }
    });

    // fade in on new component
    const elem = this._panel;
    elem.style.opacity = 0;
    setTimeout(() => (elem.style.opacity = 1), 10); // eslint-disable-line no-return-assign
  }

  // resizing (only when viewing single displays - not related displays)
  UNSAFE_componentWillReceiveProps(nprops) { // eslint-disable-line camelcase
    const { panels } = this.state;
    const loaded = Object.keys(panels).every((k) => panels[k].loaded);
    const { dims } = this.props;
    // when there is an update, if the size changed, update
    const dh = nprops.dims.ww !== dims.ww;
    const { name } = nprops.curDisplayInfo.info;
    if (loaded && dh) {
      if (nprops.panelInterface.type === 'image') {
        const panelRenderer = nprops.panelRenderers[name];
        const newPanels = { ...panels };
        if (nprops.relDispPositions.length === 0) {
          newPanels[name].panelContent = panelRenderer.fn(panels[name].panelData,
            nprops.dims.ww, nprops.dims.hh, false, `${nprops.panelKey}_${name}`);
        }
        this.setState({
          panels: newPanels
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

  // do post-rendering (if any)
  componentDidUpdate() {
    const { panels } = this.state;
    const {
      panelKey, panelRenderers, dims, curDisplayInfo,
      relDispPositions
    } = this.props;

    let names = [curDisplayInfo.info.name];
    if (relDispPositions.length > 0) {
      names = relDispPositions.map((d) => d.name);
    }
    names.forEach((name, i) => {
      if (panels[name].loaded) {
        let width = dims.ww;
        let height = dims.hh;
        if (relDispPositions.length > 0) {
          height = dims.hh * relDispPositions[i].height;
          width = height / relDispPositions[i].aspect;
        }
        const panelRenderer = panelRenderers[name];
        panelRenderer.fn(panels[name].panelData, width,
          height, true, `${panelKey}_${name}`);
      }
    });
  }

  componentWillUnmount() {
    const { panelKey, curDisplayInfo } = this.props;
    const { name } = curDisplayInfo.info;

    // stop requesting panel assets
    if (this.xhr) {
      this.xhr.abort();
    }
    // remove callback
    if (!this.isSelfContained && window.__panel__ && window.__panel__[`_${panelKey}_${name}`]) {
      window.__panel__[`_${panelKey}_${name}`] = null;
    }
  }

  setTextInputOpen(val) {
    this.setState({ textInputOpen: val });
  }

  handleHover(val) {
    this.setState({ hover: val });
  }

  render() {
    const {
      classes, dims, rowIndex, iColIndex, labels, labelArr,
      removeLabel, curDisplayInfo, relDispPositions, panelKey
    } = this.props;
    const {
      panels, hover, inputChangeCounter, textInputOpen
    } = this.state;

    const { name } = curDisplayInfo.info;
    const loaded = Object.keys(panels).every((k) => panels[k].loaded);
    let { panelContent } = panels[name];
    if (loaded && relDispPositions.length > 0) {
      panelContent = (
        <div>
          {relDispPositions.map((d) => (
            <div
              key={d.name}
              style={{
                position: 'absolute',
                top: d.top * dims.hh,
                left: d.left * (dims.hh),
                height: d.height * dims.hh,
                width: d.width * dims.hh
              }}
            >
              {panels[d.name].panelContent}
            </div>
          ))}
        </div>
      );
    }
    const bWidth = relDispPositions.length > 0 ? dims.contentWidth - 6 : dims.ww;
    const bRight = relDispPositions.length > 0 ? 1 : (dims.pWidth * iColIndex)
      + ((iColIndex + 1) * dims.pPad)
      + dims.wOffset
      + (iColIndex * 2) + 1;
    const styles = {
      bounding: {
        width: bWidth + 2,
        height: dims.hh + (dims.nLabels * dims.labelHeight) + 2,
        top: (dims.pHeight * rowIndex) + ((rowIndex + 1) * dims.pPad) // + dims.hOffset
          + (rowIndex * 2),
        right: bRight
      },
      panel: {
        width: bWidth,
        height: dims.hh
        // lineHeight: `${dims.hh}px`
      },
      panelContent: {
        width: bWidth,
        height: dims.hh
      },
      labelTable: {
        width: bWidth
      },
      labelRow: {
        width: bWidth,
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
      },
      radioDiv: {
        transform: `scale(${dims.labelHeight / 29})`,
        transformOrigin: 'left top',
        marginTop: -4
      }
    };

    return (
      <div
        className={classes.bounding}
        style={styles.bounding}
        ref={(d) => { this._panel = d; }}
      >
        <div className={classes.panel} style={styles.panel}>
          {loaded ? panelContent : (
            <Delay wait={500}>
              <div>&apos;loading...&apos;</div>
            </Delay>
          )}
        </div>
        <div ref={this.myRef}>
          <table className={classes.labelTable} style={styles.labelTable}>
            <tbody>
              {labels.map((d, i) => {
                let labelDiv;
                const removeLabelDiv = (
                  <button
                    type="button"
                    className={classes.labelClose}
                    style={({
                      ...styles.labelClose,
                      ...(hover !== d.name && { display: 'none' })
                    })}
                    onClick={() => removeLabel(d.name, labelArr)}
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
                } else if (d.type === 'href_hash') {
                  labelDiv = (
                    <div className={classes.labelInner} style={styles.labelInner}>
                      <a
                        style={{ ...styles.labelSpan, textDecoration: 'none' }}
                        href="#open_in_same_window"
                        onClick={() => {
                          window.location.href = d.value; window.location.reload();
                        }}
                      >
                        <i className="icon-open" style={styles.linkIcon} />
                      </a>
                    </div>
                  );
                } else if (d.type === 'input_radio') {
                  const lsKey = getLocalStorageKey(curDisplayInfo.info, panelKey, d.name);
                  const opts = curDisplayInfo.info.cogInfo[d.name].options;
                  labelDiv = (
                    <div
                      className={classes.labelInner}
                      style={styles.labelInner}
                      title={d.value}
                    >
                      <div style={styles.radioDiv}>
                        <RadioGroup
                          aria-label={d.name}
                          name={d.name}
                          classes={{ root: classes.formRow }}
                          value={localStorage.getItem(lsKey) || ''}
                          // onChange={(event) => {
                          onClick={(event) => {
                            if (event.target.value) {
                              setPanelCogInput(curDisplayInfo.info, event.target.value, panelKey, d.name);
                              document.activeElement.blur();
                              this.setState({ inputChangeCounter: inputChangeCounter + 1 });
                            }
                          }}
                          row
                        >
                          {opts.map((a) => (
                            <FormControlLabel key={a} value={a} control={<Radio disableRipple size="small" />} label={a} />
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  );
                } else if (d.type === 'input_text') {
                  const lsKey = `${curDisplayInfo.info.group}_:_${curDisplayInfo.info.name}_:_${panelKey}_:_${d.name}`;
                  const divRef = React.createRef();
                  const editInputButton = (
                    <button
                      type="button"
                      className={classes.editButton}
                      style={({
                        ...styles.labelClose
                        // ...({ right: dims.fontSize + 4 })
                        // ...(localStorage.getItem(lsKey) === undefined && { display: 'none' })
                      })}
                      onClick={() => this.setTextInputOpen(d.name)}
                    >
                      <EditIcon style={{ fontSize: dims.fontSize }} />
                    </button>
                  );
                  labelDiv = (
                    <div
                      className={classes.labelInner}
                      style={({
                        ...styles.labelInner,
                        ...({ display: 'flex', paddingRight: dims.fontSize + 4 })
                      })}
                      title={d.value}
                      ref={divRef}
                    >
                      <div
                        className={classes.labelP}
                        style={{ fontSize: dims.fontSize }}
                        onClick={() => this.setTextInputOpen(d.name)}
                        role="button"
                        onKeyDown={() => {}}
                        tabIndex="-1"
                      >
                        {localStorage.getItem(lsKey) || ''}
                      </div>
                      <div>{editInputButton}</div>
                      <Popover
                        open={textInputOpen === d.name}
                        anchorEl={this.myRef.current}
                        // anchorReference="anchorPosition"
                        // anchorPosition={{ top: 200, left: 400 }}
                        onClose={() => {
                          this.setTextInputOpen('');
                          setPanelCogInput(curDisplayInfo.info, this.state.textInputValue, panelKey, d.name);
                          this.setState({ inputChangeCounter: inputChangeCounter + 1 });
                        }}
                        onEnter={() => {
                          this.setState({ textInputValue: localStorage.getItem(lsKey) || ''});
                        }}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center'
                        }}
                      >
                        <div style={{ padding: 7 }}>
                          <TextField
                            id="outlined-multiline-static"
                            label={`${d.name} ('esc' when complete)`}
                            onChange={(e) => {
                              this.setState({ textInputValue: e.target.value });
                            }}
                            value={this.state.textInputValue}
                            style={{ minWidth: 300 }}
                            size="small"
                            autoFocus
                            multiline
                            rows={curDisplayInfo.info.cogInfo[d.name].height}
                            variant="outlined"
                          />
                        </div>
                      </Popover>
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
                      [classes.labelRowHover]: hover === d.name
                    })}
                    style={styles.labelRow}
                    onMouseOver={() => this.handleHover(d.name)}
                    onFocus={() => this.handleHover(d.name)}
                    onMouseOut={() => this.handleHover('')}
                    onBlur={() => this.handleHover('')}
                  >
                    <td
                      className={`${classes.labelCell} ${classes.labelNameCell}`}
                      style={styles.labelNameCell}
                    >
                      <div
                        className={classes.labelInner}
                        style={styles.labelInner}
                        data-tip
                        data-for={`tooltip_${panelKey}_${d.name}`}
                      >
                        <span style={styles.labelSpan}>{d.name}</span>
                      </div>
                      {d.name !== d.desc && (
                        <ReactTooltip place="right" id={`tooltip_${panelKey}_${d.name}`}>
                          <span>{d.desc}</span>
                        </ReactTooltip>
                      )}
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
  labels: PropTypes.array.isRequired,
  labelArr: PropTypes.array.isRequired,
  // iface: PropTypes.object.isRequired,
  cfg: PropTypes.object.isRequired,
  panelKey: PropTypes.string.isRequired,
  dims: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  iColIndex: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  panelRenderers: PropTypes.object.isRequired,
  panelInterface: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
  panelData: PropTypes.object,
  displayInfo: PropTypes.object.isRequired,
  curDisplayInfo: PropTypes.object.isRequired,
  relDispPositions: PropTypes.array.isRequired,
  removeLabel: PropTypes.func.isRequired
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
    position: 'relative',
    cursor: 'default'
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
  },
  editButton: {
    // float: 'right',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    padding: 0,
    margin: 0,
    opacity: 0.5
  },
  formRow: {
    flexWrap: 'unset'
  }
};

export default injectSheet(staticStyles)(Panel);
