import React from 'react';
import Text from '../Text';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import styles from './styles';

export default function SignInButton({ onClick }) {
  const [, isMobile] = useResponsiveWindow();
  return (
    <div className="btn-default clickable" onClick={onClick}>
      <Text color="b100" type={isMobile ? 'footnote' : 'body2'} weight="medium">
        Sign in
      </Text>
      <style jsx>{styles}</style>
    </div>
  );
}
