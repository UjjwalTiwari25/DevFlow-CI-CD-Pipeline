import React from 'react';
import Text from '../../app/Text';
import ContentType from '../../card/contentType';
import CONTENT_TYPES from '../../../data/pageContent/contentTypePageRows.json';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import styles from './styles';

function ExploreAura({ isClickable }) {
  const data = Object.values(CONTENT_TYPES);
  return (
    <div className="custom-aura-container">
      <div className="aura-header">
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          Explore Aura
        </Text>
      </div>
      <CustomHorizontalScrollView
        data={data}
        renderItem={(aura) => (
          <ContentType isClickable={isClickable} key={aura.key} data={aura} />
        )}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default ExploreAura;
