import React from 'react';
import styles from './Credits.module.scss';

const Credits: React.FC = () => (
  <div className={styles.credits}>
    <p>
      &copy;&nbsp;
      <a href="http://ryanhafen.com" target="_blank" rel="noopener noreferrer">
        Ryan Hafen
      </a>
      , 2023.
    </p>
    <p>
      Built with&nbsp;
      <a href="https://facebook.github.io/react/" target="_blank" rel="noopener noreferrer">
        React
      </a>
      &nbsp;and several other awesome libraries listed&nbsp;
      <a
        href="https://github.com/trelliscope/trelliscopejs-lib/blob/master/package.json"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      .
    </p>
    <p>
      Source code available on&nbsp;
      <a href="https://github.com/trelliscope/trelliscopejs-lib/" target="_blank" rel="noopener noreferrer">
        github
      </a>
      &nbsp;&ndash; submit issues and feature requests there.
    </p>
    <p>
      Many thanks to the Trelliscope{' '}
      <a
        href="https://github.com/trelliscope/trelliscopejs-lib/graphs/contributors"
        target="_blank"
        rel="noopener noreferrer"
      >
        contributors
      </a>{' '}
      and{' '}
      <a href="https://github.com/trelliscope/trelliscope#acknowledgements" target="_blank" rel="noopener noreferrer">
        founders
      </a>
      .
    </p>
  </div>
);

export default Credits;
