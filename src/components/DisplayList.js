import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import Radium from 'radium';
import { redA200 } from 'material-ui/styles/colors';

// di is display info
const DisplayList = ({ di, handleClick, cfg }) => {
  // get unique display groups
  const dispGroups = {};
  for (let ii = 0; ii < di.length; ii++) {
    if (!dispGroups[di[ii].group]) {
      dispGroups[di[ii].group] = [];
    }
    dispGroups[di[ii].group].push(ii);
  }

  const styles = {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around'
    },
    gridList: {
      width: 700,
      marginBottom: 24
    },
    gridTile: {
      cursor: 'pointer'
    },
    img: {
      opacity: 1,
      ':hover': {
        opacity: 0.7
      }
    }
  };

  const displayList = Object.keys(dispGroups).map((k) => (
    <div style={styles.root} key={k}>
      <GridList
        cellHeight={200}
        cols={3}
        style={styles.gridList}
      >
        <Subheader style={{ fontSize: 20 }}>{k}</Subheader>
        {dispGroups[k].map((i) => (
          <GridTile
            key={i}
            style={styles.gridTile}
            title={
              <span style={{ fontWeight: 400, color: redA200 }}>
                {di[i].name}
              </span>
            }
            subtitle={
              <span style={{ fontSize: 13 }}>
                {di[i].desc}<br />
                <span style={{ fontStyle: 'italic', fontSize: 11 }}>
                  {di[i].n} panels,
                  {di[i].updated.substring(0, di[i].updated.length - 3)}
                </span>
              </span>
            }
            titleBackground="rgba(0, 0, 0, 0.65)"
            onClick={() => handleClick(di[i].name, di[i].group)}
            children={[
              <img
                src={`${cfg.display_base}/displays/${di[i].group}/${di[i].name}/thumb.png`}
                alt={di[i].name}
                style={styles.img}
                key={`img${i}`}
              />
            ]}
          />
        ))}
      </GridList>
    </div>
  ));

  return (
    <div style={{ height: 400, overflowY: 'auto' }}>
      {displayList}
    </div>
  );
};

DisplayList.propTypes = {
  di: React.PropTypes.array,
  handleClick: React.PropTypes.func,
  cfg: React.PropTypes.object
};

export default Radium(DisplayList);
