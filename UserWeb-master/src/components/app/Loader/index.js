import React from 'react';
import styles from './styles';
import AuraLoader from '../AuraLoader';

const DEFAULT_LOADER_SIZE = 100;

export default function Loader({ size, style }) {
  return (
    <div data-testid="loader" className="loader-container" style={style}>
      <AuraLoader size={size || DEFAULT_LOADER_SIZE} />
      <style jsx>{styles}</style>
    </div>
  );
}
