import useAuthUser from '@/hooks/authUser';
import AlreadyPurchased from './AlreadyPurchased';
import NonMemberEventOrCoursePurchase from './NonMemberEventOrCoursePurchase';
import StandaloneEventOrCoursePurchase from './StandaloneEventOrCoursePurchase';
import CommunityMemberEventOrCoursePurchase from './CommunityMemberEventOrCoursePurchase';
import FreeEventOrCoursePurchase from './FreeEventOrCoursePurchase';
import styles from './styles.module.scss';

function EventOrCoursePaymentCard({
  isUserAlreadyPurchased,
  deeplink,
  type,
  community,
  coach,
  isPastEvent,
  onJoinSingleEventOrCourse,
  isUserSubscriber,
  isPartOfCommunity,
  isExclusiveToCommunity,
  isFree,
  handleButtonClick,
  eventOrCourseTitle,
  eventOrCoursePrice,
  eventOrCourseCommunityPrice,
  eventOrCourseCommunityMemberDiscount,
  eventOrCourseScheduledAt,
  eventOrCourseDuration,
  renderSubmitButton,
  isEvent,
}) {
  const { user } = useAuthUser();
  const renderPurchaseDetails = (props = {}) => {
    if (isFree && isEvent && !isUserAlreadyPurchased) {
      return <FreeEventOrCoursePurchase {...props} />;
    }
    if (!isPartOfCommunity) {
      return <StandaloneEventOrCoursePurchase {...props} />;
    }

    if (isUserSubscriber) {
      return <CommunityMemberEventOrCoursePurchase {...props} />;
    }

    return <NonMemberEventOrCoursePurchase {...props} />;
  };

  return (
    <div className={styles.container}>
      {(isUserAlreadyPurchased ||
        (isPastEvent && (isUserSubscriber || !isPartOfCommunity))) && (
        <div className={styles.purchaseCard}>
          <AlreadyPurchased deeplink={deeplink} type={type} />
        </div>
      )}
      {((!isUserAlreadyPurchased && !isPastEvent) ||
        (!isUserSubscriber && isPartOfCommunity) ||
        (isFree && isEvent && !isUserAlreadyPurchased && !user)) && (
        <div className={styles.purchaseCard}>
          {renderPurchaseDetails({
            isExclusiveToCommunity,
            isPastEvent,
            isUserAlreadyPurchased,
            eventOrCourseTitle,
            onJoinSingleEventOrCourse,
            coach,
            community,
            isUserSubscriber,
            eventOrCoursePrice,
            eventOrCourseCommunityPrice,
            eventOrCourseCommunityMemberDiscount,
            eventOrCourseScheduledAt,
            eventOrCourseDuration,
            handleButtonClick,
            type,
            isFree,
          })}
          {renderSubmitButton &&
            typeof renderSubmitButton === 'function' &&
            renderSubmitButton()}
        </div>
      )}
    </div>
  );
}
export default EventOrCoursePaymentCard;
