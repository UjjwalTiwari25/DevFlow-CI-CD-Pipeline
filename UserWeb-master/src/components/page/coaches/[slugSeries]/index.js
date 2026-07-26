import React from 'react';
import Image from 'next/image';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import { getCountDisplayValue } from '../../../../utils';
import Text from '../../../app/Text';
import ListSeriesTrack from '../../../card/tracks/ListSeriesTrack';
import styles from './styles';

export default function SlugSeries({
  series,
  tracks,
  coach,
  countryDetails,
  userSeries,
}) {
  return (
    <div className="outer-wrap col">
      <div className="row relative mobile-wrapper">
        <img
          src={series.cardImage}
          alt="aura series name"
          className="photo desktop-only"
        />
        <div className="mobile-only relative">
          <img
            src={series.cardImage}
            alt="aura series name"
            className="photo"
          />
          <img
            src={series.cardImage}
            alt="aura series name"
            className="photo-shadow"
          />
          <div className="series-info-mobile">
            <Text type="footnote" color="w100">
              Series
            </Text>
            <Text
              type="cta"
              color="w100"
              align="center"
              style={{ marginTop: 7 }}>
              {series.name}
            </Text>
            <Text type="footnote" color="w64" style={{ marginTop: 7 }}>
              {tracks && tracks.length} days
            </Text>
            <div className="coach-information row align-center">
              <img src={getCoachPhoto(coach)} alt="" className="coach-mobile" />
              <div>
                <Text type="body2" color="w100">
                  {getCoachName(coach)}
                </Text>
                <Text
                  type="footnote"
                  weight="regular"
                  color="w80"
                  style={{
                    marginTop: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                  {coach.professionalTitle}
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className="series-info">
          <div className="row align-center only-desktop">
            <Text type="footnote" color="b64">
              Series
            </Text>
            <div className="dot" />
            <Text type="footnote" color="b64">
              {tracks && tracks.length} days
            </Text>
          </div>
          <div className="desktop-only">
            <Text
              type="h2"
              color="b100"
              style={{ fontSize: 36, marginTop: 10 }}>
              {series.name}
            </Text>
          </div>
          <div className="coach-container">
            <div className="row">
              {!!getCoachPhoto(coach) && (
                <span className="coach">
                  <Image src={getCoachPhoto(coach)} alt="" fill />
                </span>
              )}
              <div className="coach-info">
                <Text type="body" weight="semibold" color="b100">
                  {getCoachName(coach)}
                </Text>
                <Text
                  type="footnote"
                  weight="regular"
                  color="b64"
                  style={{ marginTop: 2 }}>
                  {coach.professionalTitle}
                </Text>
                <div className="row align-center country-details">
                  <img
                    src={countryDetails?.imageUrl}
                    alt="coach flag"
                    className="flag"
                  />
                  <Text type="footnote" color="b64">
                    {countryDetails?.iso3}
                  </Text>
                  <img
                    src="/static/images/icons/subscribers.png"
                    alt=" aura coach sunscribers"
                    className="subs"
                  />
                  <Text type="footnote" color="b64">
                    {getCountDisplayValue(coach.followersCount) || 0}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="intro">
        <Text type="cta" color="g100">
          {series.intro}
        </Text>
      </div>
      <div className="tracks-container realtive">
        <img
          src="/static/images/coach/series-tracks-background.png"
          alt="aura backgroung"
          className="background-series"
        />
        {tracks && Array.isArray(tracks)
          ? tracks.map((track, index) => (
              <ListSeriesTrack
                track={track}
                key={track?.id}
                index={index}
                userSeries={userSeries}
                series={series}
                tracks={tracks}
                coach={coach}
              />
            ))
          : null}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
