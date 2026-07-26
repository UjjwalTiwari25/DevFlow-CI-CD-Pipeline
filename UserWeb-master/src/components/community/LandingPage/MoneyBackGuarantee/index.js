import classNames from 'classnames';
import Image from 'next/image';
import styles from './styles.module.scss';

function MoneyBackGuarantee({ moneyBackGuaranteeData }) {
  const { title, description } = moneyBackGuaranteeData || {};
  return (
    <div className={classNames(styles.moneyBackWrapper)}>
      <hr className={styles.offeringsTableDivider} />
      <div className={styles.contentWrapper}>
        <Image
          src="/static/images/community/money-back-icon.png"
          height={120}
          width={120}
          alt=""
          style={{
            background: '#FFF',
            boxShadow: '0px 4px 26px 0px rgba(43, 42, 107, 0.08)',
            borderRadius: '120px',
          }}
        />
        {title && <div className={styles.moneyBackText}>{title}</div>}
        {description && (
          <div className={styles.moneyBackSubText}>{description}</div>
        )}
      </div>
      <div className={styles.moneyBackGuaranteeImage}></div>

      <hr className={styles.offeringsTableDivider} />
    </div>
  );
}
export default MoneyBackGuarantee;
