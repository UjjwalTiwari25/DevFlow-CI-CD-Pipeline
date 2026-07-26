import { useEffect } from 'react';
import Router from 'next/router';
import BaseLayout from '@/layouts/BaseLayout';
import useNewLandingPageStyle from '@/hooks/useNewLandingPageStyle';
import { getAllCelebrities, getCelebrityBySlug } from '@/models/celebrities';
import useTrackPageView from '@/hooks/trackPageView';
import Loader from '@/components/app/Loader';
import Celebrities from '@/components/page/celebrities';
import { generateQueryPath } from '@/utils';
import routeConstants from '@/utils/constants/routes';
import usePageQuery from '@/hooks/pageQuery';
import PostAffiliatePro from '@/services/PostAffiliatePro';
import { listSeries } from '@Server/models/series';
import { getContentById } from '@/models/meditation';
import { getCoach } from '@/models/coach';
import Analytics from '@/services/Analytics';
import useExperiments from '@/hooks/experiments';

const EXPERIMENTS = [];

function SlugCelebrity(serverProps) {
  const pageQuery = usePageQuery();
  const {
    a_aid: affiliateId,
    a_cid: affiliateCampaignId,
    pap_signup_action: papSignupAction,
    pap_trial_action: papTrialAction,
    utm_source = null,
    utm_campaign = null,
    redirectTo = null,
    utm_medium = null,
    utm_content = null,
    promocode = null,
  } = pageQuery;
  const { celebrity } = serverProps;
  const { slug, userId: celebrityId } = celebrity || {};

  const [experiments] = useExperiments(EXPERIMENTS, null);
  const isExperimentsAssigned =
    !EXPERIMENTS.length || !!Object.values(experiments).length;
  useTrackPageView({ slug }, [slug, isExperimentsAssigned]);

  useNewLandingPageStyle({ includeScripts: false });

  useEffect(() => {
    if (utm_source === 'affiliate') {
      PostAffiliatePro.init();
    }
  }, [utm_source]);

  useEffect(() => {
    const properties = {
      'Attribution Celebrity ID': celebrityId,
      'Attribution Celebrity Slug': slug,
    };
    Analytics.setPeopleProperties(properties);
    Analytics.setSuperProperties(properties);
  }, [slug, celebrityId]);

  const onContinue = () => {
    Analytics.track('Celebrity LP CTA Click', { slug });
    const path = generateQueryPath(routeConstants.PAGE_SIGNUP, {
      a_aid: affiliateId,
      a_cid: affiliateCampaignId,
      pap_signup_action: papSignupAction,
      pap_trial_action: papTrialAction,
      utm_source,
      utm_campaign,
      redirectTo,
      utm_medium,
      utm_content,
      promocode,
      celeb_id: celebrityId,
    });
    Router.push(path).then(() => {
      window.scrollTo(0, 0);
    });
  };

  if (!celebrity) {
    return (
      <BaseLayout hideBackgroundImages hideFooterBackground>
        <Loader />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout hideBackgroundImages hideFooterBackground>
      <Celebrities
        celebrity={celebrity}
        onContinue={onContinue}
        experiments={experiments}
        isExperimentsAssigned={isExperimentsAssigned}
      />
    </BaseLayout>
  );
}

export const getStaticProps = async ({ params }) => {
  let celebrity = getCelebrityBySlug(params.slugCelebrity);

  if (celebrity) {
    const celebrityData = await getCoach(celebrity.userId);
    celebrity = {
      ...celebrity,
      ...celebrityData,
    };
    const masterClassResponse = await listSeries({ coachId: celebrity.userId });

    if (masterClassResponse && masterClassResponse.length > 0) {
      const masterClass = masterClassResponse.find(
        (item) => item.type === 'masterclass'
      );

      if (masterClass) {
        const masterClassContent = masterClass.data.contents;
        const classesPromises = masterClassContent.map((masterClassItem) =>
          getContentById(masterClassItem.trackId)
        );
        const masterClassTrailer = await getContentById(
          masterClass.previewTrackId
        );
        const masterClassTracks = await Promise.all(classesPromises);
        if (masterClassTracks && masterClassTrailer)
          celebrity.masterClass = {
            trailer: masterClassTrailer,
            classes: masterClassTracks,
            ...masterClass,
          };
      }
      celebrity.masterClassResponse = masterClassResponse;
    }
  }

  return {
    props: {
      celebrity,
    },
  };
};

export async function getStaticPaths() {
  const allCelebrities = getAllCelebrities();

  const paths = allCelebrities.map((celebrity) => {
    return { params: { slugCelebrity: celebrity.slug } };
  });

  return {
    paths,
    fallback: false,
  };
}

export default SlugCelebrity;
