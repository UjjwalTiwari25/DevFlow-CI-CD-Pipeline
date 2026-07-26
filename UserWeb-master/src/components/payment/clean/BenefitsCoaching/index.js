import React from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';

export default function BenefitsCoaching({ className, coachName }) {
  const { t } = useTranslations();
  const benefits = [
    {
      image: '/static/images/coachingOnboarding/icons/chat.png',
      description: t(
        'payment_subscribe_benefits_coaching_list_item_unlimited_access'
      ),
    },
    {
      image: '/static/images/coachingOnboarding/icons/recommendations.png',
      description: t(
        'payment_subscribe_benefits_coaching_list_item_custom_recommendations',
        { name: coachName }
      ),
    },
    {
      image: '/static/images/coachingOnboarding/icons/circle.png',
      description: t(
        'payment_subscribe_benefits_coaching_list_item_beautiful_mindfulness'
      ),
    },
    {
      image: '/static/images/coachingOnboarding/icons/phone.png',
      description: t(
        'payment_subscribe_benefits_coaching_list_item_full_access'
      ),
    },
  ];
  return (
    <div className={`card ${className}`}>
      <div className="values-wrapper">
        {benefits.map((item, index) => (
          <div className="value-contanier" key={index}>
            <img src={item.image} alt="benefit icons" className="blue-check" />
            <Text type="b100" align="left" weight="normal" color="b64">
              {item.description}
            </Text>
          </div>
        ))}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
