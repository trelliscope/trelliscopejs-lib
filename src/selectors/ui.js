import { createSelector } from 'reselect';
import { SB_PANEL_FILTER } from '../constants';
import { filterViewSelector, displayInfoSelector } from '.';

// http://paletton.com/#uid=33u0u0kv2ZgiPYEo+ZaOjYmVwBx
export const uiConstsSelector = () => (
  {
    fontFamily: '"Open Sans", sans-serif',
    header: {
      height: 48,
      fontSize: 16,
      borderColor: '#eaedf0',
      background: 'white',
      color: '#000',
      button: {
        color: '#9ba3af',
        active: {
          background: '#448AFF'  // <- blueA200 // '#4285f4' // #15a4fa
        }
      },
      logo: {
        background: '#FF4308',
        color: 'white'
      },
      titleWidth: 130
    },
    footer: {
      height: 30,
      background: '#666666',
      color: 'white',
      button: {
        background: '#90CAF9',
        color: 'white'
      }
    },
    sideButtons: {
      width: 48,
      fontSize: 22,
      labelFontSize: 11,
      background: '#b3b3b3',
      spacerBackground: '#c1c1c1',
      button: {
        color: 'white',
        borderColor: '#c0c0c0',
        active: {
          color: '#448AFF', // '#4285f4',
          background: 'white'
        },
        hover: {
          // background: '#999'
          background: '#448AFF' // '#4285f4'
        }
      }
    },
    sidebar: {
      width: 230,
      borderColor: '#c1c1c1',
      header: {
        fontSize: 15,
        height: 25,
        background: '#c1c1c1',
        color: 'white'
      },
      filter: {
        margin: 5,
        cat: {
          height: 125,
          bar: {
            height: 15,
            color: {
              default: '#eee',
              hover: 'rgb(255, 192, 76)',
              select: 'rgb(255, 170, 10)',
              noneSelect: 'rgb(255, 210, 127)'
            }
          },
          text: {
            color: {
              default: '#888',
              hover: '#000',
              select: '#000'
            }
          }
        },
        num: {
          height: 100,
          barColor: 'rgb(255, 210, 127)'
        },
        variables: {
          height: 100
        }
      }
    },
    content: {
      panel: {
        pad: 2
      },
      label: {
        height: 15,
        fontSize: 12
      }
    },
    trans: {
      duration: '300ms',
      timing: 'ease'
    }
  }
);

export const windowWidthSelector = state => state.ui.windowWidth;
export const windowHeightSelector = state => state.ui.windowHeight;
export const sidebarActiveSelector = state => state.sidebar.active;

export const sidebarHeightSelector = createSelector(
  windowHeightSelector, uiConstsSelector,
  (wh, ui) => wh - ui.header.height - ui.footer.height - ui.sidebar.header.height
);

// keep track of how high each filter entry is so we can spill over into a new column
export const filterColSplitSelector = createSelector(
  filterViewSelector, displayInfoSelector, uiConstsSelector, sidebarHeightSelector,
  (filt, di, ui, sh) => {
    const keys = filt.active;
    if (keys === undefined) {
      return null;
    }
    const heights = keys.map(d => {
      if (di.info.cogInfo[d].type === 'factor') {
        return ui.sidebar.filter.num.height + 53;
      } else if (di.info.cogInfo[d].type === 'numeric') {
        return ui.sidebar.filter.cat.height + 53;
      }
      return 0;
    });
    let cutoff = null;
    let csum = 0;
    let i = 0;
    while (csum < sh - ui.sidebar.filter.variables.height && i < heights.length) {
      csum += heights[i];
      i += 1;
    }
    if (i < heights.length || csum > sh - ui.sidebar.filter.variables.height) {
      cutoff = i - 1;
    }

    return cutoff;
  }
);

export const contentWidthSelector = createSelector(
  windowWidthSelector, sidebarActiveSelector, uiConstsSelector,
  filterColSplitSelector,
  (ww, active, ui, colSplit) => {
    const sw = ui.sidebar.width * (1 + (active === SB_PANEL_FILTER && colSplit !== null));
    return ww - ui.sideButtons.width -
      (active === '' ? 0 : (sw + 1));
  }
);

export const contentHeightSelector = createSelector(
  windowHeightSelector, uiConstsSelector,
  (wh, ui) => wh - ui.header.height - ui.footer.height
);
