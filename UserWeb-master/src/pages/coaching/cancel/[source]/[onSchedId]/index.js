import { isBefore } from 'date-fns';
import Head from 'next/head';
import React from 'react';
import AuraRingClean from '../../../../../components/app/AuraRingClean';
import Text from '../../../../../components/app/Text';
import CancelPage from '../../../../../components/page/cancel/[source]/[onSchedId]';
import BaseLayout from '../../../../../layouts/BaseLayout';
import { getAppointmentWithOnSchedId } from '../../../../../models/service';
import { wrapper } from '../../../../../store';

export default function CancelCoaching({ appointmentDetails }) {
  const isInvalidAppointment =
    !appointmentDetails ||
    isBefore(new Date(appointmentDetails?.start), new Date());
  return (
    <BaseLayout useAuth>
      <Head>
        <title>Cancel Appointment - Aura</title>
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
        <CancelPage appointmentDetails={appointmentDetails} />
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
