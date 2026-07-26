import React, { Fragment } from 'react';
import AuraRing from '../app/AuraRing';
import Text from '../app/Text';

export default function Header({ title, subtitle, subtitleColor }) {
  return (
    <Fragment>
      <AuraRing style={{ marginTop: 32 }} />
      <Text
        type="h4"
        color="b100"
        component="h1"
        weight="regular"
        align="center"
        style={{ marginTop: 10 }}>
        {title}
      </Text>
      <Text
        type="subtitle"
        color={subtitleColor || 'b64'}
        align="center"
        style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
        {subtitle}
      </Text>
    </Fragment>
  );
}
