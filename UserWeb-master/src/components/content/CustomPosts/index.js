import React from 'react';
import CustomHorizontalScrollView from '../../app/CustomHorizontalScroll';
import Text from '../../app/Text';
import Post from '../../card/post';
import styles from './styles';

function CustomPosts({ data, label }) {
  if (!data || !data.length) {
    return null;
  }
  return (
    <div className="custom-posts-container">
      <div>
        <Text
          type="h4"
          color="b100"
          weight="regular"
          style={{ marginBottom: 12 }}>
          {label}
        </Text>
        <Text color="b64" type="body" weight="regular">
          {data.length} reflections
        </Text>
      </div>
      <CustomHorizontalScrollView
        data={data}
        renderItem={(post) => <Post key={post.id} post={post} />}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default CustomPosts;
