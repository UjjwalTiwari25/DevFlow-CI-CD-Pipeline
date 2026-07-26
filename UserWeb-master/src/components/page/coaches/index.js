import React from 'react';
import useTrackPageView from '../../../hooks/trackPageView';
import Loader from '../../app/Loader';
import Text from '../../app/Text';
import Coach from '../../card/coach/Coach';
import styles from './styles';

export default function CoachesPage({ coaches }) {
  useTrackPageView();
  return (
    <div className="page">
      {!coaches || !coaches.length ? (
        <Loader />
      ) : (
        <div className="content-padding">
          <Text
            type="h2"
            component="h1"
            color="b100"
            style={{ marginBottom: 24 }}>
            Coaches
          </Text>
          <div className="coaches-container">
            <div className="card-header">
              <Text
                type="h4"
                color="b100"
                weight="regular"
                style={{ marginBottom: 12 }}>
                All Coaches
              </Text>
            </div>
            <div className="card-content">
              {coaches.map((item) => (
                <Coach
                  key={item.id}
                  coach={item}
                  id={item.id}
                  style={{
                    marginBottom: 24,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
