import React from 'react';
import Text from '../app/Text';

const REWARD_ITEMS = [
  {
    name: 'Stickers',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FRewards%2Faura_sticker.jpg?alt=media&token=276ea38f-48ad-4ca2-b0c2-d4434e05e33e',
    referralCount: 1,
  },
  {
    name: 'T-Shirt',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FRewards%2Faura_shirt-6.jpg?alt=media&token=36dee514-ac1a-497d-af62-8f9cbf4cb606',
    referralCount: 5,
  },
  {
    name: 'Mug',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FRewards%2Faura_blue-mug.jpg?alt=media&token=a226309a-9be0-4037-b938-c37c8180ad3d',
    referralCount: 10,
  },
  {
    name: 'Water Bottle',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FRewards%2Faura_bottle.jpg?alt=media&token=d6597a58-319f-488d-86e9-60578bd60346',
    referralCount: 15,
  },
  {
    name: 'Sleep Kit',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FRewards%2Faura_sleep-kit.jpg?alt=media&token=c9c9a446-f7ed-4c73-9b72-51904f2e7d84',
    referralCount: 20,
  },
  {
    name: 'Bluetooth Sleep Mask',
    image:
      'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/Ambassador%2FRewards%2Faura_sleep-mask.jpg?alt=media&token=92fd6cd0-2627-4222-8f76-c66974aea0a1',
    referralCount: 25,
    imageClassName: 'sleep-mask-image',
  },
];

export default function Rewards({ userReferralCount = 0 }) {
  return (
    <div className="row wrap justify-center">
      {REWARD_ITEMS.map(({ name, image, referralCount, imageClassName }) => (
        <RewardItem
          key={name}
          label={name}
          image={image}
          selected={!!userReferralCount && userReferralCount >= referralCount}
          referralCount={referralCount}
          imageClassName={imageClassName}
        />
      ))}
    </div>
  );
}

function RewardItem({ label, image, selected, referralCount, imageClassName }) {
  return (
    <div className="reward-item-container">
      <img
        className={`reward-image ${imageClassName}`}
        src={image}
        alt={label}
      />
      <Text type="footnote" align="center" color="b100">
        {label}
      </Text>
      <Text type="footnote" align="center" color="b100">
        {referralCount}
      </Text>
      {selected && (
        <img
          src="/static/images/icons/blueCheck.png"
          className="selected"
          alt="reward earned"
        />
      )}
      <style jsx>{`
        .reward-item-container {
          width: 124px;
          height: 156px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgb(255, 255, 255);
          border: 1px solid rgb(196, 196, 196);
          box-shadow: 0px 24px 40px 0px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          margin: 0px 7px 14px 7px;
          position: relative;
        }
        .reward-image {
          width: 100%;
          height: 112px;
          object-fit: contain;
        }
        .sleep-mask-image {
          height: 96px;
        }
        .selected {
          position: absolute;
          width: 16px;
          height: 16px;
          object-fit: contain;
          top: 4px;
          right: 4px;
        }
        @media (max-width: 767px) {
          .reward-item-container {
            width: 102px;
            height: 140px;
          }
          .reward-image {
            height: 100px;
          }
          .sleep-mask-image {
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
}
