import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Panel from './Panel';
import { uiConstsSelector, contentWidthSelector, contentHeightSelector } from '../selectors';
import { currentJSONIndexSelector, cogInterfaceSelector,
  layoutSelector, aspectSelector, labelsSelector } from '../selectors/cogInterface.js';

const Content = ({ style, idx, ci, layout, labels }) => {

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
        curLabels.push({ name: labels[j], value: ci.info[labels[j]][idx[i]] });
      }
      panelLabels.push(curLabels);
    }

    // populate a matrix with panel key and cog label information
    const dataMatrix = new Array(layout.nrow);
    for (let i = 0; i < layout.nrow; i++) {
      dataMatrix[i] = new Array(layout.ncol);
    }
    for (let i = 0; i < idx.length; i++) {
      let rr;
      let cc;
      if (idx.arrange === 'row') {
        rr = Math.floor(i / layout.ncol);
        cc = i % layout.ncol;
      } else {
        rr = i % layout.nrow;
        cc = Math.floor(i / layout.nrow);
      }
      dataMatrix[rr][cc] = { key: panelKeys[i], labels: panelLabels[i] };
    }

    ret = (
      <div style={style.bounding}>
      <table>
      <tbody>
      {dataMatrix.map((rr, i) => (
        <tr key={`row${i}`}>
        {rr.map((el, j) => (
          <Panel
            key={el.key}
            panelKey={el.key}
            labels={el.labels}
            style={style.panel}
            iface={ci.iface}
          />
        ))}
        </tr>
      ))}
      </tbody>
      </table>
      </div>
    );
  }

  return (ret);
};

Content.propTypes = {
  style: React.PropTypes.object,
  idx: React.PropTypes.array
};

// ------ redux container ------

const styleSelector = createSelector(
  contentWidthSelector, contentHeightSelector, uiConstsSelector,
  currentJSONIndexSelector, cogInterfaceSelector, layoutSelector,
  aspectSelector, labelsSelector,
  (cw, ch, ui, idx, ci, layout, aspect, labels) => {
    const tPad = 3; // padding on either side of the panel
    // height of row of cog label depends on number of rows
    // based on font size decreasing wrt rows as 1->14, 2->12, 3->10, 4+->8
    const cogHeightArr = [26, 24, 22, 19];
    const cogHeight = cogHeightArr[Math.min(layout.nrow - 1, 3)];
    const nCog = labels.length; // number of cogs to show
    // extra padding beyond what is plotted
    // these remain fixed while width and height can change
    const wExtra = 2 + 2 * tPad; // 2 for border + tPad on either side
    const hExtra = 2 + 2 * tPad + nCog * cogHeight; // 2 for border + tPad on top / bottom + cogHeight for every row of visible cognostics

    // first try stretching panels across full width:
    let newW = Math.round((cw - (wExtra * layout.ncol)) / layout.ncol, 0);
    // given this, compute panel height
    let newH = Math.round(newW * aspect, 0);

    // check to see if this will make it too tall:
    // if so, do row-first full-height stretching
    if ((newH + hExtra) * layout.nrow > ch) {
      newH = Math.round((ch - (hExtra * layout.nrow)) / layout.nrow, 0);
      newW = Math.round(newH / aspect, 0);
    }

    return ({
      style: {
        bounding: {
          position: 'absolute',
          top: ui.header.height,
          right: 0,
          boxSizing: 'border-box',
          padding: 0,
          // border: '3px solid red',
          width: cw,
          height: ch
        },
        panel: {
          plot: {
            width: newW,
            heigth: newH
          },
          labels: {
            width: newW,
            height: cogHeight,
            fontSize: cogHeight - 12
          }
        }
      },
      idx,
      ci,
      layout,
      labels
    });
  }
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Content);
