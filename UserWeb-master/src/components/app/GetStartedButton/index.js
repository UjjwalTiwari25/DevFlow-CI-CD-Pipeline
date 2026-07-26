import React from 'react';
import { useRouter } from 'next/router';
import Text from '../Text';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import usePageQuery from '../../../hooks/pageQuery';
import { generateQueryPath } from '../../../utils';
import routeConstants from '../../../utils/constants/routes';
import styles from './styles';

export default function GetStartedButton({ showSignUpModal, ...props }) {
  const { utm_source = null, utm_campaign = null } = usePageQuery();
  const router = useRouter();
  const [, isMobile] = useResponsiveWindow();

  function handleSignUpClick(e) {
    e.preventDefault();
    if (showSignUpModal) {
      showSignUpModal();
    } else {
      const query = {
        utm_source,
        utm_campaign,
        redirectTo: router.asPath,
      };
      const path = generateQueryPath(routeConstants.PAGE_SIGNUP, query);
      router.push(path);
    }
  }

  return (
    <div
      className="btn-primary clickable"
      onClick={handleSignUpClick}
      {...props}>
      <Text color="w100" type={isMobile ? 'footnote' : 'body2'} weight="medium">
        Get Started Free
      </Text>
      <style jsx>{styles}</style>
    </div>
  );
}
