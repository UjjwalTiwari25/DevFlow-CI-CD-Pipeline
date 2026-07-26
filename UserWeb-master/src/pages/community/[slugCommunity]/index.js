import config from '@/config';
import { getCoach } from '@/models/coach';
import { getCommunityFromSlug } from '@/models/community';

async function fetchPageData(query) {
  const { slugCommunity } = query;

  if (!slugCommunity) {
    return {
      error: 'Slug not found',
    };
  }

  const community = await getCommunityFromSlug(slugCommunity);
  if (!community || !community.slug) {
    return {
      error: 'Community not found',
    };
  }

  const coach = await getCoach(community.ownerId);
  if (!coach || !coach.slug) {
    return {
      error: 'Coach not found',
    };
  }

  return {
    coach,
    community,
  };
}

export const getServerSideProps = async (context) => {
  const { query, res } = context;
  const props = await fetchPageData(query);
  if (props.error) {
    return { notFound: true };
  }
  const { coach, community } = props;
  const { slugCommunity, ...rest } = query;
  const queryString = query ? `?${new URLSearchParams(rest).toString()}` : '';
  res.writeHead(301, {
    Location: `${config.appDomain}/coaches/${coach.slug}/communities/${community.slug}${queryString}`,
  });
  res.end();
  return { props: {} }; // it never reaches here but required as getServerSideProps need to return object.
};

export default function Rd() {
  return 200;
}
