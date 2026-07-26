import React from 'react';
import Head from 'next/head';
import routeConstants from '../../utils/constants/routes';
import Loader from '../app/Loader';
import Text from '../app/Text';
import ViewAllList from '../content/ViewAllList';
import useTrackPageView from '../../hooks/trackPageView';

function ChannelsList({ serverProps }) {
  const { pageContent, channelTopic } = serverProps;
  const { title, contentType, viewAllPage, unique } = channelTopic || {};
  const data = pageContent[unique];
  useTrackPageView(
    {
      'Page Name': 'Channel Topic',
      Title: title,
      'Topic Key': unique,
    },
    [channelTopic]
  );
  return (
    <>
      <Head>
        <title>{`${title} - Aura`}</title>
        <meta
          name="description"
          content={`Explore ${title} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`${title} - Aura`} />
        <meta
          property="og:description"
          content={`Explore ${title} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHANNELS}/${viewAllPage}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHANNELS}/${viewAllPage}`}
        />
      </Head>
      <div className="page">
        {!data ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              {title}
            </Text>
            <ViewAllList data={data} label={contentType} />
          </div>
        )}
      </div>
    </>
  );
}
export default ChannelsList;
