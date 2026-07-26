import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { trackTypeDisplayStringFromId } from '../../../models/meditation';
import { listSeries } from '../../../models/series';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import Text from '../../app/Text';
import SeriesContentCard from '../../card/series/SeriesContentCard';
import CustomTracks from '../../content/CustomTracks';
import Loader from '../../app/Loader';
import styles from './styles';

function Content({
  tracks,
  newTracks,
  allTracksByType,
  coach,
  isHomePage,
  loadingTracks,
}) {
  const { types, id } = coach;
  const [series, setSeries] = useState(null);
  useEffect(() => {
    async function getCoachSeries() {
      const res = await listSeries({ coachId: id });
      setSeries(res);
    }
    if (coach && !series) {
      getCoachSeries();
    }
  }, [coach, id, series]);

  const allTypes =
    types &&
    (isHomePage ? Object.keys(types).splice(0, 1) : Object.keys(types));

  if (loadingTracks) {
    return (
      <div
        className={classNames(`col align-center w-100 main`, {
          'main-low-margin': isHomePage,
        })}>
        {!isHomePage && (
          <div className="heading">
            <Text type="h1-large" weight="regular" color="b100">
              Coach tracks
            </Text>
          </div>
        )}
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={classNames(`col align-center w-100 main`, {
        'main-low-margin': isHomePage,
      })}>
      {!isHomePage && (
        <div className="heading">
          <Text type="h1-large" weight="regular" color="b100">
            Coach tracks
          </Text>
        </div>
      )}
      {types && (
        <>
          {tracks && tracks.length > 0 && (
            <div className="col align-center track-row-height">
              <Text type="cta" color="b100">
                Popular
              </Text>
              <div className="custom-tracks">
                <CustomTracks
                  data={tracks}
                  label={''}
                  showViewAllLink={false}
                  newCoachProfile
                />
              </div>
            </div>
          )}
          {newTracks && newTracks.length > 0 && (
            <div className="col align-center track-row-height">
              <Text type="cta" color="b100">
                New
              </Text>
              <div className="custom-tracks">
                <CustomTracks
                  data={newTracks}
                  label={''}
                  showViewAllLink={false}
                  newCoachProfile
                />
              </div>
            </div>
          )}
          {allTypes &&
            allTracksByType &&
            allTypes.map(
              (type) =>
                allTracksByType[type] &&
                allTracksByType[type].length > 0 && (
                  <div className="col align-center track-row-height" key={type}>
                    <Text type="cta" color="b100">
                      {type === 'therapy'
                        ? 'Therapy'
                        : trackTypeDisplayStringFromId(type)}
                    </Text>
                    <div className="custom-tracks">
                      <CustomTracks
                        data={allTracksByType[type]}
                        label={''}
                        showViewAllLink={false}
                        newCoachProfile
                      />
                    </div>
                  </div>
                )
            )}
          {series && series.length > 0 && (
            <div className="col align-center track-row-height">
              <Text type="cta" color="b100">
                Series
              </Text>
              <div className="custom-tracks">
                <CustomHorizontalScrollView
                  data={series}
                  newCoachProfile
                  rightChevronStyles={{
                    fontSize: 20,
                    color: '#4E545F',
                    boxShadow: '0px 10px 35px rgba(43, 42, 107, 0.45)',
                    background:
                      'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                  }}
                  leftChevronStyles={{
                    fontSize: 20,
                    color: '#4E545F',
                    boxShadow: '0px 10px 35px rgba(43, 42, 107, 0.45)',
                    background:
                      'linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(90deg, #FFF4FD 0.81%, #F4F5FF 28.06%, #ECF8FF 69%, #EEFFFC 100%)',
                  }}
                  renderItem={(singleSeries, index) => (
                    <SeriesContentCard
                      key={singleSeries.id}
                      series={singleSeries}
                      sectionTrackIndex={index}
                      coach={coach}
                      isClickable
                    />
                  )}
                />
              </div>
            </div>
          )}
        </>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

export default Content;
