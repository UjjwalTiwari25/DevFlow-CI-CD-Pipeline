import React, { useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

function MasterClassItem({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="playlist-card clickable"
      onClick={() => {
        setIsOpen(!isOpen);
      }}>
      {!isOpen ? (
        <div className="play-card-title">
          <div className="playlist-card-wrap">
            <span className="playlist-card-number">{index}</span>
            <div className="playlist-card-text">{item.title}</div>
          </div>
          <Image
            src="/static/images/celebrities/ArrowLeft.svg"
            height={14}
            width={14}
            alt=""
            className={classNames({ 'invert-arrow ': isOpen })}
          />
        </div>
      ) : (
        <>
          <div className="play-card-title">
            <div className="playlist-card-wrap">
              <span className="playlist-card-number">{index}</span>
              <div className="playlist-card-text">{item.title}</div>
            </div>
            <Image
              src="/static/images/celebrities/ArrowLeft.svg"
              height={14}
              width={14}
              alt=""
              className={classNames({ 'invert-arrow ': isOpen })}
            />
          </div>
          <div className="play-card-sub-title">{item.content}</div>
        </>
      )}
    </div>
  );
}

export default MasterClassItem;
