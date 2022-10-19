import React, { useRef, useState, useLayoutEffect } from 'react';
import getJSONP from 'browser-jsonp';
import { setPanelCogInput } from '../../inputUtils';
import PanelTable from './PanelTable';
import styles from './Panel.module.scss';
import PanelGraphic from '../PanelGraphic';

interface PanelProps {
  labels: PanelLabel[];
  labelArr: string[];
  cfg: Config;
  panelKey: string;
  dims: Dims;
  rowIndex: number;
  iColIndex: number;
  panelInterface: PanelInterface;
  displayInfo: {
    [key: string]: DisplayInfoState;
  };
  curDisplayInfo: DisplayInfoState;
  relDispPositions: RelDispPositions[];
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
  panelInterface,
  displayInfo,
  curDisplayInfo,
  relDispPositions,
  removeLabel,
}) => {
  const [panelData, setPanelData] = useState<{ [key: string]: PanelData }>({});
  const isSelfContained = panelData !== undefined && cfg.display_base === '__self__';
  const [loaded, setLoaded] = useState<boolean>(isSelfContained || panelInterface.type === 'image_src');
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let names = [curDisplayInfo.info.name];
    const abortControllers = [] as AbortController[];

    if (relDispPositions.length > 0) {
      names = relDispPositions.map((d) => d.name);
    }

    names.forEach((name, i) => {
      abortControllers[i] = new AbortController();
      const { signal } = abortControllers[i];

      const curIface = displayInfo[name].info.cogInterface;

      if (!loaded) {
        let filebase = `${cfg.cog_server.info.base}${curIface.group}`;
        filebase = `${filebase}/${curIface.name}`;

        if (cfg.cog_server.type === 'jsonp') {
          if (!window.__panel__) {
            window.__panel__ = {};
          }

          window.__panel__[`_${panelKey}_${name}`] = (data: PanelData) => {
            setPanelData((prevData) => ({ ...prevData, [name]: data }));
            setLoaded(true);
          };
          try {
            getJSONP({
              url: `${filebase}/jsonp/${panelKey}.jsonp`,
              callbackName: `__panel_${panelKey}_${name}`,
            });
          } catch (e) {
            console.log(e);
          }
        } else {
          fetch(`${filebase}/json/${panelKey}.json`, { signal })
            .then((response) => response.json())
            .then((data) => {
              setPanelData((prevData) => ({ ...prevData, [name]: data }));
              setLoaded(true);
            });
        }
      }
    });

    return () => {
      abortControllers.forEach((ac) => ac.abort());
    };
  }, []);

  let names = [curDisplayInfo.info.name];
  if (relDispPositions.length > 0) {
    names = relDispPositions.map((d) => d.name);
  }

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
        {loaded ? (
          <>
            {relDispPositions.length > 0 ? (
              <>
                {relDispPositions.map((panel, i) => {
                  let width = dims.ww;
                  let height = dims.hh;
                  if (relDispPositions.length > 0) {
                    height = dims.hh * relDispPositions[i].height;
                    width = height / relDispPositions[i].aspect;
                  }
                  return (
                    <div
                      key={panel.name}
                      style={{
                        position: 'absolute',
                        top: panel.top * dims.hh,
                        left: panel.left * dims.hh,
                        height: panel.height * dims.hh,
                        width: panel.width * dims.hh,
                      }}
                    >
                      <PanelGraphic
                        name={panelInterface?.deps?.name}
                        type={panelInterface?.type}
                        data={panelData[panel.name]}
                        imgSrcLookup={displayInfo[panel.name].info.imgSrcLookup[panelKey]}
                        key={panel.name}
                        panelKey={panelKey}
                        width={width}
                        height={height}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {names.map((name) => (
                  <PanelGraphic
                    name={panelInterface?.deps?.name}
                    type={panelInterface.type}
                    data={panelData[name]}
                    imgSrcLookup={displayInfo[name].info.imgSrcLookup[panelKey]}
                    key={name}
                    panelKey={panelKey}
                    width={dims.ww}
                    height={dims.hh}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <div>&apos;loading...&apos;</div>
        )}
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
