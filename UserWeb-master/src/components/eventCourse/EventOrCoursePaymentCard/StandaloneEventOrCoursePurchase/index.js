import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import useTranslations from '@/hooks/translations';
import { getTypeTitle } from '@/utils/community';
import styles from '../styles.module.scss';

function StandaloneEventOrCoursePurchase({ eventOrCoursePrice, type, isFree }) {
  const { t } = useTranslations();
  return (
    <div>
      <div className={styles.purchaseEventWrapper}>
        <div>
          <div className={styles.purchaseEventFor}>
            {t('purchase_card_purchase_for', {
              type: t(getTypeTitle(type), { count: 1 }),
            })}
          </div>
        </div>
        <div>
          <div className={styles.eventPriceDetails}>
            <div className={styles.eventPrice}>
              {isFree
                ? t('price_text_free')
                : I18NFormatter.formatCurrency(
                    convertToDollar(eventOrCoursePrice),
                    {
                      maximumFractionDigits: 0,
                    }
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default StandaloneEventOrCoursePurchase;
