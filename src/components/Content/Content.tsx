import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { max } from 'd3-array';
import { Swipeable } from 'react-swipeable';
import Panel from '../Panel';
import { setLabels } from '../../slices/labelsSlice';
import { setLayout } from '../../slices/layoutSlice';
import {
  configSelector,
  cogInterfaceSelector,
  layoutSelector,
  aspectSelector,
  labelsSelector,
  curDisplayInfoSelector,
  nPerPageSelector,
  pageNumSelector,
  displayInfoSelector,
  relDispPositionsSelector,
} from '../../selectors';
import { contentWidthSelector, contentHeightSelector } from '../../selectors/ui';
import { cogInfoSelector } from '../../selectors/display';
import { currentCogDataSelector, filterCardinalitySelector } from '../../selectors/cogData';
import getCustomProperties from '../../getCustomProperties';
import styles from './Content.module.scss';
import { useMetaData } from '../../slices/metaDataAPI';
import { useDisplayInfo, useGetDisplayInfoQuery } from '../../slices/displayInfoAPI';

const Content: React.FC = () => {
  const dispatch = useDispatch();
  const cw = useSelector(contentWidthSelector);
  const ch = useSelector(contentHeightSelector);
  const contentStyle = { width: cw, height: ch };
  const ccd = useSelector(currentCogDataSelector);
  const ci = useSelector(cogInterfaceSelector);
  const layout = useSelector(layoutSelector);
  const aspect = useSelector(aspectSelector);
  const labels = useSelector(labelsSelector);
  const cinfo = useSelector(cogInfoSelector);
  const cfg = useSelector(configSelector);
  const cdi = useSelector(curDisplayInfoSelector);
  const curPage = useSelector(pageNumSelector);
  const card = useSelector(filterCardinalitySelector);
  const npp = useSelector(nPerPageSelector);
  const rdp = useSelector(relDispPositionsSelector);
  const di = useSelector(displayInfoSelector);

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

  const getTextWidth = (labelsArray: string[], size: number): number => {
    const el = document.createElement('span');
    el.style.fontWeight = 'normal';
    el.style.fontSize = `${size}px`;
    el.style.fontFamily = 'Open Sans';
    el.style.visibility = 'hidden';
    const docEl = document.body.appendChild(el);
    const w = labelsArray.map((lb) => {
      docEl.innerHTML = lb;
      return docEl.offsetWidth;
    });
    document.body.removeChild(docEl);
    return max(w) as number;
  };

  const labelWidth = getTextWidth(labels, fontSize) + labelPad;

  const [headerHeight] = getCustomProperties(['--header-height']) as number[];

  const hOffset = headerHeight;

  const dims = {
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
  };
  const { panelInterface } = cdi.info;
  const totPages = Math.ceil(card / npp);
  const curDisplayInfo = cdi;
  const displayInfo = di;
  const relDispPositions = rdp;

  const removeLabel = (name: string, labelsArray: string[]) => {
    const idx = labelsArray.indexOf(name);
    if (idx > -1) {
      const newLabels = Object.assign([], labelsArray);
      newLabels.splice(idx, 1);
      dispatch(setLabels(newLabels));
    }
  };

  const setPageNum = (dir: 'right' | 'left') => {
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
  };

  let ret = <div />;

  console.log(ccd);

  const { data: metaData } = useMetaData();
  const { data: displayInfoData } = useDisplayInfo();

  console.log(metaData, displayInfoData);

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
          type: cinfo[labels[j]]?.type,
          desc: cinfo[labels[j]]?.desc,
        });
      }
      panelLabels.push(curLabels);
    }

    const panelMatrix = [];

    for (let i = 0; i < metaData.length; i += 1) {
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

    ret = (
      <Swipeable onSwipedRight={() => setPageNum('right')} onSwipedLeft={() => setPageNum('left')}>
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

export default Content;
