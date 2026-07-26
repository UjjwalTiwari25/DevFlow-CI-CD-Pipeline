import React, { useRef } from 'react';
import useToastMessage from '../../../hooks/toastMessage';
import Analytics from '../../../services/Analytics';
import referralConstants from '../../../utils/constants/referral';
import { isValidEmail } from '../../../utils/validators';
import AuraButton from '../../app/AuraButton';
import Input from '../../app/Input';
import styles from './styles';

const EMAIL_BODY = `Hey I've been using an app called Aura which has 1000s of meditations, stories, and nature sounds from wellness experts to help you fall asleep, reduce stress, and improve focus in just 3 minutes. I think you'll like it, check it out!`;

export default function ShareViaEmail({ link, referralCode, referralType }) {
  const Toast = useToastMessage();
  const email = useRef('');
  const body = useRef(EMAIL_BODY);
  const linkWithChannel = `${link}channel=${referralConstants.CHANNEL_EMAIL}`;

  function sendEmail() {
    if (!isValidEmail(email.current)) {
      Toast.showError('Please enter a valid email address');
      return;
    }
    if (!body.current || !body.current.length) {
      body.current = EMAIL_BODY;
    }
    const bodyText = `${body.current}%0D${encodeURIComponent(linkWithChannel)}`;
    const mail = document.createElement('a');
    mail.href = `mailto:${email.current}?subject=Join me on Aura&body=${bodyText}`;
    mail.target = '_blank';
    mail.rel = 'noopener noreferrer';
    mail.click();
    Analytics.track('Share Aura', {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      Channel: 'Email',
      'Referral Code': referralCode,
      'Referral Type': referralType,
      'Sent from': 'dashboard',
    });
  }

  return (
    <div className="col">
      <Input
        type="email"
        borderStyle
        placeholder="To: (Enter contact email)"
        fontType="body"
        style={{ flexGrow: 1, marginBottom: 12 }}
        onChange={(evt) => {
          email.current = evt.target.value;
        }}
      />
      <textarea
        className="email-body-container"
        type="text"
        rows={2}
        defaultValue={EMAIL_BODY}
        style={{
          minHeight: 107,
          justifyContent: 'flex-start',
          paddingTop: 16,
          paddingBottom: 16,
        }}
        onChange={(evt) => {
          body.current = evt.target.value;
        }}
      />
      <AuraButton
        title="Send Invite"
        style={{ height: 48, width: 128 }}
        loading={!link}
        onClick={sendEmail}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
