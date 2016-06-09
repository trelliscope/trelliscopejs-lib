import { createSelector } from 'reselect';

// cross-component selectors go here
// otherwise they go in the component files
// so we don't have 50 billion files

// http://paletton.com/#uid=33u0u0kv2ZgiPYEo+ZaOjYmVwBx

export const configSelector = state => state._config.config;

export const uiConstsSelector = () => (
  {
    fontFamily: '"Open Sans", sans-serif',
    header: {
      height: 45,
      fontSize: 16,
      borderColor: '#eaedf0',
      background: 'white',
      color: '#000',
      button: {
        color: '#9ba3af',
        active: {
          background: '#15a4fa'
        }
      },
      titleWidth: 120
    },
    footer: {
      height: 30,
      background: '#666666',
      color: 'white'
    },
    sideButtons: {
      width: 45,
      background: '#b3b3b3',
      spacerBackground: '#c1c1c1',
      button: {
        color: 'white',
        borderColor: '#c0c0c0',
        active: {
          color: '#15a4fa',
          background: 'white'
        },
        hover: {
          // background: '#999'
          background: '#15a4fa'
        }
      }
    },
    sidebar: {
      width: 230,
      borderColor: '#eaedf0',
      header: {
        fontSize: 15,
        height: 25,
        background: '#c1c1c1',
        color: 'white'
      },
      filter: {
        margin: 5,
        cat: {
          height: 100,
          bar: {
            width: 20,
            color: {
              default: '#FFBB78',
              hover: '#FFA958',
              select: '#FF7F0E'
            }
          }
        },
        num: {
          color: {
            default: '#aec7e8',
            hover: '#83AFD8',
            select: '#1f77b4'
          }
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

export const contentWidthSelector = createSelector(
  windowWidthSelector, sidebarActiveSelector, uiConstsSelector,
  (ww, active, ui) => ww - ui.sideButtons.width -
    (active === '' ? 0 : (ui.sidebar.width + 1))
);

export const contentHeightSelector = createSelector(
  windowHeightSelector, uiConstsSelector,
  (wh, ui) => wh - ui.header.height - ui.footer.height
);

export const sidebarHeightSelector = createSelector(
  windowHeightSelector, uiConstsSelector,
  (wh, ui) => wh - ui.header.height - ui.footer.height - ui.sidebar.header.height
);
