import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { FaUsers } from 'react-icons/fa';
import { BsCollectionPlay } from 'react-icons/bs';
import { IoIosSearch } from 'react-icons/io';
import AuraRing from '../app/AuraRing';
import Text from '../app/Text';
import routeConstants from '../../utils/constants/routes';
import useShallowEqualSelector from '../../hooks/shallowEqualSelector';
import { setCurrentTab } from '../../store/slices/navbar';
import styles from './styles';
import useHydration from '../../hooks/hydration';

export default function NavBar() {
  const { currentTab } = useShallowEqualSelector(({ navbar }) => navbar);
  const dispatch = useDispatch();
  function handleClick(path) {
    dispatch(setCurrentTab(path));
  }
  const isClient = useHydration();

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <div className="nav-main">
        <Link href={`/${routeConstants.PAGE_AURA}`} legacyBehavior>
          <a className="margin clickable">
            <AuraRing style={{ height: '33px', width: '32px' }} />
            <div className="title">
              <Text type="h4" color="b100" weight="regular" align="left">
                AURA
              </Text>
            </div>
          </a>
        </Link>
        <div className="nav-list-container">
          <Link href={`/${routeConstants.PAGE_EXPLORE}`} legacyBehavior>
            <a
              className="list clickable"
              onClick={() => {
                handleClick(routeConstants.PAGE_EXPLORE);
              }}>
              <div className="nav-icons-search">
                <IoIosSearch />
              </div>
              <div className="nav-text-search">
                <Text
                  type="body2"
                  color={
                    currentTab === routeConstants.PAGE_EXPLORE ? 'b100' : 'b64'
                  }
                  weight="regular"
                  align="left">
                  Explore
                </Text>
              </div>
            </a>
          </Link>
          <Link href={`/${routeConstants.PAGE_CHANNELS}`} legacyBehavior>
            <a
              className="list clickable"
              onClick={() => {
                handleClick(routeConstants.PAGE_CHANNELS);
              }}>
              <div className="nav-icons">
                <BsCollectionPlay />
              </div>
              <div className="nav-text">
                <Text
                  type="body2"
                  color={
                    currentTab === routeConstants.PAGE_CHANNELS ? 'b100' : 'b64'
                  }
                  weight="regular"
                  align="left">
                  Channels
                </Text>
              </div>
            </a>
          </Link>
          <Link href={`/${routeConstants.PAGE_COACHES}`} legacyBehavior>
            <a
              className="list-last clickable"
              onClick={() => {
                handleClick(routeConstants.PAGE_COACHES);
              }}>
              <div className="nav-icons">
                <FaUsers />
              </div>
              <div className="nav-text">
                <Text
                  type="body2"
                  color={
                    currentTab === routeConstants.PAGE_COACHES ? 'b100' : 'b64'
                  }
                  weight="regular"
                  align="left">
                  Coaches
                </Text>
              </div>
            </a>
          </Link>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
