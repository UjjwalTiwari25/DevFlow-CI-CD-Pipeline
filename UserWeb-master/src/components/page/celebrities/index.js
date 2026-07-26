import React from 'react';

import NewCelebritiesLandingPage from '@/components/celebrities/NewCelebritiesLandingPage';

function Celebrities({
  celebrity,
  onContinue,
  experiments,
  isExperimentsAssigned,
}) {
  return (
    <div>
      <NewCelebritiesLandingPage
        onContinue={onContinue}
        celebrity={celebrity}
        experiments={experiments}
        isExperimentsAssigned={isExperimentsAssigned}
      />
    </div>
  );
}

export default Celebrities;
