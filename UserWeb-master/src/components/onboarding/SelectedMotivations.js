import React, { Fragment, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Text from '../app/Text';
import Header from './Header';
import AuraButton from '../app/AuraButton';
import useBrowserHistory from '../../hooks/browserHistory';
import TOPICS from '../../data/topics.json';
import Loader from '../app/Loader';
import { initialCapital } from '../../utils';

const extraTopic = {
  unique: 'peacefulMoments',
  isActive: false,
  img: {
    uri: '/static/images/dion.jpg',
  },
  motivation: 'to find more peaceful moments in my day',
};

export default function SelectedMotivations({
  onNext,
  onBack,
  profile: { motivationPreference, givenName },
  experiments,
}) {
  useBrowserHistory('selectedMotivations', true, onBack, onNext);
  const [motivations, setMotivations] = useState(null);

  useEffect(() => {
    const selectedMovitations = Object.values(TOPICS).filter((topic) => {
      return Object.keys(motivationPreference).find(
        (selectedTopic) => topic.unique === selectedTopic
      );
    });
    if (motivationPreference[extraTopic.unique]) {
      selectedMovitations.push(extraTopic);
    }
    setMotivations(selectedMovitations);
  }, [motivationPreference]);
  const onContinue = () => {
    onNext();
  };

  if (!motivations) {
    return <Loader />;
  }
  const remainingMotivations = motivations.length - 4;

  return (
    <Fragment>
      <Header
        title={givenName ? `Excellent ${givenName}!` : `Perfect!`}
        subtitle={
          motivations.length > 0
            ? `Here's what you created so far:`
            : `In days, you will:`
        }
        experiments={experiments}
      />
      <div className="item-container">
        <div>
          {motivations.length > 0 ? (
            motivations.slice(0, 4).map((item) => (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 12,
                }}
                key={item.unique}>
                <img src={item.img.uri} alt={item.unique} className="avatar" />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  {initialCapital(
                    item.motivation.substr(item.motivation.indexOf(' ') + 1)
                  )}
                </Text>
              </div>
            ))
          ) : (
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <img
                  src="/static/images/icons/vision1.png"
                  alt="vision1"
                  className="avatar-large"
                />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  Wake up feeling refreshed and start the day with positivity
                </Text>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <img
                  src="/static/images/icons/vision2.png"
                  alt="vision1"
                  className="avatar-large"
                />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  Understand and manage difficult emotions easily
                </Text>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <img
                  src="/static/images/icons/vision3.png"
                  alt="vision1"
                  className="avatar-large"
                />
                <Text
                  type="body"
                  align="left"
                  color="b100"
                  style={{ marginLeft: 10 }}>
                  Increase self-awareness and gain clarity in life
                </Text>
              </div>
            </div>
          )}
        </div>
        {remainingMotivations > 0 && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: 10,
              marginLeft: 3,
            }}>
            <FaPlus />
            <Text
              type="body"
              align="left"
              color="b100"
              style={{ marginLeft: 10 }}>
              {`${remainingMotivations} more ${
                remainingMotivations === 1 ? 'benefit' : 'benefits'
              }`}
            </Text>
          </div>
        )}
        {motivations.length > 0 && (
          <Text type="body" align="left" color="b100" style={{ marginTop: 20 }}>
            87% of members notice a difference in 3 days
          </Text>
        )}
        <div className="text-bottom">
          <Text type="body" align="left" color="b100">
            {`We are excited for you and can't wait to be a part of your transformations`}
          </Text>
        </div>
      </div>
      <AuraButton
        title="Continue"
        style={{ width: 210, position: 'fixed', bottom: 24 }}
        onClick={onContinue}
        data-testid={'continueButton'}
      />
      <style jsx>{`
        .item-container {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          width: 100%;
          justify-content: flex-start;
          margin-top: 24px;
          margin-bottom: 72px;
        }
        .avatar {
          width: 20px;
          border-radius: 50%;
          height: 20px;
        }
        .plus-icon {
          filter: invert(1);
          width: 16px;
          height: 16px;
          margin-left: 2px;
        }
        .avatar-large {
          width: 50px;
          height: 50px;
        }
        .text-bottom {
          position: absolute;
          bottom: 100px;
          max-width: 400px;
        }
        @media screen and (max-width: 320px) {
          .text-bottom {
            position: relative;
            margin-top: 40px;
            bottom: 0px;
          }
        }
      `}</style>
    </Fragment>
  );
}
