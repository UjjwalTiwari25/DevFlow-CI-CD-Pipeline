import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { getPersonalizedFeedTopics } from '../../../../models/user';
import contentConstants from '../../../../utils/constants/content';
import YourPlanTracks from '../YourPlanTracks';
import styles from './styles';

export default function HomepageContent({
  className,
  style,
  user,
  isYourPlan2 = false,
  noAnimations,
  selectedContentType = null,
  isContentPreview = false,
}) {
  const [personalizedActiveTopics, setPersonalizedActiveTopics] =
    useState(null);

  useEffect(() => {
    if (user) {
      const { personalizedActiveFeed } = getPersonalizedFeedTopics(user);
      setPersonalizedActiveTopics(personalizedActiveFeed);
    }
  }, [user]);
  const durationFilter =
    user && user.durationPreference
      ? Object.values(contentConstants.DURATION_KEYS_FOR_REQUEST).indexOf(
          user.durationPreference
        )
      : contentConstants.DURATION_KEYS.ALL;
  return (
    <div
      className={classnames(
        'card align-center justify-center col',
        {
          'card-2': isYourPlan2,
        },
        className
      )}
      style={{
        ...(isYourPlan2 ? { padding: 20 } : {}),
        ...style,
      }}>
      <div
        className={classnames('tracks-topics', {
          animation: isYourPlan2 && !noAnimations,
        })}>
        {personalizedActiveTopics &&
          personalizedActiveTopics.map((topic, index) =>
            !topic || !topic.query ? null : (
              <YourPlanTracks
                topic={topic}
                key={topic.unique}
                durationFilter={durationFilter}
                isYourPlan2={isYourPlan2}
                index={index}
                isContentPreview={isContentPreview}
                selectedContentType={selectedContentType}
              />
            )
          )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
