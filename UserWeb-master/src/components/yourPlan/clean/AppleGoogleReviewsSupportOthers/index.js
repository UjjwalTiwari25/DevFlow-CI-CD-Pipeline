import AppleGoogleReviews from '@/components/payment/clean/AppleGoogleReviews';
import SupportOthers from '@/components/payment/clean/SupportOthers';
import DonateCard from '@/components/payment/clean/DonateCard';
import FaqList from '@/components/payment/clean/FaqList';
import styles from './styles.module.scss';

function AppleGoogleReviewsSupportOthers() {
  return (
    <div className={styles.containerPadding}>
      <AppleGoogleReviews isNoTopPadding />
      <SupportOthers isNoTopPadding />
      <DonateCard />
      <FaqList isUsedInYourPlan />
    </div>
  );
}
export default AppleGoogleReviewsSupportOthers;
