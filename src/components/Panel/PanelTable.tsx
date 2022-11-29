import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import CancelIcon from '@mui/icons-material/Cancel';
import LaunchIcon from '@mui/icons-material/Launch';
import { FormControlLabel, Popover, Radio, RadioGroup, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReactTooltip from 'react-tooltip';
import { DisplayInfoState } from '../../slices/displayInfoSlice';
import styles from './Panel.module.scss';

interface PanelTableProps {
  labels: PanelLabel[];
  curDisplayInfo: DisplayInfoState;
  panelKey: string;
  dims: Dims;
  bWidth: number;
  labelArr: string[];
  onLabelRemove: (label: string, labels: string[]) => void;
  setPanelCogInput: (displayInfo: DisplayObject, value: string, panelKey: string, cogId: string) => void;
}

const PanelTable: React.FC<PanelTableProps> = ({
  labels,
  curDisplayInfo,
  panelKey,
  setPanelCogInput,
  dims,
  bWidth,
  labelArr,
  onLabelRemove,
}) => {
  const [textInputOpen, setTextInputOpen] = useState('');
  const [textInputValue, setTextInputValue] = useState('');
  const [inputUpdateCount, setInputUpdateCount] = useState(0);

  const tableRef = useRef<HTMLTableElement>(null);

  const inlineStyles = {
    labelTable: {
      width: bWidth,
    },
    labelRow: {
      width: bWidth,
      height: dims.labelHeight,
      lineHeight: `${dims.labelHeight}px`,
    },
    labelSpan: {
      fontSize: dims.fontSize,
      position: 'absolute',
      TextDecooration: 'none',
    } as React.CSSProperties,
    labelClose: {
      fontSize: dims.fontSize,
      lineHeight: `${dims.labelHeight}px`,
    },
    labelInner: {
      height: dims.labelHeight,
    },
    labelNameCell: {
      paddingLeft: dims.labelPad / 2 + 2,
      paddingRight: dims.labelPad / 2 + 2,
      width: dims.labelWidth,
    },
    labelValueCell: {
      paddingLeft: dims.labelPad / 2 + 2,
      paddingRIght: dims.labelPad / 2 + 2,
    },
    linkIcon: {
      textDecoration: 'none',
      fontSize: dims.fontSize - 2,
    },
    radioDiv: {
      transform: `scale(${dims.labelHeight / 29})`,
      transformOrigin: 'left top',
      marginTop: '-4px',
    },
  };

  const specialRenderTypes = ['href', 'href_hash', 'input_radio', 'input_text'];

  return (
    <table className={styles.labelTable} style={inlineStyles.labelTable} ref={tableRef}>
      <tbody>
        {labels.map((label) => (
          <tr key={label.name} className={classNames(styles.labelRow)} style={inlineStyles.labelRow}>
            <td className={classNames(styles.labelCell, styles.labelNameCell)} style={inlineStyles.labelNameCell}>
              <div
                className={styles.labelInner}
                style={inlineStyles.labelInner}
                data-tip
                data-for={`tooltip_${panelKey}_${label.name}`}
              >
                <span style={inlineStyles.labelSpan}>{label.name}</span>
              </div>
              {label.name !== label.desc && (
                <ReactTooltip place="right" id={`tooltip_${panelKey}_${label.name}`}>
                  <span>{label.desc}</span>
                </ReactTooltip>
              )}
            </td>
            <td className={styles.labelCell} style={inlineStyles.labelValueCell}>
              {label.type === 'href' && (
                <div className={styles.labelInner} style={inlineStyles.labelInner}>
                  <a style={inlineStyles.labelSpan} href={label.value as string} rel="noopener noreferrer" target="_blank">
                    <LaunchIcon />
                  </a>
                </div>
              )}

              {label.type === 'href_hash' && (
                <div className={styles.labelInner} style={inlineStyles.labelInner}>
                  <a
                    style={inlineStyles.labelSpan}
                    href="#open_in_same_window"
                    onClick={() => {
                      window.location.href = label.value as string;
                      window.location.reload();
                    }}
                  >
                    <LaunchIcon />
                  </a>
                </div>
              )}

              {label.type === 'input_radio' && (
                <div className={styles.labelInner} style={inlineStyles.labelInner}>
                  <div style={inlineStyles.radioDiv}>
                    <RadioGroup
                      aria-label={label.name}
                      name={label.name}
                      classes={{ root: styles.formRow }}
                      value={
                        localStorage.getItem(
                          `${curDisplayInfo.info.group}_:_${curDisplayInfo.info.name}_:_${panelKey}_:_${label.name}`,
                        ) || ''
                      }
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (event.currentTarget?.value) {
                          setPanelCogInput(curDisplayInfo.info, event.currentTarget?.value, panelKey, label.name);
                          setInputUpdateCount(inputUpdateCount + 1);

                          try {
                            (document.activeElement as HTMLElement).blur();
                          } catch (e) {
                            // do nothing
                          }
                        }
                      }}
                      row
                    >
                      {curDisplayInfo.info.cogInfo[label.name].options.map((a) => (
                        <FormControlLabel key={a} value={a} control={<Radio disableRipple size="small" />} label={a} />
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {label.type === 'input_text' && (
                <div className={styles.labelInner} style={inlineStyles.labelInner}>
                  <div
                    className={styles.labelP}
                    style={{ fontSize: dims.fontSize }}
                    onClick={() => setTextInputOpen(label.name)}
                    role="button"
                    onKeyDown={() => {}}
                    tabIndex={-1}
                  >
                    {localStorage.getItem(
                      `${curDisplayInfo.info.group}_:_${curDisplayInfo.info.name}_:_${panelKey}_:_${label.name}`,
                    ) || ''}
                  </div>
                  <div>
                    <button
                      type="button"
                      className={styles.editButton}
                      style={{
                        ...inlineStyles.labelClose,
                      }}
                      onClick={() => setTextInputOpen(label.name)}
                    >
                      <EditIcon style={{ fontSize: dims.fontSize }} />
                    </button>
                  </div>
                  <Popover
                    open={textInputOpen === label.name}
                    anchorEl={tableRef.current}
                    onClose={() => {
                      setTextInputOpen('');
                      setPanelCogInput(curDisplayInfo.info, textInputValue, panelKey, label.name);
                      setInputUpdateCount(inputUpdateCount + 1);
                    }}
                    TransitionProps={{
                      onEnter: () => {
                        setTextInputValue(
                          localStorage.getItem(
                            `${curDisplayInfo.info.group}_:_${curDisplayInfo.info.name}_:_${panelKey}_:_${label.name}`,
                          ) || '',
                        );
                      },
                    }}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <div style={{ padding: 7 }}>
                      <TextField
                        id="outlined-multiline-static"
                        label={`${label.name} ('esc' when complete)`}
                        onChange={(e) => {
                          setTextInputValue(e.target.value);
                        }}
                        value={textInputValue}
                        style={{ minWidth: 300 }}
                        size="small"
                        autoFocus
                        multiline
                        rows={curDisplayInfo.info.cogInfo[label.name].height}
                        variant="outlined"
                      />
                    </div>
                  </Popover>
                </div>
              )}

              {!specialRenderTypes.some((specialType) => label?.type?.includes(specialType)) && (
                <div className={styles.labelOuter}>
                  <div className={styles.labelInner} style={inlineStyles.labelInner}>
                    <span className={styles.labelP} style={inlineStyles.labelSpan}>
                      {label.value}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.labelClose}
                    style={inlineStyles.labelClose}
                    onClick={() => onLabelRemove(label.name, labelArr)}
                  >
                    <CancelIcon />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelTable;
