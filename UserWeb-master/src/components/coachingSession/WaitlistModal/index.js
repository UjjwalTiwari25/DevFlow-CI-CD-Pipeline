import React from 'react';
import { useDispatch } from 'react-redux';
import { generateQueryPath } from '@/utils';
import routeConstants from '@/utils/constants/routes';
import Router from 'next/router';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import { setShowWaitListModal } from '../../../store/slices/coaching';
import AuraButtonSecondary from '../../app/AuraButtonSecondary';
import Text from '../../app/Text';
import styles from './styles';

function WaitlistModal({ coach, setSelectedTab, redirectToGetAppPage }) {
  const dispatch = useDispatch();
  function hide() {
    dispatch(setShowWaitListModal(false));
    if (setSelectedTab && typeof setSelectedTab === 'function')
      setSelectedTab('Coaching');
    if (redirectToGetAppPage) {
      Router.replace(generateQueryPath(routeConstants.PAGE_GET_APP)).then(
        () => {
          window.scrollTo(0, 0);
        }
      );
    }
  }
  return (
    <div id="waitlist-modal">
      <div className="modal-container-light">
        <img
          src="/static/images/coachingSession/dark-modal-background.png"
          alt="background"
          className="modalbackground"
        />
        <div className="modal-content">
          <div
            className="close-icon clickable"
            onClick={() => {
              hide();
            }}>
            <img
              src="/static/images/coachingSession/close.png"
              className="close"
              alt="close icon"
            />
          </div>
          <Text type="body" color="g100" align="center" weight="regular">
            1-on-1 Coaching
          </Text>
          <div className="col align-center container w-100 payment-container">
            <div className="relative">
              <img
                src={getCoachPhoto(coach)}
                alt={getCoachName(coach)}
                className="coach-photo"
              />
              <img
                src="/static/images/coachingSession/greenCheck.png"
                alt="aura check"
                className="check"
              />
            </div>
            <Text
              type="h3"
              color="g100"
              align="center"
              weight="regular"
              style={{ marginTop: 31, maxWidth: 276 }}>
              Thank you! You have been added to the waitlist
            </Text>
            <Text
              type="body"
              color="g50"
              align="center"
              weight="regular"
              style={{ marginTop: 20, maxWidth: 276, marginBottom: 40 }}>
              You will receive a notification when coach are ready
            </Text>
            <AuraButtonSecondary
              title="Done"
              onClick={() => {
                hide();
              }}
            />
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default WaitlistModal;
