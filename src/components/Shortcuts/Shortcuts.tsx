import React from 'react';
import { useSelector } from 'react-redux';
import { fullscreenSelector } from '../../selectors';
import styles from './Shortcuts.module.scss';

const Shortcuts: React.FC = () => {
  const fullscreen = useSelector(fullscreenSelector);

  return (
    <div className={styles.shortcuts}>
      <div>
        {!fullscreen && (
          <p className={styles.shortcutsKeynote}>Note: keyboard shortcuts are only available when the app is fullscreen.</p>
        )}
        <div className={styles.shortcutsDiv}>
          <h4 className={styles.shortcutsH4}>Sidebar controls</h4>
          <ul className={styles.shortcutsUl}>
            <li>
              <code className={styles.shortcutsCode}>g</code>
              &ensp;open &quot;Grid&quot; sidebar
            </li>
            <li>
              <code className={styles.shortcutsCode}>l</code>
              &ensp;open &quot;Labels&quot; sidebar
            </li>
            <li>
              <code className={styles.shortcutsCode}>f</code>
              &ensp;open &quot;Filter&quot; sidebar
            </li>
            <li>
              <code className={styles.shortcutsCode}>s</code>
              &ensp;open &quot;Sort&quot; sidebar
            </li>
            <li>
              <code className={styles.shortcutsCode}>esc</code>
              &ensp;close sidebar
            </li>
          </ul>
          <h4 className={styles.shortcutsH4}>Panel navigation</h4>
          <ul className={styles.shortcutsUl}>
            <li>
              <code className={styles.shortcutsCode}>left</code>
              &ensp;page back
            </li>
            <li>
              <code className={styles.shortcutsCode}>right</code>
              &ensp;page forward
            </li>
          </ul>
        </div>
        <div className={styles.shortcutsDiv}>
          <h4 className={styles.shortcutsH4}>Dialog boxes</h4>
          <ul className={styles.shortcutsUl}>
            <li>
              <code className={styles.shortcutsCode}>i</code>
              &ensp;open &quot;Display Info&quot; dialog
            </li>
            <li>
              <code className={styles.shortcutsCode}>h</code>
              &ensp;open &quot;Help/About&quot; dialog
            </li>
            <li>
              <code className={styles.shortcutsCode}>esc</code>
              &ensp;close dialog
            </li>
          </ul>
          <h4 className={styles.shortcutsH4}>Touchscreen devices</h4>
          <p className={styles.shortcutsUl}>Swiping left and right will page the panels forward and backward</p>
        </div>
      </div>
    </div>
  );
};

export default Shortcuts;
