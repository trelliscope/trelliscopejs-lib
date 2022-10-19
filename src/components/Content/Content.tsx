import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { max } from 'd3-array';
import { Dispatch } from 'redux';
import { Swipeable } from 'react-swipeable';
import Panel from '../Panel';
import { setLabels, setLayout } from '../../actions';
import {
  configSelector,
  cogInterfaceSelector,
  layoutSelector,
  aspectSelector,
  labelsSelector,
  panelRenderersSelector,
  curDisplayInfoSelector,
  nPerPageSelector,
  pageNumSelector,
  localPanelsSelector,
  displayInfoSelector,
} from '../../selectors';
import { contentWidthSelector, sidebarActiveSelector, contentHeightSelector } from '../../selectors/ui';
import { cogInfoSelector } from '../../selectors/display';
import { currentCogDataSelector, filterCardinalitySelector } from '../../selectors/cogData';
import type { RootState } from '../../store';
import styles from './Content.module.scss';

interface ContentProps {
  contentStyle: {
    width: number;
    height: number;
  };
  ccd: { [key: string]: string | number; panelKey: string }[];
  ci: DisplayObject['cogInterface'];
  cinfo: DisplayObject['cogInfo'];
  cfg: Config;
  layout: LayoutState;
  labels: string[];
  dims: Dims;
  panelInterface: PanelInterface;
  curPage: number;
  totPages: number;
  removeLabel: (label: string, labels: string[]) => void;
  setPageNum: (dir: 'right' | 'left', curPage: number, totPages: number) => void;
  curDisplayInfo: DisplayInfoState;
  displayInfo: {
    [key: string]: DisplayInfoState;
  };
  relDispPositions: RelDispPositions[];
}

const Content: React.FC<ContentProps> = ({
  contentStyle,
  ccd,
  ci,
  cinfo,
  cfg,
  layout,
  labels,
  dims,
  panelInterface,
  curPage,
  totPages,
  removeLabel,
  setPageNum,
  curDisplayInfo,
  displayInfo,
  relDispPositions,
}) => {
  let ret = <div />;

  let names = [curDisplayInfo.info.name];
  if (relDispPositions.length > 0) {
    names = relDispPositions.map((d) => d.name);
  }

  const hasDisplayInfo = names.every((name) => displayInfo[name] && displayInfo[name].isLoaded);

  if (ci && ccd && cinfo && hasDisplayInfo) {
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
          desc: cinfo[labels[j]].desc,
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
      panelMatrix.push({
        rowIndex: rr,
        colIndex: cc,
        iColIndex: layout.ncol - cc - 1,
        key: panelKeys[i],
        labels: panelLabels[i],
      });
    }
    panelMatrix.sort((a, b) => (a.key > b.key ? 1 : b.key > a.key ? -1 : 0));

    // HACK: htmlwidget panels won't resize properly when layout or sidebar is toggled
    // so we need to add this to key to force it to re-draw
    let keyExtra = '';
    // TODO: see if we can get htmlwidget resize method to work instead
    // resize method seems to be working now, but we'll keep this in case
    /* if (panelInterface.type === 'htmlwidget') {
      keyExtra = `_${layout.nrow}_${layout.ncol}_${sidebar}_${labels.length}`;
      keyExtra += `_${contentStyle.width}_${contentStyle.height}`;
    } */
    if (relDispPositions.length > 0) {
      const relDispNames = relDispPositions.map((d) => d.name).join('_');
      const relDispSum = relDispPositions.map((d) => d.left + d.top + d.width + d.height).reduce((a, b) => a + b);
      keyExtra = `${keyExtra}_${relDispNames}_${relDispSum}_${labels.length}`;
      keyExtra += `_${contentStyle.height}`;
    }

    ret = (
      <Swipeable
        onSwipedRight={() => setPageNum('right', curPage, totPages)}
        onSwipedLeft={() => setPageNum('left', curPage, totPages)}
      >
        <div className={styles.content} style={contentStyle}>
          {panelMatrix.map((el) => (
            <Panel
              key={el.key}
              cfg={cfg}
              panelKey={el.key}
              labels={el.labels}
              labelArr={labels}
              panelInterface={panelInterface}
              removeLabel={removeLabel}
              dims={dims}
              rowIndex={el.rowIndex}
              iColIndex={el.iColIndex}
              curDisplayInfo={curDisplayInfo}
              displayInfo={displayInfo}
              relDispPositions={relDispPositions}
            />
          ))}
        </div>
      </Swipeable>
    );
  }

  return ret;
};

