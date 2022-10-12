interface WidgetAsset {
  url: string[];
  type: string;
}

interface WidgetAssets {
  assets: WidgetAsset[];
}

export const findWidget = (name: string) => {
  const { widgets } = window.HTMLWidgets;
  for (let i = 0; i < widgets.length; i += 1) {
    if (widgets[i].name === name) {
      return widgets[i];
    }
  }
  return undefined;
};

export const loadAssetsSequential = (widgetAssets: WidgetAssets, configBase: string, callback: () => void) => {
  function loadScript(asset: HTMLScriptElement | HTMLLinkElement, url: string) {
    return new Promise((resolve, reject) => {
      asset.addEventListener('load', () => {
        resolve(url);
      });
      asset.addEventListener('error', () => {
        reject(url);
      });
      document.body.appendChild(asset);
    });
  }

  // save all Promises as array
  const promises = [] as Promise<unknown>[];

  widgetAssets.assets.forEach((curAsset) => {
    let urls = curAsset.url;
    if (!Array.isArray(urls)) {
      urls = [urls];
    }
    for (let i = 0; i < urls.length; i += 1) {
      let asset = {} as unknown as HTMLScriptElement | HTMLLinkElement;
      if (curAsset.type === 'script') {
        asset = document.createElement('script');
        asset.type = 'text/javascript';
        asset.src = `${configBase}${urls[i]}`;
      } else if (curAsset.type === 'stylesheet') {
        asset = document.createElement('link');
        asset.rel = 'stylesheet';
        asset.type = 'text/css';
        asset.href = `${configBase}${urls[i]}`;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:2339 this is needed because async does not exist on HTMLLinkElement but it is being set
      asset.async = false;
      promises.push(loadScript(asset, urls[i]));
    }
  });

  Promise.all(promises)
    .then(() => {
      // console.log('all scripts loaded');
      callback();
    })
    .catch((script) => {
      // console.log(script + ' failed to load');
    });
};
