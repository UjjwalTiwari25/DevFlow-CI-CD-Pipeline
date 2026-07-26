import React from 'react';
import styles from './styles';

export default function CoachCard({ coach, withShadow }) {
  return (
    <div className="w-100 container">
      <div className="coach-container relative">
        <img src={coach} alt="aura coach" className="coach" />
        {withShadow && (
          <img src={coach} alt="aura coach" className="coach-shadow" />
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
