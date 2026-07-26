import FirebaseDatabase from '../services/FirebaseDatabase';
import Logger from '../services/Logger';

async function getPost(id) {
  Logger.debug(`post: get ${id}`);
  const post = await FirebaseDatabase.getValue(`/posts/${id}`);
  if (post) {
    post.id = id;
    delete post.addedToIndex;
    delete post.type;
    delete post.linkToUsers;
    delete post.public;
    return post;
  }
  return null;
}

export { getPost };
