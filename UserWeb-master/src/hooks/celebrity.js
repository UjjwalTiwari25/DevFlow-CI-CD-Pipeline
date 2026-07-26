import { useState, useEffect } from 'react';
import { getCelebrityById } from '@/models/celebrities';
import usePageQuery from './pageQuery';

function useCelebrity() {
  const { celeb_id: celebrityId = null } = usePageQuery();
  const [celebrity, setCelebrity] = useState();

  useEffect(() => {
    if (celebrityId && !celebrity) {
      const celebrityResponse = getCelebrityById(celebrityId);
      setCelebrity(celebrityResponse);
    }
  }, [celebrityId, celebrity]);

  return celebrity;
}

export default useCelebrity;
