import React, { useCallback, useEffect, useRef, useState } from 'react';
import { trackTypeDisplayStringFromId } from '../../../models/meditation';
import Text from '../../app/Text';
import styles from './styles';

function SearchDropDown({ title, options, onClick }) {
  const [showDropDown, setShowDropDown] = useState(false);

  const dropDownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
  }, [dropDownRef]);
  function toggleDropDown() {
    setShowDropDown(!showDropDown);
  }
  const getOption = useCallback(
    (option) => {
      if (title === 'Content type') {
        return trackTypeDisplayStringFromId(option);
      }
      if (title === 'Duration' || title === 'Topic') {
        return option;
      }
      return null;
    },
    [title]
  );
  return (
    <div className="row align-center relative" ref={dropDownRef}>
      <div
        className="row selection-container align-center clickable"
        onClick={() => {
          toggleDropDown();
        }}>
        <Text type="footnote" color="b100" style={{ marginRight: 6 }}>
          {title}
        </Text>
        <img src="/static/images/newCoach/dropdown.png" alt="aura" />
      </div>
      {showDropDown && (
        <div className="container col align-center">
          {Object.values(options).map((option, index) => (
            <div key={index} onClick={onClick} className="clickable">
              <Text type="footnote" color="b100" align="center">
                {getOption(option)}
              </Text>
              {index !== Object.values(options).length - 1 && (
                <hr className="hr" />
              )}
            </div>
          ))}
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

export default SearchDropDown;
