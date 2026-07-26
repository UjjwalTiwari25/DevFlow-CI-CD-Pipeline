import React from 'react';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import styles from './styles';

export default function GuestPassCard() {
  const { currentLocale } = useTranslations();
  return (
    <>
      <img
        src={getLocaleImage('/static/images/guestPass.png', currentLocale)}
        className="guest-pass-card"
        alt="30 Day Guest Pass"></img>
      <style jsx>{styles}</style>
    </>
  );
}
