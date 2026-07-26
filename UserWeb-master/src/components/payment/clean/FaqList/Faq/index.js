import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import useTranslations from '@/hooks/translations';
import Text from '../../../../app/Text';
import styles from './styles';

export default function Faq({ item, chageColorOnOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslations();
  const faqRef = useRef();

  useEffect(() => {
    if (isOpen && faqRef.current) {
      faqRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={faqRef}
      className={classNames('faq-container col w-100 clickable', {
        'close-background': !isOpen && chageColorOnOpen,
        'open-background': isOpen && chageColorOnOpen,
        'celeb-faq-item-container': !chageColorOnOpen,
      })}
      onClick={() => {
        setIsOpen(!isOpen);
      }}>
      {!isOpen && (
        <div className="row w-100 justify-space-between align-center">
          <Text
            type="body"
            color={!chageColorOnOpen ? 'w100' : 'b100'}
            style={
              !chageColorOnOpen
                ? {
                    fontSize: 18,
                    fontWeight: 400,
                  }
                : {}
            }>
            {t(item.question)}
          </Text>
          <div
            className={classNames('close-icon', {
              'celeb-nav-icon': !chageColorOnOpen,
            })}>
            <BsChevronDown />
          </div>
        </div>
      )}
      {isOpen && (
        <>
          <div className="row w-100 justify-space-between align-center">
            <Text
              type="body"
              color="w100"
              style={
                !chageColorOnOpen
                  ? {
                      fontSize: 18,
                      fontWeight: 400,
                    }
                  : {}
              }>
              {t(item.question)}
            </Text>
            <div className="open-icon">
              <BsChevronUp />
            </div>
          </div>
          <Text
            type="body"
            color="w100"
            style={
              !chageColorOnOpen
                ? {
                    fontSize: 18,
                    fontWeight: 400,
                    marginTop: 25,
                    whiteSpace: 'pre-wrap',
                  }
                : { marginTop: 25, whiteSpace: 'pre-wrap' }
            }>
            {t(item.answer)}
          </Text>
        </>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
