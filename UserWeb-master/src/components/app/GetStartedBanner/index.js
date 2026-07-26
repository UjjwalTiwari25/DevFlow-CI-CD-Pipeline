import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Text from '../Text';
import GetStartedButton from '../GetStartedButton';
import SignInButton from '../SignInButton';
import useAuthUser from '../../../hooks/authUser';
import LoginModal from '../../login/LoginModal';
import UserDropDown from '../UserDropDown';
import routeConstants from '../../../utils/constants/routes';
import { generateQueryPath } from '../../../utils';
import usePageQuery from '../../../hooks/pageQuery';
import styles from './styles';
import Loader from '../Loader';

export default function GetStartedBanner() {
  const { user, authLoading, isLoading } = useAuthUser();
  const loginModalRef = useRef(null);
  const router = useRouter();

  const { login = null } = usePageQuery();

  useEffect(() => {
    if (
      !authLoading &&
      !isLoading &&
      login === 'true' &&
      router.asPath.includes(`/${routeConstants.PAGE_AURA}`)
    ) {
      if (user) {
        const path = generateQueryPath(`${routeConstants.PAGE_AURA}`);
        router.replace(path);
      } else if (loginModalRef.current) {
        loginModalRef.current.show();
      }
    }
  }, [user, authLoading, router, isLoading, login]);

  return (
    <div className="nav-top">
      <div className="aura-ring-text player-controls-seo-view">
        {!user &&
          (authLoading || isLoading ? (
            <div className="button-holder align-center">
              <Loader
                color="#03a9f4"
                size={24}
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'right',
                }}
              />
              <Text type="body" style={{ marginLeft: 8 }}>
                Loading...
              </Text>
            </div>
          ) : (
            <div className="button-holder">
              <GetStartedButton />
              <SignInButton
                onClick={() => {
                  if (loginModalRef.current) {
                    loginModalRef.current.show();
                  }
                }}
              />
            </div>
          ))}
        {user && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <UserDropDown
              user={user}
              authLoading={authLoading}
              style={{ maxWidth: '100%' }}
            />
          </div>
        )}
        <LoginModal ref={loginModalRef} />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
