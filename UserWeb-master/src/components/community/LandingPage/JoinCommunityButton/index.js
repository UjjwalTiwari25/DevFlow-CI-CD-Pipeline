import React from 'react';
import { ButtonCenter } from '@aurahealth/web-design-system';
import useTranslations from '@/hooks/translations';

function JoinCommunityButton({ onClick, style = {} }) {
  const { t } = useTranslations();

  return (
    <ButtonCenter
      text={t('community_table_join_community_button')}
      height="large"
      type="cta-blue"
      onClick={onClick}
      style={{
        fontSize: 20,
        fontWeight: 700,
        lineHeight: '25px',
        textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
        ...style,
      }}
    />
  );
}

export default JoinCommunityButton;
