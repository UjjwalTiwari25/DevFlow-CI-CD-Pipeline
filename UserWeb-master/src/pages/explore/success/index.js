import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import config from '@/config';

const DEEPLINK_PATH = '/deeplink/iap/checkout/success';

export default function ExploreSuccessRedirect() {
  const [href, setHref] = useState(`${config.appDomainProd}${DEEPLINK_PATH}`);

  useEffect(() => {
    const search = window.location.search || '';
    setHref(`${config.appDomainProd}${DEEPLINK_PATH}${search}`);
  }, []);

  return (
    <>
      <Head>
        <title>Payment successful</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5EEEA',
          padding: '24px',
        }}>
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <img
            src={'/static/images/aura-ring.png'}
            alt="Aura"
            style={{ height: '72px', marginBottom: '24px' }}
          />
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 600,
              color: '#2F3237',
              margin: '0 0 12px 0',
            }}>
            Payment successful
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#2F3237',
              margin: '0 0 32px 0',
              lineHeight: 1.5,
            }}>
            Your subscription is active. Tap the button below to return to the
            Aura app.
          </p>
          <a
            href={href}
            style={{
              display: 'inline-block',
              backgroundColor: '#4CCAFF',
              color: '#FFFFFF',
              padding: '16px 32px',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
              width: '100%',
              maxWidth: '320px',
              boxSizing: 'border-box',
            }}>
            Open in Aura app
          </a>
          <p
            style={{
              fontSize: '13px',
              color: '#5B657A',
              margin: '20px 0 0 0',
            }}>
            If the app doesn’t open, make sure Aura is installed on this device.
          </p>
        </div>
      </div>
    </>
  );
}
