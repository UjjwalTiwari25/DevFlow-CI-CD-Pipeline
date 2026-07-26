import React, { Fragment } from 'react';
import useBrowserHistory from '../../../hooks/browserHistory';
import LoaderWidget from '../LoaderWidget';
import styles from './styles';

export default function WebLoading({ onNext, onBack }) {
  useBrowserHistory('webLoading', true, onBack, onNext);
  return (
    <Fragment>
      <div className="item-container">
        <LoaderWidget onNext={onNext} />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
