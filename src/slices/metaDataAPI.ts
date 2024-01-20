import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelectedDisplay } from './selectedDisplaySlice';
import { selectBasePath } from '../selectors/app';
import { snakeCase } from '../utils';
// import { useDataType } from './configAPI';
import { META_DATA_STATUS } from '../constants';

export const metaIndex: unique symbol = Symbol('metaIndex');

export const useMetaData = () => {
  const basePath = useSelector(selectBasePath);
  const selectedDisplay = useSelectedDisplay();
  // const dataType = useDataType();

  const displayPath = snakeCase(selectedDisplay?.name || '');

  const url = `${basePath}/displays/${displayPath}/metaData.js`;

  const [loadingState, setLoadingState] = useState(url ? META_DATA_STATUS.LOADING : META_DATA_STATUS.IDLE);
  const [metaData, setMetaData] = useState<Datum[] | null>(null);

  useEffect(() => {
    setLoadingState(META_DATA_STATUS.IDLE);
    if (!url || !basePath || !selectedDisplay?.name) {
      return;
    }

    // if (dataType === 'json' && !window.metaData) {
    //   fetch(url)
    //     .then((res) => res.json())
    //     .then((res) => {
    //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //       // @ts-ignore
    //       // window.metaData = res;
    //       setState(META_DATA_STATUS.READY);
    //       setMetaData(res);
    //     })
    //     .catch((error) => setLoadingState(META_DATA_STATUS.ERROR));

    //   return;
    // }

    let script = document.querySelector(`script[src="${url}"]`) as HTMLScriptElement;

    const handleScript = (e: Event) => {
      setLoadingState(e.type === 'load' ? META_DATA_STATUS.READY : META_DATA_STATUS.ERROR);
      window.metaData?.forEach((datum, i) => {
        datum[metaIndex] = i;
      });
      setMetaData(window.metaData);
    };

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/javascript';
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
    }

    script.addEventListener('load', handleScript);
    script.addEventListener('error', handleScript);

    // eslint-disable-next-line consistent-return
    return () => {
      script.removeEventListener('load', handleScript);
      script.removeEventListener('error', handleScript);
      if (document.querySelector(`script[src="${url}"]`)) {
        document.body.removeChild(script);
      }
    };
  }, [url]);
  return { loadingState, metaData };
};
