import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai';
import classNames from 'classnames';
import { handleLogout } from '../../../store/slices/auth';
import Text from '../Text';
import styles from './styles';

export default function UserDropDown({
  user,
  isDisabled = false,
  authLoading,
  style,
  isCoachingSession,
  isNewCoachProfile,
}) {
  const [showDropDown, setShowDropDown] = useState(false);
  const dispatch = useDispatch();
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
  async function logout() {
    dispatch(handleLogout());
  }
  return (
    <div
      style={style}
      className="button-holder"
      onClick={() => !isDisabled && toggleDropDown()}
      ref={dropDownRef}>
      {!isCoachingSession && (
        <button className={`dropdown-button ${!isDisabled && 'clickable'}`}>
          <Text
            color="b100"
            type="body2"
            weight="medium"
            style={{
              marginLeft: 8,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitLineClamp: 1,
            }}>
            {!authLoading && user && user.givenName}
          </Text>
          <span className="drop-down-icon" style={{ marginRight: 8 }}>
            {showDropDown ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
          </span>
        </button>
      )}
      {isCoachingSession && (
        <div className="clickable">
          <Text type="body" color="b100">
            {!authLoading && user && user.givenName}
          </Text>
        </div>
      )}
      {showDropDown && (
        <div
          className={classNames({
            dropdown: !isNewCoachProfile && !isCoachingSession,
            'new-drop-down': isNewCoachProfile,
            'coaching-profile-drop-down': isCoachingSession,
          })}>
          <div>
            <ul>
              <li onClick={logout}>
                <Text type="body2" align="center" color="b100">
                  Log out
                </Text>
              </li>
            </ul>
          </div>
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
