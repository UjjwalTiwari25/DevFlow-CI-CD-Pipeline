import Logger from '../services/Logger';
import FirebaseDatabase from '../services/FirebaseDatabase';

async function getChallengeDetails(challangeId) {
  if (!challangeId || challangeId === '') {
    return null;
  }
  try {
    const value = await FirebaseDatabase.getValue(
      `/meditationChallenges/${challangeId}`
    );
    if (value !== null) {
      return value;
    }
  } catch (error) {
    Logger.error('Failed to get challenge details', { error });
  }
  return null;
}

export { getChallengeDetails };
