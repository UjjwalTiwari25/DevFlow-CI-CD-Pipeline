import React from 'react';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import AuraRingClean from '../../app/AuraRingClean';
import Text from '../../app/Text';
import styles from './styles';

function Footer() {
  const [, isMobile] = useResponsiveWindow();

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="main col align-center">
      <div className="footer-container w-100">
        <hr className="hr" />
        <div className={`row align-center text-container`}>
          <div className="row align-center">
            <AuraRingClean size={21} />
            <Text type="body2" color="b100" style={{ marginLeft: 12 }}>
              {`© ${getCurrentYear()} Aura Health`}
            </Text>
          </div>
          <div className={isMobile ? 'col' : 'row align-center'}>
            <Text
              type="body2"
              color="b100"
              style={{ marginTop: isMobile && 18 }}>
              Want to become a coach at Aura?&nbsp;
            </Text>
            <Text type="body2" color="b100">
              {' '}
              Contact us:{' '}
              <a
                href="mailto:hello@aurahealth.io"
                style={{
                  textDecoration: 'none',
                  color: 'rgba(47,50,55,1)',
                }}>
                hello@aurahealth.io
              </a>
            </Text>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default Footer;
