import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

const VALUE_PROPS = [
  {
    image: '/static/images/appleGoogleReviews/apple_gray.png',
    title: 'payment_subscribe_app_reviews_list_item_47_stars',
    description: 'payment_subscribe_app_reviews_list_item_app_store_rating',
    stars: '/static/images/appleGoogleReviews/stars_47.png',
  },
  {
    image: '/static/images/appleGoogleReviews/apple_gray.png',
    image2: '/static/images/appleGoogleReviews/playstore.png',
    title: 'payment_subscribe_app_reviews_list_item_35_rating',
    description: 'payment_subscribe_app_reviews_list_item_mobile_stores',
    stars: '/static/images/appleGoogleReviews/stars_5.png',
  },
  {
    image: '/static/images/appleGoogleReviews/Group.png',
    title: 'payment_subscribe_app_reviews_list_item_7_million',
    description: 'payment_subscribe_app_reviews_list_item_downloads',
  },
  {
    image: '/static/images/appleGoogleReviews/thumbs_up.png',
    title: 'payment_subscribe_app_reviews_list_item_30_thousands',
    titleChakraExp:
      'payment_subscribe_app_reviews_list_item_92_percent_users_title',
    description: 'payment_subscribe_app_reviews_list_item_5_star_rating',
    descriptionChakraExp:
      'payment_subscribe_app_reviews_list_item_92_percent_users_desc',
  },
];

const VALUE_PROPS_DARK = [
  {
    image: '/static/images/appleGoogleReviews/apple_gray-dark.png',
    title: 'payment_subscribe_app_reviews_list_item_47_stars',
    description: 'payment_subscribe_app_reviews_list_item_app_store_rating',
    stars: '/static/images/appleGoogleReviews/stars_47.png',
  },
  {
    image: '/static/images/appleGoogleReviews/apple_gray-dark.png',
    image2: '/static/images/appleGoogleReviews/playstore.png',
    title: 'payment_subscribe_app_reviews_list_item_35_rating',
    description: 'payment_subscribe_app_reviews_list_item_mobile_stores',
    stars: '/static/images/appleGoogleReviews/stars_5.png',
  },
  {
    image: '/static/images/appleGoogleReviews/Group-dark.png',
    title: 'payment_subscribe_app_reviews_list_item_7_million',
    description: 'payment_subscribe_app_reviews_list_item_downloads',
  },
  {
    image: '/static/images/appleGoogleReviews/thumbs_up-dark.png',
    title: 'payment_subscribe_app_reviews_list_item_30_thousands',
    titleChakraExp:
      'payment_subscribe_app_reviews_list_item_92_percent_users_title',
    description: 'payment_subscribe_app_reviews_list_item_5_star_rating',
    descriptionChakraExp:
      'payment_subscribe_app_reviews_list_item_92_percent_users_desc',
  },
];
export default function AppleGoogleReviews({ isNoTopPadding }) {
  const { isDark } = useThemeListener();
  const [values, setValues] = useState(null);
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();
  useEffect(() => {
    if (isDark) {
      setValues(VALUE_PROPS_DARK);
    } else {
      setValues(VALUE_PROPS);
    }
  }, [isDark]);
  return (
    <div
      className={classNames('card', { 'is-no-top-padding': isNoTopPadding })}>
      {!isDark && (
        <img
          src="/static/images/appleGoogleReviews/background.png"
          alt="background"
          className="background-image"
        />
      )}
      <div className="values-wrapper">
        {values &&
          values.map((item, index) => (
            <div
              className={classNames('value-contanier', {
                'background-dark': isDark,
                'background-light': !isDark,
                'margin-right': index % 2 === 0,
              })}
              key={index}>
              <div className="image-div">
                {item.image && (
                  <img
                    src={item.image}
                    alt="icon"
                    className={classNames({
                      'icon-apple': index === 0 || index === 1,
                      'icon-group': index === 2,
                      'icon-thumb': index === 3,
                    })}
                  />
                )}
                {item.image2 && (
                  <img
                    src={item.image2}
                    alt="icon"
                    className="icon-playstore"
                  />
                )}
              </div>
              {index < 2 && (
                <img
                  src={item.stars}
                  alt="aura rating stars"
                  className="stars"
                />
              )}
              <Text
                type="h4-large"
                align="center"
                weight="normal"
                color="b64"
                style={{
                  fontWeight: 600,
                  marginTop: index > 1 && 10,
                  fontSize: isMobile && '18px',
                }}>
                {t(item.titleChakraExp ? item.titleChakraExp : item.title, {
                  ns: 'common',
                })}
              </Text>
              <Text type="body2" align="center" weight="normal" color="b40">
                {t(
                  item.descriptionChakraExp
                    ? item.descriptionChakraExp
                    : item.description,
                  { ns: 'common' }
                )}
              </Text>
            </div>
          ))}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
