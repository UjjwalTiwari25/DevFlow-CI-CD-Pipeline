import { isBefore } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import AuraRingClean from '../../../../../components/app/AuraRingClean';
import Text from '../../../../../components/app/Text';
import RescheduleScreen from '../../../../../components/coachingReschedule/RescheduleScreen';
import BaseLayout from '../../../../../layouts/BaseLayout';
import { getCoach } from '../../../../../models/coach';
import { getAppointmentWithOnSchedId } from '../../../../../models/service';
import { wrapper } from '../../../../../store';
import { generateQueryPath } from '../../../../../utils';
import routeConstants from '../../../../../utils/constants/routes';

export default function ModifyAppointments({ appointmentDetails }) {
  const [coach, setCoach] = useState(null);
  const { coachId } = appointmentDetails || {};

  const router = useRouter();
  const { query } = router;
  const { source, onSchedId } = query;

  useEffect(() => {
    async function getCoachDetails() {
      const res = await getCoach(coachId);
      if (res && !res.error) {
        setCoach(res);
      }
    }
    if (coachId) {
      getCoachDetails();
    }
  }, [coachId]);
  function handleCancelAppointment() {
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHING}/cancel/${source}/${onSchedId}`
    );
    router.push(path);
  }
  function handleRescheduleAppointment() {
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHING}/reschedule/${source}/${onSchedId}`
    );
    router.push(path);
  }

  const isInvalidAppointment =
    !appointmentDetails ||
    isBefore(new Date(appointmentDetails?.start), new Date());

  return (
    <BaseLayout useAuth>
      <Head>
        <title>Modify Appointment - Aura</title>
        {/* TODO: We will need to improve these meta tags */}
        <meta property="og:title" content={`Cancel Appointment - Aura`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {isInvalidAppointment && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              flexDirection: 'column',
            }}>
            <>
              <AuraRingClean size={128} />
              <Text type={'h3-large'} color="b100" align="center">
                {!appointmentDetails
                  ? 'Could not find the requested appointment.'
                  : 'This appointment is in the past.'}{' '}
                Please contact hello@aurahealth.io for support
              </Text>
            </>
          </div>
        </div>
      )}
      {appointmentDetails && (
        <RescheduleScreen
          handleCancelAppointment={handleCancelAppointment}
          handleRescheduleAppointment={handleRescheduleAppointment}
          appointmentDetails={appointmentDetails}
          coach={coach}
        />
      )}
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ params }) => {
      const props = {};
      const response = await getAppointmentWithOnSchedId({
        onSchedAppointmentId: params?.onSchedId,
      });
      if (response && !response.error) {
        props.appointmentDetails = response;
      }
      return { props };
    }
);
