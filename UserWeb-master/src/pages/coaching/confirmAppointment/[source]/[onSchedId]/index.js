import React from 'react';
import Head from 'next/head';
import { wrapper } from '../../../../../store';
import BaseLayout from '../../../../../layouts/BaseLayout';
import { confirmOnSchedAppointmentAttendee } from '../../../../../models/service';
import Text from '../../../../../components/app/Text';
import AuraRingClean from '../../../../../components/app/AuraRingClean';

function ConfirmAppointment(serverProps) {
  const { confirmedAppointment } = serverProps;
  return (
    <BaseLayout>
      <Head>
        <title>Confirm Appointment Attendee - Aura</title>
        {/* TODO: We will need to improve these meta tags */}
        <meta
          property="og:title"
          content={`Confirm Appointment Attendee - Aura`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
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
              {confirmedAppointment
                ? 'Thanks for confirming!'
                : 'Failed to confirm. Please contact hello@aurahealth.io'}
            </Text>
          </>
        </div>
      </div>
    </BaseLayout>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ params }) => {
      const props = {};
      const response = await confirmOnSchedAppointmentAttendee(params);
      props.confirmedAppointment = response;
      return { props };
    }
);
export default ConfirmAppointment;
