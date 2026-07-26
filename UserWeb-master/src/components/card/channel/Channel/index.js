import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdGroup } from 'react-icons/md';
import Text from '../../../app/Text';
import routeConstants from '../../../../utils/constants/routes';
import { trackTypeDisplayStringFromId } from '../../../../models/meditation';
import { generateQueryPath, getCountDisplayValue } from '../../../../utils';
import usePageQuery from '../../../../hooks/pageQuery';
import { getAuthorPhoto, getChannelPhoto } from '../../../../models/channel';
import styles from './styles';

export default function Channel({ channel, style }) {
  const {
    utm_source = null,
    userId = null,
    utm_campaign = null,
  } = usePageQuery();
  if (!channel || !channel.channelName) {
    return null;
  }
  const { channelName, authorName, nSubscribers, channelType, slug } = channel;

  return (
    <div className="wrapper">
      {!!getChannelPhoto(channel, 'photo50Url') && (
        <span className="blur-background">
          <Image
            src={`${getChannelPhoto(channel, 'photo50Url')}`}
            alt="background"
            sizes="100vw"
            fill
          />
        </span>
      )}
      <div className="root" style={style}>
        <Link
          href={generateQueryPath(`${routeConstants.PAGE_CHANNELS}/${slug}`, {
            utm_source,
            utm_campaign,
            userId,
          })}
          legacyBehavior>
          <a
            className={`channel-item-container clickable`}
            style={{
              backgroundImage: `linear-gradient(transparent, #0008),url("${getChannelPhoto(
                channel,
                'photo400Url'
              )}")`,
            }}>
            {channelType && (
              <Text type="body2" color="w64" weight="regular">
                {`${trackTypeDisplayStringFromId(channelType)} Channel`}
              </Text>
            )}
            <Text
              type="cta"
              color="w100"
              weight="bold"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                marginBottom: 8,
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
              {channelName || ''}
            </Text>
            <div className="row align-center">
              {authorName && (
                <div className="row align-center">
                  {!!getAuthorPhoto(channel, 'photo50Url') && (
                    <Image
                      src={getAuthorPhoto(channel, 'photo50Url')}
                      alt={authorName}
                      style={{
                        borderRadius: '12px',
                        objectFit: 'cover',
                        marginRight: '8px',
                      }}
                      width={24}
                      height={24}
                    />
                  )}
                  <Text
                    type="footnote"
                    color="w100"
                    weight="semibold"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 180,
                      marginRight: 24,
                    }}>
                    {authorName}
                  </Text>
                </div>
              )}
              {nSubscribers && (
                <div className="row align-center">
                  <div className="subscriber-icon">
                    <MdGroup />
                  </div>
                  <Text type="footnote" color="w40" weight="regular">
                    {getCountDisplayValue(nSubscribers)}
                  </Text>
                </div>
              )}
            </div>
          </a>
        </Link>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
