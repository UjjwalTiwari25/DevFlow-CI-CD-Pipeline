import React, { useRef } from 'react';
import useToastMessage from '../../hooks/toastMessage';
import Analytics from '../../services/Analytics';
import Logger from '../../services/Logger';
import referralConstants from '../../utils/constants/referral';
import AuraButton from '../app/AuraButton';
import Input from '../app/Input';

export default function ShareLink({ link, referralType, referralCode }) {
  const Toast = useToastMessage();
  const inputRef = useRef();
  const linkWithChannel = `${link}channel=${referralConstants.CHANNEL_COPY_LINK}`;
  async function onCopy() {
    if (!link) {
      return;
    }
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(linkWithChannel);
      } else {
        inputRef.current.focus();
        inputRef.current.select();
        document.execCommand('copy');
      }
      Analytics.track('Share Aura', {
        Time: new Date().toTimeString().slice(0, 2),
        Day: new Date().getDay(),
        Channel: 'CopyLink',
        'Referral Code': referralCode,
        'Referral Type': referralType,
        'Sent from': 'dashboard',
      });
      Toast.showSuccess('Link Copied to Clipboard');
    } catch (error) {
      Toast.showError('Failed to copy link');
      Logger.error('error copying link', { error });
    }
  }

  return (
    <div className="wrap row justify-center">
      <Input
        ref={inputRef}
        style={{ flexGrow: 1, marginBottom: 12, minWidth: 320 }}
        fontType="body"
        color="b100"
        borderStyle
        value={link && linkWithChannel}
        onClick={onCopy}
      />
      <AuraButton
        title="Copy"
        style={{ height: 48, minWidth: 128, marginLeft: 12 }}
        loading={!link}
        onClick={onCopy}
      />
    </div>
  );
}
