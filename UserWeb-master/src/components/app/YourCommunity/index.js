import React from 'react';
import Router from 'next/router';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import useFetchCoachDetails from '@/hooks/useFetchCoachDetails';
import styles from './styles.module.scss';

function YourCommunity({ community, isUserSubscriber }) {
  const { t } = useTranslations();
  const { name, image, description } = community;
  const { coachDetails: communityOwner } = useFetchCoachDetails({
    coachId: community?.ownerId,
  });

  if (!(community && !isUserSubscriber)) return null;

  const handleClick = () => {
    if (communityOwner?.slug && community?.slug) {
      Router.push(
        `/coaches/${communityOwner?.slug}/communities/${community?.slug}`
      );
    }
  };

  return (
    <div
      className={classNames(styles.yourCommunityWrapper, 'clickable')}
      onClick={handleClick}>
      <div className={styles.yourCommunityLabel}>{t('community_label')}</div>
      <div className={styles.coachCommunityCard}>
        <div className={styles.communityInfoHeader}>
          <div className={styles.communityImageWrapper}>
            <img
              className={styles.yourCoachProfileImage}
              src={image}
              alt={name}
            />
          </div>
          <div>
            <div className={styles.communityName}>{name}</div>
          </div>
        </div>
        <div className={styles.communityDescription}>{description}</div>
      </div>
    </div>
  );
}

export default YourCommunity;
