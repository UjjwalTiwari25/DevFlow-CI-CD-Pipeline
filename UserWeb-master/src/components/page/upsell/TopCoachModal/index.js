import classNames from 'classnames';
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { MdClose } from 'react-icons/md';
import {
  getAvailableCoachingSpots,
  getCoachFirstName,
  getCoachName,
  getCoachPhoto,
} from '../../../../models/coach';
import { getCountDisplayValue } from '../../../../utils';
import Text from '../../../app/Text';

import styles from './styles';

function TopCoachModal(
  {
    coach,
    countryDetails,
    handleChooseCoach,
    disableButton,
    isNewCoachingFlow,
  },
  ref
) {
  const [isVisible, setIsVisible] = useState(false);
  const coachSpecialities = coach.specialties && coach.specialties.split(',');
  function show() {
    setIsVisible(true);
  }
  function hide() {
    setIsVisible(false);
  }
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const maxPlays = Math.max(coach.listenedCount, coach.playedCount);
  if (!isVisible) {
    return null;
  }
  return (
    <div id="coach-modal">
      <div
        className="close-icon clickable"
        onClick={() => {
          hide();
        }}>
        <MdClose />
      </div>
      <div className="coach-container col align-center">
        <div className="coach">
          <img
            src={getCoachPhoto(coach)}
            alt={coach && coach.name}
            className="coach-image"
          />
        </div>
        <hr className="hr less-width" />
        <div className="relative col align-center full-height">
          <img
            src="/static/images/familyPlan/coach-modal-shadow.png"
            alt="aura"
            className="shadow"
          />
          <Text
            type="h2-smaller"
            weight="regular"
            color="b100"
            style={{ marginTop: 15 }}>
            {getCoachName(coach)}
          </Text>
          <Text
            typ="body2"
            color="b100"
            align="center"
            style={{ marginTop: 11 }}>
            {coach && coach.professionalTitle}
          </Text>
          <div className="row align-center flag-container">
            <img
              src={countryDetails && countryDetails.imageUrl}
              alt="aura flag"
              className="country-flag"
            />
            <Text typ="body2" color="b100" align="center">
              {countryDetails && countryDetails.displayName}
            </Text>
          </div>
          {isNewCoachingFlow && (
            <div className="row stats">
              <div className="col align-center">
                <Text type="body2" color="b64" align="center">
                  Followers
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{ marginTop: 5 }}>
                  {`${getCountDisplayValue(coach && coach.followersCount)}`}
                </Text>
              </div>
              <div className="col align-center">
                <Text type="body2" color="b64" align="center">
                  Plays
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{ marginTop: 5 }}>
                  {`${getCountDisplayValue(maxPlays)}`}
                </Text>
              </div>
              <div className="col align-center">
                <Text type="body2" color="b64" align="center">
                  Favorites
                </Text>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{ marginTop: 5 }}>
                  {getCountDisplayValue(coach?.favoritedCount)}
                </Text>
              </div>
            </div>
          )}
          <hr className="hr" />
          <div className="coach-info col w-100">
            <Text type="body" color="b100">
              {getCoachFirstName(coach)} Specialities
            </Text>
            <Text type="body2" color="b64" style={{ marginTop: 5 }}>
              What topics {getCoachFirstName(coach)} is open to provide you
              with.
            </Text>
            <div className="row specialities">
              {coachSpecialities &&
                coachSpecialities.map((speciality) => (
                  <div key={speciality} className="speciality">
                    <Text type="footnote" color="b100">
                      {speciality}
                    </Text>
                  </div>
                ))}
            </div>
            <Text
              type="body"
              color="b100"
              style={{ marginTop: 30, marginBottom: 10 }}>
              Biography
            </Text>
            <Text type="body2" color="b64" style={{ lineHeight: '21px' }}>
              {coach && coach.bio}
            </Text>
            <div className="button-container">
              <button
                className={classNames('aura-btn with-shadow clean-style', {
                  clickable: !disableButton,
                  disabled: disableButton,
                })}
                onClick={() => {
                  if (!disableButton) {
                    handleChooseCoach();
                  }
                }}
                style={{ zIndex: 1 }}>
                <Text color={'b100'} type="body" align="center">
                  Choose this coach
                </Text>
                <div className="spots">
                  <Text
                    type="body2"
                    color="b100"
                    style={{
                      textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
                    }}>
                    {getAvailableCoachingSpots(coach)} spots left
                  </Text>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(TopCoachModal);
