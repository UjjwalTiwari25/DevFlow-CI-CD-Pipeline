import React from 'react';
import Text from '../../app/Text';
import styles from './styles';

const PARTNERS = [
  {
    name: `Nazarah's Heaven`,
    title:
      'Supporting the mental health of low-income & underserved communities',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FNon%20Profit%2Fnazarah.webp?alt=media&token=f7a9804c-dc38-4386-ac35-d0e3b34543de',
    description: `Nazarah’s Heaven (NsH) is a nonprofit organization formed to assist, give guidance and most importantly, hope and a new sense of purpose to women and mothers—in particular—who have dealt with and/or are dealing with mental illness. NsH was created to be a beacon of light and to act as an intermediary and liaison on the behalf of those in low and underserved communities seeking the proper assistance and resources for whatever it is they are battling.`,
  },
];

export default function NonProfitPartners() {
  return (
    <>
      <div className="row">
        {PARTNERS.map(({ image, name, title, description }) => (
          <PartnerItem
            key={name}
            image={image}
            title={title}
            description={description}
          />
        ))}
      </div>
    </>
  );
}

function PartnerItem({ image, title, description }) {
  return (
    <div>
      <div
        className="partner-item-container"
        style={{ backgroundImage: `url('${image}')` }}></div>
      <Text type="h4" color="b100" style={{ margin: '24px 0px 12px 0px' }}>
        {title}
      </Text>
      <Text type="body" color="b100">
        {description}
      </Text>
      <style jsx>{styles}</style>
    </div>
  );
}
