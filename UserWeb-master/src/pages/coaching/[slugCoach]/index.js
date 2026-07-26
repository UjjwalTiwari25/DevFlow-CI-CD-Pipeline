import { wrapper } from '../../../store';

function Coach() {
  return null;
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ params, res }) => {
      res.setHeader(
        'Cache-Control',
        `public, s-maxage=${60 * 60 * 24}, stale-while-revalidate=${
          60 * 60 * 24
        }`
      );
      const { slugCoach } = params;

      res.writeHead(301, { Location: `/coaches/${slugCoach}/video-coaching` });
      res.end();

      return true;
    }
);

export default Coach;
