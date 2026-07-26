import useTranslations from '@/hooks/translations';
import { ButtonCenter } from '@aurahealth/web-design-system';

function JoinCommunityOrEventButton({
  onClick,
  isEventPartOfCommunity,
  isUserSubscriber,
  style = {},
}) {
  const { t } = useTranslations();
  return (
    <ButtonCenter
      height="large"
      type="cta-blue"
      text={
        !isEventPartOfCommunity || isUserSubscriber
          ? t('button_join_event')
          : t('event_purchase_card_join_community')
      }
      style={{
        fontSize: 20,
        fontWeight: 700,
        lineHeight: '25px',
        textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
        ...style,
      }}
      onClick={onClick}
    />
  );
}
export default JoinCommunityOrEventButton;
