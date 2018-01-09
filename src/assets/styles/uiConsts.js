// http://paletton.com/#uid=33u0u0kv2ZgiPYEo+ZaOjYmVwBx

const uiConsts = {
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
        background: '#448AFF' // <- blueA200 // '#4285f4' // #15a4fa
      }
    },
    logo: {
      background: '#FF4308',
      color: 'white'
    },
    logoWidth: 130
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
        height: 50
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
};

export default uiConsts;
