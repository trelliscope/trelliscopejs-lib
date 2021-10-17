export const findWidget = (name) => {
  const { widgets } = window.HTMLWidgets;
  // console.log(widgets);
  for (let i = 0; i < widgets.length; i += 1) {
    if (widgets[i].name === name) {
      return (widgets[i]);
    }
  }
  return undefined;
};

export const loadAssetsSequential = (widgetAssets, configBase, callback) => {
  function loadScript(asset, url) {
    return new Promise((resolve, reject) => {
      // const head = document.getElementsByTagName('head')[0];
      asset.onload = () => {
        resolve(url);
      };
      asset.onerror = () => {
        reject(url);
      };
      // head.body.appendChild(asset);
      document.body.appendChild(asset);
    });
  }

  // save all Promises as array
  let promises = [];

  widgetAssets.assets.forEach((curAsset) => {
    let urls = curAsset.url;
    if (!Array.isArray(urls)) {
      urls = [urls];
    }
    for (let i = 0; i < urls.length; i += 1) {
      let asset;
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
      asset.async = false;
      // console.log(urls[i]);
      promises.push(loadScript(asset, urls[i]));
    }
  });

  Promise.all(promises)
    .then(() => {
      // console.log('all scripts loaded');
      callback();
    }).catch((script) => {
      // console.log(script + ' failed to load');
    });
};

// export const loadAssetsSequential = (widgetAssets, configBase, callback) => {
//   const assets = Object.assign([], widgetAssets.assets);
//   const loadNextAsset = () => {
//     let done = false;
//     const head = document.getElementsByTagName('head')[0];

//     const assetLoaded = (asset) => {
//       if (!done) {
//         const curAsset = asset;
//         curAsset.onreadystatechange = null;
//         curAsset.onload = null;
//         done = true;
//         if (assets.length !== 0) {
//           loadNextAsset();
//         } else {
//           callback();
//         }
//       }
//     };

//     const curAsset = assets.shift();

//     if (curAsset.url.constructor === String) {
//       curAsset.url = [curAsset.url];
//     }

//     for (let i = 0; i < curAsset.url.length; i += 1) {
//       let asset;
//       if (curAsset.type === 'script') {
//         asset = document.createElement('script');
//         asset.type = 'text/javascript';
//         asset.src = `${configBase}${curAsset.url[i]}`;
//       } else if (curAsset.type === 'stylesheet') {
//         asset = document.createElement('link');
//         asset.rel = 'stylesheet';
//         asset.type = 'text/css';
//         asset.href = `${configBase}${curAsset.url[i]}`;
//       }
//       asset.onreadystatechange = () => {
//         if (this.readyState === 'complete' || this.readyState === 'loaded') {
//           assetLoaded(asset);
//         }
//       };
//       asset.onload = assetLoaded;
//       head.appendChild(asset);
//     }
//   };
//   loadNextAsset();
// };
