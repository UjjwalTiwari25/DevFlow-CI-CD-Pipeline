import classNames from 'classnames';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import styles from './styles';

export default function CustomHorizontalScrollView({
  data,
  renderItem,
  style,
  setShowViewAll,
  setRefVal,
  newCoachProfile = false,
  newCoachProps = false,
  rightChevronStyles,
  leftChevronStyles,
  noFixedHeight,
  setIsReachEnd,
}) {
  const translate = useRef(0);
  const [, isMobile] = useResponsiveWindow();
  const [showRightChevron, setShowRightChevron] = useState(true);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const cardRef = useRef();
  const scrollRef = useRef();
  useEffect(() => {
    if (newCoachProps) {
      setShowLeftChevron(true);
    }
  }, [newCoachProps]);

  const isEndReached = () => {
    return (
      translate.current + scrollRef.current.offsetWidth >=
      cardRef.current.offsetWidth * data.length
    );
  };
  useEffect(() => {
    if (scrollRef && cardRef) {
      setShowRightChevron(
        data.length * (cardRef.current?.offsetWidth || 0) >
          scrollRef.current?.offsetWidth
      );
      if (setShowViewAll) {
        setShowViewAll(
          data.length * (cardRef.current?.offsetWidth || 0) >
            scrollRef.current?.offsetWidth
        );
      }
    }
  }, [data.length]);
  const handleScroll = useCallback(() => {
    if (isMobile && setRefVal && scrollRef && scrollRef.current) {
      setRefVal(scrollRef.current.scrollLeft);
    }
  }, [isMobile, setRefVal, scrollRef.current]);
  useEffect(() => {
    if (scrollRef && scrollRef.current && setRefVal) {
      const scroll = scrollRef.current;
      scroll.addEventListener('scroll', handleScroll, false);
      return () => {
        scroll.removeEventListener('scroll', handleScroll, false);
      };
    }
    return undefined;
  }, [handleScroll, scrollRef, setRefVal]);

  if (!data || !data.length) return null;

  function handleRight() {
    if (cardRef && scrollRef) {
      if ((newCoachProps && !isEndReached()) || !newCoachProps) {
        scrollRef.current.scrollTo({
          left: cardRef.current.offsetWidth + translate.current,
        });
        translate.current += cardRef.current.offsetWidth;
      }
      if (setRefVal) {
        setRefVal(translate.current);
      }
      if (translate.current !== 0) {
        setShowLeftChevron(true);
      }
      if (isEndReached() && showRightChevron) {
        if (setIsReachEnd) {
          setIsReachEnd(true);
        }
        setShowRightChevron(false);
      }
    }
  }
  function handleLeft() {
    if (cardRef && translate.current !== 0) {
      scrollRef.current.scrollTo({
        left: translate.current - cardRef.current.offsetWidth,
      });
      translate.current -= cardRef.current.offsetWidth;
      if (setRefVal) {
        setRefVal(translate.current);
      }
      if (translate.current === 0) {
        setShowLeftChevron(false);
      }
      if (!isEndReached() && !showRightChevron) {
        setShowRightChevron(true);
      }
    }
  }

  return (
    <div className="container position">
      {(showRightChevron || (!showRightChevron && newCoachProps)) && (
        <div
          className={classNames('clickable', {
            'chevron-container-testimonial': setRefVal,
            'chevron-container': !setRefVal && !newCoachProps,
            'chevron-container-props': newCoachProps,
            'chevron-right': !newCoachProfile && !newCoachProps,
            'chevron-icon': !newCoachProfile,
            'chevron-icon-small': newCoachProfile,
            'chevron-right-coach': newCoachProfile,
            'chevron-right-coach-props': newCoachProps,
            'chevron-container-coach': newCoachProfile,
            'chevron-icon-low-opacity': !showRightChevron,
          })}
          onClick={handleRight}
          style={rightChevronStyles || {}}>
          {newCoachProfile || newCoachProps ? (
            <FiChevronRight />
          ) : (
            <MdChevronRight />
          )}
        </div>
      )}
      {(showLeftChevron || (!showLeftChevron && newCoachProps)) && (
        <div
          className={classNames('clickable', {
            'chevron-icon': !newCoachProfile,
            'chevron-icon-small': newCoachProfile,
            'chevron-left-testimonial':
              setRefVal && !newCoachProfile && !newCoachProps,
            'chevron-container-testimonial': setRefVal,
            'chevron-left': !setRefVal && !newCoachProfile && !newCoachProps,
            'chevron-left-coach': newCoachProfile,
            'chevron-left-coach-props': newCoachProps,
            'chevron-container': !setRefVal && !newCoachProps,
            'chevron-container-coach': newCoachProfile,
            'chevron-container-props': newCoachProps,
            'chevron-icon-low-opacity': !showLeftChevron,
          })}
          onClick={handleLeft}
          style={leftChevronStyles || {}}>
          {newCoachProfile || newCoachProps ? (
            <FiChevronLeft />
          ) : (
            <MdChevronLeft />
          )}
        </div>
      )}
      <div className="wrapper">
        <div
          className={classNames('scroll-wrapper disable-scrollbars', {
            'fixed-height': newCoachProfile && !noFixedHeight,
          })}
          ref={scrollRef}
          style={style}>
          {data && Array.isArray(data)
            ? data.map((item, index) => (
                <div key={item.id || index} ref={index === 0 ? cardRef : null}>
                  {renderItem(item, index)}
                </div>
              ))
            : null}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
