import React from 'react';
import styles from './styles';

export default function SharedJournal() {
  return (
    <div className="main">
      <img
        src="/static/images/joinlist/journal1.png"
        alt="aura journal"
        className="journal1"
      />
      <img
        src="/static/images/joinlist/journal2.png"
        alt="aura journal"
        className="journal1"
      />
      <style jsx>{styles}</style>
    </div>
  );
}
