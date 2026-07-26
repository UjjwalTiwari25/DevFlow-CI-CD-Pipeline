import AlreadyPurchased from './AlreadyPurchased';
import PurchaseCommunityEventOrCourse from './PurchaseCommunityEventOrCourse';
import PurchaseStandaloneEventOrCourse from './PurchaseStandaloneEventOrCourse';
import JoinCommunity from './JoinCommunity';
import styles from './styles.module.scss';

function EventOrCoursePurchaseOptionFooter({
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
  renderSubmitButton,
  eventOrCourseCommunityMemberDiscount,
}) {
  const renderPurchaseOptions = (props = {}) => {
    if (!isPartOfCommunity) {
      return <PurchaseStandaloneEventOrCourse {...props} />;
    }
    if (isPartOfCommunity && isUserSubscriber) {
      return <PurchaseCommunityEventOrCourse {...props} />;
    }
    return <JoinCommunity {...props} />;
  };
  return (
    <div className={styles.container}>
      {(isUserAlreadyPurchased ||
        (isPastEvent && (isUserSubscriber || !isPartOfCommunity))) && (
        <AlreadyPurchased deeplink={deeplink} type={type} />
      )}
      {((!isUserAlreadyPurchased && !isPastEvent) ||
        (!isUserSubscriber && isPartOfCommunity)) &&
        renderPurchaseOptions({
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
          renderSubmitButton,
          eventOrCourseCommunityMemberDiscount,
        })}
    </div>
  );
}
export default EventOrCoursePurchaseOptionFooter;
