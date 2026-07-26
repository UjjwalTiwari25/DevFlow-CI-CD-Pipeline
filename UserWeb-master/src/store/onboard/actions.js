export const onboardActionTypes = {
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

function updateProfile(profile) {
  return {
    type: onboardActionTypes.UPDATE_PROFILE,
    data: profile,
  };
}

export { updateProfile };
