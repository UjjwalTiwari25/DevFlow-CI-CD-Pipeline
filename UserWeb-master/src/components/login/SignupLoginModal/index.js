import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { GrClose } from 'react-icons/gr';
import Text from '../../app/Text';
import AuraButton from '../../app/AuraButton';
import routeConstants from '../../../utils/constants/routes';
import { generateQueryPath } from '../../../utils';
import usePageQuery from '../../../hooks/pageQuery';
import styles from './styles';

function SignupLoginModal({ handleLoginModal }, ref) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const { utm_source = null, utm_campaign = null } = usePageQuery();
  const query = {
    utm_source,
    utm_campaign,
    redirectTo: router.asPath,
  };
  function showModal() {
    setIsModalVisible(true);
  }
  function hideModal() {
    setIsModalVisible(false);
  }
  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
  }));
  if (!isModalVisible) {
    return null;
  }

  function handleCreateAccount() {
    const path = generateQueryPath(routeConstants.PAGE_SIGNUP, query);
    router.push(path);
  }

  return (
    <div id="modal">
      <div className="card component-shadow modal-card w-100">
        <Text type="body" color="b100" align="center">
          Welcome!
        </Text>
        <AuraButton
          title="Create Account"
          style={{
            background:
              'linear-gradient(-225deg, rgb(1, 248, 239) 0%, rgb(3, 169, 244) 100%)',
            border: '1px solid rgb(212, 212, 212)',
            boxShadow: '0px 24px 40px 0px rgba(0, 0, 0, 0.25)',
            marginTop: 22,
            width: 219,
            height: 48,
          }}
          onClick={handleCreateAccount}
        />
        <AuraButton
          title="Existing user login"
          style={{
            background: 'white',
            border: '1px solid rgb(212, 212, 212)',
            boxShadow: '0px 24px 40px 0px rgba(0, 0, 0, 0.25)',
            marginTop: 16,
            width: 219,
            height: 48,
          }}
          textStyle={{ color: 'black' }}
          onClick={handleLoginModal}
        />
        <div className="close-icon clickable" onClick={hideModal}>
          <GrClose />
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(SignupLoginModal);
