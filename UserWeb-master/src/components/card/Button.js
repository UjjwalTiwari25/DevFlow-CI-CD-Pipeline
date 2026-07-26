import React from 'react';
import Text from '../app/Text';

export default function Button({ title, onClick, style }) {
  return (
    <div
      id="btn-card"
      className="button-shadow clickable"
      onClick={onClick}
      style={style}>
      <Text type="body" align="center" color="b100">
        {title}
      </Text>
      <style jsx>{`
        #btn-card {
          height: 72px;
          width: 100%;
          position: relative;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          cursor: pointer;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}
