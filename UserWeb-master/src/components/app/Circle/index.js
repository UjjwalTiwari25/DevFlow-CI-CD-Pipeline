import React from 'react';
import styles from './styles';

export default function Circle({ size, style }) {
  return (
    <div style={style}>
      <div className="circleContainer" style={{ width: size, height: size }}>
        <div className="innerContainer">
          <div className="circleDot1"></div>
          <div className="circleDot2"></div>
          <div className="circleDot3"></div>
          <div className="circleDot4"></div>
          <div className="circleDot5"></div>
          <div className="circleDot6"></div>
          <div className="circleDot7"></div>
          <div className="circleDot8"></div>
          <div className="circleDot9"></div>
          <div className="circleDot10"></div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
