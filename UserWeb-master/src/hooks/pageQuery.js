import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
// import Logger from '../services/Logger';
import { handleGetUser } from '../store/slices/auth';

export default function usePageQuery(options = { fetchUserFromQuery: false }) {
  const router = useRouter();
  const query = useRef({ isPageQueryLoading: true });
  // Parse query from URL - this avoids delay by next js router query
  useEffect(() => {
    query.current = { isPageQueryLoading: false };
    const urlQuery = new URLSearchParams(router.asPath.split('?')[1]);
    Array.from(urlQuery.entries()).forEach(([key, value]) => {
      query.current[key] = value;
    });
  }, [router.asPath]);
  query.current = { ...query.current, ...router.query };

  const dispatch = useDispatch();
  const { fetchUserFromQuery } = options;
  const { userId } = query.current;
  useEffect(() => {
    if (userId && fetchUserFromQuery) {
      // Logger.debug(`query update: user ${query.current.userId}`);
      dispatch(handleGetUser(userId));
    }
  }, [userId, dispatch, fetchUserFromQuery]);

  // Logger.debug('Page query', { currentQuery: query.current });
  return query.current;
}
