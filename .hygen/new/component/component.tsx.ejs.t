---
to: src/components/<%= name %>/<%= name %>.tsx
---
import React from 'react';
import ErrorWrapper from '../ErrorWrapper';
import styles from './<%= name %>.module.scss';

interface <%= name %>Props {};

const <%= name %>: React.FC<<%= name %>Props> = () => {
  return (
    <ErrorWrapper>
      <div className={styles.<%= h.changeCase.lcFirst(name) %>}>
        <%= name %>
      </div>
    </ErrorWrapper>
  );
};

export default <%= name %>;
