---
to: src/components/<%= name %>/<%= name %>.tsx
---
import React from 'react';
import styles from './<%= name %>.module.scss';

interface <%= name %>Props {};

const <%= name %>: React.FC<<%= name %>Props> = () => {
  return (
    <div className={styles.<%= h.changeCase.lcFirst(name) %>}>
      <%= name %>
    </div>
  );
};

export default <%= name %>;
