import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import getJSONP from 'jsonp';
import { setPanelCogInput } from '../../inputUtils';
import PanelTable from './PanelTable';
import styles from './Panel.module.scss';
import { findWidget } from '../../loadAssets';

interface PanelProps {
  labels: PanelLabel[];
  labelArr: string[];
  cfg: Config;
  panelKey: string;
  dims: Dims;
  rowIndex: number;
  iColIndex: number;
  panelRenderers: {
    [key: string]: {
      fn: (x: PanelData, width: number, height: number, post?: boolean, key?: string) => JSX.Element;
    };
  };
  panelInterface: PanelInterface;
  // panelData: PanelData;
  displayInfo: {
    [key: string]: DisplayInfoState;
  };
  curDisplayInfo: DisplayInfoState;
  relDispPositions: {
    height: number;
    aspect: number;
    name: string;
  }[];
  removeLabel: (label: string, labels: string[]) => void;
}

const Panel: React.FC<PanelProps> = ({
  labels,
  labelArr,
  cfg,
  panelKey,
  dims,
  rowIndex,
  iColIndex,
  panelRenderers,
  panelInterface,
  // panelData,
  displayInfo,
  curDisplayInfo,
  relDispPositions,
  removeLabel,
}) => {
  const [panelData, setPanelData] = useState<PanelData>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isSelfContained = panelData !== undefined && cfg.display_base === '__self__';
  let panelContent: React.ReactNode | null = null;

  useLayoutEffect(() => {
    const { name } = curDisplayInfo.info;
    const curIface = displayInfo[name].info.cogInterface;
    let filebase = `${cfg.cog_server.info.base}${curIface.group}`;
    filebase = `${filebase}/${curIface.name}`;

    const abortController = new AbortController();
    const { signal } = abortController;

    if (cfg.cog_server.type === 'jsonp') {
      if (!window.__panel__) {
        window.__panel__ = {};
      }

      window.__panel__[`_${panelKey}_${name}`] = (data: PanelData) => {
        panelRenderers[name].fn(data, dims.ww, dims.hh, true, panelKey);
        setPanelData(data);
        setLoaded(true);
      };

      getJSONP(`${filebase}/jsonp/${panelKey}.jsonp`);
    } else {
      fetch(`${filebase}/json/${panelKey}.json`, { signal })
        .then((response) => response.json())
        .then((data) => {
          panelRenderers[name].fn(data, dims.ww, dims.hh, true, panelKey);
          setPanelData(data);
          setLoaded(true);
        });
    }

    return () => {
      abortController.abort();
    };
  }, [
    panelKey,
    curDisplayInfo,
    cfg.cog_server.info.base,
    displayInfo,
    cfg.cog_server.type,
    dims.hh,
    dims.ww,
    panelRenderers,
  ]);

  // do post-rendering (if any)
  useLayoutEffect(() => {
    let names = [curDisplayInfo.info.name];
    if (relDispPositions.length > 0) {
      names = relDispPositions.map((d) => d.name);
    }
    names.forEach((name, i) => {
      if (loaded) {
        let width = dims.ww;
        let height = dims.hh;
        if (relDispPositions.length > 0) {
          height = dims.hh * relDispPositions[i].height;
          width = height / relDispPositions[i].aspect;
        }
        const panelRenderer = panelRenderers[name];
        panelRenderer.fn(panelData, width, height, true, `${panelKey}_${name}`);
      }
    });
  });

  useLayoutEffect(() => {
    if (loaded && panelInterface.type === 'htmlwidget') {
      const widget = findWidget(panelInterface?.deps?.name);
      if (widget) {
        const el = document.getElementById(`widget_${panelKey}`);
        if (el) {
          el.style.width = `${dims.ww}px`;
          el.style.height = `${dims.hh}px`;
          widget.resize(el, dims.ww, dims.hh, {});
        }
      }
    }
  }, [dims.hh, dims.ww, loaded, panelInterface?.deps?.name, panelInterface.type, panelKey]);

  let names = [curDisplayInfo.info.name];
  if (relDispPositions.length > 0) {
    names = relDispPositions.map((d) => d.name);
  }

  names.forEach((name) => {
    const isImageSrc = panelInterface.type === 'image_src';
    if (isImageSrc) {
      panelContent = panelRenderers[name].fn(
        displayInfo[name].info.imgSrcLookup[panelKey],
        dims.ww,
        dims.hh,
        false,
        panelKey,
      );
    } else if (isSelfContained) {
      panelContent = panelRenderers[name].fn(panelData, dims.ww, dims.hh, false, panelKey);
    } else if (panelData !== undefined) {
      panelContent = panelRenderers[name].fn(panelData, dims.ww, dims.hh, false, panelKey);
    }
  });

  const bWidth = relDispPositions.length > 0 ? dims.contentWidth : dims.ww;
  const bRight =
    relDispPositions.length > 0
      ? 1
      : dims.pWidth * iColIndex + (iColIndex + 1) * dims.pPad + dims.wOffset + iColIndex * 2 + 1;

  const inlineStyles = {
    bounding: {
      width: bWidth + 2,
      height: dims.hh + dims.nLabels * dims.labelHeight + 2,
      top: dims.pHeight * rowIndex + (rowIndex + 1) * dims.pPad + rowIndex * 2,
      right: bRight,
    },
    panel: {
      width: bWidth,
      height: dims.hh,
    },
    panelContent: {
      width: bWidth,
      height: dims.hh,
    },
  };

  return (
    <div className={styles.bounding} style={inlineStyles.bounding} ref={panelRef}>
      <div className={styles.panel} style={inlineStyles.panel}>
        {loaded ? panelContent : <div>&apos;loading...&apos;</div>}
      </div>
      <PanelTable
        labels={labels}
        curDisplayInfo={curDisplayInfo}
        panelKey={panelKey}
        dims={dims}
        setPanelCogInput={setPanelCogInput}
        bWidth={bWidth}
        onLabelRemove={removeLabel}
        labelArr={labelArr}
      />
    </div>
  );
};

export default Panel;
