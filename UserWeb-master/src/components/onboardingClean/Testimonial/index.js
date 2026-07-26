import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import useThemeListener from '../../../hooks/themeListener';
import Text from '../../app/Text';
import styles from './styles';

export default function Testimonial({
  isCoachPlan,
  name,
  memberOf,
  image,
  desc,
  isExperiment = false,
  isWebTestimonialsBottom,
}) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  return (
    <div
      id={classNames({
        testimonial: !isExperiment,
        'testimonial-exp': isExperiment && !isWebTestimonialsBottom,
        'testimonial-bottom': isExperiment && isWebTestimonialsBottom,
      })}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        position: 'relative',
      }}>
      {isCoachPlan && <div className="background-coach"></div>}
      {!isCoachPlan && isExperiment && !isDark && (
        <div className={'background-exp'}></div>
      )}
      {!isCoachPlan && isExperiment && isDark && (
        <div className={'background-exp-dark'}></div>
      )}
      {!isExperiment && !isDark && !isCoachPlan && (
        <div className={'background'} />
      )}

      <Text
        type="subtitle"
        weight="regular"
        color={isDark ? 'w100' : 'b100'}
        align="left"
        style={{
          marginBottom: 25,
        }}>
        {`${isExperiment && desc ? desc : t('testimonial_like_a_therapist')}`}
      </Text>
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <img
          src="/static/images/5stars.png"
          alt="Rated 5 stars"
          style={{
            height: 25,
            objectFit: 'contain',
            marginRight: 8,
            position: 'absolute',
            bottom: 54,
          }}
        />

        <div
          className={isExperiment && 'user'}
          style={{
            display: 'inline-flex',
          }}>
          <img
            className="mood-image"
            src={
              isExperiment && image
                ? image
                : '/static/images/icons/lindaAvatar.png'
            }
            alt="Linda Profile Pic"
          />
          <div>
            <Text
              type="cta"
              weight="semibold"
              color={isDark ? 'w100' : 'b100'}
              align="left">
              {isExperiment && name ? name : t('testimonial_linda')}
            </Text>
            <Text
              type="footnote"
              weight="regular"
              color={isDark ? 'w80' : 'b64'}
              align="left">
              {isExperiment && memberOf
                ? memberOf
                : t('testimonial_member_2_years')}
            </Text>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
