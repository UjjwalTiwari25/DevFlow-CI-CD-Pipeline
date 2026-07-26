import useShallowEqualSelector from './shallowEqualSelector';
// import Logger from '../services/Logger';
import GTMService from '../services/GoogleTagManager';

export default function useAuthUser() {
  const { user, isLoading, error, authLoading } = useShallowEqualSelector(
    ({ auth }) => ({
      ...auth,
    })
  );
  // Logger.debug('Auth user store', {
  //   user: user ? { id: user.id, email: user.email } : null,
  //   isLoading,
  //   error,
  //   authLoading,
  // });
  if (user) {
    GTMService.sendToGTM({
      data: {
        UserEmail: user.email,
        UserID: user.id,
      },
    });
  }
  return { user, error, isLoading, authLoading };
}
