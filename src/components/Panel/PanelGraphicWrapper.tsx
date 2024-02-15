/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react';
import PanelGraphic from './PanelGraphic';
import { panelSrcGetter, replaceDatumFactorsWithLabels, snakeCase } from '../../utils';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

interface PanelGraphicProps {
  data: Datum;
  meta: IPanelMeta;
  alt: string;
  imageWidth: number;
  basePath: string;
  displayName: string;
  panelKey: string;
  fileName: string;
}

const PanelGraphicWrapper: React.FC<PanelGraphicProps> = ({
  data,
  meta,
  alt,
  imageWidth,
  basePath,
  displayName = '',
  panelKey,
  fileName,
}) => {
  const { data: displayInfo } = useDisplayInfo();
  const [panelSrc, setPanelSrc] = useState('');
  const sourceFunc = async (func: PanelFunction) => {
    const dataWithFactorLabels = replaceDatumFactorsWithLabels(data, displayInfo?.metas as IMeta[]);
    const res = await func(dataWithFactorLabels);
    setPanelSrc(res);
    return res;
  };

  useEffect(() => {
    if (meta?.source?.type === 'JS' && meta?.source?.function) {
      sourceFunc(meta.source.function);
    }
  }, [meta, data]);

  return (
    <>
      {panelSrc ? (
        <PanelGraphic
          type={meta?.paneltype}
          src={
            meta?.source?.type === 'JS' && meta?.source?.function
              ? panelSrc
              : meta?.source?.isLocal === false
                ? fileName.toString()
                : panelSrcGetter(basePath, fileName as string, snakeCase(displayName)).toString()
          }
          alt={alt}
          aspectRatio={meta?.aspect}
          imageWidth={imageWidth}
          key={panelKey}
          port={meta?.source?.port}
          sourceType={meta?.source?.type}
          name={meta?.varname}
          sourceClean={fileName}
        />
      ) : (
        'loading...'
      )}
    </>
  );
};

export default PanelGraphicWrapper;
