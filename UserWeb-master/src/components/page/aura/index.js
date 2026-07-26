import React from 'react';
import useTrackPageView from '../../../hooks/trackPageView';
import contentConstants from '../../../utils/constants/content';
import routeConstants from '../../../utils/constants/routes';
import Loader from '../../app/Loader';
import Text from '../../app/Text';
import CustomContent from '../../content/CustomContent';
import styles from './styles';

export default function HomePage({ homePageRows, pageContent }) {
  useTrackPageView();

  return (
    <div className="page">
      {!pageContent ? (
        <Loader />
      ) : (
        <div className="content-padding">
          <div className="button">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{
                marginBottom: 24,
              }}>
              Home
            </Text>
          </div>
          {Object.values(homePageRows).map((dataRow, index) => (
            <div key={index}>
              <CustomContent
                key={dataRow.unique}
                pageContent={pageContent}
                sectionIndex={index}
                rowData={dataRow}
                viewAllLink={`/${
                  dataRow.contentType ===
                  contentConstants.CONTENT_UI_TYPES.TRACKS
                    ? routeConstants.PAGE_TOPICS
                    : routeConstants.PAGE_CHANNELS
                }/${dataRow.viewAllPage}`}
              />
            </div>
          ))}
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
