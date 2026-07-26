import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

const AccordionItem = ({ item, index, onOpenClose }) => {
  const [opened, setOpened] = useState(false);

  return (
    <div
      className={classNames(styles.accordionListItem, {
        [styles.accordionItemOpened]: opened,
      })}
      onClick={() => {
        setOpened(!opened);
        if (onOpenClose && typeof onOpenClose === 'function') {
          onOpenClose({
            title: item.title,
            action: opened ? 'Collapse' : 'Extend',
          });
        }
      }}>
      <div className={styles.accordionItemLine}>
        <h3 className={styles.accordionItemTitle}>
          {index + 1}. {item.title}
        </h3>
        <span className={styles.accordionItemIcon}></span>
      </div>
      <div className={styles.accordionItemInner}>
        <div className={styles.accordionItemContent}>
          <p className={styles.accordionItemParagraph}>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ sections, isFullList, onOpenClose }) => {
  return (
    <div className={styles.wrapper}>
      <div
        className={classNames(styles.accordionList, {
          [styles.accordionListFull]: isFullList,
        })}>
        {sections?.map((item, index) => (
          <AccordionItem
            key={index}
            item={item}
            index={index}
            onOpenClose={onOpenClose}
          />
        ))}
      </div>
    </div>
  );
};

export default Accordion;
