import React from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function NewFooter({ cleanDesign = false }) {
  const { t } = useTranslations();
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div>
      <div
        className={classNames(styles.horizontalRow, {
          [styles.lessMargin]: cleanDesign,
        })}></div>
      <div
        className={classNames(styles.footerWrapper, {
          [styles.lessMarginFooterWrapper]: cleanDesign,
        })}>
        <div className={styles.copyrightText}>
          {`© ${getCurrentYear()} Aura Health`}
        </div>
        <div>
          <div className={styles.contactText}>
            {t('footer_contact_us')}
            <a href="mailto:hello@aurahealth.io" className={styles.linkText}>
              hello@aurahealth.io
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewFooter;
