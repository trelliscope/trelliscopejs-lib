const loadAssetsSequential = (widgetAssets, callback) => {
  const assets = Object.assign([], widgetAssets.assets);
  const loadNextAsset = () => {
    let done = false;
    const head = document.getElementsByTagName('head')[0];

    const curAsset = assets.shift();
    let asset;
    if (curAsset.type === 'script') {
      asset = document.createElement('script');
      asset.type = 'text/javascript';
      asset.src = curAsset.url;
    } else if (curAsset.type === 'stylesheet') {
      asset = document.createElement('link');
      asset.rel = 'stylesheet';
      asset.type = 'text/css';
      asset.href = curAsset.url;
    }

    const assetLoaded = () => {
      if (!done) {
        asset.onreadystatechange = asset.onload = null;
        done = true;
        if (assets.length !== 0) {
          loadNextAsset();
        } else {
          const widgets = window.HTMLWidgets.widgets;
          // console.log(widgets);
          for (let i = 0; i < widgets.length; i += 1) {
            if (widgets[i].name === widgetAssets.name) {
              callback(widgets[i]);
              break;
            }
          }
        }
      }
    };

    asset.onreadystatechange = () => {
      if (this.readyState === 'complete' || this.readyState === 'loaded') {
        assetLoaded();
      }
    };
    asset.onload = assetLoaded;
    head.appendChild(asset);
  };
  loadNextAsset();
};

export default loadAssetsSequential;
