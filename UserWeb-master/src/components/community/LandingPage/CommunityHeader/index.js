import React, { useState } from 'react';
import classNames from 'classnames';
import { Carousel } from 'react-responsive-carousel';
import { ButtonCenter, Icon } from '@aurahealth/web-design-system';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import UserDropDown from '@/components/app/UserDropDown';
import useAuthUser from '@/hooks/authUser';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './styles.module.scss';
import JoinCommunityButton from '../JoinCommunityButton';

function CommunityHeader({ community, onJoinCommunity, isUserSubscriber }) {
  const { user, authLoading } = useAuthUser();
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();
  const { media = [], logo, name, summary } = community;
  const imageMedia = media.filter((item) => item.type === 'image');

  return (
    <div className={styles.communityHeader}>
      <Carousel
        showArrows={false}
        showStatus={false}
        selectedItem={activeIndex}
        onChange={(index) => setActiveIndex(index)}
        showIndicators={true}
        showThumbs={false}
        autoPlay={true}
        interval={5000}
        renderIndicator={(clickHandler, isSelected, index) => {
          return (
            imageMedia?.length > 1 && (
              <li
                onClick={clickHandler}
                className={`${isSelected ? styles.customIndicatorActive : styles.customIndicator}`}
                key={index}
                role="button"
              />
            )
          );
        }}
        className={`carousel ${styles.imageCarousel}`}>
        {imageMedia?.map((item, index) => {
          let mediaContent;

          if (item.type === 'image') {
            mediaContent = (
              <img src={item.url} alt="" className={styles.headerImage} />
            );
          }

          return (
            <div key={index}>
              {mediaContent}
              <div className={styles.overlay}></div>
            </div>
          );
        })}
      </Carousel>

      <div className={styles.headerContent}>
        <div className={classNames('w-100 row align-items', styles.nav)}>
          <img
            src="/static/images/logoHorizontal.png"
            alt="aura-logo"
            className={styles.auraLogoWithText}
          />

          <div className={styles.logoutWrapper}>
            {!isMobile && !isUserSubscriber && (
              <ButtonCenter
                text={t('community_table_join_community_button')}
                onClick={onJoinCommunity}
                height="medium"
                type="cta-blue"
              />
            )}
            {user && <UserDropDown user={user} authLoading={authLoading} />}
          </div>
        </div>

        <div className={styles.communityDetails}>
          <div
            className={classNames(styles.communityDetailsWrapperHeader, {
              [styles.communityDetailsWrapperHeaderCenter]:
                imageMedia?.length <= 1,
            })}>
            {!isMobile && imageMedia?.length > 1 && (
              <div
                onClick={() => {
                  if (activeIndex > 0) {
                    setActiveIndex((prev) => prev - 1);
                  }
                }}
                className={styles.leftArrow}>
                <Icon name={Icon.LIST.ActionArrowLeft} size={Icon.SIZES.base} />
              </div>
            )}
            <div className={styles.communityDetailsWrapper}>
              <div className={styles.communityDetailsHeader}>
                <img src={logo} alt="" className={styles.communityLogo} />
                <div className={styles.communityDetailsHeaderText}>
                  <div className={styles.communityName}>{name}</div>
                </div>
              </div>
              <div className={styles.communitySummary}>{summary}</div>
            </div>
            {!isMobile && imageMedia?.length > 1 && (
              <div
                onClick={() => {
                  if (activeIndex < (imageMedia?.length || 0) - 1) {
                    setActiveIndex((prev) => prev + 1);
                  }
                }}
                className={styles.rightArrow}>
                <Icon
                  name={Icon.LIST.ActionArrowRight}
                  size={Icon.SIZES.base}
                />
              </div>
            )}
          </div>
          {!isUserSubscriber && (
            <JoinCommunityButton
              style={{ zIndex: 21 }}
              onClick={onJoinCommunity}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityHeader;
