import React from 'react';
import styles from './Credits.module.scss';

const Credits: React.FC = () => (
  <div className={styles.credits}>
    <p>
      &copy;&nbsp;
      <a href="http://ryanhafen.com" target="_blank" rel="noopener noreferrer">
        Ryan Hafen
      </a>
      , 2019.
    </p>
    <p>
      Built with&nbsp;
      <a href="https://facebook.github.io/react/" target="_blank" rel="noopener noreferrer">
        React
      </a>
      &nbsp;and several other awesome libraries listed&nbsp;
      <a
        href="https://github.com/hafen/trelliscopejs-lib/blob/master/package.json"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      .
    </p>
    <p>
      Source code available on&nbsp;
      <a href="https://github.com/hafen/trelliscopejs-lib/" target="_blank" rel="noopener noreferrer">
        github
      </a>
      &nbsp;&ndash; submit issues and feature requests there.
    </p>
    <p>
      Thanks to Bill Cleveland for ideas upon which this is built, to Saptarshi Guha for creating a multi-panel plot viewer
      prototype many years ago that inspired initial work, and to Barret Schloerke for the introduction to React and
      discussions about the interface.
    </p>
  </div>
);

export default Credits;
