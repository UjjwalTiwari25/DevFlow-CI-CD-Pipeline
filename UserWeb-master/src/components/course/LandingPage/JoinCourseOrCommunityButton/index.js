import useTranslations from '@/hooks/translations';
import { ButtonCenter } from '@aurahealth/web-design-system';

function JoinCourseOrCommunityButton({
  onClick,
  isCoursePartOfCommunity,
  isUserSubscriber,
  style = {},
}) {
  const { t } = useTranslations();

  return (
    <ButtonCenter
      text={
        !isCoursePartOfCommunity || isUserSubscriber
          ? t('course_purchase_join_course')
          : t('course_join_community')
      }
      height="large"
      type="cta-blue"
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
export default JoinCourseOrCommunityButton;
