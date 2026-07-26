import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/app/footer';
import AuraRing from '@/components/app/AuraRing';
import Text from '@/components/app/Text';
import routeConstants from '@/utils/constants/routes';
import styles from './styles';

const steps = [
  {
    title: '1. Launch the Aura App on your device.',
  },
  {
    title: '2. Select Me tab',
    image: '/static/images/deleteAccountSteps/1-me-tab.jpg',
  },
  {
    title: '3. Click Menu Icon in the top right',
    image: '/static/images/deleteAccountSteps/2-select-menu.jpg',
  },
  {
    title: '4. Select the Edit Account Option.',
    image: '/static/images/deleteAccountSteps/3-edit-account.jpg',
  },
  {
    title: '4. Select the Delete Account option.',
    image: '/static/images/deleteAccountSteps/4-delete-account.jpg',
  },
  {
    title: '5. Select the Delete Account option.',
    image: '/static/images/deleteAccountSteps/5-delete-confirm.jpg',
  },
];

function FaqDeleteAccountPage() {
  return (
    <>
      <div className="faq-container">
        <Link href={`/${routeConstants.PAGE_AURA}`} legacyBehavior>
          <a className="header clickable">
            <AuraRing style={{ height: '33px', width: '32px' }} />
            <div className="title">
              <Text type="h4" color="b100" weight="regular" align="left">
                AURA
              </Text>
            </div>
          </a>
        </Link>
      </div>
      <div className="content-wrapper">
        <Text type="h1" color="b100" align="center">
          How to delete my account?
        </Text>
        <Text
          type="h4"
          color="b80"
          style={{ margin: '10px 0 15px' }}
          weight="semibold">
          To delete an account need to follow the following steps.
        </Text>
        <div className="step-list">
          {steps.map((item, index) => (
            <div key={`setp-${index}`}>
              <Text type="body" color="b80">
                {item.title}
              </Text>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  height={400}
                  width={186}
                  style={{ width: 'auto', marginTop: 10 }}
                />
              )}
            </div>
          ))}
        </div>
        <Text type="body" color="b100" style={{ marginTop: 10 }}>
          Once you have finished all of the steps mentioned above, your Aura
          account will be deleted. You will no longer be able to access the Aura
          App.
        </Text>
      </div>
      <Footer containerStyle={{ maxWidth: 1240 }} />
      <style jsx>{styles}</style>
    </>
  );
}

export default FaqDeleteAccountPage;
