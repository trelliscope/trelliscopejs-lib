import React from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLabelPill from '../SidebarLabelPill';
import { useDisplayMetasWithInputs, useMetaGroupsWithInputs } from '../../slices/displayInfoAPI';
import { labelsSelector } from '../../selectors';
import styles from './SidebarLabels.module.scss';
import { setLabels } from '../../slices/labelsSlice';
import { COMMON_TAGS_KEY } from '../../constants';

const SidebarLabels: React.FC = () => {
  const dispatch = useDispatch();
  const labels = useSelector(labelsSelector);
  const labelObj = useMetaGroupsWithInputs();

  const metasWithInputs = useDisplayMetasWithInputs();
  const labelDescriptionMap = new Map();
  metasWithInputs.forEach((meta) => {
    labelDescriptionMap.set(meta.varname, meta.label);
  });

  const handleLabelChange = (value: string) => {
    const idx = labels.indexOf(value);
    let newLabels = labels;
    if (idx === -1) {
      newLabels = [...labels, value];
    } else {
      newLabels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
    }
    dispatch(setLabels(newLabels));
  };

  return (
    <>
      {labelDescriptionMap.size > 0 && (
        <div className={styles.sidebarLabels}>
          <List className={styles.sidebarLabelsList}>
            {Array.from(labelObj.keys()).map((grp) => {
              const groupString = grp.toString();
              const curItems = labelObj.get(grp);
              if (curItems?.length === 0 || !curItems) {
                return null;
              }
              return (
                <React.Fragment key={groupString}>
                  {/* Don't include header for non-tagged group */}
                  {grp !== COMMON_TAGS_KEY && (
                    <ListSubheader className={styles.sidebarLabelsCogGroupHeader}>
                      <span className={styles.sidebarLabelsCogGroupText}>{`${groupString} (${curItems.length})`}</span>
                    </ListSubheader>
                  )}
                  {labelObj
                    ?.get(grp)
                    ?.sort()
                    .map((label: string) => (
                      <SidebarLabelPill
                        labels={labels}
                        labelDescriptionMap={labelDescriptionMap}
                        label={label}
                        handleLabelChange={handleLabelChange}
                        key={`${label}_${groupString}`}
                      />
                    ))}
                </React.Fragment>
              );
            })}
          </List>
        </div>
      )}
    </>
  );
};

export default SidebarLabels;
