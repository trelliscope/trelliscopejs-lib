import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Swipeable from 'react-swipeable';
import Panel from './Panel';
import { setLabels, setLayout } from '../actions';
import { contentWidthSelector, sidebarActiveSelector,
  contentHeightSelector } from '../selectors/ui';
import { cogInfoSelector } from '../selectors/display';
import { currentCogDataSelector, filterCardinalitySelector } from '../selectors/cogData';
import { configSelector, cogInterfaceSelector, layoutSelector,
  aspectSelector, labelsSelector, panelRendererSelector,
  displayInfoSelector, nPerPageSelector, pageNumSelector } from '../selectors';
import uiConsts from '../assets/styles/uiConsts';

const Content = ({ sheet: { classes }, contentStyle, ccd, ci, cinfo, cfg, layout,
  labels, dims, panelRenderer, panelInterface, sidebar, curPage, totPages,
  removeLabel, setPageNum }) => {
  let ret = <div />;

  if (ci && ccd && cinfo && panelRenderer.fn !== null) {
    const panelKeys = [];
    const panelLabels = [];

    for (let i = 0; i < ccd.length; i += 1) {
      panelKeys.push(ccd[i].panelKey);
      const curLabels = [];
      for (let j = 0; j < labels.length; j += 1) {
        curLabels.push({
          name: labels[j],
          value: ccd[i][labels[j]],
          type: cinfo[labels[j]].type,
          desc: cinfo[labels[j]].desc
        });
      }
      panelLabels.push(curLabels);
    }

    // populate a matrix with panel key and cog label information
    // const dataMatrix = new Array(layout.nrow);
    const panelMatrix = [];

    for (let i = 0; i < ccd.length; i += 1) {
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

    // HACK: htmlwidget panels won't resize properly when layout or sidebar is toggled
    // so we need to add this to key to force it to re-draw
    let keyExtra = '';
    if (panelInterface.type === 'htmlwidget') {
      keyExtra = `_${layout.nrow}_${layout.ncol}_${sidebar}_${labels.length}`;
      keyExtra += `_${contentStyle.width}_${contentStyle.height}`;
    }

    ret = (
      <Swipeable
        onSwipedRight={() => setPageNum('right', curPage, totPages)}
        onSwipedLeft={() => setPageNum('left', curPage, totPages)}
      >
        <div className={classes.content} style={contentStyle}>
          {panelMatrix.map(el => (
            <Panel
              key={`${el.key}${keyExtra}`}
              cfg={cfg}
              panelKey={el.key}
              labels={el.labels}
              labelArr={labels}
              iface={ci}
              panelRenderer={panelRenderer}
              panelInterface={panelInterface}
              removeLabel={removeLabel}
              dims={dims}
              rowIndex={el.rowIndex}
              iColIndex={el.iColIndex}
            />
          ))}
        </div>
      </Swipeable>
    );
  }

  return (ret);
};

Content.propTypes = {
  contentStyle: React.PropTypes.object,
  ccd: React.PropTypes.array,
  ci: React.PropTypes.object,
  cinfo: React.PropTypes.object,
  cfg: React.PropTypes.object,
  layout: React.PropTypes.object,
  labels: React.PropTypes.array,
  dims: React.PropTypes.object,
  panelRenderer: React.PropTypes.object,
  panelInterface: React.PropTypes.object,
  sidebar: React.PropTypes.string,
  curPage: React.PropTypes.number,
  totPages: React.PropTypes.number
};

// ------ static styles ------

const staticStyles = {
  content: {
    // border: '3px solid red',
    background: '#fdfdfd',
    position: 'absolute',
    top: uiConsts.header.height,
    right: 0,
    boxSizing: 'border-box',
    padding: 0
  }
};

// ------ redux container ------

const styleSelector = createSelector(
  contentWidthSelector, contentHeightSelector,
  currentCogDataSelector, cogInterfaceSelector,
  layoutSelector, aspectSelector, labelsSelector, cogInfoSelector,
  configSelector, panelRendererSelector, displayInfoSelector,
  sidebarActiveSelector, pageNumSelector, filterCardinalitySelector,
  nPerPageSelector,
  (cw, ch, ccd, ci, layout, aspect, labels, cinfo, cfg, panelRenderer, di, sidebar,
    curPage, card, npp) => {
    const pPad = uiConsts.content.panel.pad; // padding on either side of the panel
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
    const hExtra = ((pPad + 2) * (layout.nrow + 1)) +
      (nLabels * labelHeight * layout.nrow);

    // first try stretching panels across full width:
    let newW = Math.round((cw - wExtra) / layout.ncol, 0);
    // given this, compute panel height
    let newH = Math.round(newW * aspect, 0);
    let wOffset = 0;

    // check to see if this will make it too tall:
    // if so, do row-first full-height stretching
    if (((newH * layout.nrow) + hExtra) > ch) {
      newH = Math.round((ch - hExtra) / layout.nrow, 0);
      newW = Math.round(newH / aspect, 0);
      wOffset = (cw - ((newW * layout.ncol) + wExtra)) / 2;
    }

    const hOffset = uiConsts.header.height;

    return ({
      contentStyle: {
        width: cw,
        height: ch
      },
      ccd,
      ci,
      cinfo,
      cfg,
      layout,
      labels,
      dims: {
        ww: newW,
        hh: newH,
        labelHeight,
        nLabels,
        pWidth: newW,
        pHeight: newH + (nLabels * labelHeight),
        wOffset,
        hOffset,
        pPad
      },
      panelRenderer,
      panelInterface: di.info.panelInterface,
      sidebar,
      curPage,
      totPages: Math.ceil(card / npp)
    });
  }
);

const mapStateToProps = state => (
  styleSelector(state)
);

const mapDispatchToProps = dispatch => ({
  removeLabel: (name, labels) => {
    const idx = labels.indexOf(name);
    if (idx > -1) {
      const newLabels = Object.assign([], labels);
      newLabels.splice(idx, 1);
      dispatch(setLabels(newLabels));
    }
  },
  setPageNum: (dir, curPage, totPages) => {
    let n = curPage;
    if (dir === 'right') {
      n -= 1;
      if (n < 1) {
        n += 1;
      }
    } else {
      n += 1;
      if (n > totPages) {
        n -= 1;
      }
    }
    dispatch(setLayout({ pageNum: n }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectSheet(staticStyles)(Content));
