import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Panel from './Panel';
import { uiConstsSelector, contentWidthSelector, contentHeightSelector } from '../selectors';
import { cogInfoObjSelector } from '../selectors/display';
import { currentJSONIndexSelector, cogInterfaceSelector,
  layoutSelector, aspectSelector, labelsSelector } from '../selectors/cogInterface.js';

const Content = ({ style, idx, ci, cinfo, layout, labels, dims }) => {
  let ret = <div></div>;

  if (ci.iface && ci.info) {
    // TODO: make this generalized to REST / websockets
    // and make it async and go in componentDidMount
    // it should only rely on idx and ci in the case of client-side JSON cog interface
    const panelKeys = [];
    const panelLabels = [];
    for (let i = 0; i < idx.length; i++) {
      panelKeys.push(ci.info.panelKey[idx[i]]);
      const curLabels = [];
      for (let j = 0; j < labels.length; j++) {
        curLabels.push({
          name: labels[j],
          value: ci.info[labels[j]][idx[i]],
          type: cinfo[labels[j]].type
        });
      }
      panelLabels.push(curLabels);
    }

    // populate a matrix with panel key and cog label information
    // const dataMatrix = new Array(layout.nrow);
    const panelMatrix = [];

    for (let i = 0; i < idx.length; i++) {
      let rr;
      let cc;
      if (layout.arrange === 'row') {
        rr = Math.floor(i / layout.ncol);
        cc = i % layout.ncol;
      } else {
        rr = i % layout.nrow;
        cc = Math.floor(i / layout.nrow);
      }
      panelMatrix.push(
        {
          rowIndex: rr,
          colIndex: cc,
          iColIndex: layout.ncol - cc - 1,
          key: panelKeys[i],
          labels: panelLabels[i]
        }
      );
    }
    panelMatrix.sort((a, b) => ((a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0)));

    ret = (
      <div style={style.bounding}>
        {panelMatrix.map((el) => (
          <Panel
            key={el.key}
            panelKey={el.key}
            labels={el.labels}
            style={style.panel}
            iface={ci.iface}
            dimStyle={{
              top: dims.pHeight * el.rowIndex + (el.rowIndex + 1) * dims.pPad +
                dims.hOffset + el.rowIndex * 2,
              right: dims.pWidth * el.iColIndex + (el.iColIndex + 1) * dims.pPad +
                dims.wOffset + el.iColIndex * 2 + 1
            }}
          />
        ))}
      </div>
    );
  }

  return (ret);
};

Content.propTypes = {
  style: React.PropTypes.object,
  idx: React.PropTypes.array,
  ci: React.PropTypes.object,
  cinfo: React.PropTypes.object,
  layout: React.PropTypes.object,
  labels: React.PropTypes.array,
  dims: React.PropTypes.object
};

// ------ redux container ------

const styleSelector = createSelector(
  contentWidthSelector, contentHeightSelector, uiConstsSelector,
  currentJSONIndexSelector, cogInterfaceSelector, layoutSelector,
  aspectSelector, labelsSelector, cogInfoObjSelector,
  (cw, ch, ui, idx, ci, layout, aspect, labels, cinfo) => {
    const pPad = ui.content.panel.pad; // padding on either side of the panel
    // height of row of cog label depends on number of rows
    // based on font size decreasing wrt rows as 1->14, 2->12, 3->10, 4+->7
    const labelHeightArr = [26, 24, 22, 19];
    const maxDim = Math.max(layout.nrow, layout.ncol - 2);
    const labelHeight = labelHeightArr[Math.min(maxDim - 1, 3)];
    const nLabels = labels.length; // number of cogs to show
    // extra padding beyond what is plotted
    // these remain fixed while width and height can change
    // for ppad + 2, "+ 2" is border
    const wExtra = (pPad + 2) * (layout.ncol + 1);
    const hExtra = (pPad + 2) * (layout.nrow + 1) + nLabels * labelHeight * layout.nrow;

    // first try stretching panels across full width:
    let newW = Math.round((cw - wExtra) / layout.ncol, 0);
    // given this, compute panel height
    let newH = Math.round(newW * aspect, 0);
    let wOffset = 0;

    // check to see if this will make it too tall:
    // if so, do row-first full-height stretching
    if ((newH * layout.nrow + hExtra) > ch) {
      newH = Math.round((ch - hExtra) / layout.nrow, 0);
      newW = Math.round(newH / aspect, 0);
      wOffset = (cw - (newW * layout.ncol + wExtra)) / 2;
    }

    const hOffset = ui.header.height;

    return ({
      style: {
        bounding: {
          // border: '3px solid red',
          background: '#fdfdfd',
          position: 'fixed',
          top: ui.header.height,
          right: 0,
          boxSizing: 'border-box',
          padding: 0,
          width: cw,
          height: ch
        },
        panel: {
          bounding: {
            transitionProperty: 'all',
            transitionDuration: ui.trans.duration,
            transitionTimingFunction: ui.trans.timing,
            position: 'fixed',
            overflow: 'hidden',
            width: newW + 2,
            height: newH + nLabels * labelHeight + 2,
            padding: 0,
            boxSizing: 'border-box',
            border: '1px solid #ddd'
          },
          panel: {
            transitionProperty: 'all',
            transitionDuration: ui.trans.duration,
            transitionTimingFunction: ui.trans.timing,
            width: newW,
            height: newH,
            boxSizing: 'border-box',
            background: '#f6f6f6',
            textAlign: 'center',
            lineHeight: `${newH}px`,
            color: '#bbb'
          },
          panelContent: {
            transitionProperty: 'all',
            transitionDuration: ui.trans.duration,
            transitionTimingFunction: ui.trans.timing,
            display: 'block',
            width: newW,
            height: newH
          },
          labelTable: {
            transitionProperty: 'all',
            transitionDuration: ui.trans.duration,
            transitionTimingFunction: ui.trans.timing,
            width: newW,
            padding: 0,
            tableLayout: 'fixed',
            borderSpacing: 0,
            boxSizing: 'border-box'
          },
          labelRow: {
            transitionProperty: 'all',
            transitionDuration: ui.trans.duration,
            transitionTimingFunction: ui.trans.timing,
            width: newW,
            height: labelHeight,
            fontSize: labelHeight - 12,
            background: '#f6f6f6'
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
          labelOverflow: {
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }
        }
      },
      idx,
      ci,
      cinfo,
      layout,
      labels,
      dims: {
        pWidth: newW,
        pHeight: newH + nLabels * labelHeight,
        wOffset,
        hOffset,
        pPad
      }
    });
  }
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Content);