const getTextWidth = (labels: string[], size: number): number => {
  const el = document.createElement('span');
  el.style.fontWeight = 'normal';
  el.style.fontSize = `${size}px`;
  el.style.fontFamily = 'Open Sans';
  el.style.visibility = 'hidden';
  const docEl = document.body.appendChild(el);
  const w = labels.map((lb) => {
    docEl.innerHTML = lb;
    return docEl.offsetWidth;
  });
  document.body.removeChild(docEl);
  return max(w) as number;
};

const relDispPositionsSelector = (state: RootState) => state.relDispPositions;

const stateSelector = createSelector(
  contentWidthSelector,
  contentHeightSelector,
  currentCogDataSelector,
  cogInterfaceSelector,
  layoutSelector,
  aspectSelector,
  labelsSelector,
  cogInfoSelector,
  configSelector,
  curDisplayInfoSelector,
  sidebarActiveSelector,
  pageNumSelector,
  filterCardinalitySelector,
  nPerPageSelector,
  localPanelsSelector,
  relDispPositionsSelector,
  displayInfoSelector,
  (cw, ch, ccd, ci, layout, aspect, labels, cinfo, cfg, cdi, sidebar, curPage, card, npp, localPanels, rdp, di) => {
    const pPad = 2; // padding on either side of the panel
    // height of row of cog label depends on overall panel height / width
    // so start with rough estimate of panel height / width
    let preW = Math.round(cw / layout.ncol);
    // given this, compute panel height
    let preH = Math.round(preW * aspect);
    if (preH * layout.nrow > ch) {
      preH = Math.round(ch / layout.nrow);
      preW = Math.round(preH / aspect);
    }
    let labelHeight = Math.min(preW, preH) * 0.08;
    labelHeight = Math.max(Math.min(labelHeight, 26), 13);
    const labelPad = labelHeight / 1.625 - 4;
    const fontSize = labelHeight - labelPad;
    const nLabels = labels.length; // number of cogs to show
    // extra padding beyond what is plotted
    // these remain fixed while width and height can change
    // for ppad + 2, "+ 2" is border
    const wExtra = (pPad + 2) * (layout.ncol + 1);
    const hExtra = (pPad + 2) * (layout.nrow + 1) + nLabels * labelHeight * layout.nrow;

    // first try stretching panels across full width:
    let newW = Math.round((cw - wExtra) / layout.ncol);
    // given this, compute panel height
    let newH = Math.round(newW * aspect);
    let wOffset = 0;

    // check to see if this will make it too tall:
    // if so, do row-first full-height stretching
    if (newH * layout.nrow + hExtra > ch) {
      newH = Math.round((ch - hExtra) / layout.nrow);
      newW = Math.round(newH / aspect);
      wOffset = (cw - (newW * layout.ncol + wExtra)) / 2;
    }

    // if related displays are being used, panel area is full height/width
    if (rdp.length > 0) {
      newH = ch - hExtra;
      newW = cw - wExtra;
      wOffset = 0;
    }

    const panelData = localPanels;

    const labelWidth = getTextWidth(labels, fontSize) + labelPad;

    const hOffset = 48;

    return {
      contentStyle: {
        width: cw,
        height: ch,
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
        labelWidth,
        labelPad,
        fontSize,
        nLabels,
        pWidth: newW,
        pHeight: newH + nLabels * labelHeight,
        wOffset,
        hOffset,
        pPad,
        contentWidth: cw,
      },
      panelInterface: cdi.info.panelInterface,
      sidebar,
      curPage,
      totPages: Math.ceil(card / npp),
      panelData,
      curDisplayInfo: cdi,
      displayInfo: di,
      relDispPositions: rdp,
    };
  },
);

const mapStateToProps = (state: RootState) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  removeLabel: (name: string, labels: string[]) => {
    const idx = labels.indexOf(name);
    if (idx > -1) {
      const newLabels = Object.assign([], labels);
      newLabels.splice(idx, 1);
      dispatch(setLabels(newLabels));
    }
  },
  setPageNum: (dir: 'right' | 'left', curPage: number, totPages: number) => {
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
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
