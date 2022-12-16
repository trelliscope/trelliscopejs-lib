import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faArrowUpRightFromSquare, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FormControlLabel, Popover, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
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
      marginTop: '-2px',
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
                {label.name !== label.desc ? (
                  <Tooltip
                    title={label.desc}
                    placement="top-start"
                    id={`tooltip_${panelKey}_${label.name}`}
                    arrow
                    PopperProps={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [0, -10],
                          },
                        },
                      ],
                    }}
                  >
                    <span style={inlineStyles.labelSpan}>{label.name}</span>
                  </Tooltip>
                ) : (
                  <span style={inlineStyles.labelSpan}>{label.name}</span>
                )}
              </div>
            </td>
            <td className={styles.labelCell} style={inlineStyles.labelValueCell}>
              {label.type === 'href' && (
                <div className={styles.labelInner} style={inlineStyles.labelInner}>
                  <a style={inlineStyles.labelSpan} href={label.value as string} rel="noopener noreferrer" target="_blank">
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
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
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
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
                  <div className={styles.editButtonContainer}>
                    <button
                      type="button"
                      className={styles.editButton}
                      style={{
                        ...inlineStyles.labelClose,
                      }}
                      onClick={() => setTextInputOpen(label.name)}
                    >
                      <FontAwesomeIcon icon={faPencil} />
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
                    <FontAwesomeIcon icon={faXmark} />
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
